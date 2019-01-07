import React from 'react';
import LogoTop from '../../images/coti_logo.svg';
import styled from 'styled-components';

const Logo = styled.img`
    width: 150px;
    margin: ${props => props.margin ? props.margin : '0'};
    @media(max-width: 768px){
        margin: 0 auto;
    }
`;


const ShopLogo = (props) =>  
    <Logo src={LogoTop} alt="" margin={props.margin}/>
   
export default ShopLogo;