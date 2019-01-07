import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import styled from "styled-components";
import Time from '../../Time/Time';
import DisputePopup from './DisputeDetailsPopup';
import Warning from '../../Popup/WarningPopup';
import * as actions from '../../../store/actions/index';

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
    align-items: flex-start;
    @media(max-width: 768px){
        flex-direction: column;
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
    margin-right: 20px;
    @media(max-width: 1400px){
        margin-bottom: 20px;
    }
    @media(max-width: 768px){
        width: 100%;
        margin-right: 0;
    }
`

const DisputeContainer = styled.div`
    width: 75%;
    max-width: 100%;
    border-radius: 4px;
    box-shadow: 0px 2px 3.9px 0.1px rgba(0, 0, 0, 0.15);
    background-color: #ffffff;
    padding: 30px;
    box-sizing: border-box;
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

const Li = styled.li`
    border-top: 1px solid #ebebeb;
    border-bottom: ${props => props.borderBottom ? '1px solid #ebebeb' : ''};
    padding: ${props => props.padding}px 5px;
    display: flex;
    justify-content: space-between;
    &:not(:last-child){
        align-items: center;
    }
    flex-direction: ${props => props.direction ? props.direction : 'row'};
    & > div > img{
        width: 24px;
        margin-right: 12px;
    }
    @media(max-width: 768px){
        padding: ${props => props.padding}px 0;
    }
`

const Type = styled.div`
    font-size: 13px;
    font-family: ClanOT-Book;
    display: flex;
    align-items: center;
`

const Merchant = styled.div`
    display: flex;
    flex-direction: column;
    font-weight: bold;
    & > div:last-child{
        font-size: 15px;
        color: #333333;
        font-family: ClanOT-Medium;
        text-transform: capitalize;
    }
`

const Holder = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-weight: bold;
    margin-right: 20px;
    & > div:last-child{
        font-size: 15px;
        color: #333333;
        font-family: ClanOT-Medium;
        text-transform: uppercase;
    }
    @media(max-width: 768px){
        margin-right: 10px;
        & > div:last-child{
            font-size: 13px;
        }
    }
`

const Subtitle = styled.div`
    font-size: 11px;
    color: #999999;
    font-family: ClanOT-Medium;
    text-transform: uppercase;
    font-weight: bold;
`

const Amount = styled.div`
    font-size: 18px;
    font-weight: 600;
    font-family: ClanOT-Medium;
`

const Hash = styled.div`
    font-size: 11px;
    text-transform: uppercase;
    word-break: break-all;
    line-height: 1.4;
    font-family: ClanOT-Medium;
    @media(max-width: 768px){
        font-size: 12px;
    }
`

const PleaseSelect = styled.p`
    font-size: 13px;
    font-family: ClanOT-Book;
    margin-top: 50px;
`

const Label = styled.label`
    display: flex;
    align-items: center;
    padding: 20px 0;
    width: 100%;
    cursor: pointer;
    & > p{
        font-size: 13px;
        font-family: ClanOT-Medium;
        text-transform: capitalize;
        font-weight: bold;
    }
`

const Wrapper = styled.span`
    white-space: nowrap;
    outline: none;
    display: inline-block;
    position: relative;
    line-height: 1;
    vertical-align: middle;
    margin-right: 10px;
    cursor: pointer;
    & > input{
        position: absolute;
        left: 0;
        z-index: 9999;
        cursor: pointer;
        opacity: 0;
        top: 0;
        bottom: 0;
        right: 0;
        box-sizing: border-box;
        padding: 0;
        &:checked + span{
            background-color: #2bbfdf;
            border-color: transparent;
        }
    }
    & > span{
        
        position: relative;
        top: 0;
        left: 0;
        display: inline-block;
        width: 20px;
        height: 20px;
        border-width: 2px;
        border-style: solid;
        border-radius: 4px;
        border-color: #999999;
        background-color: #ffffff;
        transition: border-color 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55), background-color 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
        @media(max-width: 768px){
            width: 15px;
            height: 15px;
        }
        &:after{
            transform: rotate(45deg);
            position: absolute;
            left: 7px;
            top: 3px;
            display: table;
            width: 5px;
            height: 8px;
            border: 2px solid #ffffff;
            border-top: 0;
            border-left: 0;
            content: ' ';
            @media(max-width: 768px){
                left: 4px;
                top: 1px;
            }
        }
    }
`

const RightSection = styled.div`
    display: flex;
    padding: 20px 0;
    align-items: center;
`

const ViewDetails = styled.a`
    font-size: 13px;
    color: #2bbfdf;
    font-family: ClanOT-Medium;
    text-decoration: underline;
    display: flex;
    align-items: center;
    font-weight: bold;
    cursor: pointer;
    width: 80px;
    @media(max-width: 520px){
        width: 50px;
        text-align: center;
    }
