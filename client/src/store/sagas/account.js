import { put, select, take, fork, call, all } from "redux-saga/effects";
import { eventChannel } from "redux-saga";
import * as actions from "../actions/index";
import { push } from 'connected-react-router'
import { walletEncryption, cryptoUtils, addresses, BaseTransaction, Transaction, Signature } from 'coti-encryption-library';
import { getNet, isMerchant, isArbitrator, getNodeUrl, getTSNode, getUserHash, getUserTrustScore, getfullNodeFee, getNetworkFee, getPaymentRequest as getPaymentRequestFromState } from './selectors'; 
import { API } from "../../axios";
import { getQueryVariable } from "../../shared/utility";
import { CPS_URL } from "../../config";
import webstomp from 'webstomp-client';
import SockJS from "sockjs-client";
import {FINANCIAL_SERVER} from '../../config';
let TS_NODE_URL;

const bigdecimal = require("bigdecimal");
export let Wallet = null;
let Client = null;
let Client2 = null;
let subscriptions = [];

function* getRandomTSNode(){
  const nodes = yield select(getTSNode)
  const min = 0;
  const max = nodes.length - 1;
  const rand = Math.floor(Math.random() * (max - min) + min);
  return nodes[rand].httpAddress;
}

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
    const net = yield select(getNet);
    try{
        TS_NODE_URL =  yield call(getRandomTSNode);
        Wallet = new walletEncryption({seed});
        const keyPair = Wallet.getKeyPair();
        userHash = cryptoUtils.paddingPublicKey(keyPair.getPublic().x.toString('hex'), keyPair.getPublic().y.toString('hex'));
        const { data } = yield call(getTrustScoreMessage, userHash );
        yield put(actions.setTrustScoreAndUserHashAndUserType({trustScore: parseFloat(data.trustScore).toFixed(2), userHash: userHash, userType: data.userType }))  
        payment = payment ? userHash : false;
        yield call(getAddressesDetailsForSeed, node.httpAddress, payment);
        
    }
    catch(e){
        console.log("e: ", e) // create action to pass the error message to connect component
        yield put(actions.toggleSpinner(false));
        if(e && !e.response){
          yield put(actions.updateTooltipMsg(e));
        }        
        else if(e && e.response){
          if(e.response.status === 400 && e.response.data.message === "User does not exist!"){
            return window.location = `${CPS_URL}/alpha?userhash=${userHash}&&net=${net}`;
          }
          yield put(actions.updateTooltipMsg('Server is temporally unavailable. Please try again in a few minutes', true));
        }

    }
}

const getTrustScoreMessage = (userHash) => API.trustScore(TS_NODE_URL).post(`/usertrustscore`, {userHash} )

const getTrustScoreFromTsNode = ({userHash, transactionHash, userSignature}) => API.trustScore(TS_NODE_URL).post(`/transactiontrustscore`, {userHash, transactionHash, userSignature});

function* openSocketConnection(nodeUrl) {
    const socket = new SockJS(`${nodeUrl}/websocket`);
    const socket2 = new SockJS(`${FINANCIAL_SERVER }/websocket`);
    
    Client = webstomp.over(socket);
    Client2 = webstomp.over(socket2);
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
    if(addressesThatExists.length > 0){
      yield call(getBalances, addressesThatExists, node);
      yield call(getTransactionsHistory, addressesThatExists, node);
      yield call(getDisputesHistory);
    }
    yield call(GetUnreadNotifications);
    yield put(actions.setPage("/"));
    yield put(push("/"));
    yield put(actions.toggleSpinner(false));
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


function* GetUnreadNotifications(){
  const userHash = yield select(getUserHash);
  let unreadEventsData = {};
  const ts = new Date().getTime();
  unreadEventsData.userHash = userHash;
  unreadEventsData.creationTime = (ts / 1000);
  unreadEventsData.userSignature = new Signature.GetUnreadNotifications(String(ts)).sign(Wallet);
  // console.log("unreadEventsData: ", unreadEventsData);
  try {
    const {data} = yield API.financialServer().post(`/event/unread`,JSON.stringify({unreadEventsData}));
    if(!data) return
    yield put(actions.setNotifications(data));
  }catch(err){
    console.log("err: ", err)
  }
}

export function* getDisputesHistory(disputeSide){
  const userHash = yield select(getUserHash);
  const isMerchantUser = yield select(isMerchant);
  const isArbitratorUser = yield select(isArbitrator);
  disputeSide = disputeSide ? disputeSide : isMerchantUser ? 'Merchant' : isArbitratorUser ? 'Arbitrator' : 'Consumer';
  const userSignature = new Signature.GetDisputes(disputeSide).sign(Wallet);
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
  if(disputeSide != 'Consumer') yield call(getDisputesHistory, "Consumer");
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
    }, function*(err){
      console.log("webStomp connection error: ", err)
      yield call(connectPromise);
    })
  });
  const connectWSPromise = new Promise((resolve, reject) => {
    Client2.connect({}, () => {
      console.log('connected');
      resolve();
    }, function*(err){
      console.log("webStomp connection error: ", err)
      yield call(connectWSPromise);
    });
  });

  yield connectPromise;   
  yield connectWSPromise;   
  yield all([
    call(watcherAddress),
    call(watcherDisputes)
  ]);
}

