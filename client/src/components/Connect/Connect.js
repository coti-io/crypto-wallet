import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';
import Input from '../../components/Inputs/Input';
import Logo from '../../components/Logo/Logo';
import NodeList from './NodeList';
import styled, { keyframes } from 'styled-components';
import { fadeIn, shake } from 'react-animations';
import Select, { components } from 'react-select';
import messages from '../../messages.json';
import { getQueryVariable } from '../../shared/utility';

const ConnectedContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: ${({payment}) => payment ? '514' : '690'}px;
    max-width: 100%;
    padding: 40px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0px 2px 3.9px 0.1px rgba(0,0,0,0.3);
    box-sizing: border-box;
    @media(max-width: 768px){
        padding: 40px 0;
        border-radius: unset;
        position: absolute;
        top: 0;
        width: 100%;
        min-height: ${({payment}) => payment && '100vh'};
        bottom: ${({payment}) => payment && '0'};
        height: ${({payment}) => payment ? '645' : ''}px;
    }
`;

const Heading = styled.h3`
    font-family: ClanOT-News;
    font-size: 15px;
    font-weight: 500;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.36;
    letter-spacing: normal;
    text-align: center;
    color: #333333;
    margin: 50px 0;
    @media(max-width: 768px){
        width: 184px;
        margin: 50px auto 34px auto;
    }
`;


const Button = styled.button`
    border: none;
    font-family: ClanOT-Book;
    font-size: 14px;
    background: #2bbfdf;
    height: 50px;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0px 0px -15px #04a6caf0;
    color: #fff;
    width: 140px;
    max-width: 210px;
    ${'' /* width: 100%; */}
    border-radius: 10px;
    cursor: pointer;
    transition: 0.2s all ease-in;
    margin: 0 auto 18px;
    text-transform: uppercase;
    letter-spacing: 1.3px;
    margin-top: 40px;
    outline: none;
    & > img{
        width: 14px;
        margin-right: 10px;
        vertical-align: text-top;
    }
    &:focus {   
        outline: 0;
    }

`;

const GenerateSeed = styled.button`
    border: none;
    font-family: ClanOT-Book;
    font-size: 15px;
    background: ${props => props.background};
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0px 0px -15px #04a6caf0;
    color: ${props => props.color};
    width: 223px;
    border-radius: 10px;
    cursor: pointer;
    transition: 0.2s all ease-in;
    margin: 0 auto 18px;
    text-transform: uppercase;
    padding: 0;
    outline: none;
    margin-bottom: ${props => props.marginBottom ? props.marginBottom : '18px'};
    letter-spacing: ${props => props.letterSpacing ? props.letterSpacing : '0'};
    &:focus {   
        outline: 0;
    }
    & > img{
        width: 14px;
        margin-right: 10px;
        margin-top: -2px;
    }
`;


const ForgotSeed = styled.a`
    text-decoration: none;
    color: #2bbfdf;
    margin: 0 auto;
    font-family: ClanOT-Book;
    font-size: 13px;
`;

const BackToMrchant = styled.a`
    text-decoration: none;
    color: #2bbfdf;
    margin: 0 auto;
    font-family: ClanOT-Medium;
    font-size: 12px;
`

const Or = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;

    div {
        position: absolute;
        height: 1px;
        width: ${props => props.width ? props.width : '80'}%;
        background: #ebebeb;
        z-index: 9;
    }

    p {
        font-family: ClanOT-Book;
        font-size: 14px;
        padding: 0 20px;
        color: #c3c0c0;
        background: #fff;
        z-index: 99;
        margin: 40px 0;
    }
`;

const customStylesPayment = {
    indicatorSeparator: () => ({
        display: "none",
    }),
    control: () => ({
        display: "flex",
        height: "40px",
        background: "#f8f8f8",
        fontFamily: "ClanOT-Book",
        fontSize: "12px",
        borderBottom: "solid 1px #ebebeb",
        width:  "100%",
        margin: "0 auto",
        padding: "0 20px",
        boxSizing: 'border-box',
    }),
    option: (base, state) => ({
        ...base,
        fontFamily: "ClanOT-Book",
        fontSize: "13px",
        color: "#001111",
        background: state.isFocused ? 'linear-gradient(49deg,#7ae1f952 30%,#7ae1f900)' : '#fff',
        cursor: 'pointer'
    }),
    placeholder: (state) => ({
        fontFamily: "ClanOT-Book",
        fontSize: "12px",
        padding: "0",
        color: "#333333",
        textTransform: "uppercase",
    }),
    valueContainer: (base) => ({
        ...base,
        padding: "0",
    }),
    
}

