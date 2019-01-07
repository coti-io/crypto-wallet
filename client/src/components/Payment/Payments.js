import React, { Component } from 'react';
import styled from 'styled-components';
import Connect from '../Connect/Connect';
import PurchaseDetails from './PurchaseDetails';

const PaymentContainer = styled.div`
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    @media(max-width: 1081px){
        flex-direction: column-reverse;
        width: 100%;
    }
`


const Payment = () =>  
    <PaymentContainer>
        <PurchaseDetails/>
        <Connect/> 
    </PaymentContainer>
   
export default Payment;