import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import Time from '../../components/Time/Time';
import *  as actions from '../../store/actions/index';
import {customFixed, removeZerosFromEndOfNumber} from '../../shared/utility';
import SuccessPopup from '../Popup/SuccessPopup';
import WarningPopup from '../Popup/WarningPopup';

const bigdecimal = require("bigdecimal");

const PurchaseContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    width: 514px;
    max-width: 100%;
    padding: 0 30px 30px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0px 2px 3.9px 0.1px rgba(0,0,0,0.3);
    box-sizing: border-box;
    margin-right: 17px;
    @media(max-width: 1081px){
        margin-right: 0;
        margin-top: 20px;
    }
    @media(max-width: 768px){
        margin-top: 640px;
        height: auto;
        padding-bottom: 0;
    }
`;

const Header = styled.h1`
    font-family: ClanOT-News;
    font-size: 24px;
    color: #ffffff;
    background-color: #2bbfdf;
    padding: 30px;
    margin: 0 -30px;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    & > img{
        width: 24px;
        vertical-align: middle;
    }
`

const List = styled.ul`
    list-style-type: none;
    padding: 0;
    margin: 0;
    border-bottom: 1px solid #2bbfdf;
`

const Mechant = styled.div`
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #ebebeb;
    font-size: 15px;
    color: #333333;
    font-family: ClanOT-Medium;
    align-items: center;
    padding: 40px 8px 16px 8px;
    font-weight: bold;
`

const Total = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 20px 8px;
    align-items: center;
    & > div:first-child{
        font-size: 18px;
        color: #333333;
        font-family: ClanOT-Book;
        text-transform: uppercase;
    }
`

const Item = styled.li`
    display: flex;
    justify-content: space-between;
    font-size: 15px;
    color: #333333;
    font-family: ClanOT-Medium;
    align-items: flex-start;
    padding: 16px 8px;
    &:not(:last-child){
        border-bottom: 1px solid #ebebeb;
    }
`

const Box = styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    &:first-child{
        width: 60%;
    }
    &:nth-child(2){
        text-align: right;
        width: 40%;
    }
`

const ItemName = styled.div`
    font-size: 15px;
    font-family: ClanOT-Medium;
    color: #333333;
    font-weight: bold;
    margin-bottom: 15px;
`

const ItemDescription = styled.div`
    font-size: 15px;
    font-family: ClanOT-Book;
    color: #333333;
`

const Qty = styled.div`
    font-size: 13px;
    color: #111111;
    font-family: ClanOT-Medium;
    font-weight: bold;
    margin-bottom: 15px;
`

const Price = styled.div`
    font-size: 13px;
    color: #111111;
    font-family: ClanOT-Medium;
    font-weight: bold;
`

const TotalPrice = styled.div`
    font-size: 24px;
    color: #2bbfdf;
    font-family: ClanOT-Medium;
    font-weight: bold;
