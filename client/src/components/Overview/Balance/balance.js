import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import styled from "styled-components";
import SendPopup from './SendPopup';
import { customFixed, removeZerosFromEndOfNumber } from '../../../shared/utility';
import *  as actions from '../../../store/actions/index';

const bigdecimal = require("bigdecimal");
const BalanceContainer = styled.div`
    margin-bottom: 20px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    min-height: 252px;
    width: 100%;
    justify-content: space-between;
    padding: 20px;
    box-sizing: border-box;
    border-radius: 4px;
    background-color: #ffffff;
    box-shadow: 0px 2px 3.9px 0.1px rgba(0, 0, 0, 0.15);
    @media(max-width: 1201px){
        padding: 20px 10px;
    }
    @media(max-width: 768px){
        margin-bottom: 20px;
        min-height: 217px;
    }
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;

`;

const Col = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: ${props => props.justifyContent};
    background: ${({background}) => background};
    margin: ${({background}) => background && '-20px -20px -20px 0'};
    width: ${({background}) => background && '230px'};
    border-left: ${({border}) => border && '1px solid #ebebeb'};
    border-top-right-radius: ${({background}) => background && '4px'};
    border-bottom-right-radius: ${({background}) => background && '4px'};
    @media(max-width: 1400px){
        margin: ${({background}) => background && '-20px -10px -20px 0'};
    }
    @media(max-width: 768px){
        width: 100%;
        margin: ${({background}) => background && '0 -10px -30px'};
        padding: ${({background}) => background && '30px'};
        border-top-right-radius: unset;
        border-top: ${({border}) => border && '1px solid #ebebeb'};
        border-bottom-left-radius: ${({background}) => background && '4px'};
        border-left: none;
        box-shadow: ${({background}) => background && '0px 2px 3.9px 0.1px rgba(0,0,0,0.15)'};
    }
    ${'' /* &:last-child {
        @media(max-width: 622px){
            flex-direction: row;
            justify-content: center;
            width: 100%;
            button {
                width: 100%;
                margin-bottom: 0;
            }
        }
    } */}
`;


const Heading = styled.h3`
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
    & img {
        max-width: 24px;
        max-height: 24px;
        width: 100%;
        height: 100%;
        margin-right: 10px;
    }
`;


const MyBalance = styled.div`
    font-family: ClanOT-Medium;
    display: flex;
    margin-top: ${({marginTop}) => marginTop};
    & > div > span{
        font-weight: bold;
    }
    @media(max-width: 768px){
        margin: 30px auto 25px;
        width: 100%;
        justify-content: center;
    }
`;

const Rate = styled.p`
    display: flex;
    flex-direction: column;
    margin: 49px 0 0;
    font-size: 18px;
    font-family: ClanOT-Book;
    text-align: left;
    color: #333333;
`;

const Button = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 220px;
    height: 50px;
    border: none;
    border-radius: 10px;
    background-color: #2bbfdf;
    font-family: ClanOT-Book;
    font-size: 16px;
    font-weight: 500;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.71;
    letter-spacing: 0.6px;
    text-align: center;
    color: #ffffff;
    cursor: pointer;
    box-sizing: border-box;
    font-family: ClanOT-Medium;
    outline: none;
    img {
        width: 16px;
        height: 16px;
        margin-right: 11px;
    }
    @media(max-width: 768px){
        width: 100%;
        margin-bottom: ${({merchant}) => merchant && '20px'};
    }
`;

const Amount = styled.div`
    font-size: 59px;
    font-weight: bold;
    @media(max-width: 768px){
        font-size: 36px;
    }
`

const Currency = styled.p`
    display: flex;
    align-items: flex-end;
    font-size: 22px;
    font-weight: bold;
    margin-bottom: 12px;
    @media(max-width: 768px){
        margin-top: 14px;
    }
`

const Rolling = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0 30px;
    box-sizing: border-box;
    @media(max-width: 768px){
        width: 100%;
        padding: 0;
    }
