import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styled, { keyframes } from "styled-components";
import { fadeIn } from 'react-animations';
import Row from '../Table/Row';
import Pagination from '../Pagination/Pagination';
import * as actions from '../../store/actions/index';



const fadePade = keyframes`${fadeIn}`

const TransactionsContainer = styled.div`
    animation: 2s ${fadePade};
    margin-bottom: ${props => props.activity ? '0' : '10px'};
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: ${props => props.maxWidth ? props.maxWidth : '100%'};
    overflow: hidden;
    border-radius: 6px;
    background-color: #ffffff;
    box-shadow: ${props => props.activity ? 'none' : '0px 2px 3.9px 0.1px rgba(0, 0, 0, 0.15)'};
    padding: ${props => props.activity ? '40px 0 0 0' : '20px'};
    box-sizing: border-box;
    @media(max-width: 1400px) {
        max-width: 100%;
        max-height: unset;
    }
    @media(max-width: 768px){
        padding: 20px 0;
        box-shadow: 0px 2px 3.9px 0.1px rgba(0, 0, 0, 0.15);
    }
`;

const Heading = styled.h3`
    display: flex;
    margin: 0 auto 10px 0;
    align-items: center;
    font-family: ClanOT-book;
    font-size: 14px;
    font-weight: 300;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: -0.3px;
    text-align: left;
    color: #001111;
    @media(max-width: 1201px){
        padding-left: 10px;
    }
    & img {
        max-width: 21px;
        max-height: 23px;
        width: 100%;
        height: 100%;
        margin-right: 11px;
    }
`;


const Table = styled.table`
    animation: 1s ${fadePade};
    width: 100%;
    overflow-y: scroll;
    max-width: ${props => props.maxWidth};
    border-collapse: collapse;
    table-layout: fixed;
   
    &>tbody tr {
      &:hover {
        background: rgb(252, 254, 255);
        transition: 0.2s width ease;
      }
    }

    @media(max-width: 1201px){
        & > thead{
            display: none;
        }
    }
`;

const Tr = styled.tr`
  position: relative;
  max-width: 100%;
  overflow: hidden;
  & > th.Date{
    width: 7%;
  }
  & > th.Status{
      width: 10%;
  }
  & > th.Transactions.Hash{
      width: 35%;
  }
  & > th.Transactions.type{
      width: 15%;
  }
  & > th[class*="sent"]{
      width: 12%;

  }
  & > th.Amount{
      width: 9%;
  }

  &:hover{
    background-color: #fcfeff;
  }
  &:hover{
    & > td{
      border-top: 1px solid #2bbfdf;
      border-bottom: 1px solid #2bbfdf;
    }
  }
  &:hover img {
    cursor: pointer;
    display: inline-block !important;
  }
  &:hover > td{
    
    max-width: unset !important;
    overflow: unset !important;
    text-overflow: unset !important;
  }
 
  &:hover td > span {
    word-wrap: break-word;
    box-sizing: border-box;
    position: sticky;
    line-height: 20px
    z-index: 999 !important;
    max-width: unset !important;
    overflow: unset !important;
    text-overflow: unset !important;
    background: rgb(252, 254, 255) !important;
    transition: 0.2s ease;
    text-align: center;
    white-space: unset;
  }
 
  @media(max-width: 560px){
    &:first-child > td{
      border-top: none;
    }
    &:last-child > td{
      border-bottom: 1px solid #ddd;
    }
  }

`;

const Th = styled.th`
    max-width: ${props => props.thMaxWidth};
    text-align: left;
    padding: 10px 15px;
    background: transparent;
    color: #000000cc;
    font-weight: 600;
    font-size: 13px;
    font-family: ClanOT-Medium;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    position: sticky;
    top: 0;
    z-index: 2;
    background: #fff;
    & > img{
      width: 11px;
      height: 6px;
      vertical-align: middle;
      margin-left: 5px;
      cursor: pointer;
    }
    @media(max-width: 560px){
        background: #d9d9d9;
        width: 50%;
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #000111;
    }

`;

const ViewAll = styled.div`
    font-size: 13px;
    font-weight: 500;
    font-style: normal;
    font-stretch: normal;
    line-height: 2.31;
    letter-spacing: normal;
    text-align: center;
    color: #2bbfdf;
    font-family: ClanOT-Medium;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin-top: 20px;
    & > img{
        width: 15px;
        margin-left: 10px;
    }
`
const TableWrapper = styled.div`
    height: ${({height}) => height};
    overflow-y: auto;
    &::-webkit-scrollbar:horizontal  {
        height: 6px;
    }
    &::-webkit-scrollbar {
        width: 6px;
    }

    &::-webkit-scrollbar-track {
        border-radius: 10px;
        background: #eceae6;
    }

    &::-webkit-scrollbar-thumb{
        background: #2cbedfde; 
        border-radius: 10px;
    }
`

class Transactions extends Component {
    
    constructor(props) {
        super(props);
    }
    
    state = {
        transactionsFiltered: [],
        transactionsRowsNumber: 0,
        from: 0,
        to: this.props.activity ? 8 : 2
    }


    componentDidMount(){
        const maxRows = this.props.activity ? 8 : 2;
        this.createTable(0, maxRows);
    }

