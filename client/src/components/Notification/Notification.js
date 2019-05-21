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
    width: ${({bigSize}) => bigSize ? '22px' : '15px'};
    height: ${({bigSize}) => bigSize ? '22px' : '15px'};
    border-radius: 12px;
    background-color: #fa3e3e;
    color: #ffffff;
    font-size: 10px;
    font-family: ClanOT-Medium;
    display: flex;
    align-items: center;
    justify-content: center;
    top: ${({bigSize}) => bigSize ? '-12px' : '-6px'};
    right: ${({bigSize}) => bigSize ? '-8px' : '-2px'};
`

const Wrapper = styled.div`
    overflow-y: auto;
    max-height: 400px;
    margin: 0 -30px;
    padding: 0 30px 30px 30px;
    box-sizing: border-box;
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
    @media(max-width: 1080px){
        max-height: 100%;
    }
`

const Popup = styled.div`
    width: 606px;
    max-height: 480px;
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
        max-height: 100%;
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
    margin: 0;
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
const Heading = styled.div`
    margin: -30px -30px 0 -30px;
    padding: 30px;
    position: sticky;
    top: -30px;
    background-color: #ffffff;
    border-bottom: 1px solid #ebebeb;
`

class Notification extends Component {
    
    state= {
        open: false,
        notifications: []
    }

    componentDidMount() {
        const notifications = this.props.notifications
        this.setState({notifications});
        console.log('notifications: ', notifications);
    }
    
    
    componentWillReceiveProps(nextProps) {
        console.log('nextProps.notifications: ', nextProps.notifications);
    }

    viewDetails(disputeHash, transactionHash){
        this.setState({open: false})
        this.props.history.push(`/disputeDetails/${transactionHash}/${disputeHash}`)
    }

    createNotificationsArr(){
        
        const notificationsArr = this.state.notifications.map(nt => {
            return {
                disputHash: nt.eventObject.disputeHash,
                notificationContent: nt.event,
                transactionHash: this.findTxHash(nt.disputHash)
            };
        });
        return notificationsArr;
    }

    findTxHash(disputHash){
        for(let [key, value] of this.props.sentDisputes){
            if(value[0].hash === disputHash){
                return key
            }
        }
        for(let [key, value] of this.props.receivedDisputes){
            if(value[0].hash === disputHash){
                return key
            }
        }
    }

    
    render() {
        const notifications = this.createNotificationsArr();
        return (
                <React.Fragment>
                    <BellWrapper>
                        <BellIcon src={require('../../images/icons/menuicon_notification_24X24.svg')} onClick={() => this.setState({open: true})}></BellIcon>
                        <NotifictionBubble onClick={() => this.setState({open: true})} bigSize={notifications.length > 10}>{notifications.length > 10 ? "10+" : notifications.length}</NotifictionBubble>
                        {this.state.open && <React.Fragment>
                                                <ArrowWrapper>
                                                    <Arrow></Arrow>
                                                </ArrowWrapper>
                                                <Popup>
                                                    <Heading>
                                                        <Close onClick={() => this.setState({open: false})}>+</Close>
                                                        <Title>Notifications</Title>
                                                    </Heading>
                                                    <Wrapper>
                                                        {notifications.map((notification, i) => <NotificationRow 
                                                                                                key={i} 
                                                                                                notificationContent={notification.notificationContent} 
                                                                                                disputHash={notification.disputHash} 
                                                                                                onViewDetailsClick={() => this.viewDetails(notification.disputHash, notification.transactionHash)}/>)}
                                                    </Wrapper>
                                                </Popup>
                                                <OverLay onClick={() => this.setState({open: false})}></OverLay>
                                            </React.Fragment>}
                    </BellWrapper>
                    
                </React.Fragment>
            );
        
    }
}    

const mapStateToProps = ({account}) => {
    return {
        transactions: account.transactions,
        notifications: account.notifications,
        sentDisputes: account.sentDisputes,
        receivedDisputes: account.receivedDisputes
    };
};


export default connect(mapStateToProps)(withRouter(Notification));