function* watcherAddress() {
  const channel = yield call(connectToAddresses);
  while (true) {
    const action = yield take(channel);
    yield put(action);
  }
}
function* watcherDisputes() {
  const channel2 = yield call(notificationChannel);
  while (true) {
    const action2 = yield take(channel2);
    yield put(action2);
  }
}

function* notificationChannel() {
  let userHash = yield select(getUserHash);
  return eventChannel(emitter => {
    Client2.subscribe(`/topic/user/${userHash}`, ({body}) => {
      try {
        body = JSON.parse(body);  
         emitter(actions.notificationChannelResponse(body));
      }catch (err) {
        if(err){
          console.log("notificationChannel err: ", err)
          emitter(actions.updateTooltipMsg(err.response.data.message, true))
        } 
      }
    });
    return () => {
      console.log('Socket off');
    }
  });
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
  if(!node){
    const selectedNode = yield select(getNodeUrl);
    node = selectedNode.httpAddress;
  }
  let transactionsHistory = new Map();
  for (let address of addresses) {
    let {data} = yield API.fullnode(node).post(`/transaction/addressTransactions`,JSON.stringify({address}));
    let {transactionsData} = data
    if (transactionsData.length > 0){
      transactionsData.forEach(transaction => {
        transaction.createTime = transaction.createTime * 1000;
          let transactionExist = transactionsHistory.get(transaction.hash);
          if(transactionExist){
            if(transactionExist.length < 2) {
              transactionExist.push(transaction);
              transactionsHistory.set(transaction.hash, transactionExist);
            }
          }else{
            transactionsHistory.set(transaction.hash, [transaction]);
          }
      })
      yield put(actions.setTransactionsHistory(transactionsHistory));
    }
  }
} 


export function* generateAddress(addressSubscription){ 
    
  // const initialBalance = new bigdecimal.BigDecimal(0);
  let indexOfAddress = addressSubscription ? Wallet.getIndexByAddress(addressSubscription) : 0;
  let address = "";
  do {
    address = Wallet.generateAddressByIndex(indexOfAddress);
    indexOfAddress = indexOfAddress + 1;
  } while (Wallet.isAddressExists(address.getAddressHex()));

  // *** dev mode add address test  *** ~~>
  // Wallet.setAddressWithBalance(address, initialBalance, initialBalance);
  // yield put(actions.setAddresses(Wallet.getWalletAddresses()));

  yield call(sendAddressToNode, address);
 
}

