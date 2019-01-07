import { put, select, take, fork, call } from "redux-saga/effects";
import { eventChannel } from "redux-saga";
import * as actions from "../actions/index";
import { push } from 'connected-react-router'
import { walletEncryption, cryptoUtils, addresses, BaseTransaction, Transaction, Signature } from 'coti-encryption-library';
import { getNodeUrl, getUserHash, getUserTrustScore, getfullNodeFee, getNetworkFee, getPaymentRequest as getPaymentRequestFromState } from './selectors'; 
import { API } from "../../axios";
import { getQueryVariable } from "../../shared/utility";
import { CPS_QA_URL } from "../../config";
import webstomp from 'webstomp-client';
import SockJS from "sockjs-client";
import {FINANTIAL_SERVER} from '../../config';

const bigdecimal = require("bigdecimal");

let subscriptions = [];
let Wallet = null;
let Client = null;

export function* isWallet() {
    if(Wallet === null) yield put(push(`/connect`));
} 

export function* getPaymentRequest(){
  try{
    let { data } = yield API.localServer({dev: true}).get(`getPaymentRequest/${getQueryVariable('puid')}`);
    if(data){
      yield put(actions.setPaymentRequest(data));      
    }
    else{
      yield put(actions.updateTooltipMsg('Payment request was not found', true));
      yield put(push(`/connect`));
    }
  }catch(err){
    console.log('err: ', err);
    yield put(actions.updateTooltipMsg(err.response.data.message, true));
  }
}

export function* connect({seed, node, payment}){
    let userHash;
    try{
        Wallet = new walletEncryption(seed);
        const keyPair = Wallet.getKeyPair();
        userHash = cryptoUtils.paddingPublicKey(keyPair.getPublic().x.toString('hex'), keyPair.getPublic().y.toString('hex'));
        const { data } = yield call(getTrustScoreMessage, userHash );
        yield put(actions.setTrustScoreAndUserHash({trustScore: parseFloat(data.trustScore).toFixed(2), userHash: data.userHash }))        
        payment = payment ? userHash : false;
        yield call(getAddressesDetailsForSeed, node.address, payment);
        
    }
    catch(e){
        console.log("e: ", e) // create action to pass the error message to connect component
        if(e && !e.response){
          yield put(actions.toggleSpinner(false));
          yield put(actions.updateTooltipMsg(e));
        }
        if(e.response.status === 400 && e.response.data.message === "User does not exist!"){
            window.location = `${CPS_QA_URL}/alpha?userhash=${userHash}&&net=testnet`;
        }
    }
}

const getTrustScoreMessage = (userHash) => API.trustScore().post(`/usertrustscore`, {userHash} )

const getTrustScoreFromTsNode = ({userHash, transactionHash, userSignature}) => API.trustScore().post(`/transactiontrustscore`, {userHash, transactionHash, userSignature});

function* openSocketConnection(nodeUrl) {
    const socket = new SockJS(`${nodeUrl}/websocket`);
    
    Client = webstomp.over(socket);
}

export function* getAddressesDetailsForSeed(node, userHash) {
  let addressesToCheck =[];
  let notExistsAddressFound = false;
  let addressesThatExists = [];
  let NextChunk = 0;
  while (!notExistsAddressFound){
    for (var i =NextChunk ; i< NextChunk + 20; i++){
      addressesToCheck.push(Wallet.generateAddressByIndex(i).getAddressHex());
    }
    try {
      const details = yield API.fullnode(node).post(`/address`,JSON.stringify({"addresses" : addressesToCheck}));
      let addressesResult = details.data;
      addressesThatExists = addressesThatExists.concat(Object.keys(addressesResult.addresses).filter(x=> addressesResult.addresses[x] ==true));
      notExistsAddressFound = Object.values(addressesResult.addresses).filter(val=> val == false).length > 0 ;
      addressesToCheck =[];
      NextChunk = NextChunk + 20;
    }catch(err){
      if(err) {
        console.log("getAddressesDetailsForSeed err: ", err);
        yield put(actions.updateTooltipMsg(err.response.data.message, true));
      }
    }
  }
  if(!userHash){
    if(addressesThatExists.length === 0){
      yield put(push("/"));
      yield put(actions.setPage("/"));
      yield put(actions.toggleSpinner(false));
    }else{
      yield call(getBalances, addressesThatExists, node);
      yield call(getTransactionsHistory, addressesThatExists, node);
      yield call(getDisputesHistory, node);
      
      yield put(push("/"));
      // const url = '/disputeDetails/741b3b20a10e9475bd1f3263181562dac1dd315858e59297300dacefa5034021/c1f0782a99851e407df834c1d92e9d2213d4edcf04cec116796d2be0baeb8139'
      // yield put(push(url))
      yield put(actions.toggleSpinner(false));
    }
    yield call(openSocketConnection, node);
    yield call(socketSubscriber);
  }else{
    if(addressesThatExists.length < 1){
      yield put(actions.toggleWarningPopup({message: "There is no address in your wallet!"}));     
      return
    }
    yield call(getBalances, addressesThatExists, node); 
    yield call(sendPR, node, userHash);
   
  }
} 

