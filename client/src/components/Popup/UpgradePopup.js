import React, { Component } from 'react';
import styled, {keyframes} from 'styled-components';
import { fadeIn, slideInRight } from 'react-animations';
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
    @media(max-width: 768px){
        border-radius: unset;
        animation: 0.4s ${popupOpenRight};
        width: 100%;
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
`

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
    margin-bottom: 40px;
    & img {
        max-width: 24px;
        max-height: 24px;
        width: 100%;
        height: 100%;
        margin-right: 10px;
    }
`;

const Subtitle = styled.h3`
    font-family: ClanOT-Book;
    font-size: 13px;
    @media(max-width: 768px){
        text-align: center;
        padding: 0 16%;
        line-height: 1.54;
    }
`

const OptionsContainer = styled.ul`
    list-style-type: none;
    padding: 0;
    margin-bottom: 0;
`

const Option = styled.li`
    font-family: ClanOT-Medium;
    font-size: 13px;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    border-top: 1px solid #ebebeb;
    padding: 0 30px;
    margin: 0 -30px;
    background-color: ${props => props.background};
    align-items: center;
    @media(max-width: 768px){
        flex-direction: column;
    }
`

const RadioInput = styled.input`
   display: none;
`

const Label = styled.label`
    cursor:pointer;
    display:flex;
    flex-direction: row;
    min-width: 50px;
    align-items: center;
    padding: 20px 0;
    width: 100%;
`;

const RadioButton = styled.div`
    width: 18px;
    height: 18px;
    background-color: #fff;
    box-sizing: border-box;
    border: ${({isChecked}) => isChecked ? 'solid 1px #2cbddf' : '1px solid #999999'};
    border-radius: 100%;
    display: flex;
    box-sizing: border-box;
    justify-content: center;
    align-items: center;
    margin-right: 5px;
    cursor: pointer;

`;

const RadioButtonChecked = styled.div`
    width: 10px;
    height: 10px;
    background-color: #2cbddf;
    border-radius: 100%;
    transition: 0.2s all ease-in;
    display: block ;
    opacity: ${props=> props.isChecked ? '1' : '0'};
`;

const UpgradeBtn = styled.button`
    width: 107px;
    height: 40px;
    border-radius: 10px;
    background-color: #2bbfdf;
    border: none;
    color: #fff;
    text-transform: uppercase;
    font-family:ClanOT-Book;
    cursor: pointer;
    outline: none;
    @media(max-width: 1080px){
        width: 340px;
        margin: 13px auto 0;
    }
`

class Popup extends Component {

    state = {
        type: null
    }

    onSelectTypeHandler(e){
        this.setState({...this.state, type: e.target.value})
    }

    onClickOutside(e){
        const modal = document.getElementById("popup");
        if(e.target == modal){
            this.props.close();
        }
    }
   
    render(){
        const disabled = false;
        const types = ['merchant', 'arbitrator', 'Full Node Operator'];
        return (<Layout id="popup" onClick={(e) => this.onClickOutside(e)}>
                    <Modal>
                        <Close onClick={() => this.props.close()}>+</Close>
                        <Heading>
                            <img src={require('../../images/icons/upgrade_icon.svg')} alt="upgrade"/>
                            Upgrade wallet type
                        </Heading>
                        <Subtitle>Please select one of the following (this selection cannot be undone):</Subtitle>
                        <OptionsContainer>
                            {types.map((type, i) => (
                                <Option key={i} background={this.state.type === type ? 'rgb(252, 254, 255)' : disabled ? '#ebebeb' : 'fff'} disabled={disabled}>
                                    <Label htmlFor={type}>
                                        <RadioButton isChecked={this.state.type === type}><RadioButtonChecked isChecked={this.state.type === type}></RadioButtonChecked></RadioButton>
                                        {type} 
                                    </Label>
                                    <RadioInput type="radio" id={type} name="wallet-type" onChange={(e) => this.onSelectTypeHandler(e)} value={type} disabled={disabled}/>
                                    {/* <label htmlFor={type}>
                                        <RadioInput type="radio" id={type} name="wallet-type" onChange={(e) => this.onSelectTypeHandler(e)} value={type} disabled={disabled}/>
                                        <span></span>
                                        {type}
                                    </label> */}
                                    {this.state.type === type && <UpgradeBtn onClick={() => this.props.upgradeWallet(type)}>upgrade</UpgradeBtn>}
                                </Option>
                            ))}
                            
                        </OptionsContainer>
                    </Modal>
                </Layout>)
    }
}


export default Popup;