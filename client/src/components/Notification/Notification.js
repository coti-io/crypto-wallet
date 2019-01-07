import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import styled, {keyframes} from "styled-components";
import { fadeIn, slideInRight } from 'react-animations';
import NotificationRow from './DisputeNotificationRow';
const popupOpen = keyframes`${fadeIn}`;
const popupOpenRight = keyframes`${slideInRight}`;

const BellIcon = styled.img`
    width: 20px;
    height: 24px;
    cursor: pointer;
`

const BellWrapper = styled.div`
    position: relative;
    margin-right: 20px;
    
    width: 22px;
    height: 22px;
`

const NotifictionBubble = styled.div`
    position: absolute;
    width: 12px;
    height: 12px;
    border-radius: 12px;
    background-color: #fa3e3e;
    color: #ffffff;
    font-size: 10px;
    font-family: ClanOT-Medium;
    display: flex;
    align-items: center;
    justify-content: center;
    top: -2px;
    right: -3px;
`

const Popup = styled.div`
    width: 606px;
    border-radius: 4px;
    box-shadow: 0px 2px 3.9px 0.1px rgba(0, 0, 0, 0.15);
    background-color: #ffffff;
    padding: 30px;
    box-sizing: border-box;
    position: absolute;
    animation: 0.4s ${popupOpen};
    right: -20px;
    top: 55px;
    z-index: 2;
    @media(max-width: 1080px){
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        box-sizing: border-box;
        z-index: 100000;
        animation: 0.4s ${popupOpenRight};
        overflow-y: auto;
    }
`

const Arrow = styled.div`
    width: 84px;
    height: 100px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 16px 10px -17px rgba(0, 0, 0, 0.5);
    z-index: 2;
    &:after {
        content: "";
        position: absolute;
        width: 23px;
        height: 23px;
        background: #fff;
        transform: rotate(45deg);
        top: 88px;
         left: 39px;
         box-shadow: 0 0 7.6px 0.4px rgba(0, 0, 0, 0.14);
        z-index: 0;
    }
`

const ArrowWrapper = styled.div`
    position: absolute;
    top: -43px;
    right: -21px;
`
const Title = styled.h2`
    font-size: 18px;
    color: #111111;
    font-family: ClanOT-Book;
    font-weight: normal;
    margin: 0 0 20px 0;
`

const Close = styled.div`
    position: absolute;
    transform: rotate(45deg);
    top: 25px;
    right: 25px;
    font-size: 11px;
    font-size: 25px;
    font-family: auto;
    cursor: pointer;
`

const OverLay = styled.div`
    position: fixed;
    top: 75px;
    right: 0;
    left: 0;
    bottom: 0;
    background: rgba(0,0,0,.4);
    z-index: 1;
`


class Notification extends Component {
    
    state= {
        open: false
    }
    
    render() {
      
        return (
                <React.Fragment>
                    <BellWrapper>
                        <BellIcon src={require('../../images/icons/menuicon_notification_24X24.svg')} onClick={() => this.setState({open: true})}></BellIcon>
                        <NotifictionBubble onClick={() => this.setState({open: true})}>1</NotifictionBubble>
                        {this.state.open && <React.Fragment>
                                                <ArrowWrapper>
                                                    <Arrow></Arrow>
                                                </ArrowWrapper>
                                                <Popup>
                                                    <Close onClick={() => this.setState({open: false})}>+</Close>
                                                    <Title>Opened recourse claims</Title>
                                                    <NotificationRow/>
                                                    <NotificationRow/>
                                                </Popup>
                                                <OverLay></OverLay>
                                            </React.Fragment>}
                    </BellWrapper>
                    
                </React.Fragment>
            );
        
    }
}    

const mapStateToProps = state => {
    return {
        
    };
};


export default connect(mapStateToProps)(withRouter(Notification));
