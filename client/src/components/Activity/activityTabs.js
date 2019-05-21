import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { getQueryVariable } from '../../shared/utility';
import TransIcon from '../../images/icons/titleicons_grad_transactions_24X24.svg';
import SentDisputesIcons from '../../images/icons/titleicons_grad_sent_24X24.svg';
import ReceivedSentDisputesIcons from '../../images/icons/titleicons_grad_received_24X24.svg'

const TransactionsTabText = styled.span`
    font-family: ClanOT-Medium;
    font-size: 13px;
    @media(max-width: 768px){
        text-transform: uppercase;
    }
`;

const DisputesTabText = styled.span`
    font-family: ClanOT-Medium;
    font-size: 13px;
    @media(max-width: 768px){
        text-transform: uppercase;
        font-size: 12px;
        width: ${({isMerchant}) => isMerchant && '60px'};
    }
`;

const TransactionsIcon = styled.div`
    width: 24px;
    height: 24px;
    mask-image: url(${TransIcon});
    background: ${props => props.active || props.hover ? `url(${TransIcon})`: "#000"};
    margin-right:9px;
    @media(max-width: 768px){
        display: none;
    }
`;

const SentDisputesIcon = styled.div`
    width: 24px;
    height: 24px;
    mask-image: url(${SentDisputesIcons});
    background: ${props => props.active || props.hover ? `url(${SentDisputesIcons})`: "#000"};
    margin-right:${props => props.inline ? '-5px' : '9px' };
    @media(max-width: 768px){
        display: none;
    }
`;

const ReceivedSentDisputesIcon = styled.div`
    width: 24px;
    height: 24px;
    mask-image: url(${ReceivedSentDisputesIcons});
    background: ${props => props.active || props.hover ? `url(${ReceivedSentDisputesIcons})`: "#000"};
    margin-right:${props => props.inline ? '-5px' : '9px' };
    @media(max-width: 768px){
        display: none;
    }
`;

const TransactionsTabsContainer = styled.div`
    display:flex;
    justify-content:space-between;
    max-width: ${({isMerchant}) => isMerchant ? '528' : '430'}px;
	@media(max-width: 768px){
		max-width: 100%;
	}
`;

const TransactionsTab = styled.button`
    width:216px;
	height:60px;
	font-weight:bolder;
    padding:0;
    margin:0;
    background-color:transparent;
    border:none;
    display:flex;
    justify-content:center;
    align-items:center;
    font-family: ClanOT-Medium;
    font-size: 13px;
    border-bottom:6px solid transparent;
	cursor: pointer;
	transition: border-bottom 0.4s ease-in-out;
    outline: none;
    
	&:hover {
        color: #2bbfdf;
    }

    &:focus {
        color: #2bbfdf;
        border-bottom:6px solid #2bbfdf;
        outline: none;
    }
    &.active {
        color: #2bbfdf;
        border-bottom:6px solid #2bbfdf;
        outline: none;
    }

	@media(max-width: 768px){
		width: 50%;
	}
`;
class ActivityTopRow extends Component {

	state = {
		active: "transactions",
		hover: "",
	}
	
	componentDidMount = () => {
		if(getQueryVariable('sentDisputes') === 'true'){
			this.setState({
				...this.state,
				active: "sentDisputes"
			});
			return this.props.toggleTables('sentDisputes')
        }
        if(getQueryVariable('receivedDisputes') === 'true'){
            this.setState({
				...this.state,
				active: "receivedDisputes"
			});
			return this.props.toggleTables('receivedDisputes')
        }
	}
	
	
	setActive = (tabname) => {
		this.setState({
			...this.state,
			active: tabname
		});
		this.props.toggleTables(tabname)
	}

	onHover(tabname, hover){
		this.setState({
			...this.state,
			hover: hover ? tabname : ""
		});
	}
	
	render() {
        const development = this.props.net == 'testnet' || this.props._development;

		return (
			<TransactionsTabsContainer isMerchant={this.props.isMerchant}>
				<TransactionsTab onMouseEnter={()=>this.onHover('transactions',true)} onMouseLeave={()=>this.onHover('transactions',false)} className={ this.state.active === 'transactions' ? 'active' : '' } onClick={() => this.setActive('transactions') }>
					<TransactionsIcon hover={this.state.hover === 'transactions'} active={this.state.active === 'transactions'}/>
					<TransactionsTabText>Transactions</TransactionsTabText>
				</TransactionsTab>
                {development && <TransactionsTab onMouseEnter={()=>this.onHover('sentDisputes',true)} onMouseLeave={()=>this.onHover('sentDisputes',false)} className={ this.state.active === 'sentDisputes' ? 'active' : '' } onClick={() => this.setActive('sentDisputes') }>
					<SentDisputesIcon hover={this.state.hover === 'sentDisputes'} active={this.state.active === 'sentDisputes'} />
					<DisputesTabText isMerchant={this.props.isMerchant}>Sent Disputes</DisputesTabText>
				</TransactionsTab> }
                {this.props.isMerchant && development && 
                <TransactionsTab onMouseEnter={()=>this.onHover('receivedDisputes',true)} onMouseLeave={()=>this.onHover('receivedDisputes',false)} className={ this.state.active === 'receivedDisputes' ? 'active' : '' } onClick={() => this.setActive('receivedDisputes') }>
					<ReceivedSentDisputesIcon hover={this.state.hover === 'receivedDisputes'} active={this.state.active === 'receivedDisputes'} />
					<DisputesTabText isMerchant={this.props.isMerchant}>Received Disputes</DisputesTabText>
				</TransactionsTab>}
			</TransactionsTabsContainer>
		);
	}
}

const mapStateToProps = ({account, app}) => {
    return {
        net: app.net,
        _development: app._development,
        isMerchant: account.isMerchant
    };
}

const mapDispatchToProps = dispatch => {
    return {
        
    }
  }

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ActivityTopRow));