    createTable(from, to, updatedTransactions){
        const {addresses} = this.props
        let transactionsFiltered = [];
        let merchant = '';
        let items = [];
        let fullNodeFee = '';
        let networkFee = '';
        let receiverAddress = ''
        let transactions = updatedTransactions ? Array.from(updatedTransactions) : Array.from(this.props.transactions.values());
        transactions.forEach((tx,i) => {
            tx[0].baseTransactions.forEach(btx => {
                if(btx.name === 'PIBT'){
                    merchant = btx.encryptedMerchantName
                    items = btx.items
                }
                else if(btx.name === 'FFBT'){
                    fullNodeFee = btx.amount
                }
                else if(btx.name === 'NFBT'){
                    networkFee = btx.amount
                }
                else if(btx.name === 'RBT'){
                    receiverAddress = btx.addressHash
                }
            })

            tx.forEach((t,idx) => {
                let transactionObj = {
                    "Date": new Date(t.createTime).getTime(),
                    "Transactions Hash": t.hash,
                    "Transactions type": t.type,
                    "sent/received": tx.length > 1 && idx == 0 ? 'sent' : idx == 1 ? 'received' : addresses.get(receiverAddress) ? 'received' : 'sent',
                    "Status": t.transactionConsensusUpdateTime !== null ? "Confirmed" : "Attached To Dag",
                    "Amount": t.amount,
                    "confirmationTime": t.transactionConsensusUpdateTime || "",
                    "networkFee": networkFee,
                    "fullNodeFee": fullNodeFee,
                    "isDisputeable": this.props.sentDisputes.get(t.hash) ? false : true
                }
                
                if(t.type === "Transfer"){
                    transactionObj.receiver = receiverAddress
                }else{
                    transactionObj.merchant = merchant
                    transactionObj.items = items
                }
                
                transactionsFiltered.push(transactionObj)
            });
        })
    const transactionsRowsNumber = transactionsFiltered.length
    transactionsFiltered = this.sortByKey(transactionsFiltered, "Date")
    transactionsFiltered = transactionsFiltered.filter((current, i) => i < to && i >= from);
        this.setState({
            ...this.state,
            transactionsFiltered,
            transactionsRowsNumber,
            from,
            to
        });
    }

    sortByKey(array, key) {
        return array.sort((a, b) =>{
            let x = b[key];
            let y = a[key]; 
            return ((x < y) ? -1 : ((x > y) ? 1 : 0)) 
        });
    }

    toActivity(){
        this.props.history.push("/activity");
        this.props.setPage('activity');
    }
    compareMaps(map1, map2) {
        var testVal;
        if (map1.size !== map2.size) {
            return false;
        }
        for (var [key, val] of map1) {
            testVal = map2.get(key);
            // in cases of an undefined value, make sure the key
            // actually exists on the object so there are no false positives
            if (testVal !== val || (testVal === undefined && !map2.has(key))) {
                return false;
            }
        }
        return true;
    }
    componentWillReceiveProps(nextProps){
        const to = this.props.activity ? 8 : 2
        this.createTable(0, to , nextProps.transactions.values())
        // if(!this.compareMaps(nextProps.transactions, this.props.transactions)){
        // }
        // else if(nextProps.transactions.length !== this.props.transactions.length){
        //     console.log("!==")
        //     this.createTable(this.state.from, this.state.to , nextProps.transactions.values())
        // }
    }

    render() {
        const dataColumns = ["Date","Transactions Hash", "Transactions type", "sent/received", "Status" , "Amount"];
        return(        
            <TransactionsContainer maxWidth="100%" activity={this.props.activity}>
                {!this.props.activity && <Heading>
                                            <img src={require('../../images/icons/transactions.svg')} alt="transactions"/>
                                            Recent Transactions
                                        </Heading>}
                <TableWrapper height={this.props.activity && '500px'}>
                    <Table>
                        <thead>
                            <Tr>
                                {dataColumns.map(col=><Th key={col} className={col}>{col}<img src={require('../../images/icons/crescent-dd_12X6.svg')}/></Th>)}
                            </Tr>
                        </thead>
                        <tbody>
                            {this.state.transactionsFiltered.map((row ,i)=> 
                                <Row key={i} rowData={row}/>
                            )}
                        </tbody>
                    </Table>
                </TableWrapper>
                {this.props.activity 
                    ? this.props.transactions.size > 7 && this.state.transactionsFiltered.length > 0 && <Pagination maxRows={8} array={this.state.transactionsRowsNumber} setFilterdRows={(from, to) => this.createTable(from, to)} maxPages={this.props.windowWidth > 768 ? 8 : 4}/>
                    : <ViewAll onClick={() => this.toActivity()}>View all Transactions <img src={require('../../images/icons/crescentright.svg')}/></ViewAll>}
            </TransactionsContainer>
        )
    }
} 


const mapStateToProps = ({ app, account }) =>{
    return{
       transactions: account.transactions,
       addresses: account.addresses,
       sentDisputes: account.sentDisputes,
       windowWidth: app.windowWidth
    }
}

const mapDispatchToProps = dispatch => {
  return {
    setPage: page => dispatch(actions.setPage(page))
  }
}

Transactions.propTypes = {
    addresses: PropTypes.object,
    transactionsHistory: PropTypes.array
}

export default withRouter(connect(
    mapStateToProps,mapDispatchToProps
)(Transactions));