import { delay } from "redux-saga";
import { push } from 'connected-react-router';
import { put, select, take, actionChannel, call } from "redux-saga/effects";
import axios from '../../axios';
import * as actions from "../actions/index";
import { getWallet } from './selectors'; 


export function* setWindowWidth({width}){
    yield put(actions.setWidth(width))
}