const customStylesPaymentMobile = {
    indicatorSeparator: () => ({
        display: "none",
    }),
    control: () => ({
        display: "flex",
        height: "60px",
        background: "#f8f8f8",
        fontFamily: "ClanOT-Book",
        fontSize: "12px",
        borderBottom: "solid 1px #ebebeb",
        maxWidth:  "100%",
        margin: "0 auto",
        padding: "0 20px",
        boxSizing: 'border-box',
    }),
    option: (base, state) => ({
        ...base,
        fontFamily: "ClanOT-Book",
        fontSize: "13px",
        color: state.isSelected ? '#fff' : "#001111",
        background: state.isSelected ? '#2bbfdf' : '#fff',
    }),
    placeholder: (state) => ({
        fontFamily: "ClanOT-Book",
        fontSize: "12px",
        padding: "0",
        color: "#333333",
        textTransform: "uppercase",
    }),
    valueContainer: (base) => ({
        ...base,
        padding: "0",
    }),
    
}

const DropdownIndicator = (props) => {
    return components.DropdownIndicator && (
      <components.DropdownIndicator {...props}>
        <img src={require('../../images/icons/crescent-dd_12X6.svg')} alt="" width="12px" height="100%" />
      </components.DropdownIndicator>
    );
};

const TooltipContainer = styled.div`
    position: absolute;
    top: 50px;
    left: 0;
    width: 100%;
    display: flex;
    z-index: 9999999;
    justify-content: center;
    pointer-events: none;
`;

const fadeEffect = keyframes`${fadeIn}`;
const TooltipInner = styled.div`
    animation: 1s ${fadeEffect};
    position: relative;
    max-width: 420px;
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

    font-family: ClanOT-News;
    span {
        position: absolute;
        top: 0px;
        right: 5px;
        font-size: 16px;
        cursor: pointer;
        transform: rotate(45deg);
    }
`;

const animation = keyframes`${shake}`;
const Error = styled.p`
    animation: 1s ${animation};
    font-family: ClanOT-Book;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin: 0 auto;
    max-width: 454px;
    width: 100%;
    position: absolute;
    bottom: -15px;
    left: 0;
    font-size: 10px;
    color: #ff0000ad;
    transition: 0.5s opacity ease-in;
    @media(max-width: 768px){
        bottom: 0px;
        left: 20px;
        z-index: 2;
    }
`;

const SelectNode = styled.div`
    width: 100%;
    max-width: ${props => props.maxWidth || "454"}px;
    margin: 0 auto;
    height: 40px;
    background-color: #f8f8f8;
    font-size: 12px;
    color: #333333;
    font-family: ClanOT-Book;
    display: flex;
    align-items: center;
    text-transform: uppercase;
    padding: 0 20px;
    box-sizing: border-box;
    margin-bottom: 40px;
    border-bottom: 1px solid #ebebeb;
    position: relative;
    cursor: pointer;
    justify-content: space-between;
    & > img{
        width:12px;
        padding: 8px;
    }
    @media(max-width: 768px){
        margin: 0;
        height: 60px;
        max-width: 100%;
    }
`
const NodeItem = styled.li`
    font-size: 12px;
    color: #333333;
    font-family: ClanOT-Book;
    width: ${props => props.width};
    font-weight: bold;
    &:not(:first-child){
        text-align: center;
    }
    &:last-child{
        color: #50e3c2;
        font-weight: bold;
    }
    text-transform: capitalize;
`

const NodeSelectedRow = styled.ul`
    padding: 0;
    list-style-type: none;
    margin: 0;
    display: flex;
    cursor: pointer;
`

const Coti = styled.span`
    font-size: 8px;
    font-weight: bold;
    font-family: ClanOT-Medium;
`

const Holder = styled.div`
    width: 454px;
    margin: 0 auto;
    @media(max-width: 768px){
        width: 100%;
    }
`

class Connect extends Component {
    
