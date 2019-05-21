import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';
import update from 'immutability-helper';
import { DISPUTE_UPDATES_HANDLER } from './handlers/disputeUpdatesHandler';
const initialState = {
    reconnect: false,
    isMerchant: false,
    isArbitrator: false,
    userHash: undefined,
    trustScore: undefined,
    node: undefined,
    addresses: new Map(),
    sentDisputes: new Map(),
    receivedDisputes: new Map(),
    claimDisputes: new Map(),
    transactions: new Map(),
    fullNodeFee: {},
    networkFee: {},
    paymentRequest: {},
    disputeDetails: {
      disputeHash: null,
      itemId: null,
      documents: [],
      comments: [],
      history: []
    },
    imagePreview: null,
    notifications: [],
    userType: ''
};

const reconnect = (state, action) => {
   return updateObject( state , { reconnect: true } )
}
const setAddresses = (state, { addresses }) => {
    let updatedMap = new Map([...state.addresses, ...addresses]);
    return updateObject( state , { addresses: updatedMap } )
}

const setTrustScoreAndUserHash = (state, { trustScore, userHash, userType }) => {
    return updateObject( state , {
         trustScore,
         userHash, 
         userType,
         isMerchant: userType == "merchant", 
         isArbitrator:userType == "arbitrator"
      })
}

const setPaymentRequest = (state, { paymentRequest }) => {
    return updateObject( state , { paymentRequest } )
}

const setFees = (state, { fullNodeFee, networkFee }) => {
    return updateObject( state , { fullNodeFee, networkFee } )
}

const findDispute = (state, disputeHash) => {
   let type;
   let txHash;
   let currentDispute;
   let index;
   Array.from(state.sentDisputes.values()).forEach(dispute => {
      dispute.forEach((d, i) => {
         if(d.hash === disputeHash){
            type = 'sentDisputes';
            txHash = d.transactionHash;
            currentDispute = d;
            index = i;
         }
      })
   })
   if(!type){
      Array.from(state.receivedDisputes.values()).forEach(dispute => {
         dispute.forEach((d, i) => {
            if(d.hash === disputeHash){
               type = 'receivedDisputes';
               txHash = d.transactionHash;
               currentDispute = d;
               index = i;
            }
         })
      })
   }

   return {type, txHash, currentDispute, index};
}

const updateDisputeEvidenceArray = (state, {disputeHash, itemId, file}) => {
   const {type, txHash, currentDispute, index} = findDispute(state, disputeHash);
   const itemIndex = currentDispute.disputeItems.findIndex(x => x.id == itemId);
   return update(state, {[type]: {
      [txHash]: {
         [index]: {
            disputeItems: {
               [itemIndex]: {
                  disputeDocumentHashes: {
                     $push: [file]
                  }
               }
            }
         }
      }
   }})
}

const setTransactionsHistory = (state, { transactions }) => {
    let updatedMap = new Map([...state.transactions, ...transactions]);
    return updateObject( state , { transactions: updatedMap } );
}

const setDisputeDetails = (state, {disputeDetailsResponse}) => {
   if(state.disputeDetails.disputeHash !== disputeDetailsResponse.disputeHash){
      return updateObject( state , { disputeDetails: disputeDetailsResponse } );
   }
   const {comments, documents, itemId} = disputeDetailsResponse;
   return updateObject( state , { disputeDetails: {...state.disputeDetails, comments, documents, itemId} } );
}

const updateTransactionHistory = (state, {transaction}) => {
   let transactionExist = state.transactions.get(transaction.hash);
   let transactions = new Map([...state.transactions]);
   if(transactionExist){
      let exist = false;
      transactionExist = transactionExist.map((tx, idx) =>  { // send received self;
         if(tx.transactionConsensusUpdateTime !== transaction.transactionConsensusUpdateTime){
            tx = {...transaction}
            exist = true;
         }
         return tx
      })
      if(!exist && transaction.transactionConsensusUpdateTime == null) {
         transactionExist.push(transaction);
      }
      transactions.set(transaction.hash, transactionExist);
   }
   else{
      transactions.set(transaction.hash, [transaction]);
   }
   return updateObject(state, {transactions})
}


const setDisputes = (state, { disputesHistory, disputeSide }) => {
   
   const isConsumer = disputeSide === 'Consumer';

   const side = isConsumer ? "sentDisputes" : "receivedDisputes";

   let oldDisputes = new Map([...state[side]]);
   let updatedDisputes = new Map();
   disputesHistory.forEach((dispute, i) => {
      
         let disputeExist = updatedDisputes.get(dispute.transactionHash);
         if(disputeExist){
            disputeExist.push(dispute);
            updatedDisputes.set(dispute.transactionHash, disputeExist);
         }
         else{
            updatedDisputes.set(dispute.transactionHash, [dispute]);
         }
      
   })
   const disputes = new Map([...oldDisputes,...updatedDisputes]);
   return updateObject( state , { [side] : disputes } )
}

const showImage = (state, action) => {
   const image = action.image || null;
   return updateObject( state , {  imagePreview: image } );
}

const updateCommentsInItems = (state, {comment}) => {
   const oldComments = [...state.disputeDetails.comments];
   const newComments = oldComments.concat(comment)
   return updateObject( state , {  disputeDetails: {
      ...state.disputeDetails,
      comments: newComments
   } } );
}

const updateDocumentsInItems = (state, {document}) => {
   const oldDocuments = [...state.disputeDetails.documents];
   const newDocuments = oldDocuments.concat(document)
   return updateObject( state , {  disputeDetails: {
      ...state.disputeDetails,
      documents: newDocuments
   }} );
}

const notificationChannelResponse = (state, {data}) => {
   
   return DISPUTE_UPDATES_HANDLER[data.event](state, data);
   
}
const setNotifications = (state, {data}) => {
   const notifications = data.unreadUserDisputeEvents.map(msg => {
      msg.creationTime = msg.creationTime * 1000
      return msg
   }).filter(msg => msg.creationTime > new Date(new Date().getTime() - (48 * 60 * 60 * 1000)).getTime()); // remove filter to get all past notificaitons
   return updateObject( state , { notifications });
}


const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.SET_TRUST_SCORE_AND_USERHASH: return setTrustScoreAndUserHash(state, action);
        case actionTypes.SET_ADDRESSES: return setAddresses(state, action);
        case actionTypes.SET_FEES: return setFees(state, action);
        case actionTypes.UPDATE_EVIDENCE: return updateDisputeEvidenceArray(state, action);
        case actionTypes.SET_PAYMENT_REQUEST: return setPaymentRequest(state, action);
        case actionTypes.SET_TRANSACTIONS: return setTransactionsHistory(state, action);
        case actionTypes.ADD_TRANSACTION: return updateTransactionHistory(state, action);
        case actionTypes.SET_DISPUTES: return setDisputes(state, action);
        case actionTypes.RE_CONNECT: return reconnect(state, action);
        case actionTypes.SET_DISPUTE_DETAILS: return setDisputeDetails(state, action);
        case actionTypes.SET_IMAGE: return showImage(state, action);
        case actionTypes.UPDATE_COMMENT_IN_ITEMS: return updateCommentsInItems(state, action);
        case actionTypes.UPDATE_DOCUMENT_IN_ITEMS: return updateDocumentsInItems(state, action);
        case actionTypes.NOTIFICATION_CHANNEL: return notificationChannelResponse(state, action);
        case actionTypes.SET_NOTIFICATIONS: return setNotifications(state, action);
        
        default:
            return state;
    }
    
};


export default reducer;

