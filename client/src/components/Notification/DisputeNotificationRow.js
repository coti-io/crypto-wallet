
import React from 'react';
import styled from 'styled-components';

const NotificationRowHolder = styled.div`
    margin: 0 -30px;
    padding: 25px 30px;
    &:not(:last-child){
        border-bottom: 1px solid #ebebeb;
    }
    &:last-child{
        padding: 25px 30px 0 30px;
    }
    @media(max-width: 1080px){
        &:last-child{
            padding: 25px 30px;
        }
    }
`

const Title = styled.div`
    color: #999999;
    text-transform: uppercase;
    font-size: 12px;
    font-family: ClanOT-Medium;
    font-weight: bold;
    margin-bottom: 5px;
`

const Hash = styled.div`
    font-size: 12px;
    font-family: ClanOT-Book;
    color: #333333;
    line-height: 1.67;
    text-transform: uppercase;
    width: 70%;
    word-break: break-all;
    margin-bottom: 20px;
`

const Address = styled.div`
    font-size: 12px;
    font-family: ClanOT-Book;
    color: #333333;
    line-height: 1.67;
    width: 70%;
    word-break: break-all;
`

const Details = styled.div`
    color: #2bbfdf;
    font-family: ClanOT-News;
    font-size: 12px;
    text-decoration: underline;
    cursor: pointer;
    font-weight: bold;
`

const Read = styled.div`
    color: #2bbfdf;
    font-family: ClanOT-News;
    font-size: 12px;
    text-decoration: underline;
    cursor: pointer;
    font-weight: bold;
`

const Box = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`

const Heading = styled.div`
    font-size: 12px;
    font-family: ClanOT-Medium;
    margin-bottom: 12px;
`

const Button = styled.button`
    width: 130px;
    height: 40px;
    border-radius: 10px;
    background-color: #2bbfdf;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    text-transform: uppercase;
    color: #ffffff;
    font-family: ClanOT-Book;
    font-size: 12px;
    cursor: pointer;
`

const Amount = styled.div`
    font-family: ClanOT-News;
    font-size: 12px;
    font-weight: bold;
    color: #333333;
`

let NotificationRow;

export default NotificationRow = ({notificationContent, disputHash, onViewDetailsClick}) =>{
    return (<NotificationRowHolder>
               <Box>
                    <Title>dispute hash</Title>
               </Box>  
               <Hash>{disputHash}</Hash>
               <Heading>{notificationContent}</Heading>
               <Box>
                    <Details onClick={() => onViewDetailsClick()}>View dispute details</Details>
                    <Read>Read</Read>
               </Box>
            </NotificationRowHolder>)
}
	