export function* getDisputesHistory(){
  const disputeSide = 'Consumer';
  const userSignature = new Signature.GetDisputes(disputeSide).sign(Wallet);
  
  const userHash = yield select(getUserHash);
  let disputesData = {
		userHash,
    disputeSide,
    userSignature
  }
  
  try {
    const { data } = yield API.financialServer().post(`/dispute`,JSON.stringify({disputesData}));
    yield put(actions.setDisputes(data.disputesData, disputeSide))
  } catch (error) {
    console.log('getDisputesHistory error: ', error)
  }
}

function* sendPR(node, userHash){
  const walletAddressesList = yield Wallet.getWalletAddresses();
  let paymentRequest = yield select(getPaymentRequestFromState);
  let baseTransactions = JSON.parse(paymentRequest.baseTransactions);
  let items = JSON.parse(paymentRequest.items);
  let encryptedMerchantName = JSON.parse(paymentRequest.merchant);
  const returnUrl = JSON.parse(paymentRequest.returnUrl);
  
  let address = "";
  let amount = 0;
  let name = "PIBT";
  let receiverBaseTransactionHash = '';
  baseTransactions.forEach(tx => {
    if(tx.name === 'RBT') {
      address = tx.addressHash;
      receiverBaseTransactionHash = tx.hash;
    }
    if(tx.name !== 'PIBT' && tx.name !== 'IBT') amount += Number(tx.amount);
  });

  let transactionsIndex = 0;
  let amountToSend = new bigdecimal.BigDecimal(String(amount));
  let iBTindex = 1;
  let totalPreBalance = new bigdecimal.BigDecimal(0);
  
  for(let address of walletAddressesList){
    let bxTransaction;
    let addressAmount = address[1].getPreBalance().compareTo(address[1].getBalance()) < 0 ? address[1].getPreBalance() : address[1].getBalance();
    totalPreBalance = totalPreBalance.add(addressAmount);
    if(addressAmount.compareTo(new bigdecimal.BigDecimal('0')) <= 0) {
      transactionsIndex++;
      continue;
    }
    let subtract = amountToSend.subtract(addressAmount);
    let spendFromAddress = amountToSend.multiply(new bigdecimal.BigDecimal('-1'));
    if (subtract.compareTo(new bigdecimal.BigDecimal('0')) <= 0){
        bxTransaction = new BaseTransaction(address[1], spendFromAddress ,"PIBT",items, encryptedMerchantName);
        baseTransactions.unshift(bxTransaction);
        transactionsIndex++;
        break;
      }else{
        bxTransaction = new BaseTransaction(address[1],addressAmount.multiply(new bigdecimal.BigDecimal('-1')), "IBT", items, encryptedMerchantName);
        baseTransactions.splice(iBTindex, 0, bxTransaction);
        iBTindex++;
    }
    amountToSend = amountToSend.subtract(addressAmount);
    transactionsIndex++;
  }

  if(totalPreBalance.compareTo(new bigdecimal.BigDecimal(String(amount))) < 0){
    yield put(actions.toggleWarningPopup({message: "Insufficient balance"}));
    return
  }
  baseTransactions = baseTransactions.map((btx,idx) => btx = btx.name !== "PIBT" && btx.name !== "IBT" ? BaseTransaction.getBaseTransactionFromFeeObject(btx) : btx)

  let transactionToSend =  new Transaction(baseTransactions, 'Payment Transaction', userHash, 'Payment');
  const createTrustScoreMessage = {
    userHash,
    transactionHash: transactionToSend.createTransactionHash(),
    userSignature: Wallet.signMessage(transactionToSend.createTransactionHash())
  }

  
  try{
    const { data } = yield getTrustScoreFromTsNode(createTrustScoreMessage);
    if(!data) return
    else{
      transactionToSend.addTrustScoreMessageToTransaction(data.transactionTrustScoreData);
      transactionToSend.signTransaction(Wallet);   
      const res = yield API.fullnode(node).put(`/transaction`,JSON.stringify(transactionToSend));
      if(res.status === 201){
        let resDeletePaymentRequest = yield API.localServer({dev: true}).put(`paymentRequest/${getQueryVariable('puid')}`);
        console.log('resDeletePaymentRequest: ', resDeletePaymentRequest);
        yield put(actions.toggleSpinner(false));
        yield put(actions.toggleSuccessPopup(true));
      }
    }
  }catch(err){
    if(err){
      yield put(actions.updateTooltipMsg(err.response.data.message, true));
      yield put(actions.toggleSpinner(false));
    }
  }


}

