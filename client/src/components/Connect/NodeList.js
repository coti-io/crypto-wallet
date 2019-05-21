import React, { Component } from 'react';
import styled from 'styled-components';

const NodeListContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: ${props => props.width ? props.width : '690'}px;
    max-width: 100%;
    background-color: #ffffff;
    height: ${props => props.height ? props.height : '720'}px;
    border-radius: 4px;
    box-shadow: 0px 2px 3.9px 0.1px rgba(0, 0, 0, 0.3);
    @media(max-width: 768px){
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        height: unset;
        border-radius: unset;
        width: 100%;
    }
`

const Heading = styled.h2`
    font-size: 12px;
    color: #333333;
    font-family: ClanOT-Medium;
    margin: 0;
    padding: 22px 30px;
    font-weight: bold;
    position: relative;
    & > img{
        width: 24px;
        vertical-align: middle;
        margin-right: 10px;
    }
`
const Close = styled.span`
    position: absolute;
    transform: rotate(45deg);
    cursor: pointer;
    top: 5px;
    right: 15px;
    font-size: 29px;
    font-weight: normal;
    font-family: ClanOT-Book;
`


const TableTop = styled.ul`
    padding: 25px 30px;
    list-style-type: none;
    margin: 0;
    background-color: #f8f8f8;
    display: flex;
    border-bottom: 1px solid #ebebeb;
    @media(max-width: 768px){
        padding: 25px 10px;
    }
`

const Item = styled.li`
    font-size: 12px;
    font-weight: 600;
    color: #000000;
    font-family: ClanOT-Medium;
    text-transform: uppercase; 
    width: ${props => props.width};
    &:not(:first-child){
        text-align: center;
    }
    & > img{
        width: 11px;
        vertical-align: middle;
        margin-left: 5px;
    }
    @media(max-width: 768px){
        & > img{
            margin-left: 0;
        }
    }
`

const NodeItem = styled.li`
    font-size: 12px;
    color: #333333;
    font-family: ClanOT-Book;
    width: ${props => props.width};
    &:not(:first-child){
        text-align: center;
    }
    &:last-child{
        color: #50e3c2;
        font-weight: bold;
    }
    text-transform: capitalize;
    overflow: hidden;
    text-overflow: ellipsis;
    @media(max-width: 768px){
        white-space: nowrap; 
        overflow: hidden;
        text-overflow: ellipsis;
        &:first-child{
            padding-right: 10px;
            box-sizing: border-box;
        }
    }
`

const TableRow = styled.ul`
    padding: 25px 30px;
    list-style-type: none;
    margin: 0;
    display: flex;
    border-bottom: 1px solid #ebebeb;
    cursor: pointer;
    &:hover{
        /* background-color: #fbffff; */
        /* background-color: #7ae1f952; */
        background: linear-gradient(49deg, #7ae1f952 30%,#7ae1f900);
    }
    @media(max-width: 768px){
        padding: 25px 10px;
    }
`

const Coti = styled.span`
    font-size: 8px;
    font-weight: bold;
    font-family: ClanOT-Medium;
`

const TableContainer = styled.div`
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
        background: #2cbedf; 
        border-radius: 10px;
    }
`

const calculatewidth = (windowWith, payment) => {
    if(windowWith <= 768){
        return "30%";
    }
    if(payment){
        return "180px";
    }
    return "305px";
}

const NodeList = ({nodeList, onSelectNode, windowWith, close, width, height, payment}) =>  {
    
    return (
        <NodeListContainer width={width} height={height}>
            <Heading>
                <img src={require('../../images/icons/titleicons_grad_node_24X24.svg')}/>
                Choose node to connect
                <Close onClick={close}>+</Close>
            </Heading>
            <TableContainer>
                <TableTop>  
                    <Item width={calculatewidth(windowWith, payment)}>node name <img src={require('../../images/icons/crescent-dd_12X6.svg')}/></Item>
                    <Item width={windowWith > 768 ? "70px" : "20%"}>fee <img src={require('../../images/icons/crescent-dd_12X6.svg')}/></Item>
                    <Item width={windowWith > 768 ? "70px" : "20%"}>min fee <img src={require('../../images/icons/crescent-dd_12X6.svg')}/></Item>
                    <Item width={windowWith > 768 ? "100px" : "25%"}>max fee <img src={require('../../images/icons/crescent-dd_12X6.svg')}/></Item>
                    {/* <Item width="25%">trust score <img src={require('../../images/icons/crescent-dd_12X6.svg')}/></Item> */}
                </TableTop>
                {nodeList.map((node, i) => {
                    return (
                        <TableRow key={i} onClick={() => onSelectNode(node)}>
                            <NodeItem width={calculatewidth(windowWith, payment)}>{node.nodeHash}</NodeItem>
                            <NodeItem width={windowWith > 768 ? "70px" : "20%"}>{node.feeData.feePercentage}%</NodeItem>
                            <NodeItem width={windowWith > 768 ? "70px" : "20%"}>{node.feeData.minimumFee}</NodeItem>
                            <NodeItem width={windowWith > 768 ? "100px" : "25%"}>{node.feeData.maximumFee} <Coti>COTI</Coti></NodeItem>
                            {/* <NodeItem width="25%">{nodeList..trustScore}</NodeItem> */}
                        </TableRow>
                    )
                })}
            </TableContainer>
        </NodeListContainer>
    )
}
    
   
export default NodeList;
