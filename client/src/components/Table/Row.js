import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import moment from 'moment';
import styled from "styled-components";
import copy from "../../images/icons/copy.svg";
import Time from '../Time/Time';
import {removeZerosFromEndOfNumber, customFixed} from '../../shared/utility';
import ExpandedDisputeRow from '../Disputes/ExpandRowMobile';
import ClosedDisputeRow from '../Disputes/ClosedRowMobile';
import * as actions from '../../store/actions/index';


const Tr = styled.tr`
  position: relative;
  max-width: 100%;
  overflow: hidden;
  border-top: 1px solid #ddd;
  & > td.Amount{
    font-size: 14px;
    font-family: ClanOT-Medium;
    position: relative;
    font-weight: bold;
    text-align: right;
    padding-right: 46px;
  }
  & > td.Amount > span{
    width: 76px;
    text-align: right;
  }
  & > td.Amount > img{
      width: 13px;
      position: absolute;
      right: 15px;
      top: 23px;
      cursor: pointer;
  }
  & > td.Transactions.Hash img{
      cursor: pointer;
  }
  &:hover{
    background-color: #fcfeff;
  }
  &:hover{
    & > td{
      border-top: ${props => props.disputes ? '' : '1px solid #2bbfdf'};
      border-bottom: ${props => props.disputes ? '' : '1px solid #2bbfdf'};
    }
  }
  &:hover img {
    display: inline-block !important;
    top: 28px !important;
  }
  &:hover > td{
    max-width: ${props => props.disputes ? '' : 'unset !important'};
    overflow: ${props => props.disputes ? '' : 'unset !important'};
    text-overflow: ${props => props.disputes ? '' : 'unset !important'};
  }
 
  &:hover td > span {
    word-wrap: break-word;
    box-sizing: border-box;
    line-height: 20px
    z-index: 999 !important;
    max-width: unset !important;
    overflow: unset !important;
    text-overflow: unset !important;
    background: rgb(252, 254, 255) !important;
    transition: 0.2s ease;
    white-space: unset;
  }
  &:hover td.Amount > span{
      top: 22px;
  }

`;

const ExpandTr = styled.tr`
  border-top: ${props => props.borderTop ? props.borderTop : 'none'};
  border-bottom: ${props => props.borderBottom ? props.borderBottom : 'none'};
  & > td.Amount{
    text-align: right;
    padding-right: 46px;
    font-size: 18px;
    font-family: ClanOT-Medium;
    position: relative;
    font-weight: bold;
  }
`
const DetailsWrapper = styled.ul`
  background-color: #fcfeff;
  list-style-type: none;
  height: 60px;
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
  padding-right: ${({paddingRight}) => paddingRight && '20px'};
`

const ExapndTd = styled.td`
  font-size: 12px;
  font-family: ClanOT-News; 
  padding: 10px 15px;
  box-sizing: border-box;
  text-transform: capitalize;
  position: relative;
  vertical-align: baseline;
  & > span{
    overflow-wrap: break-word;
    line-height: 1.5;
   }
  & span > img{
    width: 22px;
    cursor: pointer; 
    vertical-align: middle;
    margin-right: 10px;
  }
  & > img {
    width: 13px;
    position: absolute;
    right: 17px;
    top: 20px;
    cursor: pointer;
    transform: rotate(90deg);
    transition: transform 0.7s ease 0s;
  }
`

const Td = styled.td`
  position: relative;
  text-overflow: ellipsis;
    overflow: hidden;
  text-align: left;
  height: 60px;
  font-size: ${props => props.sizeFont ? '18' : '12'}px;
  font-family: ClanOT-News; 
  padding: 10px 15px;
  box-sizing: border-box;
  text-transform: ${props => props.hash ? 'lowercase' : 'capitalize'};
  font-weight: ${props => props.bold ? 'bold' : ''};
  & > span{
    white-space: nowrap; 
    overflow: hidden;
    text-overflow: ellipsis;
  }
  & > span.Transactions.Hash{
    font-family: ClanOT-News;
    text-transform: lowercase;
  }
  & span > img{
    width: 22px;
    vertical-align: middle;
    margin-right: 10px;
  }
`;

