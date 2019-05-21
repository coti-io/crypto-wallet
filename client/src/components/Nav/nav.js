import React, { Component } from 'react';
import styled, { keyframes } from 'styled-components';
import { fadeInRight, fadeInLeft } from 'react-animations';
import { withRouter  } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';
import Logo_white from '../../images/coti_logo.svg';
import ScrollLock from 'react-scrolllock';
import Popup from '../Popup/UpgradePopup';
import SuccessPopup from '../Popup/SuccessPopup';
import Notification from '../Notification/Notification';

const menuanimateOpen = keyframes`${fadeInRight}`;

const Navbar = styled.nav`
    position: fixed;
    display: flex;
    justify-content: ${({justify})=> justify};
    min-height: 74px;
    width: 100%;
    padding: 0 15px;
    box-sizing: border-box;
    background-color: #ffffff;
    z-index: 999;
    box-shadow: 0 0 4.9px 0.1px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.img`
    display: flex;
    width: 140px;
    height: 75px;
    padding: 20px 0;
    box-sizing: border-box;
`;

const RightSection = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 88px;
    height: 75px;
    padding: 20px 0;
    box-sizing: border-box;
`;

const UpgradeBtn = styled.button`
    width: 107px;
    height: 40px;
    border-radius: 10px;
    background-color: #2bbfdf;
    border: none;
    color: #fff;
    text-transform: uppercase;
    font-family:ClanOT-Book;
    margin: 0 50px 0 14px;
    cursor: pointer;
    outline: none;
    @media(max-width: 1080px){
        margin: 0 0 0 22px;
    }
`

const WalletType = styled.div`
    font-size: 11px;
    font-family: ClanOT-Medium;
    color: #111111;
    padding-right: 10px;
    & span{
        font-weight: bold;
        text-transform: uppercase;
    }
    & > img{
        width: 19px;
        margin-right: 15px;
        vertical-align: bottom;
    }
`

const Logout = styled.p`
    display: flex;
    margin: 0 0 0 0;
    font-family: ClanOT-Medium;
    font-size: 13px;
    font-weight: bolder;
    font-style: normal;
    font-stretch: normal;
    letter-spacing: normal;
    color: #2bbfdf;
    text-transform: uppercase;
    cursor: pointer;
    align-items: center;
`


const LogoutMobile = styled.li`
    font-size: 13px;
    color: #333333;
    font-family: ClanOT-Medium;
    margin: 0;
    padding: 17px 40px;
    font-weight: bold;
    padding-bottom: 140px;
    & > img{
        width: 24px;
        margin-right: 20px;
        vertical-align: middle;
    }
`;

const Menu = styled.ul`
    display: flex;
    margin: 0;
    padding-left: 0;
    align-items: center;
    flex-direction: ${({desktop}) => desktop ? 'row' : 'column'};
    box-shadow: ${({desktop}) => desktop ? "none" : "0px 5px 30px -10px #666"};
    background: #fff;
    @media(max-width: 1080px){
        align-items: flex-start;
    }
    > div.seperator {
        background: #ebebeb;
        width: 100%;
        height: 1px;
    }
`;

const Page = styled.li`
    position: relative;
    box-sizing: border-box;
    display: flex;
    font-family: ClanOT-Medium;
    font-size: 16px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: 1px;
    text-align: left;
    text-transform: capitalize;
    color: ${props => props.selected === props.id ? "#2bbfdf" : "#111111" };
    height: 100%;
    align-items: center;
    margin-left: 25px;
    padding: 0 5px;
    background: ${props => props.selected === props.id ? "linear-gradient(268deg, #2cbfdf, #2c9cdf)" : "none"};
    background-position: left bottom;
    background-repeat: no-repeat;
    background-size:  ${props => props.selected === props.id ? "100% 4px" : "0 4px " };
    cursor: ${props=>props.id === "merchants" ? "not-allowed" : "pointer"};
    transition: 300ms background-size ease-out;

   
    &:hover {
        :not(#merchants){
            color : #2bbfdf;
        }
    }

    img {
        max-width: 25px ;
        max-height: 23px ;
        width: 100%;
        height: 100%;
        margin-right: 5px;
        pointer-events: none;
    }
    .arrow-down {
        position: absolute;
        bottom: -8px;
        left: calc(50% - 8px);
        width: 0; 
        height: 0; 
        opacity: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-top: 8px solid #2cacdf;
        transition: 400ms all ease;
        &.active {
            opacity: 1;
            transition: 100ms all ease;
        }
    }

    &#shop>img{
        width: 90px;
        height: 57px;
        max-height: 100%;
        max-width: 100%;
    }
    @media(max-width: 1080px){
        padding: 20px 5px;
        margin-left: 35px;
        font-size: 13px
    }

`;

