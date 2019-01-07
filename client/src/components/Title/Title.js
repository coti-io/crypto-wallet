
import React from 'react';
import styled from 'styled-components';

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

let Title;

export default Title = (props) =>
	(<TitleContainer>
        <ActivityIcon onClick={()=>props.onClickGetDisputes ? props.onClickGetDisputes() : {}} src={require(`../../images/menu/${props.title}-active.svg`)}  />
        <Heading>{props.title}</Heading>
    </TitleContainer>)