const Li = styled.li`
  font-family: ClanOT-Medium;
  color: #333333;
  font-weight: bold;
  text-transform: capitalize;
  &:first-child{
        padding: 10px 15px;
        width:${({receiver}) => receiver ? '100%' : '45%'};
        font-size:${({receiver}) => receiver && '10px'};
  }
  &:nth-child(2){
      display: flex;
      justify-content: ${({fee}) => fee ? 'flex-end' : 'space-between'};
      width: 50%;
      font-size: 18px;
      padding: 10px 24px 10px 50px;
      & > div:nth-child(2){
          font-size: 18px;
          font-weight: bold;
      }
  }
  & span{
      font-family: ClanOT-Book;
      font-size: 18px;
      font-weight: normal;
  }
`

const OpenDispute = styled.div`
  font-family: ClanOT-News;
  font-size: 12px !important;
  color: #2bbfdf;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1.2px;
`

const OpenDisputeOpen = styled.div`
  font-family: ClanOT-News;
  font-size: 12px !important;
  color: #2bbfdf;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  background-color: #EEFCFE;
  padding: 10px 0;
  text-align: center;
  display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
`

const Box = styled.div`
  display: flex;
  flex-direction: column;
`
const Subtitle = styled.div`
  font-size: 15px;
  color: #333333;
  font-family: ClanOT-Medium;
  text-transform: capitalize;
  margin-bottom: 4px;
  font-weight: ${({disputes}) => disputes && 'bold'};
  @media(max-width: 414px){
      font-size: 13px;
  }
`

const Status = styled.div`
  font-size: 13px;
  color: #333333;
  font-weight: ${({disputes}) => disputes && 'bold'};
  font-family: ClanOT-Book;
  text-transform: capitalize;
  & > img{
      width: 22px;
      vertical-align: middle;
      margin-right: 10px;
  }
  @media(max-width: 414px){
      font-size: 11px;
  }
`

const TransactionAmount = styled.div`
  font-size: 13px;
  text-align: right;
  color: #333333;
  font-family: ClanOT-Medium;
  margin-bottom: 10px;
  font-weight: bold;
  @media(max-width: 414px){
      font-size: 11px;
  }
`

const TransactionAmountOpened = styled.div`
  font-size: 18px;
  text-align: right;
  color: #333333;
  font-family: ClanOT-Medium;
  margin-bottom: 10px;
`

const TransactionStatus = styled.div`
  font-size: 13px;
  color: #333333;
  font-family: ClanOT-Book;
  text-align: right;
  text-transform: capitalize;
  @media(max-width: 414px){
      font-size: 11px;
  }
`

const ResponsiveTr = styled.tr`
  border-top: ${props => props.open ? '1px solid #00c3e2' : '1px solid #ebebeb'};
  &:first-child{
    border-top: ${props => props.open ? '1px solid #00c3e2' : 'none'};
  }
  &:last-child{
      border-bottom: ${props => props.open ? '1px solid #00c3e2' : '1px solid #ebebeb'};
  }
  background: ${props => props.background ? '#fbffff' : '#fff'};
`

const ResponsiveTd = styled.td`
    padding-top: 10px;
    padding-bottom: 10px;
    box-sizing: border-box;
    vertical-align: ${props => props.vertical ? props.vertical : 'middle'};
    &:first-child{
        padding-left: 10px;
    }
    &:last-child{
        padding-right: 10px;
    }
`

const TransactionHash = styled.div`
    overflow-wrap: break-word;
    font-family: ClanOT-News;
    font-size: 12px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.67;
    letter-spacing: normal;
    text-align: left;
    color: #333333;
`

const ResponsiveTdOpened = styled.td`
    padding: ${props => props.padding ? props.padding : '10'}px 0;
    box-sizing: border-box;
    vertical-align: ${props => props.top ? "top" : "middle"};
    &:first-child{
        padding-left: 10px;
    }
    &:last-child{
        padding-right: 10px;
    }
`

