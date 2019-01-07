import { takeEvery, all, takeLatest, throttle } from "redux-saga/effects";
import * as actionTypes from "../actions/actionTypes";
import * as actions from "../actions/app";
import {
	setWindowWidth
} from "./app";

import { 
	isWallet,
	connect,
	generateAddress,
	addressSubscription,
	getFnFees,
	sendTX,
	logout,
	updateBalanceOfAddress,
	uploadEvidence,
	getPaymentRequest,
	sendDispute,
	sendComments,
	getDisputeDetails,
	downloadFile,
	sendMessage,
	UpdateItemsStatus,
	getDisputesHistory
} from './account';



export function* watchApp() {
	yield all([
		throttle(500, actionTypes.SET_WINDOW_WIDTH, setWindowWidth)
	]);
}

export function* watchAccount() {
	yield all([
		takeEvery(actionTypes.IS_WALLET, isWallet),
		takeEvery(actionTypes.SEND_DISPUTE, sendDispute),
		takeEvery(actionTypes.GET_PAYMENT_REQUEST, getPaymentRequest),
		takeEvery(actionTypes.UPLAOD_EVIDENCE, uploadEvidence),
		takeEvery(actionTypes.CONNECT, connect),
		takeEvery(actionTypes.LOG_OUT, logout),
		takeEvery(actionTypes.GENERATE_ADDRESS, generateAddress),
		takeEvery(actionTypes.ADDRESS_SUBSCRIPTION, addressSubscription),
		takeLatest(actionTypes.GET_FULLNODE_FEES, getFnFees),
		takeEvery(actionTypes.SEND_TX, sendTX),
		takeEvery(actionTypes.UPDATE_BALANCE_OF_ADDRESS, updateBalanceOfAddress),
		takeEvery(actionTypes.ON_SEND_MESSAGE, sendComments),
		takeEvery(actionTypes.GET_DISPUTE_DETAILS, getDisputeDetails),
		takeEvery(actionTypes.DOWNLOAD_FILE, downloadFile),
		takeEvery(actionTypes.UPDATE_ITEMS_STATUS, UpdateItemsStatus),
		takeEvery(actionTypes.GET_DISPUTES, getDisputesHistory),
		
	]);
}