function* socketSubscriber() {
  const connectPromise = new Promise((resolve, reject) => {
    Client.connect({}, () => {
      console.log('connected');
      resolve();
    }, (err)=>  {
      console.log("webStomp connection error: ", err)
      call(connectPromise);
    })
  });
  yield connectPromise;   
  const channel = yield call(connectToAddresses);
  while (true) {
    const action = yield take(channel);
    yield put(action);
  }
}

function* getBalances( addresses, node ) {
  let addressIndex = 0;
  let generatedAddress;
  let balance;
  let preBalance;
  try {
    const {data} = yield API.fullnode(node).post(`/balance`,JSON.stringify({ addresses }));
    do {
      generatedAddress = Wallet.generateAddressByIndex(addressIndex);
      if (addresses.includes(generatedAddress.getAddressHex())){
        let { addressBalance, addressPreBalance } = data.addressesBalance[generatedAddress.getAddressHex()];
        balance = new bigdecimal.BigDecimal(`${addressBalance}`);
        preBalance = new bigdecimal.BigDecimal(`${addressPreBalance}`);
      }
      Wallet.setAddressWithBalance(generatedAddress, balance, preBalance);
      addressIndex++;
    }while (generatedAddress.getAddressHex() != addresses[addresses.length-1]);
    yield put(actions.setAddresses(Wallet.getWalletAddresses()));
  }catch(error){
    //TODO:: show error 
    console.log("getBalances error: ", error)
  } 
}

function* getTransactionsHistory(addresses, node) {
  let transactionsHistory = new Map();
  for (let address of addresses) {
    let {data} = yield API.fullnode(node).post(`/transaction/addressTransactions`,JSON.stringify({address}));
    let {transactionsData} = data
    if (transactionsData.length > 0){
      transactionsData.forEach(transaction => {
        let transactionExist = transactionsHistory.get(transaction.hash);
        if(transactionExist){
          transactionExist.push(transaction);
          transactionsHistory.set(transaction.hash, transactionExist);
        }else{
          transactionsHistory.set(transaction.hash, [transaction]);
        }
      })
    }
  }

  yield put(actions.setTransactionsHistory(transactionsHistory));
} 


export function* generateAddress(addressSubscription){ 
    
  // const initialBalance = new bigdecimal.BigDecimal(0);
  let indexOfAddress = 0;
  let address = addressSubscription || "";
  do {
    address = Wallet.generateAddressByIndex(indexOfAddress);
    indexOfAddress = indexOfAddress + 1;
  } while (Wallet.isAddressExists(address.getAddressHex()));

  // *** dev mode add address test  *** ~~>
  // Wallet.setAddressWithBalance(address, initialBalance, initialBalance);
  // yield put(actions.setAddresses(Wallet.getWalletAddresses()));

  yield(call(sendAddressToNode, address));
 
}

function* sendAddressToNode(address){
  const node = yield select(getNodeUrl);
  try{
    yield API.fullnode(node.address).put(`/address`, JSON.stringify({ "address": address.getAddressHex() })); 
    let balanceResult = yield API.fullnode(node.address).post(`/balance`, JSON.stringify({ "addresses": [address.getAddressHex()]})); 
    
    const body = {
      addressHash : address.getAddressHex(),
      balance :balanceResult.data.addressesBalance[address.getAddressHex()].addressBalance ,
      preBalance :balanceResult.data.addressesBalance[address.getAddressHex()].addressPreBalance ,
    };
    
    Wallet.setAddressWithBalance(address, new bigdecimal.BigDecimal(body.balance), new bigdecimal.BigDecimal(body.preBalance));      
    yield put(actions.setAddresses(Wallet.getWalletAddresses()));
    yield call(connectToAddress, address);
    // add notification to address was added
  }catch(err){
    if(err) console.log("generateAddress err: ", err)
    // yield put(actions.updateTooltipMsg(err.response.data.message))
  }
}

