
import axios from 'axios';
import { SERVER_URL, TS_NODE_URL, FN_URL, FINANTIAL_SERVER } from './config';

const headers = {
    'Content-Type': 'application/json',
    'cache-control': 'no-cache',
} 
const multipartHeaders = {
    'Content-Type': 'multipart/form-data',
    'cache-control': 'no-cache',
} 

export const API = {
    trustScore: () => axios.create({
        baseURL: `${TS_NODE_URL}/`,
        headers: headers
    }),
    axiox: () => axios.create({
        baseURL: `${SERVER_URL}/api/v1/`,
        headers: headers
    }),
    fullnode: (url) => axios.create({
        baseURL: `${url}/`,
        headers: headers
    }),
    localServer: ({dev}) => axios.create({
        baseURL: `${dev ? SERVER_URL : '' }/`,
        headers: headers
    }),
    financialServer: (multipart) => axios.create({
        baseURL: `${FINANTIAL_SERVER}/`,
        headers: multipart ? multipartHeaders : headers
    })
}



