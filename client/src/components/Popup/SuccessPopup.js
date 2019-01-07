import React, { Component } from 'react';
import styled, {keyframes} from 'styled-components';
import { fadeIn, slideInRight } from 'react-animations';
import Timer from '../Timer/timer';
const popupOpen = keyframes`${fadeIn}`;

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
    padding: 44px;
    position: relative;
    animation: 0.4s ${popupOpen};
    @media(max-width: 768px){
        border-radius: unset;
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
    @media(max-width: 320px){
        right: 25px;
    }
`

const ModalBody = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`

const Title = styled.h1`
    font-family: ClanOT-Medium;
    font-size: 18px;
    color: #50e3c2;
    text-transform: capitalize;
    margin: 0 0 30px 0;
`

const Subtitle = styled.p`
    font-size: 13px;
    color: #333333;
    font-family: ClanOT-Book;
    margin: 0 0 67px 0;
`

const Button = styled.button`
    width: 160px;
    height: 50px;
    border-radius: 10px;
    background-color: #2bbfdf;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #feffff;
    font-size: 15px;
    font-family: ClanOT-Medium;
    text-transform: capitalize;
    border: none;
    cursor: pointer;
    outline: none;
    @media(max-width: 768px){
        text-transform: uppercase;
        width: 254px;
    }
`

const Img = styled.img`
    width: 67px;
    margin: 36px 0 53px 0;
`

class Popup extends Component {

    render(){
        return (<Layout>
                    <Modal>
                        {!this.props.payment && <Close onClick={() => this.props.close()}>+</Close>}
                        <ModalBody>
                            <Img src={require('../../images/icons/popupIcon_success.png')}/>
                            <Title>{this.props.title}</Title>
                            {this.props.subtitle && <Subtitle>{this.props.subtitle}</Subtitle>}
                            {this.props.payment && <Timer returnUrl={this.props.returnUrl}/>}
                            {!this.props.payment && <Button onClick={() => this.props.close()}>close</Button>}
                        </ModalBody>         
                    </Modal>
                </Layout>)
    }
}


export default Popup;