`

const ButtonsWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 24px;
`

const CancelButton = styled.button`
    width: 220px;
    height: 50px;
    border-radius: 10px;
    background-color: #ffffff;
    border: 1px solid #2bbfdf;
    font-size: 16px;
    font-family: ClanOT-Book;
    color: #2bbfdf;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20px;
    cursor: pointer;
    outline: none;
    & > img{
        width: 15px;
        height: 15px;
        margin-right: 10px;
    }
`

const SubmitButton = styled.button`
    width: 220px;
    height: 50px;
    border-radius: 10px;
    border: none;
    background-color: ${({disabled}) => disabled ? '#dbe1e2' : '#2bbfdf'};
    cursor: ${({disabled}) => disabled ? 'not-allowed' : 'pointer '};
    font-size: 16px;
    font-family: ClanOT-Book;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    outline: none;
    & > img{
        width: 15px;
        height: 15px;
        margin-right: 10px;
    }
`

const Gap = styled.div`
    width: 78px;
    height: 33px;
    @media(max-width: 768px){
        width: 50px;
    }
`

class OpenDispute extends Component {

    state = {
        showPopup: false,
        currentProductSelected: {},
        transactionToDispute: {},
        disputeItems: [],
        evidences: new Map(),
        descriptions: new Map(),
        all: false,
        warningPopup: false
    }

    saveToAllItems(evidences, item, description){
        const PIBT = this.state.transactionToDispute.baseTransactions[0];
        const disputeItems = PIBT.items.map(current => ({id: current.itemId, reason: item.reason, images: item.images, price: current.itemPrice, quantity: current.itemQuantity}));
        let updatedDescriptionMap = new Map();
        PIBT.items.forEach(current => updatedDescriptionMap.set(current.itemId, description));

        let updatedEvidenceMap = new Map();
        PIBT.items.forEach(current => updatedEvidenceMap.set(current.itemId, evidences));
        
        this.setState({
            ...this.state,
            descriptions: updatedDescriptionMap,
            disputeItems,
            evidences: updatedEvidenceMap,
            showPopup: false
        })
    }

    checkIfExist(evidences, item, description){
        const items = [...this.state.disputeItems];
        for(let i=0; i < items.length; i++){
            if(items[i].id === item.id){
                return this.updateItem(i, evidences, item, description);
            }   
        }
        const disputeItems = [...this.state.disputeItems, item];
        const itemDescriptions = this.state.descriptions.set(item.id, description);
        const openDisputeEvidences = this.state.evidences.set(item.id, evidences);
        return this.setState({
                ...this.state, 
                evidences: openDisputeEvidences, 
                descriptions: itemDescriptions, 
                disputeItems, 
                showPopup: false
            })
    }

    updateItem(index, evidences, item, description){
        const disputeItems = [...this.state.disputeItems];
        disputeItems[index].reason = item.reason;
        disputeItems[index].images = item.images;

        let updatedDescriptionMap = this.state.descriptions.set(item.id, description);
        const updatedDescriptions = new Map([...updatedDescriptionMap, ...this.state.descriptions])

        let updatedEvidenceMap = this.state.evidences.set(item.id, evidences);
        const updatedEvidences = new Map([...updatedEvidenceMap, ...this.state.evidences])

        this.setState({
            ...this.state,
            descriptions: updatedDescriptions,
            disputeItems,
            evidences: updatedEvidences,
            showPopup: false
        })
    }

    saveItem(evidences, item, description){
        if(item.id === 'all'){
            return this.saveToAllItems(evidences, item, description)
        }
        if(this.state.disputeItems.length > 0){
            return this.checkIfExist(evidences, item, description);
        }
        const disputeItems = [item];
        const itemDescriptions = this.state.descriptions.set(item.id, description);
        const openDisputeEvidences = this.state.evidences.set(item.id, evidences);
        return this.setState({
                ...this.state, 
                evidences: openDisputeEvidences, 
                descriptions: itemDescriptions, 
                disputeItems, 
                showPopup: false
            })
    }

    close(id, mode){
        if(id && mode === 'add'){
            document.getElementById(id).checked = false;
        }
        if(id === 'all' && mode === 'add'){
            return this.setState({...this.state, showPopup: false, currentProductSelected: {}, all: false})
        }
        this.setState({...this.state, showPopup: false, currentProductSelected: {}})
    }

    onSelectProductHandler(product, id){
        if(id === 'all'){
            return this.state.all ? this.removeAll(false) : this.isdisputeItemsArrayEmpty();
        }
        if(!document.getElementById(id).checked){
            return this.removeItem(id);
        }
        return this.setState({...this.state, showPopup: true, currentProductSelected: product})
    }

    isdisputeItemsArrayEmpty(){
        if(this.state.disputeItems.length > 0){
            return this.setState({...this.state, warningPopup: true})
        }
        return this.setState({...this.state, showPopup: true, all: true, currentProductSelected: 'all'})
    }

