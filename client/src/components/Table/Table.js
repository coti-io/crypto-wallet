import React, { Component } from 'react';
import styled, { keyframes } from 'styled-components';
import { fadeIn } from 'react-animations';
import { connect } from 'react-redux';
import copy from "../../images/icons/copy.svg";
import Sort from '../../images/icons/crescent-dd_12X6.svg';
import rotateIn from 'react-animations/lib/rotate-in';

const fadePade = keyframes`${fadeIn}`;

const TableContainer = styled.div`
    display: block;
    height: 100%;
    overflow-y: auto;
    @media(max-width: 560px){
        overflow-y: unset;
        height: auto;
    }
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
`;

const Tr = styled.tr`
  position: relative;
  max-width: 100%;
  overflow: hidden;
  &:hover{
    background-color: #fcfeff;
  }
  &:hover{
    & > td{
      border-top: 1px solid #2bbfdf;
      border-bottom: 1px solid #2bbfdf;
    }
  }
  &:hover td img{
    vertical-align: bottom;
  }
  &:hover img {
    cursor: pointer;
    display: inline-block !important;
    margin-right: 5px;
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
    font-size: 12px;
    padding: 2px 20px 2px 0px;
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



const Td = styled.td`
  position: relative;
  overflow: hidden;
  text-overflow: ellipsis;
  border-top: 1px solid #ddd;
  text-align: left;
  height: 45px;
  font-size: 12px;
  font-family: ClanOT-News; 
  padding: 10px 15px;
  box-sizing: border-box;
  
  & > span{
    white-space: nowrap; 
    overflow: hidden;
    text-overflow: ellipsis;
  }
  & span > img{
    width: 22px;
    margin-right: 5px;
    cursor: pointer; 
    display: none;
  }
  
 @media(max-width: 560px){
   height: 58px;
   & > div{
    font-family: ClanOT-book;
    color: #333333;
    padding: 0;
    font-weight: bold;
   }
   & > div:nth-child(1){
     font-size: 13px;
   }
   & > div:nth-child(2){
     font-size: 10px;
   }
   &:nth-child(1){
     width: 60%;
   }
   &:nth-child(2){
     text-align: right;
     padding-left: 0;
   }
 }

`;

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { data, columns } = this.props;
    return (
      <TableContainer>
        {
          this.props.windowWidth >= 560 ?
          
        <Table>

          <thead>
              <Tr>
                {columns.map(col=><Th onClick={()=>this.props.setSorting({col})} key={col}>{col}<img src={require('../../images/icons/crescent-dd_12X6.svg')}/></Th>)}
              </Tr>
          </thead>

          <tbody>                
                {data.map((row,i)=> 
                    <Tr key={i}>
                      {
                        Object.keys(row).map((col,idx)=><Td key={idx}><span> {row[col]} {col === 'Address' && <img onClick={(e)=>this.props.onClickCopy(e,row[col])} src={copy}/>}</span></Td>)
                      }  
                    </Tr>

                )}
          </tbody>

        </Table>
        
        :

        <Table>
          <tbody>
              {data.map((row,i)=>      
                <Tr key={i}>
                  {
                  <React.Fragment>
                    <Td><span>{row.Address} {<img onClick={(e)=>this.props.onClickCopy(e, row.Address)} src={copy}/>} </span></Td>
                    <Td>
                      <div>{row.Balance} </div>
                      <div>pre {row.PreBalance}</div>
                    </Td>
                  </React.Fragment>
                  }
                </Tr>     
                )}
          </tbody>
        </Table>
        
        }
      </TableContainer>
    );
  }
}

const mapStateToProps = ({app}) => {
  return {
    windowWidth: app.windowWidth
  };
};

export default connect( mapStateToProps )(App);