`

class PurchaseDetails extends Component {

    state = {
        merchant: '',
        items: [],
        total: '',
        nodeFee: '',
        createdTime: '',
        total: 0,
        baseTransactions: []
    }
    
    componentDidMount() {
        this.props.getPaymentRequest();
    }

    componentWillReceiveProps({paymentRequest, selectedNode}){
        if(paymentRequest && paymentRequest.merchant !== this.state.merchant){
            this.setState({
                ...this.state,
                total: this.getTotal(JSON.parse(paymentRequest.baseTransactions)),
                items: JSON.parse(paymentRequest.items),
                merchant: JSON.parse(paymentRequest.merchant),
                nodeFee: JSON.parse(paymentRequest.baseTransactions).filter(tx => tx.name === 'FFBT')[0].amount,
                createdTime: JSON.parse(paymentRequest.baseTransactions).filter(tx => tx.name === 'RBT')[0].createTime
            })
        }
        if(this.props.selectedNode !== selectedNode){
            this.calcFee(selectedNode)
        }
    }

    getTotal(baseTransactions, feeAfterSelected){
        let FFBT, NFBT, RRBT, RBT; 

        baseTransactions.forEach(tx => {
            if(tx.name === 'FFBT'){
                FFBT = feeAfterSelected || tx.amount;
            }
            else if(tx.name === 'NFBT'){
                NFBT = tx.amount;
            }
            else if(tx.name === 'RRBT'){
                RRBT = tx.amount;
            }
            else if(tx.name === 'RBT'){
                RBT = tx.amount;
            }
        })

        FFBT = new bigdecimal.BigDecimal(FFBT);
        NFBT = new bigdecimal.BigDecimal(NFBT);
        RRBT = new bigdecimal.BigDecimal(RRBT);
        RBT = new bigdecimal.BigDecimal(RBT);

        const total =  FFBT.add(NFBT).add(RRBT).add(RBT).toPlainString();
        return removeZerosFromEndOfNumber(customFixed(total, 4));
    }

    calcFee(selectedNode){
        let total= this.getTotal(JSON.parse(this.props.paymentRequest.baseTransactions)); // total purchase
        let fee = Number(selectedNode.fee.replace('%','')); // remove % from String
        fee = (total * fee)/100 // convert presentage to fee in COTI 
        fee = fee > Number(selectedNode.maxFee) ? Number(selectedNode.maxFee) : fee;
        total = this.getTotal(JSON.parse(this.props.paymentRequest.baseTransactions), fee);
        this.setState({
            ...this.state, 
            nodeFee: fee,
            total: total
        })
    }

    drawItemsList(){
        const {items} = this.state;
       return(
            <List>
                {items.map((item, i) => (
                    <Item key={i}>
                        <Box>
                            <ItemName>{item.itemName}</ItemName>
                        </Box>
                        <Box>
                            <Qty>X {item.itemQuantity}</Qty>
                            <Price>{item.itemPrice} COTI</Price>
                        </Box>
                    </Item>
                ))}
                <Item>
                    <Box>
                        <ItemName>Full Node Fee</ItemName>
                    </Box>
                    <Box>
                        <Price>{customFixed(this.state.nodeFee, 2)}</Price>
                    </Box>
                </Item>
            </List>
        )
    }

    getReturnUrl(merchant){
        let returnUrl = JSON.parse(this.props.paymentRequest.returnUrlSuccess);
        if(merchant) return returnUrl
        const lastItemIdx = JSON.parse(this.props.paymentRequest.items).length - 1;
        JSON.parse(this.props.paymentRequest.items).forEach((item, i) => {
            returnUrl += "?item=" + item.itemName + "+" + item.itemPrice + "+" + item.itemQuantity + (i !== lastItemIdx ? "&" : '')
        })
        return returnUrl;
    }

    render() {
        return (
            <PurchaseContainer>
                <Header><img src={require('../../images/icons/titleicons_perchasedetails_24X24.svg')}/> Purchase Details</Header>
                <Mechant>
                    <div>{this.state.merchant}</div>
                    <Time date={this.state.createdTime}/>
                </Mechant>
                {this.state.items.length > 0 && this.drawItemsList()}
                <Total>
                    <div>total</div>
                    <TotalPrice>{this.state.total} COTI</TotalPrice>
                </Total>
                {this.props.successPopup > 0 && <SuccessPopup title="Your payment was successful." payment returnUrl={this.getReturnUrl()}/>}
                {this.props.failPopup && <WarningPopup yes={()=>this.props.connectAfterFail()} no={()=>window.location = this.props.paymentRequest.returnUrl} title="Your payment failed." paymentFail={this.props.failPopup} />}
            </PurchaseContainer>
        );
    }
}

const mapStateToProps = ({account, app}) => ({
    successPopup: app.successPopup,
    failPopup: app.failPopup,
    paymentRequest: account.paymentRequest,
    selectedNode: app.selectedNode
})

const mapDispatchToProps = dispatch => {
  return {
    connectAfterFail: () => dispatch(actions.connectAfterFail()),
    getPaymentRequest: () => dispatch(actions.getPaymentRequest()),
  }
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(PurchaseDetails));
