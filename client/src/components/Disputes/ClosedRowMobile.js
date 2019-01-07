
import React from 'react';
import styled from 'styled-components';
import Time from '../Time/Time';

const Tr = styled.tr`
  border-top: 1px solid #ebebeb;
  background: #fff;
  &:first-child{
      border-top: none;
  }
  &:last-child{
    border-bottom: 1px solid #ebebeb;
  }
`

const Td = styled.td`
    padding: ${({padding}) => padding};
    box-sizing: border-box;
    vertical-align: middle;
    direction: ${({rtl}) => rtl && 'rtl'};
    text-align: ${({alignRight}) => alignRight && 'right'};
    font-family: ClanOT-Medium;
    &:first-child{
        padding-left: 20px;
    }
    &:last-child{
        padding-right: 20px;
    }
`

const Subtitle = styled.div`
  font-size: 15px;
  color: #333333;
  font-family: ClanOT-Medium;
  text-transform: capitalize;
  margin-bottom: 4px;
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

const Box = styled.div`
  display: flex;
  flex-direction: column;
`

const Arrow = styled.img`
  width: 16px;
  cursor: pointer;
  vertical-align: ${({middle}) => middle && 'middle'};
  margin-left: ${({marginLeft}) => marginLeft && '10px'};
`

let ClosedRow;

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

export default ClosedRow = ({rowData, open, type}) =>{

    return (
        <React.Fragment>
            <Tr>
                {type === 'claimDisputes' 

                ?   <React.Fragment>
                        <Td colSpan={2} padding="20px 0">{rowData.merchant}</Td>
                        <Td vertical={'top'} colSpan={2} alignRight padding="20px 0">
                            {displayDisputeStatusCell(rowData.status)}
                            <Arrow src={require('../../images/icons/crescentright.svg')} onClick={() => open()} middle marginLeft/>
                        </Td>
                    </React.Fragment>    

                :   <React.Fragment>
                        <Td colSpan={1} padding="10px 0"><Time date={rowData.opened}/></Td>
                        <Td padding="10px 0" vertical={'top'} colSpan={1}>
                            <Box>
                                {type === 'sentDisputes' && <Subtitle>{rowData.merchant}</Subtitle>}
                                <Status status={rowData.status}>{displayDisputeStatusCell(rowData.status)}</Status>
                            </Box>
                        </Td>
                        <Td colSpan={2} rtl padding="10px 0">
                            <Arrow src={require('../../images/icons/crescentright.svg')} onClick={() => open()}/>
                        </Td>
                    </React.Fragment>
                }
            </Tr>
        </React.Fragment>
    )
}
	

