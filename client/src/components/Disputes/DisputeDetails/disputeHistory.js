import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components';
import moment from 'moment';


const DisputeHistoryTitleContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: left;
	height:31px;
	padding: 30px 20px 0px 31px;
`;
const DisputeHistoryIcon = styled.img`
	width: 24px;
	height: 24px;
	margin-right:10px;
`;
const DisputeHistoryTitle = styled.div`
	font-family: ClanOT-Medium;
    font-size: 13px;
    font-weight: bold;
`;

const DisputeHistoryBox = styled.div`
	width: 100%;
	box-sizing: border-box;
	flex-wrap: wrap;
	max-height: 100%;
	border-radius: 4px;
	background-color: #ffffff;
	box-shadow: 0px 2px 3.9px 0.1px rgba(0, 0, 0, 0.15);
	position:relative;
	margin-top:20px;
	@media(max-width: 768px){
		margin-bottom: 20px;
	}
`;


const List = styled.ul`
    padding: 0 30px 30px;
    margin: 0;
    list-style: none;
    
`

const Li = styled.li`
	text-transform: ${({capitalize}) => capitalize && 'capitalize'};
    border-bottom: ${({borderBottom}) => borderBottom && '1px solid #ebebeb'};
    padding-left: 5px;
	padding-right: 5px;
	padding-top: ${({paddingTop}) => paddingTop && '25px'};
	padding-bottom: ${({paddingBottom}) => paddingBottom && '25px'};
	margin-bottom: ${({marginBottom}) => marginBottom && '25px'};
    display: flex;
    justify-content: space-between;
    background: ${({background}) => background};
	font-size: 13px;
	font-family: ClanOT-Book;
    &:last-child{
        border: none;
    }
	@media(max-width: 768px){
		flex-direction: column;
		margin-bottom: 0;
	}
`


const Title = styled.div`
	font-weight: bold;
	margin-bottom: ${({marginBottom}) => marginBottom && '20px'};
	display: flex;
    align-items: center;
	& > span{
		font-weight: normal;
	}
	& > img{
		width: 24px;
  		height: 24px;
		margin-right: 10px;
	}
	@media(max-width: 768px){
		margin-bottom: 5px;
	}
`

const Time = styled.div`
	font-family: ClanOT-Book;
  	font-size: 11px;
	@media(max-width: 768px){
		margin-bottom: 5px;
	}
`

export default class DisputeHistory extends Component{

	state = {
		status: ''
	}

	componentDidMount(){
		this.setState({
			...this.state,
			status: this.props.disputedItems.filter(item => item.id == this.props.currentItem)[0].status
		})
	}

	componentWillReceiveProps(nextProps){
		const updatedStatus = nextProps.dispute.disputeItems.filter(item => item.id == this.props.currentItem)[0].status;
		if(updatedStatus !== this.state.status){
			this.setState({...this.state, status: updatedStatus})
		}
	}
	
	historyList(){
		const {dispute} = this.props;
		const itemName = this.props.disputedItems.filter(item => item.id == this.props.currentItem)[0].name;
		const itemUnits = this.props.disputedItems.filter(item => item.id == this.props.currentItem)[0].units;
		const itemAmount = this.props.disputedItems.filter(item => item.id == this.props.currentItem)[0].amount;
		const reason = this.props.disputedItems.filter(item => item.id == this.props.currentItem)[0].reason;
		const arbitrationStarted = false;
		const arbitrationCompleted = false;
		return (
			<List>
				<Li paddingTop>
					<Title marginBottom marginBottom>Item purchased</Title>
					<Time>{moment(this.props.purchased * 1000).format('LLLL')}</Time>
				</Li>
				<Li borderBottom paddingBottom capitalize>{itemName} X{itemUnits} | {itemAmount}</Li>
				<Li paddingTop>
					<Title marginBottom>Dispute opened</Title>
					<Time>{moment(dispute.creationTime * 1000).format('LLLL')}</Time>
				</Li>
				<Li borderBottom paddingBottom>
					<Title>
						Reason for dispute: &nbsp;
						{reason === 'ItemNotReceived' && <span>Item not received</span>}
						{reason === 'NotAsDescribed' && <span>Item not as described</span>}
					</Title>
				</Li>
				{this.state.status !== 'Recall' && <Li borderBottom paddingTop paddingBottom>
					<Title>
						{this.state.status === 'Claim' && 'Arbitration started'}
						{this.state.status === 'RejectedByMerchant' && 'Rejected by merchant'}
						{this.state.status === 'AcceptedByMerchant' && 'Accepted by merchant'}
						{this.state.status === 'CanceledByConsumer' && 'Cancelled by consumer'}
						{this.state.status === 'AcceptedByArbitrators' && 'Accepted by arbitrator'}
						{this.state.status === 'RejectedByArbitrators' && 'Rejected by arbitrator'}
					</Title>
					<Time>{moment(dispute.updateTime * 1000).format('LLLL')}</Time>
				</Li>}
				{arbitrationStarted && <Li borderBottom paddingTop paddingBottom>
					<Title>Arbitration started</Title>
					<Time>{moment(dispute.createdAt * 1000).format('LLLL')}</Time>
				</Li>}
				{arbitrationCompleted && <Li paddingTop paddingBottom>
					<Title><img src={require('../../../images/icons/popupIcon_successDeposit_66X66.svg')}/>Arbitration completed</Title>
					<Time>{moment(new Date()).format('LLLL')}</Time>
				</Li>}
			</List>
		)
	}
	
	render(){
		return (
			<DisputeHistoryBox>
				<DisputeHistoryTitleContainer>
					<DisputeHistoryIcon src={require('../../../images/icons/titleicons_grad_disputeHistory_24X24.svg')}/>
					<DisputeHistoryTitle>Dispute History</DisputeHistoryTitle>
				</DisputeHistoryTitleContainer>
				{this.historyList()}
			</DisputeHistoryBox>
		)
	}
}
	






