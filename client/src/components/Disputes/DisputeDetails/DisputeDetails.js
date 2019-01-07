import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import update from 'immutability-helper';
import styled from "styled-components";
import * as actions from '../../../store/actions/index';
import ChatBox from './chatBox';
import DisputeHistory from './disputeHistory';
import Evidence from './Evidence/Evidence';
import Warning from '../../Popup/WarningPopup';

const MainContainer = styled.div`
    width: 1400px;
    max-width: 100%;
    @media(max-width: 768px){
        margin-top: 75px;
    }
`
const TitleContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: left;
	padding-left: 10px;
`;
const ActivityIcon = styled.img`
	width: 24px;
	height: 24px;
`;
const Heading = styled.h1`
	font-family: ClanOT-book;
	font-size: 30px;
	color: #2bbfdf;
	position:relative;
	left:11px;
    text-transform: capitalize; 
	@media (max-width: 768px){
		font-size:18px;
		text-transform: uppercase;
	}
`;

const Container = styled.div`
    display: flex;
    justify-content: space-between;
    position: relative;
    @media(max-width: 768px){
        flex-direction: column;
    }
`

const Refund = styled.div`
    width: 335px;
    max-width: 100%;
    border-radius: 4px;
    box-shadow: 0px 2px 3.9px 0.1px rgba(0, 0, 0, 0.15);
    background-color: #ffffff;
    padding: 30px;
    margin-bottom: 20px;
    box-sizing: border-box;
    @media(max-width: 768px){
        width: 100%;
    }