function* sendAddressToNode(address){
  const node = yield select(getNodeUrl);
  try{
    yield API.fullnode(node.httpAddress).put(`/address`, JSON.stringify({ "address": address.getAddressHex() })); 
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
            // addressPropogationSubscription.unsubscribe();
            // subscriptions = subscriptions.filter(s => s !== addressPropogationSubscription);
            emitter(actions.addressSubscription(addressHex, addressPropogationSubscription));
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
  const node = yield select(getNodeUrl);
  const walletAddressesList = Wallet.getWalletAddresses();
  if(walletAddressesList.get(address)){
    return;
  }
  if(subscription){
    subscription.unsubscribe()
    subscriptions = subscriptions.filter(s => s !== subscription);    
  }

  let addressGenerated;
  const getIdx = Wallet.getIndexByAddress(address);
  let indexOfAddress =  getIdx ? getIdx : 0;
  do {
    addressGenerated = Wallet.generateAddressByIndex(indexOfAddress);
    indexOfAddress = indexOfAddress + 1;
  } while (addressGenerated.getAddressHex() != address );
  
  let {data} = yield API.fullnode(node.httpAddress).post(`/balance`, JSON.stringify({ "addresses": [address]})); 
  
  const body = {
    addressHash : addressGenerated.getAddressHex(),
    balance : String(data.addressesBalance[addressGenerated.getAddressHex()].addressBalance),
    preBalance : String(data.addressesBalance[addressGenerated.getAddressHex()].addressPreBalance),
  };
  
  Wallet.setAddressWithBalance(addressGenerated, new bigdecimal.BigDecimal(body.balance), new bigdecimal.BigDecimal(body.preBalance));      

  yield put(actions.setAddresses(Wallet.getWalletAddresses()));

  yield call(getTransactionsHistory, [addressGenerated.getAddressHex()]);

  yield call(connectToAddress, addressGenerated);

    
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
  const node = yield select(getNodeUrl);
  try {
    const { data } = yield API.fullnode(node.httpAddress).put(`/fee`, {"originalAmount" : amountToTransfer})
    yield call(getNetworkFees, data.fullNodeFee);
  }catch(error){
    console.log("error: ", error)
  }
}

export function* getNetworkFees(fullNodeFee){
  let userHash = yield select(getUserHash);
  try {
    const { data } = yield API.trustScore(TS_NODE_URL).put(`/networkFee`, { "fullNodeFeeData" : fullNodeFee , "userHash" : userHash})
    yield put(actions.setFees(fullNodeFee, data.networkFeeData));
  }catch(error){
    console.log("error: ", error)
  }
}

export function* sendTX({address, amount, description}) {
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
      yield API.fullnode(node.httpAddress).put(`/transaction`,JSON.stringify(transactionToSend));
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
      res = yield API.trustScore(TS_NODE_URL).post(`/networkFee`, validationNetworkFeeMessage);
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

  Wallet.setAddressWithBalance(generatedAddress, updatedBalance, updatedPreBalance);      
  yield put(actions.setAddresses(Wallet.getWalletAddresses()));
}

export function* sendDispute({disputeData, comments, documents}){
  const {transactionHash,disputeItems,consumerHash} = disputeData;
  const consumerSignature = new Signature.OpenDispute(transactionHash, disputeItems).sign(Wallet);
  disputeData.consumerSignature = consumerSignature
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
    }catch(error){
      //TODO :: handle success / failed
      console.log('error: ', error)
    }

  }
}

export function* getDisputeDetails({disputeDetails, onLoadDispute}){
  
  let {disputeHash, itemId } = disputeDetails;
  disputeDetails.userSignature = new Signature.GetDisputeDetails(disputeHash, itemId).sign(Wallet);
  try{
    const getCommentsResponse = yield API.financialServer().post(`/comment`,JSON.stringify({disputeCommentsData: disputeDetails}));
    const getDocumentsNameResponse = yield API.financialServer().post(`/document/names`,JSON.stringify({disputeDocumentNamesData: disputeDetails}));
    let [comments, documents] = [getCommentsResponse.data.disputeComments, getDocumentsNameResponse.data.disputeDocumentNames];
    yield call(createEvidencesAraay, documents);
    let disputeDetailsResponse = { comments, documents, itemId: String(itemId), disputeHash } 
    if(onLoadDispute){
      const userHash = yield select(getUserHash);
      let disputeHistoryData = {disputeHash, userHash}
      disputeHistoryData.userSignature = new Signature.GetDisputeItemsHistory(disputeHash).sign(Wallet, true);
      const getDisputeHistoryResponse = yield API.financialServer().post(`/dispute/history`,JSON.stringify({disputeHistoryData}));
      disputeDetailsResponse.history = getDisputeHistoryResponse.data.disputeHistory
    }
    
    yield put(actions.setDisputeDetails(disputeDetailsResponse))
      
  }catch(error){
    console.log('error: ', error)

  }
}

export function* createEvidencesAraay(documents){
  const userHash = yield select(getUserHash);
  return documents.forEach(document => {
    let userSignature = new Signature.DownloadDocument(document.hash).sign(Wallet, true);
    let src = `${FINANCIAL_SERVER}/document/${userHash}/${userSignature.r}/${userSignature.s}/${document.hash}`;
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
          // yield put(actions.updateDocumentsInItems(res.data.document));
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
      yield put(actions.toggleSpinner(false));
  } catch (error) { 
      yield put(actions.toggleSpinner(false));
      console.log('error: ', error)
    }
  
}
