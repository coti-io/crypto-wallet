
import React from 'react';
import styled from 'styled-components';
import moment from 'moment';

const Timeholder = styled.div`
    display: flex;
    flex-direction: column;
    width: 50px;
    justify-content: center;
    align-items: center;
`

const Day = styled.div`
    font-size: 11px;
    font-family: ClanOT-Medium;
    text-transform: uppercase;
    color: #666666;
    font-weight: bolder;
    margin-bottom: 5px;
`

const Hour = styled.div`
    font-size: 10px;
    font-family: ClanOT-Book;
    color: #999999;
`

let Time;

export default Time = ({date}) =>{
    return (<Timeholder>
                <Day>{moment(new Date(date)).format("MMM DD")}</Day>
                <Hour>{moment(new Date(date)).format('HH:mm')}</Hour>     
            </Timeholder>)
}
	

