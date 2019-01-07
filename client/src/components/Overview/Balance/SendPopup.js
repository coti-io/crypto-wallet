import React, { Component } from 'react';
import styled, {keyframes} from 'styled-components';
import { fadeIn, slideInRight } from 'react-animations';
import { connect } from 'react-redux';
import Input from '../../Inputs/Input';
import * as actions from '../../../store/actions/index';
const bigdecimal = require("bigdecimal");

const popupOpen = keyframes`${fadeIn}`;

const popupOpenRight = keyframes`${slideInRight}`;

const Layout = styled.div`
	position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: rgba(0,0,0,.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100000;
    @media(max-width: 768px){
        align-items: initial;
    }
`;

const Modal = styled.div`
    width: 553px;
    border-radius: 4px;
    box-shadow: 0px 2px 3.9px 0.1px rgba(0, 0, 0, 0.15);
    background-color: #ffffff;
    padding: 30px;
    position: relative;
    animation: 0.4s ${popupOpen};
    box-sizing: border-box;
    @media(max-width: 768px){
        border-radius: unset;
        animation: 0.4s ${popupOpenRight};
        width: 100%;
        padding: 40px 0;
    }
`
const Close = styled.div`
    position: absolute;
    transform: rotate(45deg);
    top: 6px;
    right: 10px;
    font-size: 11px;
    font-size: 25px;
    font-family: auto;
    cursor: pointer;
    @media(max-width: 768px){
        top: 15px;
        right: 15px;
    }
`

const Head = styled.h3`
    display: flex;
    margin: 0 auto 40px 0;
    align-items: center;
    font-family: ClanOT-book;
    font-size: 14px;
    font-weight: 600;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: -0.3px;
    text-align: left;
    color: #001111;
    & img {
        max-width: 21px;
        max-height: 23px;
        width: 100%;
        height: 100%;
        margin-right: 11px;
    }
    @media(max-width: 768px){
        padding-left: 30px;
    }
`;

const Button = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 220px;
    height: 50px;
    border: none;
    border-radius: 10px;
    background-color: ${({disabled}) => disabled ? '#dbe1e2' : '#2bbfdf'};
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
        margin-top: 35px;
    }
`;

const Fees = styled.div`
    font-family: ClanOT-Book;
    font-size: 12px;
    color: #999999;
    text-transform: uppercase;
    width: 100%;
    max-width: 454px;
    margin: 0 auto;
    padding-left: 20px;
    box-sizing: border-box;
    margin-bottom: 14px;
    display: flex;
    & > div > span{
        color: #111111;
    }
    @media(max-width: 768px){
        margin-bottom: 0;
        ${'' /* height: 60px; */}
        display: flex;
        align-items: center;
        flex-direction: column;
        padding-left: 0;
        max-width: 100%;
        & > div{
            height: 60px;
            display: flex;
            align-items: center;
            width: 100%;
            padding-left: 20px;
            border-bottom: 1px solid #ebebeb;
            box-sizing: border-box;
        }
    }
`

const Pipe = styled.span`
    padding: 0 3px;
    @media(max-width: 768px){
        display: none;
    }
`

const TotalFee = styled.div`
    width: 454px;
    height: 40px;
    background-color: #F4FCFD;
    padding: 0 20px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    margin: 0 auto;
    justify-content: space-between;
    margin-bottom: 20px;
    @media(max-width: 768px){
        height: 60px;
        margin-bottom: 0;
        border-bottom: 1px solid #ebebeb;
        justify-content: flex-start;
        width: 100%;
    }
`

const TotalText = styled.div`
    font-family: ClanOT-Book;
    font-size: 12px;
    text-transform: uppercase;
    
    &:first-child{
        color: #999999;
        padding-right: 3px;
    }
    &:last-child{
        color: #111111;
    }
`

const ButtonWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    @media(max-width: 768px){
        flex-direction: column;
        align-items: center;
    }
`

class Popup extends Component {

    state = {
        address: '',
        amount: '',
        description: '',
        disabledGetButton: true,
        disaledSendButton: true,
        fee: 0.00,
        totalAmount: 0.00,
        addressInvalid: false,
        descriptionInvalid: false,
        amountInvalid: false,
        availableToSend: 0
    }

    componentDidMount() {
        if(this.props.addresses.size > 0){
            this.checkAvailableToSend(this.props.addresses)
        }
    }


    handleChange = ( name, value ) => {
        const regex  = /^[0-9]\d*(((,\d{3}){1})?(\.\d{0,4})?)$/;
        if(name === 'amount'){
            this.props.resetFees(0, 0); //reset the fees (fullnudeFee , networkFee) in reducer
            if(value.length < 1) {
                return this.setState({...this.state, [name]: value, disabledGetButton: true});
            }
            else if(regex.test(value)){
                return this.setState({
                    ...this.state, 
                    [name]: value, 
                    disabledGetButton: false, 
                    disaledSendButton: true,
                    totalAmount: 0.00
                });
            }
        }
        else
            return this.setState({...this.state, [name]: value});
    }

