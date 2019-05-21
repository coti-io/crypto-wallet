import { updateObject } from '../../../shared/utility';
import { Wallet } from '../../sagas/account';
import { Signature } from 'coti-encryption-library';
import {FINANCIAL_SERVER} from '../../../config';

export const DISPUTE_UPDATES_HANDLER = {
    NewDispute: (state, data) => {
        let dispute = {...data.eventObject};
        dispute.creationTime = new Date(dispute.creationTime).getTime() / 1000;
        dispute.transactionCreationTime = new Date(dispute.transactionCreationTime).getTime() / 1000;
        dispute.updateTime = new Date(dispute.updateTime).getTime() / 1000;
        const side = data.eventDisplaySide === 'Consumer' ? "sentDisputes" : "receivedDisputes";
        const oldDisputes = new Map([...state[side]]);
        const newDispute = new Map();
        newDispute.set(dispute.transactionHash, [dispute]);
        const disputes = new Map([...oldDisputes,...newDispute]);
        return updateObject( state , { [side] : disputes } )
    },
    
    NewDisputeComment: (state, data) => {
        let comment = {...data.eventObject};
        comment.creationTime = new Date(comment.creationTime).getTime() / 1000;
        if(state.disputeDetails.disputeHash === data.eventObject.disputeHash && state.disputeDetails.itemId === String(comment.itemIds[0])){
            const oldComments = [...state.disputeDetails.comments];
            const newComments = oldComments.concat(comment);
            return updateObject( state , {  disputeDetails: {
                ...state.disputeDetails,
                comments: newComments
            }});
        }
        return state;
    },
    
    NewDisputeDocument: (state, data) => {
        let document = { ...data.eventObject };
        const oldDocuments = [...state.disputeDetails.documents];
        if(state.disputeDetails.disputeHash === data.eventObject.disputeHash && state.disputeDetails.itemId === String(document.itemIds[0])){
            const userSignature = new Signature.DownloadDocument(document.hash).sign(Wallet);
            const src = `${FINANCIAL_SERVER}/document/${state.userHash}/${userSignature.r}/${userSignature.s}/${document.hash}`;
            document.creationTime = new Date(document.creationTime).getTime() / 1000;
            document.src = src;
            const newDocuments = oldDocuments.concat(document);
            return updateObject( state , {  disputeDetails: {
                ...state.disputeDetails,
                documents: newDocuments
            }});
        }
        return state;
    },

    DisputeItemStatusUpdated: (state, data) => {
        data.creationTime = new Date(data.creationTime).getTime() / 1000;
        const side = data.eventDisplaySide === 'Consumer'? "sentDisputes" : "receivedDisputes";
        const oldDisputes = new Map([...state[side]]);
        const dispute = oldDisputes.get(data.eventObject.transactionHash);
        let disputesUpdated = new Map();
        if(dispute){
            let disputeUpdated = { ...dispute[0] }
            let disputeItems = [ ...disputeUpdated.disputeItems ]
            disputeItems = disputeItems.map(item => {
                if(item.id === data.eventObject.itemId){
                    item.status = data.eventObject.disputeItemStatus
                }
                return item;
            })
            disputeUpdated.disputeItems = disputeItems;
            disputesUpdated.set(data.eventObject.transactionHash, [disputeUpdated])
            const disputes = new Map([...oldDisputes,...disputesUpdated]);
            if(state.disputeDetails.disputeHash === data.eventObject.disputeHash){
                return updateObject( state , { [side] : disputes, disputeDetails: {...state.disputeDetails, history: [...state.disputeDetails.history].concat(data)}});
            }
            return updateObject( state , { [side] : disputes } );
        }
        return state;
    },

    DisputeStatusUpdated: (state, data) => {
        data.creationTime = new Date(data.creationTime).getTime() / 1000;
        const side = data.eventDisplaySide === 'Consumer'? "sentDisputes" : "receivedDisputes";
        const oldDisputes = new Map([...state[side]]);
        const dispute = oldDisputes.get(data.eventObject.transactionHash);
        let disputesUpdated = new Map();
        if(dispute){
            let disputeUpdated = { ...dispute[0] }
            disputeUpdated.disputeStatus = data.eventObject.disputeStatus;
            if(data.eventObject.disputeStatus === "Closed"){
                disputeUpdated.closedTime = data.creationTime;
            }
            disputesUpdated.set(data.eventObject.transactionHash, [disputeUpdated])
            const disputes = new Map([...oldDisputes,...disputesUpdated]);
            if(state.disputeDetails.disputeHash === data.eventObject.disputeHash){
                return updateObject( state , { [side] : disputes, disputeDetails: {...state.disputeDetails, history: [...state.disputeDetails.history].concat(data)}});
            }
            return updateObject( state , { [side] : disputes } );
        }
        return state;
    },

    NewDisputeItemVote: (state, data) => {
        data.creationTime = new Date(data.creationTime).getTime() / 1000;
        data.eventObject.voteTime = new Date(data.eventObject.voteTime).getTime() / 1000;
        const side = "receivedDisputes";
        const oldDisputes = new Map([...state[side]]);
        const dispute = Array.from(oldDisputes.values()).map(dispute => dispute[0]).filter(dispute => dispute.hash === data.eventObject.disputeHash);
        let disputesUpdated = new Map();
        if(dispute){
            let disputeUpdated = { ...dispute[0] }
            let disputeItems = [ ...disputeUpdated.disputeItems ]
            disputeItems = disputeItems.map(item => {
                if(item.id === data.eventObject.itemId){
                    item.arbitratorItemVote = {...data.eventObject}
                }
                return item;
            })
            disputeUpdated.disputeItems = disputeItems;
            disputesUpdated.set(disputeUpdated.transactionHash, [disputeUpdated])
            const disputes = new Map([...oldDisputes,...disputesUpdated]);
            if(state.disputeDetails.disputeHash === data.eventObject.disputeHash && state.userHash === data.eventObject.arbitratorHash){
                return updateObject( state , { [side] : disputes, disputeDetails: {...state.disputeDetails, history: [...state.disputeDetails.history].concat(data)}});
            }
            return updateObject( state , { [side] : disputes } );
        }
        return state;
    }
}