const Receiver = styled.span`
    font-family: ClanOT-News;
    font-size: 12px;
    font-weight: bold
`

const Arrow = styled.img`
  transform: rotate(${props => props.open ? "90" : "0"}deg);
  width: 16px;
  cursor: pointer;
`

const OpenRow = styled.tr`
    background-color: #fbffff;
    border-bottom: ${props => props.borderBottom ? "1px solid #00c3e2" : "1px solid rgb(232,248,252)"};
`

const Icon = styled.img`
    width: 24px;
`

const Date = styled.div`
    font-size: 18px;
    color: #333333;
    font-family: ClanOT-Book;
`

const Merchant = styled.div`
    font-size: 18px;
    font-weight: 600;
    color: #333333;
    font-family: ClanOT-Medium;
    text-transform: capitalize;
`
const Product = styled.div`
    font-size: 18px;
    color: #333333;
    font-family: ClanOT-Medium;
    text-transform: capitalize;
`

const Quantity = styled.div`
    font-size: 12px;
    color: #333333;
    font-family: ClanOT-Medium;
`

const ProductTotal = styled.div`
    font-family: ClanOT-News;
    font-size: 18px;
    text-align: right;
    color: #333333;
`

const Plus = styled.span`
    font-size: 30px;
    margin-right: 8px;
`

const ViewDetails = styled.td`
    color: #2bbfdf;
    font-size: 12px;
    font-family: ClanOT-Medium;
    text-transform: uppercase;
    border-top: 1px solid #ddd;
    cursor: pointer;
    padding: 10px 15px;
    font-weight: bold;
    & > img{
        width: 15px;
        vertical-align: middle;
        margin-left: 10px;
    }
`

const Address = styled.span`
    font-size: 12px !important;
    font-family: ClanOT-News !important;
    font-weight: normal;
    text-transform: lowerCase;
`

class Row extends Component {

    state = {
        open: false,
    }

    onClickCopy(e,val){
        var x = e.pageX,
            y = e.pageY;

        var textField = document.createElement('textarea')
        textField.innerText = val
        document.body.appendChild(textField)
        textField.select()
        document.execCommand('copy')
        textField.remove()
        var copied = document.createElement('span')
        copied.innerText = "Copied";
        copied.style = `
                    position: absolute; 
                    top: ${Number(y)-50}px; 
                    left: ${Number(x)-40}px; 
                    font-size: 14px;
                    background-image: linear-gradient(244deg, #2cbfdf, #2c9cdf);
                    border-radius: 8px 4px 8px 0px;
                    color: #fff;           
                    letter-spacing: 1px;
                    font-family: ClanOT-news;
                    padding: 5px 10px;
                    z-index: 99999;
                    `;
        document.body.appendChild(copied);
        setTimeout(()=>{copied.remove()},2000)
    }