const Holder = styled.li`
    display: flex;
    border-top: 1px solid #ebebeb;
    border-bottom: 1px solid #ebebeb;
    padding: 10px 40px;
    align-items: center;
    justify-content: space-between;
    width: 100%;
`

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`

const HamburgerContainer = styled.div`
    position: absolute;
    left: 20px;
    display: flex;
    flex-direction: column;
    width: 25px;
    height: 24px;
    cursor: pointer;
    padding: 25px 0 ;
`;

const HamburgerLine = styled.div`
    display: inline-flex;
    height: 4px;
    width: ${({hide})=> hide ? "0px" : "24px" };
    transition: 0.${({ms})=>ms}s all;
    border-radius: 2px;
    background: #666;
    margin-top: 4px;
    justify-content: center;   
`;



const MobileMenuOverlay = styled.div`
    animation: 0.4s ${menuanimateOpen};
    position: absolute;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    margin-top: 75px;
    width: 100%;
    top:0;
    left: 0;
    height: 100vh;
    z-index: 2;
`;


// const pages = ["overview", "activity", "merchants", "Arbitration", "help"]

class Nav extends Component {
    

    state = { 
        toggleMobileMenu: false,
        hover: null,
        successPopup: false
    }

    componentWillReceiveProps(nextProps){

        if(nextProps.windowWidth !== this.props.windowWidth){
            this.handleResize(nextProps.windowWidth)
        }
    }
    
    shouldComponentUpdate(nextProps, nextState){
        return nextProps.page !== this.props.page || 
                (nextState.hover !== this.state.hover && nextState.hover !== this.props.page) ||
                nextState.toggleMobileMenu !== this.state.toggleMobileMenu || 
                nextProps.showModal !== this.props.showModal ||
                nextProps.windowWidth !== this.props.windowWidth ||
                nextState.successPopup !== this.state.successPopup
    }

    handleResize(windowWidth) {
        this.setState({
            ...this.state,
            toggleMobileMenu: windowWidth > 1080 ? false : this.state.toggleMobileMenu,
        });
    }
    
    changePage(pageName){
        
        this.setState({
            ...this.state,
            toggleMobileMenu: false
        });
        this.props.setPage(pageName)
        this.props.history.push(`/${pageName === 'overview' ? '' : pageName}`);
    }

    hoverfn(pageName, action) {
        this.setState({
            ...this.state,
            hover: action ? pageName : null
        });
    }

    onClickUserMenu = (target) => {
        const clicked = target.id
        this.props[clicked]();
        if(clicked === "resetPassword" && this.state.toggleMobileMenu){
            this.setState({
                ...this.state,
                toggleMobileMenu: false
            });
        }
    }


    createMenu(pageSelected){
        
        const Desktop = this.props.windowWidth > 1080;
        pageSelected = this.props.page;

        if(pageSelected !== this.props.page) {
            this.props.setPage(pageSelected)
        }
        
        return(
            <Menu desktop={Desktop}>
                <Page id="overview" selected={pageSelected} onClick={e => this.changePage(e.target.id)} onMouseEnter={e => this.hoverfn(e.target.id, true)} onMouseLeave={e => this.hoverfn(e.target.id, false)}>
                    <img src={require(`../../images/menu/overview${pageSelected === "overview" || this.state.hover === "overview"? "-active" : ""}.svg`)} alt="overview"/>
                    {'overview'}
                    {Desktop && <div className={pageSelected === "overview" ? "arrow-down active" : "arrow-down"}></div>}
                </Page>
                <Page id="activity" selected={pageSelected} onClick={e => this.changePage(e.target.id)} onMouseEnter={e => this.hoverfn(e.target.id, true)} onMouseLeave={e => this.hoverfn(e.target.id, false)}>
                    <img src={require(`../../images/menu/activity${pageSelected === "activity" || this.state.hover === "activity" ? "-active" : ""}.svg`)} alt="activity"/>
                    {'activity'}
                    {Desktop && <div className={pageSelected === "activity" ? "arrow-down active" : "arrow-down"}></div>}
                </Page>
               { 
                   this.props.isArbitrator &&
                   <Page id="arbitration" selected={pageSelected} onClick={e => this.changePage(e.target.id)} onMouseEnter={e => this.hoverfn(e.target.id, true)} onMouseLeave={e => this.hoverfn(e.target.id, false)}>
                        <img src={require(`../../images/menu/arbitration${pageSelected === "arbitration" || this.state.hover === "arbitration" ? "-active" : ""}.svg`)} alt="arbitration"/>
                        {'arbitration'}
                        {Desktop && <div className={pageSelected === "arbitration" ? "arrow-down active" : "arrow-down"}></div>}
                    </Page>
                }
                <Page id="help" selected={pageSelected} onClick={e => this.changePage(e.target.id)} onMouseEnter={e => this.hoverfn(e.target.id, true)} onMouseLeave={e => this.hoverfn(e.target.id, false)}>
                    <img src={require(`../../images/menu/help${pageSelected === "help" || this.state.hover === "help" ? "-active" : ""}.svg`)} alt="help"/>
                    {'help'}
                    {Desktop && <div className={pageSelected === "help" ? "arrow-down active" : "arrow-down"}></div>}
                </Page>
                {!Desktop &&
                    <React.Fragment>
                        <Holder>
                            <Wrapper>
                                {/* <Notification/> */}
                                <WalletType><img src={require('../../images/icons/menuicon_06_restpass_24X24.svg')}/>Wallet type: <span>{this.props.userType} </span></WalletType>
                                {
                                    this.props.userType == 'consumer'
                                    && ( this.props.net == 'testnet'
                                    || this.props._development ) &&
                                    <UpgradeBtn onClick={() => this.props.toggleModal(true)}>upgrade</UpgradeBtn>}
                            </Wrapper>
                        </Holder>
                        <LogoutMobile onClick={()=>this.props.logout()}><img src={require('../../images/icons/menuicon_07_logout_24X24.svg')}></img>Log out</LogoutMobile>
                    </React.Fragment>
                }
            </Menu> 
        )
    }

    toggleMobileMenu(target){
        this.setState({
            ...this.state,
            toggleMobileMenu: !this.state.toggleMobileMenu
        }) 
    }
    renderDesktop(pageSelected){
        return(
            <React.Fragment>
                <Logo src={Logo_white} alt="logo" />
                {this.createMenu(pageSelected) }
            </React.Fragment>
        )
    }

    renderMobile(){
        return(
            <React.Fragment>
                <HamburgerContainer id="mobile_menu" onClick={({target}) => this.toggleMobileMenu(target) }>
                    <HamburgerLine ms="4" hide={this.state.toggleMobileMenu}/>
                    <HamburgerLine />
                    <HamburgerLine ms="4" hide={this.state.toggleMobileMenu}/>
                </HamburgerContainer>  

                <Logo src={Logo_white} alt="logo" />
            </React.Fragment>
        )
    }

    hideSucessPopup(){
        this.setState({...this.state, successPopup: false})
    }

    upgradeWallet(type){
        window.location.href = `${process.env.REACT_APP_CPS}/wallet/type?userhash=${this.props.userHash}&net=${this.props.net}&user_type=${type}`;
    }

    render(){
        const { net, _development, userType } = this.props; 
        const pageSelected = this.props.location.pathname.replace('/','')
        return(
            <Navbar justify={this.props.windowWidth > 1080  ? "space-between" : "center"}>
                
                { this.props.windowWidth > 1080 
                    ? this.renderDesktop(pageSelected) 
                    : this.renderMobile()
                }

                {
                    this.state.toggleMobileMenu && 
                    <MobileMenuOverlay animate={this.state.toggleMobileMenu}>          
                        {this.createMenu(pageSelected)}
                        <ScrollLock/>
                    </MobileMenuOverlay>
                    
                }

                { this.props.windowWidth > 1080 && 
                <RightSection onMouseEnter={e => this.hoverfn(e.target.id, true)} onMouseLeave={e => this.hoverfn(e.target.id, false)}>
                    {/* <Notification/> */}
                    <WalletType>Wallet type: <span>{this.props.userType}</span></WalletType>
                    {userType == 'consumer' && (_development || net == 'testnet') && <UpgradeBtn onClick={() => this.props.toggleModal(true)}>upgrade</UpgradeBtn>}
                    <Logout onClick={()=>this.props.logout()}>logout </Logout>
                </RightSection>}
                {this.props.showModal && <Popup close={() => this.props.toggleModal(false)} upgradeWallet={(type) => this.upgradeWallet(type)} closeModal={this.closeModal}/>}
                {this.state.successPopup && <SuccessPopup title="success" subtitle="Your wallet has updated." close={() => this.hideSucessPopup()}/>}
            </Navbar>
        )
    }

}


const mapStateToProps = ({app, account}) => {
    return {
        page: app.page,
        net: app.net,
        _development: app._development,
        showModal: app.showModal,
        tooltipMsg: app.tooltipMsg,
        windowWidth: app.windowWidth,
        isArbitrator: account.isArbitrator,
        userType: account.userType,
        userHash: account.userHash
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setPage: page => dispatch(actions.setPage(page)),
        logout: () => dispatch(actions.logout()),
        toggleModal:(flag) => dispatch(actions.toggleModal(flag))
    };
};

export default withRouter(connect( mapStateToProps, mapDispatchToProps )( Nav ));