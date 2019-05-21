import { delay } from "redux-saga";
import { push } from 'connected-react-router';
import { put, select, take, actionChannel, call } from "redux-saga/effects";
import axios from '../../axios';
import * as actions from "../actions/index";
import { API } from "../../axios";
import { NODE_MANAGER_TESTNET_URL, NODE_MANAGER_MAINNET_URL } from '../../config';

const nets = { 
    mainnet: NODE_MANAGER_MAINNET_URL, 
    testnet: NODE_MANAGER_TESTNET_URL
}

export function* getNodesList({net}){
    try {
        const res = yield API.nodesList(nets[net]).get('wallet/nodes');
        let node_list = {...res.data.nodes}
        
        node_list.FullNodes.map(node => node.httpAddress  = nodeMapper[node.httpAddress] )
        node_list.TrustScoreNodes.map(node => node.httpAddress  = nodeMapper[node.httpAddress] )
    
        if(res.status == 200){
            yield put(actions.setNodesList(node_list, net))
        }
    } catch (error) {
        yield put(actions.setNodesList({}, net))
    }
}

export function* setWindowWidth({width}){
    yield put(actions.setWidth(width))
}

const nodeMapper = {
    
    //testnet
    
    'http://35.156.217.39:7070' : 'https://testnet-fullnode1.coti.io',
    'http://52.29.54.35:7030' : 'https://testnet-trustscore1.coti.io',

    //mainnet

    'http://3.121.68.236:7070' : 'https://mainnet-fullnode1.coti.io',
    'http://35.158.80.236:7060' : 'https://mainnet-fullnode2.coti.io',
    'http://3.120.223.68:7030' : 'https://mainnet-trustscore1.coti.io',
}