    renderDetails(){
        const {rowData} = this.props;
        const items = rowData.items;
        const {type} = this.props;
        const isSent = rowData["sent/received"] == 'sent'
        const isReceived = rowData["sent/received"] === 'received'
        const isTransfer = rowData['Transactions type'] === 'Transfer'
            return (
                <React.Fragment>
                    {
                        this.props.rowData['Transactions type'] === "Transfer" &&
                        <ExpandTr>
                            <td colSpan={6}>
                                <DetailsWrapper paddingRight>
                                    <Li receiver><span>Receiver Address: </span><Address lowerCase>{this.props.rowData.receiver}</Address></Li>
                                </DetailsWrapper>
                            </td>
                        </ExpandTr>
                    }
                    {this.props.rowData['Transactions type'] === "Payment" && items.map((item, i) => (
                        <ExpandTr key={i}>
                            <td colSpan={6}>
                                <DetailsWrapper paddingRight>
                                    <Li>product name: <span>{item.itemName}</span></Li>
                                    <Li>
                                        <div>product quantity: <span>{item.itemQuantity}</span></div>
                                        <div>{item.itemPrice}</div>
                                    </Li>
                                </DetailsWrapper>
                            </td>
                        </ExpandTr>
                    ))}
                   { 
                    (isSent || (isReceived && !isTransfer)) &&
                        <React.Fragment>
                            <ExpandTr borderTop={'1px solid rgb(232, 248, 252)'}>
                                    <td colSpan={6}>
                                        <DetailsWrapper paddingRight>
                                            <Li><span>Full node fee</span></Li>
                                            <Li fee>{this.props.rowData.fullNodeFee}</Li>
                                        </DetailsWrapper>
                                    </td>
                                </ExpandTr>
                                <ExpandTr borderTop={'1px solid rgb(232, 248, 252)'}>
                                    <td colSpan={6}>
                                        <DetailsWrapper paddingRight>
                                            <Li><span>Network fee</span></Li>
                                            <Li fee>{this.props.rowData.networkFee}</Li>
                                        </DetailsWrapper>
                                    </td>
                                </ExpandTr>
                        </React.Fragment>
                    }
                    <ExpandTr borderTop={'1px solid rgb(232, 248, 252)'} borderBottom={'1px solid #2bbfdf'}>
                        <td colSpan={6}>
                            <DetailsWrapper paddingRight>
                            {
                                this.props.rowData.confirmationTime !== ''
                                ?<Li>Confirmation time: <span>{moment(this.props.rowData.confirmationTime).format('LLLL')}</span></Li>
                                :<Li>Created time: <span>{moment(this.props.rowData.Date).format('LLLL')}</span></Li>
                            }
                            
                                
                                <Li>
                                    {this.props.rowData['Transactions type'] === "Payment" && <div>Merchant: <span>{this.props.rowData.merchant}</span></div>}
                                    {this.props.rowData['isDisputeable'] && this.props.rowData['Status'] === "Confirmed" && rowData['Transactions type'] === "Payment"
                                        && rowData['sent/received'] === 'sent' && <OpenDispute onClick={() => this.openDispute()}>+ Open dispute</OpenDispute>}
                                </Li>
                            
                            </DetailsWrapper>
                        </td>
                    </ExpandTr>
                </React.Fragment>
            )
    }

    viewDispute(disputeHash, transactionHash){
        this.props.history.push(`/disputeDetails/${transactionHash}/${disputeHash}`)
    }

    displayDisputeStatusCell(value){
        switch(value) {
            case 'Recall':
                return 'Open'
            case 'CanceledByConsumer':
                return 'Cancelled'
            case 'Claim':
                return 'In arbitration'
            case 'Closed':
                return 'Closed'
          }
    }


    displayClosedRow(){
        const {rowData} = this.props;
        const {type} = this.props;
        if(this.props.disputes){
            return (
                <Tr disputes>
                    <Td hash>
                        {rowData['dispute hash'].toLowerCase()}
                    </Td>
                    {rowData.merchant &&
                        <Td>
                            {rowData.merchant}
                        </Td>
                    }
                    <Td>
                        {type ==='claimDisputes' 
                            ? <Time date={rowData['assigned']}/>
                            : rowData.amount}
                    </Td>
                    <Td>
                        {type ==='claimDisputes'
                            ? rowData['pending arbitration']
                            : <Time date={rowData.opened}/>}
                    </Td>
                    <Td>
                        {type ==='claimDisputes'
                            ? this.displayDisputeStatusCell(rowData.status)
                            : <Time date={rowData.lastUpdated}/>}
                    </Td>
                    <Td>
                        {type ==='claimDisputes'
                            ? rowData['close date'] ? <Time date={rowData['close date']}/> : '---'
                            : this.displayDisputeStatusCell(rowData.status)}
                    </Td>
                    <ViewDetails onClick={() => this.viewDispute(rowData["dispute hash"], rowData['transaction hash'])}>View Details <img src={require('../../images/icons/crescentright.svg')}/></ViewDetails>    
                </Tr>
            )
        }
        return (
            <Tr>
                <Td className={"Date"}>
                    <span className={"Date"}>
                        <Time date={rowData.Date}/>
                    </span>
                </Td>
                <Td className={"Transactions Hash"}>
                    <span className={"Transactions Hash"}>
                        {rowData["Transactions Hash"]}
                        {<img onClick={(e)=>this.onClickCopy(e, rowData["Transactions Hash"])} style={{display: 'none', marginLeft: '5px'}} src={copy}/>}
                    </span>
                </Td>
                <Td className={"Transactions type"}>
                    <span className={"Transactions type"}>
                        <img src={require(`../../images/transactions/${rowData['Transactions type'].toLowerCase()}.svg`)}/> 
                        {rowData['Transactions type']}
                    </span>
                </Td>
                <Td className={"sent/received"}>
                    <span className={"sent/received"}>
                        {rowData["sent/received"]}
                    </span>
                </Td>
                <Td className={"Status"}>
                    <span className={"Status"}>
                        {rowData["Status"]}
                    </span>
                </Td>
                <Td className={"Amount"}>
                    <span className={"Amount"}>
                        {rowData["sent/received"] === 'received' && rowData['Transactions type'] === 'Transfer' ? customFixed((rowData["Amount"] - rowData['fullNodeFee'] - rowData['networkFee']), 2) : removeZerosFromEndOfNumber(customFixed(rowData["Amount"], 2))}
                    </span>
                    <img open={this.state.open} onClick={() => this.setState({...this.state, open: !this.state.open})} src={require('../../images/icons/crescentright.svg')}/>
                </Td>
            </Tr>
        )
    }

