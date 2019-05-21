import React, { Component } from 'react';
import styled from "styled-components";
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import ActivityTopRow from './activityTabs'; 
import PageTitle from '../Title/Title';
import Transactions from '../Transactions/Transactions';
import Disputes from '../Disputes/DisputesTable'
import { orderBy } from '../../shared/utility';
import *  as actions from '../../store/actions/index';

export const ActivityTable = styled.div`
	@media(max-width: 480px){
		padding:10px 0 0;
	}
`;

export const ActivityIcon = styled.div`
	width: 24px;
	height: 24px;
	background-image:url('../../../../assets/images/icons/menuicon_grad_02_activity_24X24.svg');
`;

export const ActivityBox = styled.div`
	max-width: 1400px;
	border-radius: 4px;
	background-color: #ffffff;
	box-shadow: 0px 2px 3.9px 0.1px rgba(0, 0, 0, 0.15);
	padding:20px;
	@media(max-width: 480px){
		padding:0px;
	}
`;

export const ActivitySection = styled.div`
	border-radius: 4px;
	background-color: #ffffff;
	box-shadow: 0px 2px 3.9px 0.1px rgba(0, 0, 0, 0.15);
	padding:20px;
	width: 100%;
	margin: 0 auto 11px;
	box-sizing: border-box;
	@media(max-width: 768px){
		padding:0px;
	}
`;


export const TitleContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: left;
`;

export const Title = styled.h1`
	font-family: ClanOT-book;
	font-size: 30px;
	color: #2bbfdf;
	position:relative;
	left:11px;
`;

export const ActivityContainer = styled.div`
	width:100%;
	@media(max-width: 768px){
		margin-top: 75px;
	}
`;

class Activity extends Component {
	state = {
		active: 'transactions',
		transactions: [],
		disputes: []
	}

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.props.setPage("activity");
	}


	toggleDisputes(tabname){
		this.setState({
			...this.state,
			active: tabname
		});
	}
	
	onClickSort(key, way) {
		const sorted = orderBy(this.state[this.state.active], [key], [way ? 'asc' : 'desc']);

		this.setState((prevState,props)=>({
			...prevState,
			[this.state.active]: sorted
		}));

	}

	render() {
		const development = this.props.net == 'testnet' || this.props._development;

		if(this.props.windowWidth > 768){
			return (
				<ActivityContainer>
					<PageTitle onClickGetDisputes={()=>this.props.getDisputes()} title="activity"/>
					<ActivityBox>
						<ActivityTopRow toggleTables={(tabname)=>this.toggleDisputes(tabname)} />
                        {this.state.active === 'transactions' && <Transactions activity/>}
                        {this.state.active === 'receivedDisputes' && development && <Disputes type={this.state.active}/>}
						{this.state.active === 'sentDisputes' && development && <Disputes type={this.state.active}/>}
					</ActivityBox>
				</ActivityContainer>
			) 
		}

		return (
			<ActivityContainer>
				<PageTitle title="activity"/>
				<ActivitySection>
					<ActivityTopRow toggleTables={(tabname)=>this.toggleDisputes(tabname)} />
				</ActivitySection>
                {this.state.active === 'transactions' && <Transactions activity/>}
                {this.state.active === 'receivedDisputes' && development && <Disputes type={this.state.active}/>}
				{this.state.active === 'sentDisputes' && development && <Disputes type={this.state.active}/>}
			</ActivityContainer>
		)
	}
}

const mapStateToProps = ({app}) => {
	return {
		net: app.net,
        _development: app._development,
		windowWidth: app.windowWidth
	};
};

const mapDispatchToProps = dispatch => {
	return {
		setPage: page => dispatch(actions.setPage(page)),
		getDisputes: page => dispatch(actions.getDisputes(page)),
	};
};


export default withRouter(connect( mapStateToProps, mapDispatchToProps )(Activity));