`

const Subtitle = styled.h4`
    font-size: 11px;
    color: #333333;
    font-family: ClanOT-Medium;
    margin: 0;
    margin-bottom: 10px;
    margin-top: ${({marginTop}) => marginTop};
    display: flex;
    align-items: center;
    & > img{
        width: 22px;
        margin-right: 10px;
    }
`

const CotiAmount = styled.div`
    font-size: 18px;
    font-family: ClanOT-Medium;
    text-transform: uppercase;
    color: ${({color}) => color ? color: "#333333"};
    font-weight: bold;
    @media(max-width: 768px){
        text-align: center;
    }
`

class Balance extends Component {
    
    state = {
        show: false,
        balance: 0
    }
    
    componentDidMount() {
        if(this.props.addresses.size > 0){
            const balance = this.calcTotalBalance(this.props.addresses)
            this.setState({...this.state, balance})
        }
    }

    calcTotalBalance(addresses){
        let balanceDeciaml = new bigdecimal.BigDecimal('0');
        for(let address of addresses){
            balanceDeciaml = balanceDeciaml.add(address[1].getBalance())
        }
        const balance = customFixed(balanceDeciaml.toString(), 2);
        return removeZerosFromEndOfNumber(balance);
    }


    componentWillReceiveProps(nextProps) {
        const nextBalance = this.calcTotalBalance(nextProps.addresses);
        if(nextBalance !== this.state.balance){
            this.setState({...this.state, balance: nextBalance});
        }
    }
    
    onClickSend(){
        if(this.props.addresses.size < 1){
            return this.props.updateTooltipMsg('No addresses exist', true);
        }
        this.setState({...this.state, show: true});
    }

    render() {
      const merchant = false;
      const { net, _development } = this.props;

        return (
            <BalanceContainer>
                <Col justifyContent={merchant && "space-between"}>
                    <Heading>
                        <img src={require('../../../images/sections/balance.svg')} alt="balance"/>
                        Total balance
                    </Heading>
                    <Row>
                        <MyBalance marginTop={!merchant && '45px'}>
                            <Amount>{this.state.balance}</Amount>
                            <Currency>coti</Currency>
                        </MyBalance>
                    </Row>
                    {merchant ? 
                        <Row>
                            <Button bgColor="#50e3c2" merchant={merchant} onClick={() => this.setState({...this.state, show: true})}>
                                <img src={require('../../../images/icons/buttonicons_paynow_16X16.svg')} alt="exchange"/>
                                SEND
                            </Button>   
                        </Row>
                    : null }
                </Col>
                <Col justifyContent={merchant ? "center" : "flex-end"} background={merchant && "#fbfbfb"} border={merchant}>
                    {merchant ?
                        <Rolling>
                            <Subtitle><img src={require("../../../images/icons/titleicons_grad_reserve_24X24.svg")}/>Rolling Reserve </Subtitle>
                            <CotiAmount>1000 coti</CotiAmount>
                            <Subtitle marginTop="40px"><img src={require("../../../images/icons/titleicons_grad_recourse_24X24.svg")}/>Recourse claim amount </Subtitle>
                            <CotiAmount color="#fa3e3e">630 coti</CotiAmount>
                        </Rolling>
                    :
                        net == 'testnet' || _development ? <Button bgColor="#50e3c2" onClick={() => this.onClickSend()}>
                            <img src={require('../../../images/icons/buttonicons_paynow_16X16.svg')} alt="exchange"/>
                            SEND
                        </Button> : null
                    }
                </Col>
                {this.state.show && <SendPopup close={() => this.setState({...this.state, show: false})}/>}
            </BalanceContainer>
            );
        
    }
}    

const mapStateToProps = ({app, account}) => {
    return {
        addresses: account.addresses,
        net: app.net,
        _development: app._development
    };
};

const mapDispatchToProps = dispatch => {
    return {
      updateTooltipMsg: (msg, isError) => dispatch(actions.updateTooltipMsg(msg, isError)),
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Balance));
