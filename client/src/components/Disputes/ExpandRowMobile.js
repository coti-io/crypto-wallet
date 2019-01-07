
import React from 'react';
import styled from 'styled-components';
import Time from '../Time/Time';

const Tr = styled.tr`
    border-top: 1px solid #00c3e2;
    background: #fbffff;
`

const Td = styled.td`
    padding-top: 15px;
    padding-bottom: 15px;
    box-sizing: border-box;
    vertical-align: middle;
    text-align: ${({alignRight}) => alignRight && 'right'};
    direction: ${({rtl}) => rtl && 'rtl'};
    &:first-child{
        padding-left: 20px;
    }
    &:last-child{
        padding-right: 20px;
    }
`

const Box = styled.div`
  display: flex;
  flex-direction: column;
`

const Arrow = styled.img`
  transform: rotate(90deg);
  width: 16px;
  cursor: pointer;
`

const Title = styled.div`
    font-size: 11px;
    color: #999999;
    font-family: ClanOT-Medium;
    text-transform: uppercase;
    font-weight: bold;
`

const MerchantName = styled.div`
    font-size: 18px;
    color: #333333;
    font-family:ClanOT-Medium;
    text-transform: capitalize;
    font-weight: bold;
`

const OpenRow = styled.tr`
    background-color: #fbffff;
    border-bottom: ${({borderBottom}) => borderBottom ? '1px solid #00c3e2' : '1px solid rgb(232,248,252)'};
`

const Hash = styled.div`
    font-size: 12px;
    color: #333333;
    font-family: ClanOT-Book;
    word-break: break-all;
    text-transform: lowercase;
    line-height: 1.67;
`

const KeyTitle = styled.div`
    font-size: 13px;
    color: #333333;
    text-transform: uppercase;
    font-family: ClanOT-Medium;
    font-weight: bold;
`

const Amount = styled.div`
    font-size: 18px;
    color: #333333;
    font-family: ClanOT-Medium;
    font-weight: bold;
`

const Status = styled.div`
  font-size: 13px;
  color: ${({status}) => getColor(status)};
  font-weight: bold;
  font-family: ClanOT-Book;
  text-transform: capitalize;
`

const getColor = (status) => {
    switch(status) {
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

const ViewDetails = styled.td`
    color: #2bbfdf;
    font-size: 12px;
    font-family: ClanOT-Medium;
    text-transform: uppercase;
    cursor: pointer;
    padding: 20px;
    text-align: right;
    font-weight: bold;
    background: #EEFCFE;
    & > img{
        width: 15px;
        vertical-align: middle;
        margin-left: 10px;
    }
`

const displayDisputeStatusCell = (value) => {
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

let ExpandedRow;

export default ExpandedRow = ({rowData, close, type, onViewDispute}) =>{
    return (
        <React.Fragment>
            <Tr>
                {(type === 'sentDisputes' ||  type === 'claimDisputes') && 
                    <Td colSpan={2}>
                        <Box>
                            <Title>Merchant</Title>
                            <MerchantName>{rowData.merchant}</MerchantName>
                        </Box>
                    </Td>}
                <Td colSpan={type === 'sentDisputes' ||  type === 'claimDisputes' ? 2 : 4} alignRight>
                    <Arrow src={require('../../images/icons/crescentright.svg')} onClick={() => close()}/>
                </Td>
            </Tr>
            <OpenRow>
                <Td colSpan={4}>
                    <Title>dispute hash</Title>
                    <Hash>{rowData['dispute hash']}</Hash>
                </Td>
            </OpenRow>
            <OpenRow>
                <Td colSpan={2}>
                    <KeyTitle>{type === 'claimDisputes' ? 'assigned' : 'amount'}</KeyTitle>
                </Td>
                <Td colSpan={2} alignRight rtl>
                    {
                        type === 'claimDisputes'
                        ? <Time date={rowData['assigned']}/>
                        : <Amount>{rowData.amount}</Amount>}
                </Td>
            </OpenRow>
            <OpenRow>
                <Td colSpan={type === 'claimDisputes' ? 3 : 2}>
                    <KeyTitle>{type === 'claimDisputes' ? 'pending arbitration' : 'opened'}</KeyTitle>
                </Td>
                <Td colSpan={type === 'claimDisputes' ? 1 : 2} rtl>
                    {   
                        type === 'claimDisputes'
                        ?  <Status>{rowData['pending arbitration']}</Status> 
                        : <Time date={rowData.opened}/>
                    }
                </Td>
            </OpenRow>
            <OpenRow>
                <Td colSpan={2}>
                    <KeyTitle>{type === 'claimDisputes' ? 'status' : 'Last Updated'}</KeyTitle>
                </Td>
                <Td colSpan={2} rtl>
                    {
                        type === 'claimDisputes'
                        ? <Status status={rowData.status}>{displayDisputeStatusCell(rowData.status)}</Status>
                        : <Time date={rowData['lastUpdated']}/>
                    }
                </Td>
            </OpenRow>
            <OpenRow>
                <Td colSpan={2}>
                    <KeyTitle>{type === 'claimDisputes' ? 'closed date' : 'status'}</KeyTitle>
                </Td>
                <Td colSpan={2} rtl>
                    {
                        type === 'claimDisputes'
                        ? rowData['close date'] ? <Time date={rowData['close date']}/> : '---'
                        : <Status status={rowData.status}>{displayDisputeStatusCell(rowData.status)}</Status>
                    }
                </Td>
            </OpenRow>
            <OpenRow borderBottom>
                <ViewDetails onClick={() => onViewDispute(rowData["dispute hash"], rowData['transaction hash'])} colSpan={4}>View Details <img src={require('../../images/icons/crescentright.svg')}/></ViewDetails>
            </OpenRow>
        </React.Fragment>
    )
}
	