    displayOpenedRow(){
        const {rowData} = this.props;
        const {type} = this.props;
        return (
            <React.Fragment>
                <ExpandTr borderTop={'1px solid #2bbfdf'}>
                    <ExapndTd className={"Date"}>
                        <span className={"Date"}>
                            <Time date={rowData.Date}/>
                        </span>
                    </ExapndTd>
                    <ExapndTd className={"Transactions Hash"}>
                        <span className={"Transactions Hash"}>
                            {rowData["Transactions Hash"]}
                            {<img onClick={(e)=>this.onClickCopy(e, rowData["Transactions Hash"])} style={{width: '18px', marginLeft: '5px'}} src={copy}/>}
                        </span>
                    </ExapndTd>
                    <ExapndTd className={"Transactions type"}>
                        <span className={"Transactions type"}>
                            <img src={require(`../../images/transactions/${rowData['Transactions type'].toLowerCase()}.svg`)}/>
                            {rowData['Transactions type']}
                        </span>
                    </ExapndTd>
                    <ExapndTd className={"sent/received"}>
                        <span className={"sent/received"}>
                            {rowData["sent/received"]}
                        </span>
                    </ExapndTd>
                    <ExapndTd className={"Status"}>
                        <span className={"Status"}>
                            {rowData["Status"]}
                        </span>
                    </ExapndTd>
                    <ExapndTd className={"Amount"}>
                        <span className={"Amount"}>
                            {rowData["sent/received"] === 'received' && rowData['Transactions type'] === 'Transfer' 
                                ? (rowData["Amount"] - rowData['fullNodeFee'] - rowData['networkFee']) 
                                : removeZerosFromEndOfNumber(customFixed(rowData["Amount"], 2))}
                        </span>
                        <img open={this.state.open} onClick={() => this.setState({...this.state, open: !this.state.open})} src={require('../../images/icons/crescentright.svg')}/>
                    </ExapndTd>
                </ExpandTr>
                {this.renderDetails()}
            </React.Fragment>
        )
    }

    getColor(col){
        switch(col) {
            case 'open':
                return '#00c3e2'
            case 'closed':
                return '#00e7c0'
            case 'reviewed':
                return '#fc8200'
            default:
                return '#333333'
          }
    }

