
import React from 'react';
import styled from 'styled-components';

const NotificationRowHolder = styled.div`
    margin: 0 -30px;
    padding: 25px 30px;
    border-top: 1px solid #ebebeb;
    &:last-child{
        padding: 25px 30px 0 30px;
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

const Box = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
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

export default NotificationRow = ({date}) =>{
    return (<NotificationRowHolder>
               <Box>
                    <Title>dISPUTE hASH</Title>
                    <Amount>230</Amount>
               </Box>  
               <Hash>5UMXEPHDD42B5RLCW58KMDADX8JDKU89S6QGUKKFXCW74E6DM25UMXEPHDD42B5RLCW58KMDADX8JDKU89S6QGUKKFXCW74E6DM2</Hash>
               <Title>wALLET ADDRESS</Title>
               <Address>3b199f20-cf46-4343-8b5b-eebc27ad3c57</Address>
               <Box>
                    <Details>View dispute details</Details>
                    <Button>Send funds</Button>
               </Box>
            </NotificationRowHolder>)
}
	

