import React from 'react';
import styled, {keyframes} from 'styled-components';
import { shake } from 'react-animations';


const InputWrapper = styled.div`
    position: relative;
    display: inline-flex;
    z-index: 0;
    width: 100%;
    max-width: ${props => props.maxWidth || "454"}px;
    margin: 0 auto;
    font-family: ClanOT-Book;
    font-size: 13px;
    height: 40px;
    display: flex;
    align-items: center;
    margin-bottom: ${({marginBottom}) => marginBottom ? marginBottom : '40px'};
    @media(max-width: 768px){
      margin: 0;
      width: 100%;
      max-width: 100%;
      height: 60px;
    }
`;

const CustomeInput = styled.input.attrs({
    minLength: '1',
    maxLength: '136'})`;
    width: 100%;
    font: inherit;
    background-color: transparent;
    border: 0;
    color: #001111;
    border-bottom: solid 1px #ebebeb;
    padding: 0px 20px 0 0;
    box-sizing: border-box;
    transition: 0.3s all ease-out;
    letter-spacing: 0.9px;
    background-color: #f8f8f8;
    height: 100%;
    text-indent: 20px;
    &::placeholder{
      text-transform: uppercase;
    }

    &:focus {
      outline: 0;
      border-color: #04a6caf0;
      transition: 0.3s all ease-in;
    }
    @media(min-width: 480px){
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0 30px #fff inset;
        -webkit-text-fill-color: #001111;
        transition: background-color 5000s ease-in-out 0s;
      }
    }
    
`;


const animation = keyframes`${shake}`;
const Error = styled.p`
    animation: 1s ${animation};
    font-family: ClanOT-Book;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    position: absolute;
    bottom: -24px;
    left: 00px;
    font-size: 10px;
    color: #ff0000ad;
    opacity: ${props => props.showError ? 1 : 0};
    transition: 0.5s opacity ease-in;
    @media(max-width: 768px){
      bottom: -8px;
      left: 20px;
    }
`;

class Input extends React.Component {
  constructor(props) {
    super(props)
  }
  
  shouldComponentUpdate(nextProps, nextState){
    const {value, showError} = this.props
    return showError !== nextProps.showError || value !== nextProps.value
  }

  render() {
    return ( 
      <InputWrapper maxWidth={this.props.maxWidth} marginBottom={this.props.marginBottom}>
        <CustomeInput 
          maxWidth={this.props.maxWidth}
          placeholder={this.props.placeholder} 
          type={this.props.type} 
          name={this.props.name} 
          value={this.props.value} 
          required={this.props.required}
          disabled={this.props.disabled}
          onBlur={this.props.connect && this.props.onBlur}
          onChange={ ({target}) => this.props.onChangeOutside(target.name, target.value)}
          />
          {this.props.showError &&
            <Error showError={this.props.showError}>{this.props.errorMsg}</Error>
          }
        </InputWrapper>
    )
  }
}


export default Input;