`

const TransactionDetails = styled.div`
    width: 335px;
    max-width: 100%;
    border-radius: 4px;
    box-shadow: 0px 2px 3.9px 0.1px rgba(0, 0, 0, 0.15);
    background-color: #ffffff;
    padding: 30px;
    box-sizing: border-box;
    @media(max-width: 1400px){
        margin-bottom: 20px;
    }
    @media(max-width: 768px){
        width: 100%;
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
    & img {
        max-width: 21px;
        max-height: 23px;
        width: 100%;
        height: 100%;
        margin-right: 11px;
    }
`;

const List = styled.ul`
    padding: 0;
    margin: 0;
    list-style: none;
    
`

const ProductDetailsHolder = styled.div`
    display: flex;
    justify-content: space-between;
`

const Li = styled.li`
    border-bottom: 1px solid #ebebeb;
    padding: 0 5px;
    background: ${({background}) => background};
    @media(max-width: 768px){
        margin: 0 -30px;
        padding: 15px 30px;
    }
    &:last-child{
        padding-left: 38px;
        padding-top: 15px;
        border: none;
        display: flex;
        justify-content: space-between;
    }
`

const RadioInput = styled.input`
    display: none;
`
const Label = styled.label`
    cursor:pointer;
    display:flex;
    flex-direction: column;
    min-width: 50px;
    width: 100%;
    padding: 15px 0;
`;

const RadioButton = styled.div`
    width: 18px;
    height: 18px;
    background-color: #fff;
    box-sizing: border-box;
    border: ${({isChecked}) => isChecked ? 'solid 1px #2cbddf' : '1px solid #999999'};
    border-radius: 100%;
    display: flex;
    box-sizing: border-box;
    justify-content: center;
    align-items: center;
    margin-right: 5px;
    cursor: pointer;

`;

const RadioButtonChecked = styled.div`
    width: 10px;
    height: 10px;
    background-color: #2cbddf;
    border-radius: 100%;
    transition: 0.2s all ease-in;
    display: block ;
    opacity: ${props=> props.isChecked ? '1' : '0'};
`;

const Holder = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    & > div:first-child{
        font-size: 13px;
        color: #333333;
        font-family: ClanOT-Book;
        text-transform: capitalize;
    }
    & > div:last-child{
        font-size: 12px;
        color: #333333;
        font-family: ClanOT-Medium;
        font-weight: bold;
    }
`

const PleaseSelect = styled.p`
    font-size: 13px;
    font-family: ClanOT-Book;
    margin-top: 50px;
`
const Status = styled.div`
    width: 335px;
    max-width: 100%;
    border-radius: 4px;
    box-shadow: 0px 2px 3.9px 0.1px rgba(0, 0, 0, 0.15);
    background-color: #ffffff;
    padding: 30px 30px 0;
    margin-bottom: 20px;
    box-sizing: border-box;
    @media(max-width: 768px){
        width: 100%;
    }
`

const Amount = styled.div`
    font-family: ClanOT-News;
    font-size: 13px;
    display: flex;
    align-items: flex-end;
    flex-direction: column;
    justify-content: center;
`

const Left = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 20px;
    @media(max-width: 768px){
        width: 100%;
        margin-right: 0;
    }
`

const Accept = styled.button`
    width: 242px;
    height: 50px;
    border-radius: 10px;
    background-color: #2bbfdf;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    border: none;
    font-family: ClanOT-News;
    font-size: 16.5px;
    margin-top: 20px;
    cursor: pointer;
    text-transform: capitalize;
    margin-left: 20px;
    outline: none;
    & > img{
        width: 17px;
        margin-right: 7px;
    }
    @media(max-width: 768px){
        margin-bottom: 18px;
        margin-left: 0;
    }
`

const Cancel = styled.button`
    width: 242px;
    height: 50px;
    border-radius: 10px;
    background-color: #ff0e38;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    border: none;
    font-family: ClanOT-News;
    font-size: 16.5px;
    margin-top: 20px;
    cursor: pointer;
    outline: none;
    text-transform: capitalize;
    & > span{
        transform: rotate(45deg);
        font-size: 29px;
        font-family: auto;
        margin-right: 10px;
    }
    @media(max-width: 768px){
        margin-top: 0;
        margin-bottom: 20px;
    }
`

const ItemStatus = styled.div`
    color: ${({color}) => color};
    font-family: ClanOT-Book;
    font-size: 13px;
    text-align: center;
    margin-top: 10px;
    text-transform: capitalize;
`

const BackToDisputes = styled.p`
  position: absolute;
  top: -35px;
  right: 0;
  margin: 0;
  font-family: ClanOT-News;
  cursor: pointer;
  font-size: 16px;
  font-weight: bolder;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.88;
  letter-spacing: 1.6px;
  text-align: right;
  color: #2bbfdf;
  text-transform: uppercase;
  @media(max-width: 768px){
      & > span{
          display: none;
      }
      &:after{
        content: 'back >';
        font-size: 13px;
      }
      
  }
`;

const Right = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 100%;
  width: 75%;
  align-items: center;
  @media(max-width: 768px){
      width: 100%;
  }
`;


const TotalRefund = styled.div`
  font-size: 18px;
  font-family: ClanOT-Medium;
  font-weight: bold;
`

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: center;
  @media(max-width: 768px){
      flex-direction: column-reverse;
      width: 100%;
      align-items: center;
  }
`

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  & > div:last-child{
    font-family: ClanOT-Medium;
    font-size: 18px;
    font-weight: bold;
  }
`

const Bottom = styled.div`
  display: flex;
  flex-direction: column;
  padding: 30px 0;
  border-top: 1px solid #ebebeb;
`

const InnerTop = styled.div`
  display: flex;
  justify-content: space-between;
`

const InnerLeft = styled.div`
  display: flex;
  align-items: center;
`

const InnerRight = styled.div`
  font-weight: bold;
`

class DisputeDetails extends Component {

    state = {
        itemSelectedId: null,
        disputedItems: [],
        disputeStatus: null,
        transaction: {},
        currentDispute: {},
        warningCancelDisputePopup: false,
        warningCancelProductPopup: false,
        isConsumer: true
    }

    onSelectItemHandler(e){
        this.setState({...this.state, itemSelectedId: e.target.value});
        this.getDisputeData(e.target.value);
    }
  
    componentWillMount(){
        this.props.setPage('activity');
        this.createDisputedItemsArr();
    }

    componentWillReceiveProps(nextProps){
        const {currentDispute} = this.findDisputeByTxHash(nextProps)
        if(this.state.currentDispute.disputeStatus !== currentDispute.disputeStatus){
            this.updateDisputeItemsArray(currentDispute);
        }

        else{
            this.checkIfSingleItemStatusChanged(currentDispute);
        }
    }

    checkIfSingleItemStatusChanged(currentDispute){
        const disputedItems = [...this.state.disputedItems];
        let shouldUpdate = false;
        disputedItems.forEach(item => {
            currentDispute.disputeItems.forEach(updatedItem => {
                if(item.id === updatedItem.id && item.status !== updatedItem.status){
                    item.status = updatedItem.status;
                    shouldUpdate = true;
                }
            })
        })
        if(shouldUpdate){
            this.setState({...this.state, disputedItems, currentDispute})
        }
    }

    updateDisputeItemsArray(currentDispute){
        const disputedItems =[];
        currentDispute.disputeItems.forEach(item => {
            disputedItems.push(this.createItemObject(item));
        })

        this.setState({...this.state, disputedItems, currentDispute})
    }

    componentDidMount(){
        this.getDisputeData(this.state.itemSelectedId);
    }
    
    getDisputeData(itemId) {
        const disputeHash = this.props.match.params.disputeHash
        let disputeDetails = {
            disputeHash,
            itemId,
            userHash: this.props.userHash
        }
                
        this.props.getDisputeDetails(disputeDetails);
    }

    findDisputeByTxHash(props){

        let consumer = this.state.isConsumer;

        const transactionHash = this.props.match.params.txHash;
        const disputeHash = this.props.match.params.disputeHash;
        let currentDispute;
        let transactionDisputes = props.sentDisputes.get(transactionHash);
        
        if(transactionDisputes){
            currentDispute = transactionDisputes.filter(dispute => dispute.hash === disputeHash)[0];
        }
        else{
            transactionDisputes = props.receivedDisputes.get(transactionHash);
            if(transactionDisputes){
                currentDispute = transactionDisputes.filter(dispute => dispute.hash === disputeHash)[0];
                consumer = false;
            }
        }

        if(!currentDispute){
            return this.props.history.push("/activity");
        }
        
        return {currentDispute, consumer};
    }

    createDisputedItemsArr(){
        
        const {currentDispute, consumer} = this.findDisputeByTxHash(this.props);
        const disputedItems = [];
        currentDispute.disputeItems.forEach(item => {
            disputedItems.push(this.createItemObject(item));
        })
        this.setState({...this.state, disputedItems, isConsumer: consumer, currentDispute, itemSelectedId: disputedItems[0].id})
    }

    createItemObject(item){
        return{
            id: item.id,
            name: item.name,
            units: item.quantity,
            amount: item.price,
            reason: item.reason,
            status: item.status,
        }
    }

    getColor(status){
        switch(status) {
            case "AcceptedByMerchant":
                return "#50e3c2"
            case "AcceptedByArbitrators":
                return "#50e3c2"
            case 'RejectedByArbitrators':
                return '#ff0e38'
            default:
                return '#333333'
          }
    }

    getBackground(status){
        switch(status) {
            case "AcceptedByMerchant":
                return "#F6FEFC"
            case "AcceptedByArbitrators":
                return "#F6FEFC2"
            case 'RejectedByArbitrators':
                return '#FFF3F5'
            default:
                return '#ffffff'
          }
    }
    drawItems(){
        return this.state.disputedItems.map((item, i) => (
            <Li background={this.getBackground(item.status)} key={i}>
                <Label htmlFor={item.id}>
                    <InnerTop>
                        <InnerLeft>
                            <RadioButton isChecked={this.state.itemSelectedId == item.id}><RadioButtonChecked isChecked={this.state.itemSelectedId == item.id}></RadioButtonChecked></RadioButton>
                            <Holder>
                                <div>{item.name}</div>
                                <div>X{item.units}</div>
                            </Holder> 
                        </InnerLeft>
                        <InnerRight>
                            <Amount>
                                {item.amount}
                            </Amount>
                        </InnerRight>
                    </InnerTop>
                    <ItemStatus color={this.getColor(item.status)}>
                        {item.status === 'RejectedByMerchant' && 'Rejected by merchant'}
                        {item.status === 'AcceptedByMerchant' && 'Accepted by merchant'}
                        {item.status === 'CanceledByConsumer' && 'Cancelled by consumer'}
                        {item.status === 'AcceptedByArbitrators' && 'Accepted by arbitrator'}
                        {item.status === 'RejectedByArbitrators' && 'Rejected by arbitrator'}
                        {item.status === 'Claim' && 'In arbitration'}
                    </ItemStatus>
                </Label>
                <RadioInput type="radio" id={item.id} name="item" onChange={(e) => this.onSelectItemHandler(e)} value={item.id} defaultChecked={i === 0} />
            </Li>
        ))
    }

    displayDisputeStatus(){
        const refundAmount = 300;
        let status = this.state.currentDispute.disputeStatus;
        return (
            <Status>
                <Top>
                    <Head>
                        <img src={require('../../../images/icons/titleicons_grad_status_24X24.svg')}/>
                        Status
                    </Head>
                    <div>
                        {this.state.currentDispute.disputeStatus === 'Recall' && 'Open'}
                        {this.state.currentDispute.disputeStatus === 'CanceledByConsumer' && 'Cancelled'}
                        {this.state.currentDispute.disputeStatus === 'Claim' && 'In arbitration'}
                        {this.state.currentDispute.disputeStatus === 'Closed' && 'Closed'}
                    </div>
                </Top>
                {/* {status === 'Closed' && 
                    <Bottom>
                        <Head>
                            <img src={require('../../../images/icons/titleicons_grad_refund_24X24.svg')}/>
                            Refund Amount
                        </Head>
                        <TotalRefund>{refundAmount}</TotalRefund>
                    </Bottom>} */}
            </Status>
        )
    }

    displayDisputedProducts(){
        return (
            <TransactionDetails>
                <Head>
                    <img src={require('../../../images/icons/titleicons_gradd_perchasedetails_24X24.svg')}/>
                    Disputed products
                </Head>
                <PleaseSelect>Select product to view details</PleaseSelect>
                <List>
                    {this.drawItems()}
                    <Li>
                        <Holder>
                            <div>Total</div>      
                        </Holder>
                        <Amount>{this.state.currentDispute.amount}</Amount>
                    </Li>
                </List>
            </TransactionDetails>
        )
    }

    getItemStatus(){
        if(this.state.disputedItems.length > 0){
            return this.state.disputedItems.filter(item => item.id == this.state.itemSelectedId)[0].status;
        }
    }

    checkConditions(isDisputeOpen, isMerchant, isArbitrator){
        const status = this.state.disputedItems.filter(item => item.id == this.state.itemSelectedId)[0].status;
        return isDisputeOpen && !isMerchant && !isArbitrator
                && status !== "AcceptedByMerchant" && status !== "CanceledByConsumer" 
                && status !== "Claim" && status !== "AcceptedByArbitrators" 
                && status !== "RejectedByArbitrators"
    }

    UpdateItemsStatus(itemId, status){

        let itemIds;
        itemIds = itemId 
                ? [String(itemId)] 
                : this.state.disputedItems.filter(item => item.status === 'Recall').map(item => String(item.id))

        this.setState({...this.state, warningCancelProductPopup: false, warningCancelDisputePopup: false});

        this.props.toggleSpinner(true);
        const disputeUpdateItemData = {
            userHash: this.props.userHash,
            disputeHash: this.props.match.params.disputeHash,
            itemIds: itemIds,
            status
        }
        this.props.UpdateItemsStatus(disputeUpdateItemData);
    }

    render() {
        let isArbitrator = this.props.isArbitrator && !this.state.isConsumer;
        let isMerchant = this.props.isMerchant && !this.state.isConsumer;
        let isDisputeOpen = this.state.currentDispute.disputeStatus === 'Recall';
        return (
           <MainContainer>
                <TitleContainer>
                    <ActivityIcon src={require('../../../images/menu/titleicons_grad_desputes2_24X24.svg')}  />
                    <Heading>Dispute Details</Heading>
                </TitleContainer>
                <Container>
                    <Left>
                        {this.displayDisputeStatus()}
                        {this.displayDisputedProducts()}
                        {isDisputeOpen && !isMerchant && !isArbitrator && <Cancel onClick={() => this.setState({...this.state, warningCancelDisputePopup: true})}><span>+</span>Cancel entire dispute</Cancel>}
                        {this.state.warningCancelDisputePopup && <Warning title="Cancel Entire Dispute" yes={()=>this.UpdateItemsStatus(null, "CanceledByConsumer")} no={() => this.setState({warningCancelDisputePopup: false})} note/>}
                    </Left>
                    <BackToDisputes onClick={()=> this.props.history.push({pathname: '/activity', search: this.state.isConsumer ? '?sentDisputes=true' : '?receivedDisputes=true'})}><span>Back to disputes list > </span></BackToDisputes>
                    <Right>
						{this.state.itemSelectedId && <ChatBox isMerchant={isMerchant} isArbitrator={isArbitrator} itemId={this.state.itemSelectedId} isDisputeOpen={isDisputeOpen} status={this.getItemStatus()}/>}
                        {this.state.itemSelectedId && 
                            <Evidence 
                                currentItem={this.state.itemSelectedId} 
                                dispute={this.state.currentDispute} 
                                isDisputeOpen={isDisputeOpen}
                                isMerchant={isMerchant}
                                isArbitrator={isArbitrator}
                                status={this.getItemStatus()}/>}
						{this.state.itemSelectedId && 
                            <DisputeHistory 
                                dispute={this.state.currentDispute} 
                                purchased={this.state.currentDispute.transactionCreationTime}
                                disputedItems={this.state.disputedItems} 
                                currentItem={this.state.itemSelectedId}/>}
                        {this.checkConditions(isDisputeOpen, isMerchant, isArbitrator) && <Cancel onClick={() => this.setState({...this.state, warningCancelProductPopup: true})}><span>+</span>Cancel product dispute</Cancel>}
                        {this.state.warningCancelProductPopup && <Warning title="Cancel Product Dispute" yes={()=>this.UpdateItemsStatus(this.state.itemSelectedId, "CanceledByConsumer")} no={() => this.setState({...this.state, warningCancelProductPopup: false})}/>}
                        { ((isMerchant && this.getItemStatus() === 'Recall') 
                        || (isArbitrator && this.getItemStatus() === 'Claim')) 
                        && <ButtonsWrapper>
                             <Cancel onClick={()=>this.UpdateItemsStatus(this.state.itemSelectedId, isArbitrator? "RejectedByArbitrator" : "RejectedByMerchant")}><span>+</span>Reject</Cancel>
                             <Accept onClick={()=>this.UpdateItemsStatus(this.state.itemSelectedId, isArbitrator? "AcceptedByArbitrator" : "AcceptedByMerchant")}><img src={require('../../../images/icons/buttonicons_accepts_16X16.svg')}/>Accept</Accept>
                           </ButtonsWrapper>}
					</Right>
                </Container>
           </MainContainer>
        );
    }
}
const mapStateToProps = ({account, app}) => {
    return {
        userHash: account.userHash,
        transactions: account.transactions,
        sentDisputes: account.sentDisputes,
        receivedDisputes: account.receivedDisputes,
        disputeDetails: account.disputeDetails,
        isMerchant: account.isMerchant,
        isArbitrator: account.isArbitrator
    };
}

const mapDispatchToProps = dispatch => {
    return {
        setPage: page => dispatch(actions.setPage(page)),
        getDisputeDetails: disputeDetails => dispatch(actions.getDisputeDetails(disputeDetails)),
        UpdateItemsStatus: disputeDetails => dispatch(actions.UpdateItemsStatus(disputeDetails)),
        toggleSpinner: flag => dispatch(actions.toggleSpinner(flag))
    }
  }

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(DisputeDetails));


