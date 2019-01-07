import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from "styled-components";
import Table from '../Table/Table';
import { orderBy, removeZerosFromEndOfNumber } from '../../shared/utility';
import Pagination from '../Pagination/Pagination';
import * as actions from '../../store/actions/index';

const AddressListContainer = styled.div`
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 492px;
    flex-basis: 690px;
    padding: 20px;
    box-sizing: border-box;
    border-radius: 4px;
    background-color: #ffffff;
    box-shadow: 0px 2px 3.9px 0.1px rgba(0, 0, 0, 0.15);
    @media(max-width: 1400px){
        flex-grow: 1;
    }
    @media(max-width: 1201px){
        padding: 20px 10px;
    }
    @media(max-width: 1167px){
        max-width: unset;
        height: auto;
    }
`;

const BoxHeading = styled.h3`
    display: flex;
    margin: 0;
    align-items: center;
    font-family: ClanOT-Book;
    font-size: 13px;
    font-weight: semi-bold;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: -0.3px;
    text-align: left;
    color: #001111;
    margin-bottom: 50px;
    position: relative;
    & img {
        max-width: 24px;
        max-height: 24px;
        width: 100%;
        height: 100%;
        margin-right: 10px;
    }
`;

const GenerateNewAddress = styled.p`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: auto;
    cursor: pointer;
    color: #2bbfdf;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 12px;
    img {
        width: 11px;
        margin-right: 4px;
    }
    @media(max-width: 380px){
        font-size: 9px;
    }
`;


class AddressList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filteredAddresses: [],
            table: null,
            from: 0,
            to: 6
        }
    }

    componentDidMount() {
        this.setAddresses(this.state.from, this.state.to);
	}

    setAddresses(from, to, updatedAddresses){
        let addresses = Array.from(updatedAddresses || this.props.addresses.values());
        let addressesWithAmounts =[];
        
        addresses.forEach(address=>{
            addressesWithAmounts.push({ 
                Address : address.getAddressHex() , 
                Balance : removeZerosFromEndOfNumber(address.getBalance().toPlainString()), 
                PreBalance : removeZerosFromEndOfNumber(address.getPreBalance().toPlainString())
            });
        });
    
        const filteredAddresses = addressesWithAmounts.filter((current, i) => i < to && i >= from);
        this.setState({
            ...this.state,
            filteredAddresses,
            from,
            to
        });
    }
    
    componentWillReceiveProps(nextProps) {
        if(nextProps.addresses !== this.props.addresses){
            this.setAddresses(this.state.from, this.state.to, nextProps.addresses.values())
        }
    }

    onClickSort(key, way) {
        const sorted = orderBy(this.state.addressesWithAmounts, [key.col], ['asc']);
        this.setState({
            ...this.state,
            addressesWithAmounts: sorted
        })
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

    render() {
        return (
            <AddressListContainer>
                <BoxHeading>
                    <img src={require('../../images/icons/address_list_icon.svg')} alt="ts"/>
                    My Address List 
                    <GenerateNewAddress onClick={()=> this.props.generateAddress()}>
                        Generate new address >
                    </GenerateNewAddress>
                </BoxHeading>

                <Table setSorting={(col) => this.onClickSort(col)} onClickCopy={(e,val) => this.onClickCopy(e,val)} columns={['Address', 'Balance', 'Pre balance']} data={this.state.filteredAddresses}/>
                
                {this.props.addresses && this.props.addresses.size > 0 && 
                    <Pagination 
                        addresses
                        maxRows={6} 
                        array={this.props.addresses.size} 
                        setFilterdRows={(from, to) => this.setAddresses(from, to)}
                        maxPages={this.props.windowWidth > 768 ? 8 : 4}/>
                }
            </AddressListContainer>
        );
    }
}


AddressList.propTypes = {
    addresses: PropTypes.object,
    balance: PropTypes.number,
    preBalance: PropTypes.number,
};


const mapStateToProps = ({account, app}) => {
    return {
        addresses: account.addresses,
        windowWidth: app.windowWidth
    }
}

const mapDispatchToProps = dispatch => {
  return {
    generateAddress: () => dispatch(actions.generateAddress()),
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(AddressList);