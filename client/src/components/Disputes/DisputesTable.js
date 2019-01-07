import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled, { keyframes } from "styled-components";
import { fadeIn } from 'react-animations';
import Row from '../Table/Row';
import Pagination from '../Pagination/Pagination';



const fadePade = keyframes`${fadeIn}`

const DisputesContainer = styled.div`
    animation: 2s ${fadePade};
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: ${props => props.maxWidth ? props.maxWidth : '100%'};
    overflow: hidden;
    border-radius: 4px;
    background-color: #ffffff;
    padding: 40px 0 0 0;
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
  & > th.Date, & > th.Status{
    width: 10%;
  }
  & > th.Transactions.Hash{
      width: 30%;
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
    &:first-child{
        width: 30%;
    }
    &.action{
        width: 120px;
    }
    &.Pending{
        width: 17%;
    }
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


const TableWrapper = styled.div`
    height: 310px;
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

class Disputes extends Component {
    
    state = {
        disputesFiltered: [],
        from: 0,
        to: 6
    }
    
    componentDidMount() {
        this.createTable(this.state.from, this.state.to);	
    }
    
    createDisputeObj(dispute){
        const {type} = this.props;
        
        let disputenObj = {};
        disputenObj["dispute hash"] = dispute.hash;
        disputenObj["transaction hash"] = dispute.transactionHash;
        disputenObj["status"] = dispute.disputeStatus;

        if(type === 'sentDisputes' || type === 'receivedDisputes'){
            disputenObj["amount"] = dispute.amount;
            disputenObj["opened"] = dispute.creationTime * 1000;
            disputenObj["lastUpdated"] = dispute.updateTime * 1000;  
        }

        if(type === 'claimDisputes'){
            disputenObj["pending arbitration"] = "yes";
            disputenObj["assigned"] = dispute.creationTime;
            disputenObj["close date"] = dispute.shani;
        }

        if(type === 'sentDisputes'){
            let merchant = this.props.transactions.get(dispute.transactionHash)[0].baseTransactions.filter(btx => btx.name === 'PIBT')[0].encryptedMerchantName;
            disputenObj.merchant = merchant
        }

        return disputenObj;
    }

    createTable(from, to, updatedDisputes){
        const {type} = this.props;
        let disputes = Array.from(updatedDisputes || this.props[type].values());
        let disputesFiltered = [];
        disputes.forEach(dispute => {
            dispute.forEach(d => {
                disputesFiltered.push(this.createDisputeObj(d))
            })
        })

        disputesFiltered = this.sortByKey(disputesFiltered, 'opened');
        disputesFiltered = disputesFiltered.filter((current, i) => i < to && i >= from);
        this.setState({
            ...this.state,
            disputesFiltered,
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


    render() {
        const {type} = this.props;
        const {isArbitrator} = this.props;
        const dataColumns = type === 'sentDisputes' 
                                ? ['dispute hash', 'merchant', 'amount', 'opened', 'last updated', 'status', 'action']
                                : isArbitrator  
                                    ? ['dispute hash', 'assigned', 'Pending arbitration', 'status', 'close date', 'action'] 
                                    : ['dispute hash', 'amount', 'opened', 'last updated', 'status', 'action'];
        
        return(        
            <DisputesContainer maxWidth="100%" activity={this.props.activity}>
                <TableWrapper>
                    <Table>
                        <thead>
                            <Tr>
                                {dataColumns.map(col=><Th key={col} className={col}>{col}<img src={require('../../images/icons/crescent-dd_12X6.svg')}/></Th>)}
                            </Tr>
                        </thead>
                        <tbody>
                            {this.state.disputesFiltered.map((row ,i)=> 
                                <Row key={i} rowData={row} disputes type={type}/>
                            )}
                        </tbody>
                    </Table>
                </TableWrapper>
                {this.props[this.props.type].size > 0 && this.state.disputesFiltered.length > 0 && <Pagination maxRows={6} array={this.props[this.props.type].size} setFilterdRows={(from, to) => this.createTable(from, to)} maxPages={this.props.windowWidth > 768 ? 8 : 4}/>}
            </DisputesContainer>
        )
    }
} 


const mapStateToProps = ({ app, account }) =>{
    return{
        transactions: account.transactions,
        sentDisputes: account.sentDisputes,
        receivedDisputes: account.receivedDisputes,
        claimDisputes: account.receivedDisputes,
        windowWidth: app.windowWidth,
        isArbitrator: app.isArbitrator
    }
}

const mapDispatchToProps = dispatch => {
  return {

  }
}


export default connect(
    mapStateToProps,mapDispatchToProps
)(Disputes);