    getFee(){
        this.props.getFnFees(this.state.amount);
        this.setState({...this.state, disabledGetButton: true, disaledSendButton: false})
    }

    
    componentWillReceiveProps(nextProps) {
        const { fullNodeFee, networkFee }= this.props
        if(!nextProps.fullNodeFee || !nextProps.networkFee) return
        if(nextProps.fullNodeFee !== fullNodeFee || 
            nextProps.networkFee !== networkFee){
            const totalAmount = new bigdecimal.BigDecimal(this.state.amount);
            const ffbt = new bigdecimal.BigDecimal(nextProps.fullNodeFee);
            const nfbt = new bigdecimal.BigDecimal(nextProps.networkFee);
            this.setState({
                ...this.state,
                totalAmount: totalAmount.add(ffbt).add(nfbt).toString() 
            });
        }
    }

    checkAvailableToSend(addresses){
        let fromAddress;
        let availableToSendDecimal = new bigdecimal.BigDecimal('0');

        for(let address of addresses){
            let fromAddress = address[1].getPreBalance().compareTo(address[1].getBalance()) < 0 ? address[1].getPreBalance() : address[1].getBalance();
            availableToSendDecimal = availableToSendDecimal.add(fromAddress)
        }
        this.setState({...this.state, availableToSend: Number(availableToSendDecimal.toString())});
    }

    checkValidation(){
        let addressInvalid = false;
        let descriptionInvalid = false;
        let amountInvalid = false;
        if(this.state.address.length !== 136){
            addressInvalid = true;
        }
        if(this.state.description.length < 1){
            descriptionInvalid = true;
        }
        if(this.state.totalAmount > this.state.availableToSend || this.state.totalAmount < 1 || this.state.amount === ''){
            amountInvalid = true;
        }
        this.setState({...this.state, addressInvalid, descriptionInvalid, amountInvalid})
        return addressInvalid || descriptionInvalid || amountInvalid;
    }

    sendTX(){
        if(this.checkValidation()){
            return;
        }
        const { address, totalAmount, description }= this.state
        this.props.sendTX(address, totalAmount, description);
        this.props.close();
        this.props.toggleSpinner(true);
    }

    onClickOutside(e){
        const modal = document.getElementById("popup");
        if(e.target == modal){
            this.props.close();
        }
    }


    render(){
        const  { disaledSendButton } = this.state
        const  { fullNodeFee, networkFee } = this.props

        return (<Layout onClick={(e) => this.onClickOutside(e)} id="popup">
                    <Modal>
                        <Close onClick={() => this.props.close()}>+</Close>
                        <Head>
                            <img src={require('../../../images/menu/titleicons_grad_desputes2_24X24.svg')}/>
                            Transaction Details
                        </Head>
                        <Input placeholder="Address to send" name="address" type="text" marginBottom={'20px'} showError={this.state.addressInvalid} errorMsg={'INVALID ADDRESS'} value={this.state.address} onChangeOutside={(name, value) => this.handleChange(name, value)}/>
                        <Input placeholder="Amount to send" name="amount" type="text" marginBottom={'14px'} showError={this.state.amountInvalid} errorMsg={Number(this.state.amount) == 0 ? `CAN'T SEND 0 COTI` : `MAX AMOUNT TO SEND ${this.state.availableToSend}`} value={this.state.amount} onChangeOutside={(name, value) => this.handleChange(name, value)}/>
                        <Fees><div>Full node fee: <span>{disaledSendButton ? 0.00 : fullNodeFee}</span></div> <Pipe> | </Pipe> <div>Network fee: <span>{disaledSendButton ? 0.00 : networkFee}</span></div></Fees>
                        <TotalFee>
                            <TotalText>TOTAL:</TotalText>
                            <TotalText>{this.state.totalAmount}</TotalText>
                        </TotalFee>
                        <Input placeholder="Description of transaction" name="description" type="text" marginBottom={'20px'} showError={this.state.descriptionInvalid} errorMsg={'DESCRIPTION FIELD IS REQUIRED'} value={this.state.description} onChangeOutside={(name, value) => this.handleChange(name, value)}/>
                        <ButtonWrapper>
                            <Button disabled={this.state.disabledGetButton} onClick={() => this.getFee()}>
                                <img src={require('../../../images/icons/buttonicons_transfer_16X16.svg')} alt="exchange"/>
                                GET FEES
                            </Button>
                            <Button onClick={() => this.sendTX()} disabled={this.state.disaledSendButton}>
                                <img src={require('../../../images/icons/buttonicons_paynow_16X16.svg')} alt="exchange"/>
                                SEND TRANSACTION
                            </Button>
                        </ButtonWrapper>
                    </Modal>
                </Layout>)
    }
}


const mapStateToProps = ({account}) => {
    return {
        addresses: account.addresses,
        fullNodeFee: account.fullNodeFee.amount,
        networkFee: account.networkFee.amount
    };
};


const mapDispatchToProps = dispatch => {
    return {
        getFnFees: amountToTransfer => dispatch(actions.getFnFees(amountToTransfer)),
        resetFees: (ff, nf) => dispatch(actions.setFees(ff, nf)),
        toggleSpinner: bol => dispatch(actions.toggleSpinner(bol)),
        sendTX: (address, amount, description) => dispatch(actions.sendTX(address, amount, description))
    }
  }


export default connect(mapStateToProps, mapDispatchToProps)(Popup);
