import React, { Component } from 'react';
import styled, { keyframes } from 'styled-components';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PageTitle from '../Title/Title';
import TrustScore from "./TrustScore/trustScore";
import Balance from "./Balance/balance";
import AddressList from "../AddressList/AddressList";
import Transactions from "../Transactions/Transactions";
import *  as actions from '../../store/actions/index';



import { fadeIn } from 'react-animations';
const fadePade = keyframes`${fadeIn}`


const OverviewContainer = styled.div`
    animation: 2s ${fadePade};
    display: flex;
    flex-direction: column;
    width: 100%;
    @media(max-width: 768px){
        margin-top: 75px;
    }
`;


const DivRow = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    @media(max-width: 375px){
        display: initial;
    }
`;

const DivCol = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    flex-basis: 690px;
    @media(max-width: 1400px) {
        flex-grow: 1;
    }

`;

const ContactUs = styled.p`
    padding: 0 5px;
    margin: 0;
    margin-bottom: 10px;
    font-size: 15px;
    font-family: ClanOT-Book;
    color: #000011;

    a {
        font-family: ClanOT-Medium;
        color: #2bbfdf;
        font-weight: 600;
    }
    @media(max-width: 768px){
        font-size: 12px;
        margin-bottom: 20px;
    }
`;

class Overview extends Component {

    componentDidMount() {
        this.props.setPage('overview');
    }

    render(){
        return( 
            <OverviewContainer>
                <PageTitle title='overview'/>
                <ContactUs>For funds to be added to your wallet, please contact us at <a href="mailto:support@coti.io">support@coti.io</a></ContactUs>
                <DivRow>
                    <DivCol>
                        <Balance/>                
                        <TrustScore />
                    </DivCol>
                    <AddressList onClickGenerateAddress={()=>this.onClickGenerateAddress()} addresses={this.props.walletAddressesList}/>
                </DivRow> 
                <DivRow>
                    <Transactions addresses={this.props.walletAddressesList} />
                </DivRow>
            </OverviewContainer>
        )
    }

}


const mapStateToProps = state => {
    return {
        
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setPage: page => dispatch(actions.setPage(page))
    };
};

export default withRouter(connect( mapStateToProps, mapDispatchToProps )(Overview));