    removeAll(isTriggerdFromWraningPopup){
        this.setState({
            ...this.state, 
            evidences: new Map(), 
            descriptions: new Map(), 
            disputeItems: [], 
            all: isTriggerdFromWraningPopup, 
            currentProductSelected: {},
            warningPopup: false,
            showPopup: isTriggerdFromWraningPopup,
            currentProductSelected: 'all'
        });
    }

    removeItem(id){
        const disputeItems = this.state.disputeItems.filter(item => item.id !== id);
        let evidences = new Map(this.state.evidences);
        evidences.delete(id);

        let descriptions = new Map(this.state.descriptions);
        descriptions.delete(id);

        this.setState({...this.state, evidences, descriptions, disputeItems, all: false});
    }

    editDisputeDetails(product){
        this.setState({
            ...this.state,
            showPopup: true,
            currentProductSelected: product
        })
    }

    async componentWillMount(){
        this.props.setPage('activity');
        const transactionHash = this.props.match.params.transactionHash;
        await this.findTransaction(transactionHash);
    }

    findTransaction(transactionHash){
        const transactionToDispute = this.props.transactions.get(transactionHash);
        this.setState({...this.state, transactionToDispute: transactionToDispute[0]});
    }

    findItem(){
        if(this.state.disputeItems.length > 0){
            if(this.state.all){
                return {
                    reason: this.state.disputeItems[0].reason,
                    description: this.state.descriptions.values().next().value,
                    evidences: this.state.evidences.values().next().value,
                    images: this.state.disputeItems[0].images
                }
             }
        }
        let foundItem = this.state.disputeItems.filter((item) => item.id === this.state.currentProductSelected.itemId)[0];
        if(foundItem){
            return {
                reason: foundItem.reason,
                description: this.state.descriptions.get(foundItem.id),
                evidences: this.state.evidences.get(foundItem.id),
                images: foundItem.images
            }
        }
        return false;
    }

    cancel(){
        document.getElementById('all').checked = false;
        this.setState({...this.state, warningPopup: false});
    }

    createArrayToSend(map, type){
        let result = [];

        if(this.state.all && map.values().next().value.length > 0){    
            result.push({
                    itemIds: this.state.disputeItems.map(item => JSON.stringify(item.id)),
                    [type]: type === "documents" ? map.values().next().value.map(file => file.file):  map.values().next().value,
                    disputeHash: null,
                    userHash: this.props.userHash
                })
        }
        else{
            map.forEach((value, key) => {
                if(type === "documents"){
                    value.forEach((file,idx) => {
                        result.push({
                            itemIds: [JSON.stringify(key)],
                            documents: [file.file],
                            disputeHash: null,
                            userHash: this.props.userHash
                        })
                    })
                }else{
                    result.push({
                        itemIds: [JSON.stringify(key)],
                        [type]: value,
                        disputeHash: null,
                        userHash: this.props.userHash
                    })
                }
            })
        }
        return result;
    }

    submit(){
        this.props.toggleSpinner(true);
        this.state.disputeItems.map(item => delete item['images']);
        const transactionHash = this.state.transactionToDispute.hash;
        const disputeData = {
            transactionHash,
            disputeItems: this.state.disputeItems,
            consumerHash: this.props.userHash
        }

        let descriptionsArr = this.createArrayToSend(this.state.descriptions, 'comment');
        let evidenceArr = this.createArrayToSend(this.state.evidences, 'documents');
        if(descriptionsArr.length < 1){
            descriptionsArr = null;
        }
        if(evidenceArr.length < 1){
            evidenceArr = null;
        }
        this.props.sendDispute(disputeData, descriptionsArr, evidenceArr);
    }

