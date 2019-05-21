import React, { Component } from 'react';
import styled, {keyframes} from 'styled-components';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import Lightbox from 'react-images';
import { fadeIn, slideInRight, shake } from 'react-animations';
import chooseIcon from '../../../images/icons/choose.svg';
import * as actions from '../../../store/actions/index';
const popupOpen = keyframes`${fadeIn}`;
const popupOpenRight = keyframes`${slideInRight}`;

const Layout = styled.div`
	position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: rgba(0,0,0,.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    @media(max-width: 768px){
        align-items: initial;
    }
`;

const Modal = styled.div`
    width: 1044px;
    max-width: 100%;
    border-radius: 4px;
    box-shadow: 0px 2px 3.9px 0.1px rgba(0, 0, 0, 0.15);
    background-color: #ffffff;
    position: relative;
    animation: 0.4s ${popupOpen};
    display: flex;
    flex-wrap: wrap;
    @media(max-width: 1060px){
        overflow-y: auto;
        height: 100%;
    }
    @media(max-width: 768px){
        border-radius: unset;
        width: 100%;
        animation: 0.4s ${popupOpenRight};
    }
`
const Close = styled.div`
    position: absolute;
    transform: rotate(45deg);
    top: 6px;
    right: 10px;
    font-size: 11px;
    font-size: 25px;
    font-family: auto;
    cursor: pointer;
    @media(max-width: 320px){
        right: 25px;
    }
`

const LeftSection = styled.div`
    width: 522px;
    max-width: 100%;
    padding: 40px 30px;
    box-sizing: border-box;
    @media(max-width: 768px){
        padding: 40px 30px 0 30px;
    }
`

const RightSection = styled.div`
    width: 522px !important;
    max-width: 100%;
    padding: 30px;
    box-sizing: border-box;
    border-left: 1px solid #ebebeb;
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
    padding-top: ${props => props.paddingTop};
    border-top: ${props => props.borderTop && '1px solid #ebebeb'};
    & img {
        max-width: 21px;
        max-height: 23px;
        width: 100%;
        height: 100%;
        margin-right: 11px;
    }
    @media(max-width: 768px){
        margin: ${({borderTop}) => borderTop && '0 -30px 25px'};
        padding-left: ${({borderTop}) => borderTop && '30px'};
    }
`;

const Note = styled.p`
    font-size: 10px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 2;
    letter-spacing: normal;
    text-align: left;
    color: #999999;
    font-family: ClanOT-Book;
    margin: 0;
    margin-left: 30px;
    margin-top: 5px;
`

const CharsNote = styled.span`
    font-size: 10px;
    font-family: ClanOT-Book;
    color: #999999;
`

const UploadContainer = styled.div`
    padding-top: 12px;
    & > div{
        display: flex;
    }
    & span{
        display: flex;
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
    }
    & img{
        max-width: 21px;
        max-height: 23px;
        width: 100%;
        height: 100%;
        margin-right: 11px;
    }
`

const UploadDocument = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 36px;
    margin-bottom: 45px;
    width: 100%;
    justify-content: center;

`;


const EvidenceHolder = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 20px;
    &:last-child{
        margin-right: 0;
    }
    @media(max-width: 768px){
        margin-bottom: 10px;
    }
`

const ImgHolder = styled.div`
    width: 60px;
    height: 60px;
    background-color: #ebebeb;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
    cursor: pointer;
    & > img{
        max-width: 100%;
        max-height: 100%;
    }
`

const Remove = styled.div`
    font-family: ClanOT-Book;
    font-size: 13px;
    color: #2bbfdf;
    text-decoration: underline;
    cursor: pointer;
`

const Textarea = styled.textarea`
    width: 100%;
    height: 120px;
    background-color: #f8f8f8;
    padding: 20px;
    resize: none;
    box-sizing: border-box;
    border-color: rgb(232, 229, 229);
    font-size: 13px;
    color: #999999;
    font-family: ClanOT-Book;
    outline: none;
    margin-top: 8px;
    & + span{
        font-size: 10px;
        color: #999999; 
        font-family: ClanOT-Book;
    }
`

const ButtonsWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 30px;
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
    background-color: #2bbfdf;
    font-size: 16px;
    font-family: ClanOT-Book;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    outline: none;
    & > img{
        width: 15px;
        height: 15px;
        margin-right: 10px;
    }
`

const ProductName = styled.h1`
    font-size: 24px;
    color: #333333;
    font-family: ClanOT-Book;
    font-weight: normal;
    margin-top: 0;
    margin-bottom: ${({all}) => all ? '150' : '20'}px;
    text-transform: capitalize;
    @media(max-width: 768px){
        margin-bottom: 30px;
    }
`

const Holder = styled.div`
    display: flex;
    flex-direction: column;
    font-weight: bold;
    margin-right: 30px;
    & > div:last-child{
        font-size: 18px;
        color: #333333;
        font-family: ClanOT-Medium;
        text-transform: uppercase;
    }
`

const Subtitle = styled.div`
    font-size: 12px;
    color: #999999;
    font-family: ClanOT-Medium;
    text-transform: uppercase;
    margin-bottom: 5px;
    font-weight: bold;
`

const Details = styled.div`
    display: flex;
    margin-bottom: 60px;
    @media(max-width: 768px){
        margin: 0 -30px;
        padding-bottom: 30px;
        padding-left: 30px;
        border-bottom: 1px solid #ebebeb;
    }
`

const OptionsContainer = styled.ul`
    list-style-type: none;
    padding: 0;
    margin: 0;
    padding-top: 5px;
    @media(max-width: 768px){
        padding-top: 0;
    }
`

const Option = styled.li`
    font-family: ClanOT-Book;
    font-size: 13px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #ebebeb;
    padding-left: 20px;
    &:first-child{
        border-top: 1px solid #ebebeb;
    }
    & > label > img{
        width: 24px;
        margin-right: 10px;
    }
    @media(max-width: 768px){
        padding-left: 40px;
        margin: 0 -30px;
    }
`

const RadioInput = styled.input`
    display: none;
`

const Label = styled.label`
    cursor:pointer;
    display:flex;
    flex-direction: row;
    min-width: 50px;
    align-items: center;
    padding: 20px 0;
    width: 100%;
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

const shakeAn = keyframes`${shake}`;
const Errmsg = styled.p`
    display: flex;
    animation: 1s ${shakeAn};
    font-family: ClanOT-Bold;
    color: #e35959b3;
    font-size: 11px;
`;

const ChooseFileContainer = styled.label`
	display:flex;
	align-items:center;
	margin-left:5px;
	> input {
		display: none;
	}
`; 

const UploadTextHolder = styled.div`
    display: flex;
    & > span{
        font-family: ClanOT-News;
        font-size: 12px;
        margin-left: 5px;
    }
`

const EvidenceWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    max-width: 100%;
    padding-bottom: 30px;
`

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
    }
`;

const Total = styled.div`
    font-size: 12px;
    font-family: ClanOT-Book;
    margin-bottom: 40px;
`

class Popup extends Component {

    state = {
        reason: null,
        files: [],
		maxFiles: false,
        fileNotSupported: false,
        description: '',
        reasonErr: false,
        mode: 'add',
        preview: false,
        base64: [],
        imageSelected: null
    }

    onSelectReason(e){
        this.setState({...this.state, reason: e.target.value, reasonErr: false})
    }

