import React,{Component} from 'react';
import styled, {keyframes} from 'styled-components';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import * as actions from '../../../../store/actions/index';
import InnerEvidence from './EvidenceInnerSection';

const TitleContainer = styled.div`
    display:flex;
    align-items:center;
    margin-bottom: 22px;
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

const EvidenceContainer = styled.div`
    width:100%;
    height: auto;
    border-radius: 4px;
    background-color: #ffffff;
    box-shadow: 0px 2px 3.9px 0.1px rgba(0, 0, 0, 0.15);
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    @media(max-width: 768px){
        padding: 30px 0;
    }
`;

const LeftSection = styled.div`
    width: 522px;
    max-width: 100%;
    padding: 30px;
    box-sizing: border-box;
    @media(max-width: 768px){
        padding: 0 30px 20px;
    }
`

const RightSection = styled.div`
    width: 522px;
    max-width: 100%;
    padding: 30px;
    box-sizing: border-box;
    border-left: 1px solid #ebebeb;
    @media(max-width: 768px){
        border-left: none;
        border-top: 1px solid #ebebeb;
        padding-bottom: 0;
    }
`
class Evidence extends Component{

    state = {
        consumerEvidence: [],
        merchantEvidence: []
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.documents){
            const consumerEvidence = nextProps.documents.filter(d => d.uploadSide === 'Consumer');
            const merchantEvidence = nextProps.documents.filter(d => d.uploadSide === 'Merchant');
            this.setState({...this.state, consumerEvidence, merchantEvidence})
        }
    }
    
    render(){
        return (
            <EvidenceContainer>
                <LeftSection>
                    <TitleContainer>
                        <TitleIcon src={require('../../../../images/icons/titleicons_grad_uploadevidence_24X24.svg')}/>
                        <TitleText>Evidence</TitleText>
                    </TitleContainer>
                    <InnerEvidence 
                        status={this.props.status}
                        allowedToUplaodNew={!this.props.isMerchant && !this.props.isArbitrator}
                        documents={this.state.consumerEvidence}
                        title='Consumer’s evidence' 
                        isDisputeOpen={this.props.isDisputeOpen} 
                        dispute={this.props.dispute} 
                        currentItem={this.props.currentItem}/>
                </LeftSection>   
                <RightSection>
                    <InnerEvidence 
                        paddingTop
                        status={this.props.status}
                        allowedToUplaodNew={this.props.isMerchant && !this.props.isArbitrator} 
                        documents={this.state.merchantEvidence}
                        title='Merchant’s evidence' 
                        isDisputeOpen={this.props.isDisputeOpen} 
                        dispute={this.props.dispute} 
                        currentItem={this.props.currentItem}/>
                </RightSection> 
            </EvidenceContainer>
        );
    }
	
};


const mapStateToProps = ({account}) => {
    return {      
        documents: account.disputeDetails.documents
    }
}

const mapDispatchToProps = dispatch => {
    return {
        
    }
  }


export default withRouter(connect(
    mapStateToProps, mapDispatchToProps
)(Evidence));