    backToTxTable(){
        this.props.history.goBack();
    }
    getTotalAmount(items){
        let total = 0;
        items.forEach(item => total += Number(item.itemPrice));
        return total
    }
    render() {
        const { transactionToDispute } = this.state;
        const PIBT = transactionToDispute.baseTransactions[0];
        return (
           <MainContainer>
                <TitleContainer>
                    <ActivityIcon src={require('../../../images/menu/titleicons_grad_desputes2_24X24.svg')}  />
                    <Heading>open dispute</Heading>
                </TitleContainer>
                <Container>
                    <TransactionDetails>
                        <Head>
                            <img src={require('../../../images/icons/titleicons_gradd_perchasedetails_24X24.svg')}/>
                            Transaction Details
                        </Head>
                        <List>
                            <Li padding="15">
                                <Merchant>
                                    <Subtitle>Merchant</Subtitle>
                                    <div>{PIBT.encryptedMerchantName}</div>
                                </Merchant>
                                <Time date={transactionToDispute.createTime}/>
                            </Li>
                            <Li padding="15">
                                <Subtitle>transaction</Subtitle>
                                <Type>
                                    <img src={require('../../../images/transactions/payment.svg')}/>
                                    {transactionToDispute.type}
                                </Type>
                            </Li>
                            <Li padding="15">
                                <Subtitle>AMOUNT</Subtitle>
                                <Amount>{transactionToDispute.amount}</Amount>
                            </Li>
                            <Li direction="column" padding="15">
                                <Subtitle>Transaction Hash</Subtitle>
                                <Hash>{transactionToDispute.hash}</Hash>
                            </Li>
                        </List>
                    </TransactionDetails>
                    <DisputeContainer>
                        <Head>
                            <img src={require('../../../images/menu/titleicons_grad_desputes2_24X24.svg')}/>
                            Select products to dispute
                        </Head>
                        <PleaseSelect>Please select one or more of the following:</PleaseSelect>
                        <List>
                            {PIBT.items && PIBT.items.map((prod, i) => {
                                return (
                                    <Li padding="0" key={i}>
                                        <Label htmlFor={prod.itemId}>
                                            <Wrapper>
                                                <input 
                                                    id={prod.itemId} 
                                                    name={prod.itemName} 
                                                    type="checkbox" 
                                                    value="" 
                                                    checked={this.state.all || this.state.disputeItems.find(item => item.id === prod.itemId) !== undefined}
                                                    onChange={() => this.onSelectProductHandler(prod, prod.itemId)}/><span></span>
                                            </Wrapper>
                                            <p>{prod.itemName}</p>
                                        </Label>
                                        <RightSection>
                                            <Holder>
                                                <Subtitle>Units</Subtitle>
                                                <div>x{prod.itemQuantity}</div>
                                            </Holder>
                                            <Holder>
                                                <Subtitle>Amount</Subtitle>
                                                <div>{prod.itemPrice}</div>
                                            </Holder>
                                            {this.state.disputeItems.find(item => item.id === prod.itemId) && !this.state.all 
                                                && <ViewDetails onClick={() => this.editDisputeDetails(prod)}>View details</ViewDetails>}
                                            {((this.state.disputeItems.length > 0 && this.state.disputeItems.findIndex(item => item.id === prod.itemId) < 0 && !this.state.all) || this.state.all) && <Gap/>}
                                        </RightSection>
                                    </Li>
                                )
                            })}
                            {PIBT.items.length > 1 &&
                                <Li padding="0" borderBottom>
                                    <Label htmlFor="all">
                                        <Wrapper>
                                            <input 
                                                id="all" 
                                                type="checkbox" 
                                                value="" 
                                                checked={this.state.all}
                                                onChange={() => this.onSelectProductHandler('all', 'all')} /><span></span>
                                        </Wrapper>
                                        <p>All products</p>
                                    </Label>
                                    <RightSection>
                                        <Holder>
                                            <Subtitle>Amount</Subtitle>
                                            <div>{transactionToDispute.amount}</div>
                                        </Holder>
                                        {this.state.all  && <ViewDetails onClick={() => this.editDisputeDetails('all')}>View details</ViewDetails>}
                                        {this.state.disputeItems.length > 0 && !this.state.all && <Gap/>}
                                    </RightSection>
                                </Li>}
                        </List>
                        <ButtonsWrapper>
                            <CancelButton onClick={() => this.backToTxTable()}><img src={require('../../../images/icons/buttonicons_cancel_16X16.svg')}/>Cancel</CancelButton>
                            <SubmitButton 
                                disabled={this.state.disputeItems.length < 1} 
                                onClick={() => this.submit()}>
                                <img src={require('../../../images/icons/buttonicons_submit_16X16.svg')}/>
                                Submit
                            </SubmitButton>
                        </ButtonsWrapper>
                    </DisputeContainer>
                </Container>
                {this.state.warningPopup && <Warning yes={() => this.removeAll(true)} no={() => this.cancel()} title={"Information you provide in the next step will override the details previously submitted for your individual products"}/>}
                {this.state.showPopup && <DisputePopup 
                                            close={(id ,mode) => this.close(id, mode)} 
                                            product={this.state.currentProductSelected}
                                            total={transactionToDispute.amount}
                                            save={(evidences, item, description) => this.saveItem(evidences, item, description)}
                                            disputed={this.findItem()}/>}
           </MainContainer>
        );
    }
}
const mapStateToProps = state => {
    return {
        transactions: state.account.transactions,
        userHash: state.account.userHash
    };
}

const mapDispatchToProps = dispatch => {
    return {
        setPage: page => dispatch(actions.setPage(page)),
        toggleSpinner: flag => dispatch(actions.toggleSpinner(flag)),
        sendDispute: (disputeData, comment, documents) => dispatch(actions.sendDispute(disputeData, comment, documents))
    }
  }

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(OpenDispute));