    displayClosedRowMobile(){
        const {rowData} = this.props;
        const {type} = this.props;
        if(this.props.disputes){
            return (
                <ClosedDisputeRow type={type} rowData={rowData} open={() => this.setState({...this.state, open: true})}/>
            )
        }
        return (
            <React.Fragment>
                <ResponsiveTr>
                    <ResponsiveTd width="20%"><Time date={rowData.Date}/></ResponsiveTd>
                    <ResponsiveTd vertical={'top'} width="30%">
                        <Box>
                            <Subtitle>{rowData['sent/received']}</Subtitle>
                            <Status>
                                <React.Fragment>
                                    {<img src={require(`../../images/transactions/${rowData['Transactions type'].toLowerCase(0)}.svg`)}/>}
                                    {rowData['Transactions type']}
                                </React.Fragment>
                            </Status>
                        </Box>
                    </ResponsiveTd>
                    <ResponsiveTd vertical={'top'} width="40%">
                        <TransactionAmount>
                            {rowData['Amount'] > 0 && "+"} 
                            {rowData["sent/received"] === 'received' && rowData['Transactions type'] === 'Transfer' 
                                ? (rowData["Amount"] - rowData['fullNodeFee'] - rowData['networkFee']) 
                                : removeZerosFromEndOfNumber(customFixed(rowData["Amount"], 2))}
                        </TransactionAmount>
                        <TransactionStatus>{rowData['Status']}</TransactionStatus>
                    </ResponsiveTd>
                    <ResponsiveTd width="10%" style={{textAlign: 'right'}}>
                        <Arrow src={require('../../images/icons/crescentright.svg')} onClick={() => this.setState({...this.state, open: !this.open})}/>
                    </ResponsiveTd>
                </ResponsiveTr>
            </React.Fragment>
        )
    }

