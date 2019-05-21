import React, { Component } from 'react';
import styled, {keyframes} from 'styled-components';
import { fadeIn, slideInRight, shake } from 'react-animations';
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
    padding: 70px 30px 50px;
    justify-content: center;
    box-sizing: border-box;
    width: 560px;
    max-width: 100%;
    border-radius: 4px;
    box-shadow: 0px 2px 3.9px 0.1px rgba(0, 0, 0, 0.15);
    background-color: #ffffff;
    position: relative;
    animation: 0.4s ${popupOpen};
    display: flex;
    flex-wrap: wrap;
    @media(max-width: 1060px){
        overflow-y: auto;
        height: 100%;
    }
    @media(max-width: 768px){
        border-radius: unset;
        width: 100%;
        animation: 0.4s ${popupOpenRight};
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
        right: 25px;
    }
`

const ButtonsWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
    @media(max-width: 768px){
        justify-content: center;
    }
`

const CancelButton = styled.button`
    width: 160px;
    height: 50px;
    border-radius: 10px;
    background-color: #ffffff;
    border: 1px solid #2bbfdf;
    font-size: 16px;
    font-family: ClanOT-Book;
    color: #2bbfdf;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 15px;
    cursor: pointer;
    outline: none;
    & > img{
        width: 15px;
        height: 15px;
        margin-right: 10px;
    }
    @media(max-width: 768px){
        margin-bottom: 10px;
        width: 130px;
    }
`

const SubmitButton = styled.button`
    width: 160px;
    height: 50px;
    border-radius: 10px;
    border: none;
    background-color: #2bbfdf;
    font-size: 16px;
    margin: 0 15px;
    font-family: ClanOT-Book;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    outline: none;
    @media(max-width: 768px){
        width: 130px;
        margin-bottom: 10px;
    }
    & > img{
        width: 15px;
        height: 15px;
        margin-right: 10px;
    }
`

const ModalBody = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`

const Img = styled.img`
    width: 67px;
    margin-bottom: 57px;
`

const Title = styled.h1`
    font-family: ClanOT-Medium;
    font-size: 18px;
    color: #2bbfdf;
    margin: 0 0 30px 0;
    text-align: center;
`

const Subtitle = styled.p`
    font-size: 13px;
    color: #333333;
    font-family: ClanOT-Book;
    margin-bottom: 40px;
    text-align: center;
    margin-top: 0;
    line-height: 1.5;
    & > span{
        font-weight: bold;
    }
`

const onClickOutside = (e, cb) => {
    const modal = document.getElementById("popup");
    if(e.target == modal){
        cb();
    }
}

const WarningPopup = ({paymentFail, yes, no, title, note}) => {
    return (<Layout id="popup" onClick={(e) => onClickOutside(e, no)}>
                <Modal>
                    {!paymentFail && <Close onClick={() => no()}>+</Close>}
                    <ModalBody>
                        <Img src={require('../../images/icons/popupIcon_warning_66X66.svg')}/>
                        <Title>{title}</Title>
                        {!paymentFail && <Subtitle>Are you sure?</Subtitle>}
                        {!paymentFail && note && <Subtitle><span>Please note: </span>you cannot cancel disputed products that have moved on to the arbitration phase or have been accepted by the merchant</Subtitle>}
                        {paymentFail && <Subtitle><span>{paymentFail}</span></Subtitle>}
                        <ButtonsWrapper>
                            <SubmitButton onClick={() => yes()}>{paymentFail? "CONNECT" : "Yes"}</SubmitButton>
                            <CancelButton onClick={() => no()}>{paymentFail? "Back to merchant" : "No"}</CancelButton>
                        </ButtonsWrapper>
                    </ModalBody> 
                </Modal>
            </Layout>)
    
}




export default WarningPopup;