function* connectToAddresses() {
  const walletAddressesList = yield Wallet.getWalletAddresses();
  const addresses = Array.from(walletAddressesList.keys());
  return eventChannel(emitter => {
    if(addresses.length > 0){
      addresses.forEach(address => {
        let addressSubscription = Client.subscribe(`/topic/${address}`, ({body}) => {
          try {
            body = JSON.parse(body);  
            emitter(actions.updateBalanceOfAddress(body))
          }catch (err) {
            if(err){
              console.log("err: ", err)
              emitter(actions.updateTooltipMsg(err.response.data.message, true))
            } 
          }
        });
     
        let transactionSubscription = Client.subscribe(`/topic/addressTransactions/${address}`, ({body}) => {
          try {
            body = JSON.parse(body); 
            console.log("connectToAddresses transaction: ", body);
            let { transactionData } = body;
            emitter(actions.addTransaction(transactionData));
          }catch (err) {
            if(err) {
              console.log("err: ", err);
              emitter(actions.updateTooltipMsg(err.response.data.message, true));
            }
          }
        });
        subscriptions.push(addressSubscription);
        subscriptions.push(transactionSubscription);
      });
    }
    const addressesLength = walletAddressesList.size == 0 ? 0 : addresses.length;
    for (let i = addressesLength; i < addressesLength + 10; i++) {
      let addressHex = Wallet.generateAddressByIndex(i).getAddressHex();
      let addressPropogationSubscription = Client.subscribe(`/topic/address/${addressHex}`, ({body}) => {
        try {
          const parsedBody = JSON.parse(body);
          console.log("parsedBody: ", parsedBody);
          const addressHex = parsedBody.addressHash;
          emitter(actions.updateTooltipMsg(`Address ${addressHex} is generated`));
          if(!walletAddressesList.has(addressHex)){
            addressPropogationSubscription.unsubscribe();
            subscriptions = subscriptions.filter(s => s !== addressPropogationSubscription);
            emitter(actions.addressSubscription(addressHex));
          }
        }catch (err) {
          if(err){
            console.log("err: ", err);
            // emitter(actions.updateTooltipMsg(err.response.data.message))
          }
        }
      });
    }
    return () => {
      console.log('Socket off');
    }
  });
}

export function* addressSubscription({address,subscription}) {
    const walletAddressesList = Wallet.getWalletAddresses();
    if(walletAddressesList.get(address)){
      return;
    }
    if(subscription){
      subscription.unsubscribe()
      subscriptions = subscriptions.filter(s => s !== subscription);    
    }
    yield call(generateAddress, address);
}


function* connectToAddress(address){
  const channel = yield call(subscribeToAddress, address)
  while (true) {
    const action = yield take(channel)
    yield put(action)
  }
}

function* subscribeToAddress(address) {  
  const walletAddressesList = yield Wallet.getWalletAddresses();
  const addressHex = address.getAddressHex();
  return eventChannel(emitter => {
    var addressSubscription = Client.subscribe("/topic/" + addressHex, ({body}) => {
      try {
        var body2 = JSON.parse(body);
        const { addressHash, balance , preBalance } = body ;
        // emitter(actions.updateTooltipMsg(err.response.data.message, true))
        emitter(actions.updateBalanceOfAddress(body2))
      } catch (err) {
        if(err){
          console.log(err)
          emitter(actions.updateTooltipMsg(err.response.data.message, true))
        } 
      };
    });


    var transactionSubscription = Client.subscribe("/topic/addressTransactions/" + addressHex, ({body}) => {
      try {
        body = JSON.parse(body); 
        let { transactionData } = body;
        emitter(actions.addTransaction(transactionData))
      } catch (err) {
        if(err) console.log("transactionData err: ", err)
        // emitter(actions.updateTooltipMsg(err.response.data.message))
      };
    });	

    const index = walletAddressesList.size + 9;
    var addressbyIndex = Wallet.generateAddressByIndex(index).getAddressHex();
    var addressPropogationSubscription = Client.subscribe("/topic/address/" + addressbyIndex, function(body) {          
      const parsedBody = JSON.parse(body.body)
      const addressHex = parsedBody.addressHash
      emitter(actions.addressSubscription(addressHex,addressPropogationSubscription));
    })
      
    subscriptions.push(addressSubscription);
    subscriptions.push(transactionSubscription);

    return () => {
      console.log('Socket off')
    }
  })
}

