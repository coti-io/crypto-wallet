import React,{Component} from 'react';
import styled, {keyframes} from 'styled-components';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import * as actions from '../../../../store/actions/index';
import { shake } from 'react-animations';
import Lightbox from 'react-images';
import moment from 'moment';

const EvidenceTitle = styled.div`
    font-family: ClanOT-News;
    font-size: 12px;
    margin-bottom: 23px;
    padding-top: ${({paddingTop}) => paddingTop && '46px'};
    @media(max-width: 768px){
        padding-top: 0;
    }
`

const EvidenceWrapper = styled.div`
    display: flex;
    flex-direction: column;
`

const ImgName = styled.div`
    font-family: ClanOT-Book;
    font-size: 13px;
    color: #2bbfdf;
    text-decoration: underline;
    margin-bottom: 8px;
    cursor: pointer;
`

const ChooseFileContainer = styled.label`
	display:flex;
	align-items:center;
	margin-top: 30px;
	> input {
		display: none;
	}
`;     

const ChooseFileText = styled.p`
	font-family: ClanOT-News;
	font-size: 12px;
	color: #2bbfdf;
	cursor:pointer;
	margin: 0;
    font-weight: bold;
    & > span{
        color: #999999;
        font-weight: normal;
        cursor: default;
        pointer-events: none;
    }
    @media(max-width: 768px){
        font-size: 12px;
        & > span{
            font-size: 10px;
        }
    }
`;

const shakeAn = keyframes`${shake}`;
const Errmsg = styled.p`
    display: flex;
    animation: 1s ${shakeAn};
    font-family: ClanOT-Bold;
    color: #e35959b3;
    font-size: 11px;
`;

const ImgHolder = styled.div`
    display:flex;
`

const ImgDate = styled.div`
    font-size: 12px;
    font-family: ClanOT-News;
    margin-left: 10px;
`

class Evidence extends Component{

    state = {
		maxFiles: false,
        fileNotSupported: false,
        images: [],
        preview: false,
        imageSelected: null,
        documents: []
    }

    uploadFile = (event) => {
		if(event.target.files[0] && this.validateFileUpload(event.target.files[0])){
			if(this.props.documents.length <= 2){
                this.props.uploadeNewEvidence([{
                    documents: [event.target.files[0]],
                    userHash: this.props.userHash,
                    disputeHash: this.props.dispute.hash,
                    itemIds: [this.props.currentItem],
                    inDispute: true
                }]);
                this.props.toggleSpinner(true);
				this.setState({ 
					...this.state,
					maxFiles: false,
					fileNotSupported: false
				})
			}else{
				this.setState({ 
					...this.state,
					maxFiles: true
				});
			}
		}
    };


	validateFileUpload(file) {
        let filename = file.name,
            filesize = file.size,
            filetype = file.type 
            filesize = filesize/1024/1024 < 5.1

        if (filesize && (filetype === "image/png" || filetype === "image/jpeg" || filetype === "image/jpg" || filetype === "application/pdf")) {                
            this.setState({...this.state, fileNotSupported: false});
            return true
        } 

        let errMsg = filesize ? "Document only allowed file types of PDF, PNG and JPG." : "Document size limit to 5MB";
        
        this.setState({...this.state, fileNotSupported: errMsg})
        return false
    }
    
    drawFiles(){
        const documents = this.state.documents;
        if(documents && documents.length > 0){
            return (
                documents.map((file, i) => {
                    return (
                        <ImgHolder key={i}>
                            <ImgName key={i} onClick={() => this.onClickDocument(file.hash, file.fileName)}>{file.fileName}</ImgName>
                            <ImgDate>{moment(file.creationTime*1000).startOf('second').fromNow()}</ImgDate>
                        </ImgHolder>
                        
                    )
                })
            )
        }
    }



    onClickDocument(fileHash, fileName){
        this.setState({
            ...this.state,
            imageSelected: fileName,
            preview: true
        });
    }
    

    getSelectedImage(){
        return this.state.documents.filter(file => file.fileName === this.state.imageSelected).map(file => {
            return {src: file.src, caption: file.fileName}
        })
    }
    
    componentDidMount() {
        const documents = this.props.documents
        if(documents && documents.length > 0){
            this.setState({
                ...this.state,
                documents
            });
        }
    }

    checkConditions(){
        return this.props.isDisputeOpen && this.props.allowedToUplaodNew
                && this.props.status !== "AcceptedByMerchant" && this.props.status !== "CanceledByConsumer" 
                && this.props.status !== "Claim" && this.props.status !== "AcceptedByArbitrators" 
                && this.props.status !== "RejectedByArbitrators" && this.props.status !== "RejectedByMerchant"
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.imagePreview){
            this.setState({...this.state, preview: true})
        }
        if(this.props.currentItem != nextProps.currentItem){
            return this.setState({ 
                ...this.state,
                maxFiles: false,
                fileNotSupported: false
            })
        }
        if(this.props.documents != nextProps.documents){
            this.setState({ 
                ...this.state,
                documents: nextProps.documents
            })
        }
    }

    
    render(){
        return (
            <React.Fragment>
                {this.props.documents && <Lightbox images={this.getSelectedImage()} isOpen={this.state.preview} backdropClosesModal={true} width={300} onClose={() => this.setState({...this.state, preview: false})} showImageCount={false}/> }
                <EvidenceTitle paddingTop={this.props.paddingTop}>{this.props.title}</EvidenceTitle>
                <EvidenceWrapper>
                {this.state.documents.length > 0 && this.drawFiles()}
                </EvidenceWrapper>
                {this.checkConditions() && 
                <ChooseFileContainer htmlFor="inputfile">
                    <ChooseFileText >Upload files <span>3 files mx | 5MB each max | JPG, JPEG, PNG</span></ChooseFileText>
                    <input type="file" multiple id="inputfile" onChange={this.uploadFile} accept="image/*;capture=camera"/>
                </ChooseFileContainer> }
                {(this.state.maxFiles || this.state.fileNotSupported )&& <Errmsg>{this.state.maxFiles ? "Maximun files to upload: 3" : this.state.fileNotSupported }</Errmsg>}
            </React.Fragment>
        );
    }
	
};



const mapStateToProps = ({account}) => {
    return {      
        userHash: account.userHash,
        downloadedFile: account.downloadedFile,
        imagePreview: account.imagePreview,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        uploadeNewEvidence: file => dispatch(actions.uploadEvidence(file)),
        downloadFile: downloadFileData => dispatch(actions.downloadFile(downloadFileData)),
        toggleSpinner: flag => dispatch(actions.toggleSpinner(flag))
    }
  }


export default withRouter(connect(
    mapStateToProps, mapDispatchToProps
)(Evidence));