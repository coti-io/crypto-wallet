
import axios from 'axios';
import { SERVER_URL, FINANCIAL_SERVER } from './config';

const headers = {
    'Content-Type': 'application/json',
    'cache-control': 'no-cache',
} 
const multipartHeaders = {
    'Content-Type': 'multipart/form-data',
    'cache-control': 'no-cache',
} 

export const API = {
    nodesList: (net) => axios.create({
        baseURL: `${net}/`,
        headers: headers
    }),
    trustScore: (TS_NODE_URL) => axios.create({
        baseURL: `${TS_NODE_URL}/`,
        headers: headers
    }),
    axiox: () => axios.create({
        baseURL: `${SERVER_URL}/api/v1/`,
        headers: headers
    }),
    fullnode: (FULL_NODE_URL) => axios.create({
        baseURL: `${FULL_NODE_URL}/`,
        headers: headers
    }),
    localServer: ({dev}) => axios.create({
        baseURL: `${dev ? SERVER_URL : '' }/`,
        headers: headers
    }),
    financialServer: (multipart) => axios.create({
        baseURL: `${FINANCIAL_SERVER}/`,
        headers: multipart ? multipartHeaders : headers
    })
}