export function* getFnFees({amountToTransfer}){
  console.log('amountToTransfer: ', amountToTransfer)
  const node = yield select(getNodeUrl);
  try {
    const { data } = yield API.fullnode(node.address).put(`/fee`, {"originalAmount" : amountToTransfer})
    yield call(getNetworkFees, data.fullNodeFee);
  }catch(error){
    console.log("error: ", error)
  }
}

export function* getNetworkFees(fullNodeFee){
  let userHash = yield select(getUserHash);
  try {
    const { data } = yield API.trustScore().put(`/networkFee`, { "fullNodeFeeData" : fullNodeFee , "userHash" : userHash})
    yield put(actions.setFees(fullNodeFee, data.networkFeeData));
  }catch(error){
    console.log("error: ", error)
  }
}

export function* sendTX({address, amount, description}) {
  console.log('amount: ', amount)
  const userHash = yield select(getUserHash);
  let to = new addresses.BaseAddress(address);
  let baseTransactions = [];
  let transactionsIndex = 0;
  let totalPreBalance = new bigdecimal.BigDecimal(0);
  let amountToSend = new bigdecimal.BigDecimal(amount);
  const walletAddressesList = Wallet.getWalletAddresses();
  for(let address of walletAddressesList){
    let bxTransaction;
    let addressAmount = address[1].getPreBalance().compareTo(address[1].getBalance()) < 0 ? address[1].getPreBalance() : address[1].getBalance();
    totalPreBalance = totalPreBalance.add(addressAmount);
    if(addressAmount.toPlainString() <= 0) {
      transactionsIndex++;
      continue;
    }
    let subtract = amountToSend.subtract(addressAmount);
    let spendFromAddress = amountToSend.multiply(new bigdecimal.BigDecimal('-1'));
    if (subtract.compareTo(new bigdecimal.BigDecimal('0')) <= 0){
        bxTransaction = new BaseTransaction(address[1], spendFromAddress ,"IBT");
        baseTransactions.push(bxTransaction);
        transactionsIndex++;
        break;
    }else{
        bxTransaction = new BaseTransaction(address[1],addressAmount.multiply(new bigdecimal.BigDecimal('-1')), "IBT");
        baseTransactions.push(bxTransaction);
    }
    amountToSend = amountToSend.subtract(addressAmount);
    transactionsIndex++;
  }

  if(totalPreBalance.compareTo(new bigdecimal.BigDecimal(amount)) < 0){
    // yield put(actions.toggleWarningPopup({message: "Insufficient balance"})); // handle error sent TX
    return
  }

  const node = yield select(getNodeUrl);
  let {fullNodeFee, networkFee} = yield call(createMiniConsenuse, userHash);
  
  const amountRBB = new bigdecimal.BigDecimal(amount).subtract(new bigdecimal.BigDecimal(fullNodeFee.amount)).subtract(new bigdecimal.BigDecimal(networkFee.amount)).toString();
  
  const RBT = new BaseTransaction(to, amountRBB, "RBT")
  const fullNodeTransactionFee = BaseTransaction.getBaseTransactionFromFeeObject(fullNodeFee);
  const transactionNerworkfee = BaseTransaction.getBaseTransactionFromFeeObject(networkFee);

  baseTransactions.push(fullNodeTransactionFee);
  baseTransactions.push(transactionNerworkfee);
  baseTransactions.push(RBT);
  
  let transactionToSend =  new Transaction(baseTransactions, description, userHash);
      
  const createTrustScoreMessage = {
    userHash,
    transactionHash: transactionToSend.createTransactionHash(),
    userSignature: Wallet.signMessage(transactionToSend.createTransactionHash())
  }
  
  
  try{
    const { data } = yield getTrustScoreFromTsNode(createTrustScoreMessage);
    if(!data) return

    else{
      transactionToSend.addTrustScoreMessageToTransaction(data.transactionTrustScoreData);
      transactionToSend.signTransaction(Wallet);
      yield API.fullnode(node.address).put(`/transaction`,JSON.stringify(transactionToSend));
      yield put(actions.toggleSpinner(false));
      yield put(actions.updateTooltipMsg(`${amount} COTI's sent.`))
    }
  }catch(err){
    if(err) yield put(actions.updateTooltipMsg(err.response.data.message, true));
    yield put(actions.toggleSpinner(false));
  }
}

