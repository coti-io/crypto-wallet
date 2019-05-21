import React, { Component } from 'react';
import styled from "styled-components";
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PageTitle from '../Title/Title';
import Disputes from '../Disputes/DisputesTable'
import { orderBy } from '../../shared/utility';
import *  as actions from '../../store/actions/index';


const DisputesContainer = styled.div`
	width:100%;
    @media(max-width: 768px){
        margin-top: 75px;
    }
`;

const ArbitrationBox = styled.div`
    max-width: 1400px;
	border-radius: 4px;
	background-color: #ffffff;
	box-shadow: 0px 2px 3.9px 0.1px rgba(0, 0, 0, 0.15);
	padding:30px;
    @media(max-width: 768px){
        margin-bottom: 20px;
    }
	@media(max-width: 480px){
		margin: 10px 0;
        padding: 20px;
	}
`

const Head = styled.h3`
    display: flex;
    margin: 0 auto 25px 0;
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
    margin-bottom: 0;
    & img {
        max-width: 21px;
        max-height: 23px;
        width: 100%;
        height: 100%;
        margin-right: 11px;
    }
`;

class Arbitration extends Component {
	state = {
		
	}

	componentDidMount() {
		this.props.setPage("arbitration");
	}


	render() {
		if(this.props.windowWidth > 768){
			return (
				<DisputesContainer>
					<PageTitle title="arbitration"/>
                    <ArbitrationBox>
                        <Head>
                            <img src={require('../../images/menu/titleicons_grad_desputes2_24X24.svg')}/>
                            disputes
                        </Head>
                        <Disputes type={'claimDisputes'}/>
                    </ArbitrationBox>
				</DisputesContainer>
			) 
		}

		return (
			<DisputesContainer>
				<PageTitle title="arbitration"/>
                <ArbitrationBox>
                    <Head>
                        <img src={require('../../images/menu/titleicons_grad_desputes2_24X24.svg')}/>
                        disputes
                    </Head>
                </ArbitrationBox>
                <Disputes type={'claimDisputes'}/>
			</DisputesContainer>
		)
	}
}

const mapStateToProps = ({app}) => {
	return {
		windowWidth: app.windowWidth
	};
};

const mapDispatchToProps = dispatch => {
	return {
		setPage: page => dispatch(actions.setPage(page))
	};
};


export default withRouter(connect( mapStateToProps, mapDispatchToProps )(Arbitration));