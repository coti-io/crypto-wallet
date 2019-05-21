import React,{Component} from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import moment from 'moment';
import { orderBy } from '../../../shared/utility';
import * as actions from '../../../store/actions/index';
import { withRouter } from 'react-router';


const TitleContainer = styled.div`
    display:flex;
    align-items:center;
    @media(max-width: 768px){
        padding-left: 20px;
    }
`;

const TitleIcon = styled.img`
    height:24px;
    width:24px; 
    margin-right: 10px;
`;
const TitleText = styled.div`
    font-family: ClanOT-Medium;
    font-size: 13px;
    font-weight: bold;
`;
const ChatFeed = styled.div`
    width: 95%;
    margin: 0 auto;
    overflow-y: auto;
    height: ${({feedHeight}) => feedHeight}px;
    padding-right: 10px;
    ${'' /* transition: 0.5s height linear; */}
    &::-webkit-scrollbar:horizontal  {
        height: 6px;
    }
    &::-webkit-scrollbar {
        width: 6px;
    }

    &::-webkit-scrollbar-track {
        border-radius: 10px;
        background: #eceae6;
    }

    &::-webkit-scrollbar-thumb{
        background: #2cbedfde; 
        border-radius: 10px;
    }
    @media(max-width: 768px){
        width: 90%;
    }
`;

const Message = styled.div`
    display:flex;
    ${props => !props.isUser ? 'margin-left:auto;' : 'margin-right:auto;' }
    border-radius: 10px;
    max-width: 670px;
    position: relative;
    background-color: ${props => props.isUser ? 'rgba(43, 191, 223, 0.05)': 'rgba(225, 137, 21, 0.1)' };
    border: solid 1px rgba(43, 191, 223, 0.1);
    @media(max-width: 768px){
        height: auto;
        position: relative;
    }

`;
const MessageTextContainer = styled.div`
    margin:25px 30px;
    font-family: ClanOT-Book;
    font-size: 12px;
    color: #333333;
`;
const MessageDate = styled.div` 
    position:relative;
    ${props => !props.isUser ? 'margin-left:auto;' : 'margin-right:auto;' } 
    ${props => !props.isUser ? 'text-align:right;' : 'text-align:left;' }
    ${props => !props.isUser ? 'right:5px;' : 'left:5px;' }
    top:-4px;     
    width:100px;
    font-family: ClanOT-Book;
    font-size: 12px;
    line-height: 2.67;
    letter-spacing: 0.1px;
    color: #565d66;
    margin-bottom: 10px;
    @media(max-width: 768px){
        display: none;
    }
`;

const DateToday = styled.div`
    display:flex;
    justify-content:center;
    align-items:center;
    width: 244px;
    height: 30px;
    border-radius: 10px;
    background-color: #999999;
    margin:0 auto;
    margin-top:16px;
    margin-bottom:16px;
    font-family: ClanOT-book;
    font-size: 12px;
    line-height: 2.67;
    letter-spacing: 0.1px;
    color: #ffffff;
    @media(max-width: 768px){
        margin-bottom: 30px;
    }
`;

const Wrapper = styled.div`
    width: 100%;
    max-width: 100%;
    margin: 30px auto 20px;
    position: relative;
    @media(max-width: 768px){
        margin-bottom: -30px;
    }
`

const Send = styled.button`
    border: none;
    background: #fff;
    font-family: ClanOT-News;
    font-size: 16.5px;
    color: #00c3e2;
    letter-spacing: 1.7px;
    text-transform: uppercase;
    position: absolute;
    top: 20px;
    right: 22px;
    padding: 0;
    cursor: pointer;
    font-weight: bold;
    outline: none;
`

const Textarea = styled.textarea`
    resize: none;
    border-color: #00c3e2;
    outline: none;
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    font-family: ClanOT-Book;
    font-size: 13px;
    padding-top: 23px;
    padding-left: 18px;
    padding-right: 80px;
    box-sizing: border-box;
    @media(max-width: 768px){
        border-left: none;
        border-right: none;
        border-bottom: none;
    }
`

const ChatBoxContainer = styled.div`
    width:100%;
    height: auto;
    border-radius: 4px;
    background-color: #ffffff;
    box-shadow: 0px 2px 3.9px 0.1px rgba(0, 0, 0, 0.15);
    padding: 30px;
    box-sizing: border-box;
    @media(max-width: 768px){
        padding: 30px 0;
    }
`;

const Bubble = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    position: relative;
    @media(max-width: 768px){
        margin-bottom: 20px;
        display: flex;
    }