export function* logout() {
  yield subscriptions.map(s => s.unsubscribe());
  subscriptions = [];
  Client.disconnect(function() {
    console.log("See you next time!");
  });
  window.location = '/connect';
}


function* createMiniConsenuse(userHash){ 
  const iteration = 3;
  let [fullNodeFee, networkFee] = [yield select(getfullNodeFee), yield select(getNetworkFee)];
  
  let validationNetworkFeeMessage = { 
    fullNodeFeeData : fullNodeFee,
    networkFeeData : networkFee, 
    userHash
  };

  let res;
  
  try {
    for (let i = 1; i < iteration; i++){
      res = yield API.trustScore().post(`/networkFee`, validationNetworkFeeMessage);
      validationNetworkFeeMessage.networkFeeData = res.data.networkFeeData;
    }
  }catch(error){
    console.log("error: ", error);
  }
  return { fullNodeFee, networkFee: res.data.networkFeeData }
}

export function* updateBalanceOfAddress({body}){
  
  const { addressHash, balance , preBalance } = body ;
  const walletAddressesList = Wallet.getWalletAddresses();
  const generatedAddress = walletAddressesList.get(addressHash);
  const updatedBalance = new bigdecimal.BigDecimal(`${balance === null ? 0 : balance}`);
  const updatedPreBalance = new bigdecimal.BigDecimal(`${preBalance === null ? 0 : preBalance}`);

  console.log("updateBalanceOfAddress generatedAddress: ", generatedAddress);
  Wallet.setAddressWithBalance(generatedAddress, updatedBalance, updatedPreBalance);      
  yield put(actions.setAddresses(Wallet.getWalletAddresses()));
}

export function* sendDispute({disputeData, comments, documents}){
  const {transactionHash,disputeItems,consumerHash} = disputeData;
  const consumerSignature = new Signature.OpenDispute(transactionHash, disputeItems).sign(Wallet);
  disputeData.consumerSignature = consumerSignature
  console.log("disputeData:", disputeData)
  try{
    const res = yield API.financialServer().put(`/dispute`,JSON.stringify({disputeData}));
    if(comments){
      comments.map(comment => comment.disputeHash = res.data.disputesData[0].hash);
      yield call(sendComments, {comments: comments});    
    }
    if(documents){
      documents.map(document => document.disputeHash = res.data.disputesData[0].hash);
      yield call(uploadEvidence, {documents: documents});
    }
    // yield put(actions.setDisputes(res.data.disputesData, "Consumer"));
    yield call(getDisputesHistory);
    yield put(push(`/disputeDetails/${transactionHash}/${res.data.disputesData[0].hash}`));
    yield put(actions.toggleSpinner(false));
    
  }catch(error){
    console.log('error: ', error)
  }
  
  
 
}

export function* sendComments({comments}){
  if(!comments){
    // TODO:: return no comments ? error ? tooltip?
    console.log('no comments')
    return 
  } 
  for(let message of comments){
    let disputeCommentData = {...message}
    let {disputeHash, comment, itemIds, inChat } = disputeCommentData
    disputeCommentData.userSignature = new Signature.UploadComments(disputeHash, comment, itemIds).sign(Wallet);
    try{
      const res = yield API.financialServer().put(`/comment`,JSON.stringify({disputeCommentData}));
      if(res && inChat){
        const newMessage = {
          creationTime: new Date().getTime() / 1000, 
          comment: comment, 
          commentSide: 'Consumer'
        }
        yield put(actions.updateCommentsInItems(newMessage))
      }
      console.log('res: ', res.data)
    }catch(error){
      //TODO :: handle success / failed
      console.log('error: ', error)
    }

  }
}

