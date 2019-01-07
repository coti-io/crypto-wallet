import React, { Component } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import *  as actions from '../../store/actions/index';

const CountdownRedirect = styled.p`
    max-width: 330px;
    width: 100%;
    font-family: ClanOT-Book;
    text-align: center;
    font-size: 15px;
    color: #333333;
    line-height: 2;
    letter-spacing: normal;
`;

class Timer extends Component {

    state = {
        currentCount: 7,
        intervalId: null 
    }

    componentDidMount() {
        var intervalId = setInterval(this.timer, 1000);
        this.setState({...this.state, intervalId: intervalId});
    }
     
     
    timer = () => {
        var newCount = this.state.currentCount - 1;
        if(newCount >= 0) { 
            this.setState({ ...this.state, currentCount: newCount });
        } else {
            clearInterval(this.state.intervalId);
            window.location = this.props.returnUrl;
        }
    }

    render() {
        return (
            <CountdownRedirect> Please wait {this.state.currentCount} seconds while we redirect you back to the merchant’s website.</CountdownRedirect>
        )
    }
}

const mapStateToProps = ({account}) => ({
    paymentRequest: account.paymentRequest
})

const mapDispatchToProps = dispatch => {
  return {
    
  }
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Timer));