`

const MessageDateMobile = styled.div`
    display: none;
    @media(max-width: 768px){
        display: initial;
        font-family: ClanOT-Book;
        font-size: 9px;
        position: absolute;
        right: 10px;
        top: 7px;
    }
`

const SenderName = styled.span`
    position: absolute;
    top: -15px;
    left: 5px;
    font-size: 10px;
`

class ChatBox extends Component{
    constructor(props){
        super(props);
        this.state = {
            message: '',
            chat: []
        }
    }

    componentWillReceiveProps(nextProps){
        if(this.props.itemId != nextProps.itemId){
            this.scrollToBottom();
        }
        if(nextProps.comments && nextProps.comments.length < 1){
            this.setState({...this.state, message: "", chat: []})
        }
        if(nextProps.comments && nextProps.comments.length > 0){
            const chat = nextProps.comments.filter(comment => comment.comment !== '');
            this.setState({...this.state, message: "", chat: chat})
        }
        if(nextProps.comments && nextProps.comments.length > this.state.chat.length){
            this.scrollToBottom();
        }
    }
       
    appendMessages(){
        let comments = [...this.state.chat];
        let currentDate = null;
        let showDate;

        comments = orderBy(comments, 'creationTime', 'asc');
        return comments.map((item, index) => {
            let Hour = moment(item.creationTime * 1000).format('HH:mm');
            let date_today = moment(item.creationTime * 1000).format('ll');
            if(moment(item.creationTime * 1000).date() > currentDate && comments.length > 0){
                currentDate = moment(item.creationTime * 1000).date();
                showDate = true;
            } else {
                showDate = false;
            }
            return (
                <React.Fragment key={index}>
                    {showDate && <DateToday>{date_today}</DateToday>}
                        <Bubble>
                            <Message isUser={item.commentSide === 'Consumer'}>
                                <MessageTextContainer>
                                    {item.comment}  
                                    <SenderName>{item.commentSide}</SenderName>  
                                </MessageTextContainer>
                                <MessageDateMobile isUser={item.commentSide === 'Consumer'}>{Hour}</MessageDateMobile>
                            </Message>
                            <MessageDate isUser={item.commentSide === 'Consumer'}>{Hour}</MessageDate>
                        </Bubble>
                </React.Fragment>
            )

        })
    }    

    checkConditions(){
        return this.props.isDisputeOpen 
                && this.props.status !== "AcceptedByMerchant" && this.props.status !== "CanceledByConsumer" 
                && this.props.status !== "Claim" && this.props.status !== "AcceptedByArbitrators" 
                && this.props.status !== "RejectedByArbitrators" && !this.props.isArbitrator
                && this.props.status !== "RejectedByMerchant"
    }
    
    onSendMessage() {
        const itemId = this.props.itemId
        const disputeHash = this.props.match.params.disputeHash
        const comment = [{
            userHash: this.props.userHash,
            disputeHash,
            itemIds: [String(itemId)],
            comment: this.state.message,
            inChat: true
        }]
        this.props.onSendMessage(comment);

    }

    scrollToBottom = () => {
    var objDiv = document.getElementById("feed");
    objDiv.scrollTop = objDiv.scrollHeight;
    }
      
      
    componentDidUpdate() {
        this.scrollToBottom();
    }

    render(){
        return (
            <ChatBoxContainer>
                <TitleContainer>
                    <TitleIcon src={require('../../../images/icons/titleicons_grad_chat_24X24.svg')}/>
                    <TitleText>Message History</TitleText>
                </TitleContainer>
                <ChatFeed id="feed" feedHeight={this.state.chat.length > 0 ? '320' : '70'} >
                    {this.appendMessages()}
                </ChatFeed>
                {this.checkConditions() && <Wrapper>
                    <Textarea placeholder="Write a message" value={this.state.message} onChange={(e) => this.setState({...this.state, message: e.target.value})} maxLength={255}/>
                    {this.state.message !== '' && <Send onClick={()=>this.onSendMessage()}>send</Send>}
                </Wrapper>}
            </ChatBoxContainer>
        );
    }
	
};


const mapStateToProps = ({account, app}) => {
    return {
        userHash: account.userHash,
        comments: account.disputeDetails.comments
    };
}

const mapDispatchToProps = dispatch => {
    return {
        getDisputeDetails: (disputeCommentsData) => dispatch(actions.getDisputeDetails(disputeCommentsData)),
        onSendMessage: (comment) => dispatch(actions.onSendMessage(comment)),
        
    }
  }

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ChatBox));


