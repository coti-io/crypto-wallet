import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components';
import moment from 'moment';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { orderBy } from '../../../shared/utility';

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
	position: relative;
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

const Decision = styled.p`
	position: absolute;
    left: 33px;
    bottom: -30px;
    font-weight: normal;
`

class DisputeHistory extends Component{

	state = {
		status: '',
		history: []
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
		if(nextProps.disputeDetails.disputeHash !== this.props.disputeDetails.disputeHash || 
			((nextProps.disputeDetails.history && this.props.disputeDetails.history) &&  nextProps.disputeDetails.history.length !== this.props.disputeDetails.history.length)){
			this.setState({
				history: nextProps.disputeDetails.history
			});
		}
	}

	getItemStatusBySide({eventDisplaySide, eventObject}){
		switch(eventDisplaySide) {
			case 'Consumer':
				return eventObject.disputeItemStatus
			case 'Arbitrator':
				return eventObject.status
			case 'Merchant':
				return eventObject.disputeItemStatus
		  }
	}

	displayItemHistory(){
		const itemHistory = this.state.history.filter(x => x.eventObject.itemId == this.props.currentItem)
		let historyOrderdByDate = orderBy(itemHistory, ['creationTime'], ['asc']);
		historyOrderdByDate = historyOrderdByDate.map(x => ({date: x.creationTime, status: this.getItemStatusBySide(x)}));
		return historyOrderdByDate.map(({status, date}, i) => {
			if(status && status !== "AcceptedByArbitrators" && status !== "RejectedByArbitrators"){
				return (
					<Li key={i} borderBottom paddingTop paddingBottom>
						<Title>{statuses[status]}</Title>
						<Time>{moment(date*1000).format('LLLL')}</Time>
					</Li>
				)
			}
		})
	}

	displayDecision(decision){
		if(decision === 'AcceptedByArbitrators'){
			return <Decision>Decision: accepted</Decision>
		}
		else if(decision === 'RejectedByArbitrators'){
			return <Decision>Decision: rejected</Decision>
		}
	}

	checkIfArbitrationCompleted(closedTime){
		const itemHistory = this.state.history.filter(x => x.eventObject.itemId == this.props.currentItem)
		for(let i = 0; i < itemHistory.length; i++){
			if(itemHistory[i].eventObject.disputeItemStatus === "RejectedByArbitrators" || itemHistory[i].eventObject.disputeItemStatus === "AcceptedByArbitrators"){
				return (
					<Li paddingTop paddingBottom>
						<Title>
							<img src={require('../../../images/icons/popupIcon_successDeposit_66X66.svg')}/>
							Arbitration completed
							{this.displayDecision(itemHistory[i].eventObject.disputeItemStatus)}
						</Title>
						<Time>{moment(closedTime*1000).format('LLLL')}</Time>
					</Li>
				)
			}
		}
	}
	
	historyList(){
		const {dispute} = this.props;
		const itemName = this.props.disputedItems.filter(item => item.id == this.props.currentItem)[0].name;
		const itemUnits = this.props.disputedItems.filter(item => item.id == this.props.currentItem)[0].units;
		const itemAmount = this.props.disputedItems.filter(item => item.id == this.props.currentItem)[0].amount;
		const reason = this.props.disputedItems.filter(item => item.id == this.props.currentItem)[0].reason;
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
				{this.state.history.length > 0 && this.displayItemHistory()}
				{this.checkIfArbitrationCompleted(dispute.closedTime)}
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
	
const statuses = {
	RejectedByMerchant: 'Rejected by merchant',
	AcceptedByMerchant: 'Accepted by merchant',
	CanceledByConsumer: 'Cancelled by consumer',
	Claim: 'Arbitration started',
	AcceptedByArbitrator: 'Arbitration vote: accepted',
	RejectedByArbitrator: 'Arbitration vote: rejected',
	RejectedByArbitrators: 'Arbitration completed',
	AcceptedByArbitrators: 'Arbitration completed'
}


const mapStateToProps = ({account}) => {
    return {
        disputeDetails: account.disputeDetails
    };
}

export default connect(mapStateToProps, null)(withRouter(DisputeHistory));