    displayOpenedRowMobile(){
        const {rowData} = this.props;
        
        const {type} = this.props;
        const isSent = rowData["sent/received"] == 'sent'
        const isReceived = rowData["sent/received"] === 'received'
        const isTransfer = rowData['Transactions type'] === 'Transfer'
        

        if(this.props.disputes){
            return (
                <ExpandedDisputeRow onViewDispute={(disputeHash, transactionHash) => this.viewDispute(disputeHash, transactionHash)} type={type} rowData={rowData} close={() => this.setState({...this.state, open: !this.state.open})}/>
            )
        }
        return (
            <React.Fragment>
                <ResponsiveTr open background>
                    <ResponsiveTdOpened padding={20}><Time date={rowData.Date}/></ResponsiveTdOpened>
                    <ResponsiveTdOpened padding={20}>
                        <Subtitle>{rowData['sent/received']}</Subtitle>
                    </ResponsiveTdOpened>
                    <ResponsiveTdOpened colSpan={2} style={{textAlign: 'right'}} padding={20}>
                        <Arrow src={require('../../images/icons/crescentright.svg')} open onClick={() => this.setState({open: !this.state.open})}/>
                    </ResponsiveTdOpened>
                </ResponsiveTr>
                <OpenRow>
                    <ResponsiveTdOpened>
                        {<Icon src={require(`../../images/transactions/${rowData['Transactions type'].toLowerCase()}.svg`)}/>}
                    </ResponsiveTdOpened>
                    <ResponsiveTdOpened>
                        <Status>
                            {rowData['Transactions type']}
                        </Status>
                    </ResponsiveTdOpened>
                    <ResponsiveTdOpened colSpan={2}>
                        <Box>
                            <TransactionAmountOpened>
                                {rowData['Amount'] > 0 && "+"} 
                                {rowData["sent/received"] === 'received' && rowData['Transactions type'] === 'Transfer' 
                                    ? (rowData["Amount"] - rowData['fullNodeFee'] - rowData['networkFee']) 
                                    : removeZerosFromEndOfNumber(customFixed(rowData["Amount"], 2))}
                            </TransactionAmountOpened>
                            <TransactionStatus>{rowData['Status']}</TransactionStatus>
                        </Box>    
                    </ResponsiveTdOpened>
                </OpenRow>
                <OpenRow>
                    <ResponsiveTdOpened colSpan={1} padding={20} top>
                        <Icon onClick={(e)=>this.onClickCopy(e, rowData['Transactions Hash'])} src={copy}/>
                    </ResponsiveTdOpened>
                    <ResponsiveTdOpened colSpan={3} padding={20}>
                        <TransactionHash>{rowData['Transactions Hash']}</TransactionHash>
                    </ResponsiveTdOpened>
                </OpenRow>
                {
                    this.props.rowData['Transactions type'] === "Transfer" &&
                    <OpenRow>
                        <ResponsiveTdOpened colSpan={1} padding={20} top>
                            <Receiver>Receiver Address</Receiver>
                        </ResponsiveTdOpened>
                        <ResponsiveTdOpened colSpan={3} padding={20}>
                            <TransactionHash>{rowData['receiver']}</TransactionHash>
                        </ResponsiveTdOpened>
                    </OpenRow>
                }

                <OpenRow>
                    <ResponsiveTdOpened colSpan={4} padding={20}>
                        {
                            this.props.rowData.confirmationTime !== '' 
                            ?<Date>{moment(rowData.confirmationTime).format('LLLL')}</Date>
                            :<Date>{moment(rowData.Date).format('LLLL')}</Date>
                        }
                    </ResponsiveTdOpened>
                </OpenRow>
                {
                    rowData['Transactions type'] === 'Payment' && 
                    <OpenRow>
                        <ResponsiveTdOpened colSpan={4} padding={20}>
                            <Merchant>{rowData.merchant}</Merchant>
                        </ResponsiveTdOpened>
                    </OpenRow>
                    
                }
                {rowData['Transactions type'] === 'Payment' && this.props.rowData.items.map((item, i) => (
                    <OpenRow key={i}>
                        <ResponsiveTdOpened colSpan={1}>
                            <Box>
                                <Product>{item.itemName}</Product>
                                <Quantity>X {item.itemQuantity}</Quantity>
                            </Box>
                        </ResponsiveTdOpened>
                        <ResponsiveTdOpened colSpan={3}>
                            <ProductTotal>{item.itemPrice}</ProductTotal>
                        </ResponsiveTdOpened>
                    </OpenRow>
                ))}
                {

                (isSent || (isReceived && !isTransfer)) &&

                <React.Fragment>
                <OpenRow>
                    <ResponsiveTdOpened colSpan={2}>
                        <Product>Full node fee</Product>
                    </ResponsiveTdOpened>
                    <ResponsiveTdOpened colSpan={2}>
                        <ProductTotal>{rowData.fullNodeFee}</ProductTotal>
                    </ResponsiveTdOpened>
                </OpenRow>
                <OpenRow>
                    <ResponsiveTdOpened colSpan={2}>
                        <Product>Network fee</Product>
                    </ResponsiveTdOpened>
                    <ResponsiveTdOpened colSpan={2}>
                        <ProductTotal>{rowData.networkFee}</ProductTotal>
                    </ResponsiveTdOpened>
                </OpenRow>
                </React.Fragment>
                }
                {rowData['Transactions type'] === 'Payment' && rowData['Status'] === 'Confirmed' && 
                this.props.rowData['isDisputeable'] && rowData['sent/received'] === 'sent' &&
                    <OpenRow borderBottom>
                        <ResponsiveTdOpened colSpan={4} style={{padding: '0'}}>
                            <OpenDisputeOpen onClick={() => this.openDispute()}><Plus>+</Plus> Open dispute</OpenDisputeOpen>
                        </ResponsiveTdOpened>
                    </OpenRow>
                }
            </React.Fragment>
        )
    }

    openDispute(){
        this.props.history.push("/createDispute/" + this.props.rowData["Transactions Hash"]);
    }

    componentWillReceiveProps(nextProps){
        if(this.props.rowData['Transactions Hash'] !== nextProps.rowData['Transactions Hash']){
            this.setState({...this.state, open: false})
        }
    }
   
    render() {
        const {windowWidth} = this.props;
        return(  
            windowWidth > 1201 
            ? this.state.open ? this.displayOpenedRow() : this.displayClosedRow()
            : this.state.open ? this.displayOpenedRowMobile() : this.displayClosedRowMobile()
        
        )
    }
} 

const mapStateToProps = state => {
    return {
        disputeObj: state.account.disputeData,
        windowWidth: state.app.windowWidth
    }
}

const mapDispatchToProps = dispatch => {
    return {
      
    }
  }


export default withRouter(connect(
    mapStateToProps, mapDispatchToProps
)(Row));