export function* getDisputeDetails({disputeDetails}){
  let {disputeHash, itemId } = disputeDetails;
  disputeDetails.userSignature = new Signature.GetDisputeDetails(disputeHash, itemId).sign(Wallet);

  try{
    const getCommentsResponse = yield API.financialServer().post(`/comment`,JSON.stringify({disputeCommentsData: disputeDetails}));
    const getDocumentsNameResponse = yield API.financialServer().post(`/document/names`,JSON.stringify({disputeDocumentNamesData: disputeDetails}));
    let [comments, documents] = [getCommentsResponse.data.disputeComments, getDocumentsNameResponse.data.disputeDocumentNames];
    yield call(createEvidencesAraay, documents);
    const disputeDetailsResponse = { comments, documents } 
    yield put(actions.setDisputeDetails(disputeDetailsResponse))
      
  }catch(error){
    console.log('error: ', error)

  }
}

function* createEvidencesAraay(documents){
  const userHash = yield select(getUserHash);
  return documents.forEach(document => {
    let userSignature = new Signature.DownloadDocument(document.hash).sign(Wallet);
    let src = `${FINANTIAL_SERVER}/document/${userHash}/${userSignature.r}/${userSignature.s}/${document.hash}`;
    document.src = src
  })
}

export function* uploadEvidence({documents}){
  if(documents.length < 1){
    // TODO:: return no documents ? error ? tooltip?
    console.log('no documents')
    return 
  } 
  for(let item of documents){
    for(let file of item.documents){
      let form = yield call(createForm, item.disputeHash, file, item.itemIds, item.userHash);
      let disputeHash = form.get('disputeHash');
      let itemIds = form.getAll('itemIds');
      const userSignature = new Signature.UploadDocuments(disputeHash, itemIds).sign(Wallet);
      form.append('s', userSignature.s);
      form.append('r', userSignature.r);
      try{
        const res = yield API.financialServer(true).post(`/document/upload`, form );
         if(res && item.inDispute){
          yield put(actions.updateDocumentsInItems(res.data.document));
          yield put(actions.toggleSpinner(false));
          yield put(actions.updateTooltipMsg(`${res.data.document.fileName} was added successfully`));
         }
      }catch(error){
        yield put(actions.toggleSpinner(false));
        yield put(actions.updateTooltipMsg(`${error.response.data.message}`, true));
      }
    } 
  }
}

function* createForm(disputeHash, file, itemIds, userHash){
  let form = new FormData(); 
  form.append('disputeHash', disputeHash);
  form.append('file', file, file.name);
  itemIds.forEach(itemId => form.append('itemIds', itemId));
  form.append('userHash', userHash);
  return form
}

export function* downloadFile({downloadFileData}){
  let {disputeHash, documentHash } = downloadFileData;
  const userSignature = new Signature.DownloadDocument(documentHash).sign(Wallet);
  downloadFileData.userSignature = {
    s: userSignature.s,
    r: userSignature.r,
  }
  
  try {
    const res = yield API.financialServer().post(`/document/download`,JSON.stringify({documentFileData: downloadFileData}));
    yield put(actions.setImage(res.data));
    console.log('res: ', res)
        
  } catch (error) {
    console.log('error: ', error)
  }
}

export function* UpdateItemsStatus({disputeUpdateItemData}){
  let {disputeHash, itemIds, status } = disputeUpdateItemData;
  let res;
  const isArbitrator = status === "RejectedByArbitrator" || status === "AcceptedByArbitrator";
  try {
    if(isArbitrator){
      const userHash = yield select(getUserHash);
      const arbitratorSignature = new Signature.Vote(disputeHash, itemIds[0], status).sign(Wallet);
      let disputeItemVoteData = {...disputeUpdateItemData}
      disputeItemVoteData.arbitratorHash = userHash;
      disputeItemVoteData.itemId = itemIds[0];
      delete disputeItemVoteData.itemIds;
      disputeItemVoteData.arbitratorSignature = {
        r: arbitratorSignature.r,
        s: arbitratorSignature.s,
      }   
      res = yield API.financialServer().put(`/dispute/item/vote`,JSON.stringify({disputeItemVoteData}));
      
    }else{
      const userSignature = new Signature.UpdateItemsStatus(disputeHash, itemIds, status).sign(Wallet);
      disputeUpdateItemData.userSignature = {
        r: userSignature.r,
        s: userSignature.s,
      }  
      res = yield API.financialServer().put(`/dispute/item/update`,JSON.stringify({disputeUpdateItemData}));
    }
      console.log('res: ', res)
      yield call(getDisputesHistory);
      yield put(actions.toggleSpinner(false));
  } catch (error) {
      yield put(actions.toggleSpinner(false));
      console.log('error: ', error)
    }
  
}
