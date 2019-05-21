import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { MoonLoader } from "react-spinners";
import { fadeIn, wobble } from 'react-animations';
import *  as actions from './store/actions/index';
import styled, {keyframes} from 'styled-components';
import asyncComponent from './hoc/asyncComponent/asyncComponent';
import ConnectComponent from './components/Connect/Connect';
import Nav from './components/Nav/nav';
import Payment from './components/Payment/Payments';
import "./fonts/fonts";
import bgImg from './images/bg.jpg';
import Overview from './components/Overview/overview';


const AsyncWallet = asyncComponent(() => {
  return import(/* webpackChunkName: "testnet" */ './containers/Wallet/Wallet');
});

const AsyncWalletMainnet = asyncComponent(() => {
  return import(/* webpackChunkName: "mainnet" */ './containers/Wallet/Mainnet');
});



const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: 100vh;
  flex-wrap: wrap;
  background-image: linear-gradient(340deg, #14213b, #211f39);
  box-sizing: border-box;
  background: url(${bgImg});
`;
const View = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-width: 1425px;
  width: 100%;
  margin: ${({wallet}) => wallet ? '95px auto 20px' : '20px auto'};
  padding: 30px 10px;
  box-sizing: border-box;
  ${'' /* min-height: 100vh; */}
  justify-content: center;
  align-items: center;
  @media(max-width: 480px){
    padding-right:0;
    padding-left:0;
  }
  @media(max-width: 768px){
    margin:0;
    padding:5%;
  }

`;

const fadeInSpinner = keyframes`${fadeIn}`;
const IsLoading = styled.div`
    animation: 1s ${fadeInSpinner};
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100%;
    background: #ffffffcc;
    z-index: 10000 ;
    cursor: not-allowed;
`;

const TooltipContainer = styled.div`
    position: fixed;
    top: 70px;
    left: 0;
    width: 100%;
    display: flex;
    z-index: 9999999;
    justify-content: center;
    pointer-events: none;
`;

const fadeEffect = keyframes`${fadeIn}`

const TooltipInner = styled.div`
    animation: 1s ${fadeEffect};
    position: relative;
    max-width: 360px;
    margin: 20px 10px 0;
    width: 100%;
    padding: 10px 20px;
    background-image: linear-gradient(271deg,${props => props.error ? "#9e0d0d,#d86464" : "#50e3c2, #38d5ab"});
    z-index: 9999;
    display: flex;
    flex-direction: column;
    border-radius: 6px;
    box-shadow: 0 6px 10px 0 rgba(0,0,0,.2);
    pointer-events: auto;
    color: #fff;
    font-size: 13px;
    word-wrap: break-word;
    font-family: ClanOT-News;
    span {
        position: absolute;
        top: 5px;
        right: 7px;
        font-size: 12px;
        cursor:pointer;
    }
`;

class App extends Component {
  
  constructor(props){
    super(props)
  }

  
  componentWillReceiveProps(nextProps){
    if(nextProps.tooltipMsg === undefined) return 
    const { updateTooltipMsg, tooltipMsg } = this.props;
    if((nextProps.tooltipMsg !== false || tooltipMsg !== nextProps.tooltipMsg) && !nextProps.tooltipMsg.isError){
        setTimeout(() => {
            updateTooltipMsg(false);
        }, 6000);
    }
}

  closeTooltip(){
    this.props.updateTooltipMsg(false);
  }

  componentDidMount(){
    window.addEventListener('resize', this.handleResize.bind(this));
    const { pathname } = this.props.location;
    if(pathname !== '/connect' && pathname !== '/payment'){
      this.props.isWallet();
    }
  }

  handleResize() {
    this.props.setWindowWidth(window.innerWidth);
  }

  componentWillMount(){
    window.removeEventListener('resize', this.handleResize.bind(this));
  }

  getRoute = () => {
    const { pathname } = this.props.location;
    if(pathname == '/connect')
      return (
        <React.Fragment>
          <View>
            <ConnectComponent />
          </View>
        </React.Fragment>
      )
    else if(pathname == '/payment')
      return (
        <React.Fragment>
          <View>
            <Payment />
          </View>
        </React.Fragment>
      )
      return (
        <React.Fragment>
          <Nav />
          <View wallet>
            {
              this.props.net == 'testnet' || this.props._development
              ? <AsyncWallet/>
              : <AsyncWalletMainnet />
            }
          </View>
        </React.Fragment>
      )
  }

  render () {
    return (
      <React.Fragment>
      { this.props.tooltipMsg && 
            <TooltipContainer>
                <TooltipInner error={this.props.tooltipMsg.isError}>
                    {this.props.tooltipMsg.isError ? this.props.tooltipMsg.tooltipMsg : this.props.tooltipMsg}
                    {this.props.tooltipMsg.isError && <span onClick={()=>this.closeTooltip()}>X</span>}
                </TooltipInner>
            </TooltipContainer> 
        }
        {this.props.isLoading && <IsLoading><MoonLoader sizeUnit={"px"} size={90} color={'#2b8fdf'} loading={true} /></IsLoading>}
        <AppContainer>
          {this.getRoute()}
        </AppContainer>
      </React.Fragment>
    );
  }
}


const mapStateToProps = ({app}) => {
  return {
    _development: app._development,
    net: app.net,
    page: app.page,
    isLoading: app.isLoading,
    tooltipMsg: app.tooltipMsg
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateTooltipMsg: (msg) => dispatch(actions.updateTooltipMsg(msg)),
    isWallet: () => dispatch(actions.isWallet()),
    setWindowWidth: width => dispatch(actions.setWindowWidth(width))
  };
};

export default withRouter(connect( mapStateToProps, mapDispatchToProps )(App));