    state = { 
        cpsError: false,
        generateSuccess: false,
        seedInvalid: false,
        nodeNotSelected: false,
        showNodeList: false,
        payment: false,
        recommendedFullNode: {},
        seed: '',
    }

    componentDidMount() {
        this.setState({
            ...this.state,
            payment: this.props.location.pathname === '/payment'
        });
        
	}

    componentWillMount(){
        const generateSuccess = getQueryVariable("generateSuccess")
        const cpsError = getQueryVariable("error")
        const userseed = getQueryVariable("userseed")
        
        if(generateSuccess){
            this.setState({
                ...this.state,
                generateSuccess
            });
            setTimeout(() => {
                this.setState({generateSuccess: false});
            }, 6000)
        }

        if(cpsError){
            this.setState({...this.state,cpsError});
        }
        
        if(userseed !== null && userseed !== undefined){
            this.setState({...this.state, seed: userseed})
        }
    }

    handleChange = (name, value ) => {
        this.setState({...this.state, [name]: value, seedInvalid: false});
    }

    checkFormValidation(){
        let seedInvalid = false;
        let nodeNotSelected = false;
        if(this.state.seed.length !== 64){
            seedInvalid = true;
        }
        if(Object.keys(this.props.selectedNode).length < 1 && Object.keys(this.state.recommendedFullNode).length < 1){
            nodeNotSelected = true;
        }
        this.setState({...this.state, seedInvalid, nodeNotSelected});
        return seedInvalid || nodeNotSelected;
    }

    connect(seed, reconnect) {
        if(this.checkFormValidation()){
            return;
        }
        let node = Object.keys(this.props.selectedNode).length > 0 ? this.props.selectedNode : this.state.recommendedFullNode;
        this.props.toggleSpinner(true);
        let payment = reconnect ? false : this.state.payment;
        this.props.connect(seed, node, payment);
    }

    async handleSelectNode(node){
        if(this.props.selectedNode !== node){
            await this.props.onSelectNode(node);
        }
        this.setState({
            ...this.state,
            showNodeList: false
        });
    }