    getBase64(file){
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
          });
    }

    uploadFile(event){
        event.persist();
		if(event.target.files[0] && this.validateFileUpload(event.target.files[0])){
			if(this.state.files.length <= 2){
                this.getBase64(event.target.files[0]).then(basedFile => {
                    const x = [...this.state.base64];
                    x.push(basedFile)
                    this.setState({ 
                        ...this.state,
                        files: [...this.state.files, event.target.files[0]],
                        maxFiles: false,
                        fileNotSupported: false,
                        base64: [...this.state.base64, {src: basedFile, caption: event.target.files[0].name}]
                    })
                }).catch(e => console.log(e))
				
			}else{
				this.setState({ 
					...this.state,
					maxFiles: true
				})
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

    removeFile = (key) => {
		const filesState = this.state.files.length > 1 ? [
			...this.state.files.slice(0,key),
			...this.state.files.slice(key + 1)
        ] : [];
        const base64State = this.state.base64.length > 1 ? [
			...this.state.base64.slice(0,key),
			...this.state.base64.slice(key + 1)
		] : [];
		return this.setState({
			...this.state,
            files: filesState,
            base64: base64State,
			maxFiles: false
		});
	}

    drawFiles(){
        if(this.state.base64 && this.state.base64.length > 0){
            return (
                this.state.base64.map((file, i) => {
                    return (
                        <EvidenceHolder key={i}>
                            <ImgHolder onClick={() => this.setState({...this.state, preview: true, imageSelected: file.src})}><img src={file.src}/></ImgHolder>
                            <Remove onClick={()=>this.removeFile(i)}>remove</Remove>
                        </EvidenceHolder>  
                    )
                })
            )
        }
    }

    saveDisputeDetails(){
        let item = {};
        if(!this.state.reason){
            return this.setState({...this.state, reasonErr: true})
        }
        const formDataArr = [];
        if(this.state.files.length > 0){
            for(let i = 0; i < this.state.files.length ; i++){
                formDataArr.push(this.createFormData(this.state.files[i], this.props.product.itemId))
            }
        }
        if(this.props.product !== 'all' ){
            item = {
                id: this.props.product.itemId,
                quantity: this.props.product.itemQuantity,
                price: this.props.product.itemPrice,
                reason: this.state.reason,
                images: this.state.base64
            }
        }else{
            item = {
                id: 'all',
                reason: this.state.reason,
                images: this.state.base64
            }
        }

        const description = this.state.description;
        this.props.save(formDataArr, item, description);
    }

    createFormData(file, itemIds ){
        const formData = {
            file: file,
            userHash: this.props.userHash,
            disputeHash: null,
            itemIds: [itemIds],
        } 
        return formData;
    }

    onTextareaChangeHandler(description){
        this.setState({...this.state, description})
    }

    componentWillMount(){
        if(this.props.disputed){
            const files = this.props.disputed.evidences.map(evidence => evidence.file);
            this.setState({
                ...this.state,
                mode: 'edit',
                reason: this.props.disputed.reason,
                description: this.props.disputed.description,
                base64: this.props.disputed.images,
                files
            })
        }
    }

    getSelectedImage(){
        return this.state.base64.filter(file => file.src === this.state.imageSelected)
    }

    onClickOutside(e, productId, mode){
        const modal = document.getElementById("popup");
        if(e.target == modal){
            this.props.close(productId, mode);
        }
    }

    render(){
        const {product} = this.props;
        const reasons = [
                            {label: 'Services/Goods were not received', value: 'ItemNotReceived'}, 
                            {label: 'Services/Goods are not as described', value: 'NotAsDescribed'}
                        ];
        return (<Layout id="popup" onClick={(e) => this.onClickOutside(e, product.itemId || 'all', this.state.mode)}>
                    <Modal>
                        <Close onClick={() => this.props.close(product.itemId || 'all', this.state.mode)}>+</Close>
                        <LeftSection>
                            <Head>
                                <img src={require('../../../images/icons/titleicons_grad_disputedetails_24X24.svg')}/>
                                Dispute Details
                            </Head>
                            <ProductName all={!product}>{product.itemName || 'All products'}</ProductName>
                            {!product.itemId && <Total>Total amount: {this.props.total}</Total>}
                            {product.itemId && <Details>
                                <Holder>
                                    <Subtitle>Units</Subtitle>
                                    <div>x{product.itemQuantity}</div>
                                </Holder>
                                <Holder>
                                    <Subtitle>Amount</Subtitle>
                                    <div>{product.itemPrice || 'All'}</div>
                                </Holder>
                            </Details>}
                            <Head paddingTop="25px" borderTop>
                                <img src={require('../../../images/icons/titleicons_grad_disputereason_24X24 copy.svg')}/>
                                Dispute Reason
                            </Head>
                            <OptionsContainer>
                                {reasons.map((reason, i) => (
                                    <Option key={i} background={this.state.reason === reason ? 'rgb(252, 254, 255)' : '#fff'}>
                                        <Label htmlFor={reason.value}>
                                            <RadioButton isChecked={this.state.reason === reason.value}><RadioButtonChecked isChecked={this.state.reason === reason.value}></RadioButtonChecked></RadioButton>
                                            {i === 0 && 
                                                (this.state.reason === reason.value ? <img src={require('../../../images/icons/reason_grad_notreceived_48X48.svg')}/> : <img src={require('../../../images/icons/reason_notreceived_48X48.svg')}/>)}
                                            {i === 1 && 
                                                (this.state.reason === reason.value ? <img src={require('../../../images/icons/reason_grad_notasdescribed_48X48.svg')}/> : <img src={require('../../../images/icons/reason_notasdescribed_48X48.svg')}/>)}
                                            {reason.label}
                                        </Label>
                                        <RadioInput type="radio" id={reason.value} name="dispute-reason" onChange={(e) => this.onSelectReason(e)} value={reason.value} checked={this.state.reason === reason.value}/>
                                    </Option>
                                ))}
                                
                            </OptionsContainer>
                            {this.state.reasonErr && <Errmsg>Please select a reason</Errmsg>}
                        </LeftSection>   
                        <RightSection>
                            
                            <UploadContainer>
                                <div>
                                    <img src={require('../../../images/icons/titleicons_grad_uploadevidence_24X24.svg')}/>
                                    <span>Upload your evidence</span>
                                </div>
                                <Note>You can only upload 3 files in total. Each file cannot exceed 5MB. Supports JPG, JPEG, PNG, PDF</Note>
                            </UploadContainer>
                            <UploadDocument>
                                <EvidenceWrapper>
                                    {this.drawFiles()}
                                </EvidenceWrapper>
                                <UploadTextHolder>
                                    <ChooseFileContainer htmlFor="inputfile">
                                        <ChooseFileText >Upload files</ChooseFileText>
                                        <input type="file" multiple id="inputfile" accept="image/*;capture=camera" onChange={(e) => this.uploadFile(e)} onClick={(event)=> { event.target.value = null}}/>
                                    </ChooseFileContainer> 
                                </UploadTextHolder>
                                {(this.state.maxFiles || this.state.fileNotSupported )&& <Errmsg>{this.state.maxFiles ? "Maximun files to upload: 3" : this.state.fileNotSupported }</Errmsg>}
                            </UploadDocument>
                            <Head>
                                <img src={require('../../../images/icons/titleicons_grad_reasons_24X24.svg')}/>
                                Leave a message for the merchant
                            </Head>
                            <Textarea maxLength="512" placeholder="Provide additional information" onChange={(e) => this.onTextareaChangeHandler(e.target.value)} value={this.state.description}></Textarea>
                            <CharsNote>* Up to 512 charaters</CharsNote>
                            <ButtonsWrapper>
                                <CancelButton onClick={() => this.props.close(product.itemId || 'all', this.state.mode)}><img src={require('../../../images/icons/buttonicons_cancel_16X16.svg')}/>Cancel</CancelButton>
                                <SubmitButton onClick={() => this.saveDisputeDetails()}><img src={require('../../../images/icons/buttonicons_submit_16X16.svg')}/>Save</SubmitButton>
                            </ButtonsWrapper>
                        </RightSection>   
                        <Lightbox images={this.getSelectedImage()} isOpen={this.state.preview} backdropClosesModal={true} width={300} onClose={() => this.setState({...this.state, preview: false})} showImageCount={false}/> 
                    </Modal>
                </Layout>)
    }
}


const mapStateToProps = ({account}) => {
    return {      
        userHash: account.userHash,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        
    }
  }


export default withRouter(connect(
    mapStateToProps, mapDispatchToProps
)(Popup));