    handleSelectChange(option){
        if(option.value === 'alphanet'){
            window.location.href = 'https://alpha-wallet.coti.io/connect';
        }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.reconnect){
            this.connect(this.state.seed, true);
        }
        if(nextProps.recommendedFullNode){
            const recommendedFullNode = nextProps.nodeList.filter(node => node.address == JSON.parse(nextProps.recommendedFullNode))[0];
            this.setState({...this.state, recommendedFullNode});
        }
        
    }

    isSeedValid(value){
        if(value.length !== 64){
            this.setState({...this.state, seedInvalid: true})
        }
    }
    
    render() {
        const pathName = this.props.location.pathname;
        const { nodeNotSelected } = this.state;
        const {selectedNode} = this.props;
        const msg = this.state.cpsError || this.state.generateSuccess;
        const { nodeList } = this.props;
        const { returnUrl } = this.props.paymentRequest;
        
        return (
            <React.Fragment>
                {!this.state.showNodeList &&
                    <ConnectedContainer payment={pathName === '/payment'}>
                        <Logo margin={pathName === '/payment' && 'auto'}/>
                        { msg && 
                            <TooltipContainer>
                                <TooltipInner error={this.state.cpsError}>{this.state.cpsError ? messages[this.state.cpsError] : messages[this.state.generateSuccess] }
                                {this.state.cpsError && <span onClick={()=>this.setState({...this.state, cpsError: false})}>+</span>}
                                </TooltipInner>
                            </TooltipContainer> 
                        }
                        <Heading>
                            Please enter your seed to connect your wallet
                        </Heading>
                        <Holder>
                            <Input 
                                maxWidth={pathName === '/payment' && '414'} 
                                showError={this.state.seedInvalid} 
                                errorMsg={'INVALID SEED'} 
                                placeholder="Your seed" 
                                name="seed" 
                                type="text" 
                                value={this.state.seed} 
                                onChangeOutside={(name, value) => this.handleChange(name, value)} 
                                connect 
                                onBlur={(e) => this.isSeedValid(e.target.value)}/>
                            <SelectNode 
                                maxWidth={pathName === '/payment' && '414'}
                                onClick={() => this.setState({...this.state, showNodeList: !this.state.showNodeList, nodeNotSelected: false})}>
                                {this.state.payment || (!this.state.payment && Object.keys(this.props.selectedNode).length > 0)
                                    ? <NodeSelectedRow>
                                        <NodeItem width={this.state.payment || this.props.windowWidth < 769 ? "150px" : "210px"}>Node {selectedNode.nodeName || this.state.recommendedFullNode.nodeName}</NodeItem>
                                        <NodeItem width="50px">{selectedNode.fee || this.state.recommendedFullNode.fee}</NodeItem>
                                        <NodeItem width="70px">{selectedNode.maxFee || this.state.recommendedFullNode.maxFee} <Coti>COTI</Coti></NodeItem>
                                        <NodeItem width="50px">{selectedNode.trustScore || this.state.recommendedFullNode.trustScore}</NodeItem>
                                        </NodeSelectedRow>
                                    : 'Choose node to connect'}
                                <img src={require('../../images/icons/crescent-dd_12X6.svg')} alt=""/>
                                {nodeNotSelected && <Error>PLEASE SELECT NODE TO CONNECT</Error>}
                            </SelectNode>
                            
                            {pathName === '/connect' && <Select
                                                            components={{ DropdownIndicator }}
                                                            onChange={this.handleSelectChange}
                                                            styles={this.props.windowWidth > 768 ? customStylesPayment : customStylesPaymentMobile}
                                                            placeholder="testnet"
                                                            defaultValue={{value: 'testnet', label: 'TESTNET'}}
                                                            options={[{value: 'testnet', label: 'TESTNET'}, {value: 'alphanet', label: 'ALPHANET'}]}
                                                        />}
                        </Holder>
                        
                        <Button onClick={() => this.connect(this.state.seed)}>
                            <img src={require('../../images/icons/buttonicons_connect_16X16.svg')}/>
                            {pathName === '/payment' ? 'pay now' : 'connect'}
                        </Button>
                        <ForgotSeed href="https://cps-qa.coti.io/alpha?generate=false&net=testnet"> Forgot your seed? </ForgotSeed>
                        <Or width={pathName === '/payment' ? '100' : ''}>
                            <div></div>
                            <p>Or</p>
                        </Or>
                        <GenerateSeed 
                            onClick={() => window.location = "https://cps-qa.coti.io/alpha?generate=true&net=testnet"} 
                            background={pathName === '/payment' ? '#fff' : '#2bbfdf'}
                            color={pathName === '/payment' ? '#2bbfdf' : '#fff'}
                            marginBottom={pathName === '/payment' && '0'}
                            letterSpacing={pathName === '/payment' ? '1.5px' : ''}>
                            <img src={pathName === '/payment' ? require('../../images/icons/buttonicons_newseed_16X16.svg') : require('../../images/icons/buttonicons_newseed_white_16X16.svg')}/>
                            {"Generate new seed"}
                        </GenerateSeed>
                        {pathName === '/payment' && <BackToMrchant href={returnUrl ? JSON.parse(returnUrl) : ""}>Back to merchant's website ></BackToMrchant>}
                    </ConnectedContainer>}
                    {this.state.showNodeList && 
                    <NodeList 
                        nodeList={nodeList} 
                        windowWith={this.props.windowWidth} 
                        onSelectNode={(node) => this.handleSelectNode(node)}
                        close={() => this.setState({...this.state, showNodeList: false})}
                        width={pathName === '/payment' ? '514' : ''}
                        height={pathName === '/payment' ? '640' : ''}
                        payment={pathName === '/payment'}
                        />}
            </React.Fragment>
        );
    }
}

const mapStateToProps = ({app, account}) => ({
    selectedNode: app.selectedNode,
    recommendedFullNode: account.paymentRequest.recommendedFullNode,
    nodeList: app.nodeList,
    paymentRequest: account.paymentRequest,
    reconnect: account.reconnect,
    windowWidth: app.windowWidth
})

const mapDispatchToProps = dispatch => {
  return {
    connect: (seed, node, payment) => dispatch(actions.connect(seed, node, payment)),
    onSelectNode: (node) => dispatch(actions.onSelectNode(node)),
    toggleSpinner: flag => dispatch(actions.toggleSpinner(flag))
  }
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Connect));
