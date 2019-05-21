
import styled from 'styled-components';
import Arrow from '../../images/icons/crescentright.svg';
import HelpIcon from '../../images/icons/menuicon_grad_05_help_24X24.svg';

export const HelpContainer = styled.div`
	width:100%;
	@media (max-width: 768px) {
		margin-top: 75px;
	}
`;

export const TitleContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: left;
`;

export const Title = styled.h1`
	font-family: ClanOT-book;
	font-size: 30px;
	color: #2bbfdf;
	position:relative;
	left:11px;
`;

export const QuestionIcon = styled.div`
	width: 24px;
	height: 24px;
	background-image:url(${HelpIcon});
`;

export const HelpBox = styled.div`
	max-width: 1400px;
	border-radius: 4px;
	background-color: #ffffff;
	box-shadow: 0px 2px 3.9px 0.1px rgba(0, 0, 0, 0.15);
	transition: 0.3s all;
`;

export const HelpList = styled.ul`
	padding: 30px;
`;

export const HelpRowContainer = styled.li`
	min-height: 60px;
	font-family: ClanOT-book;
	font-size: 15px;
	line-height: 2;
	text-align: left;
	color: #333333;
	border-bottom: #ebebeb 1px solid;
	display: flex;
	flex-direction:column;
	justify-content:center;
	align-items: center;
	transition: 0.3s all;
	padding: ${({active}) => active ? "10px" : "0"} 5px;
	background: ${({active}) => active ? "#fcfeff" : "unset"} 5px;
	cursor: pointer;

	&:last-child{
		border-bottom: none;
	}
	&:hover {
		background: #f8f8f8;
	}
`;

export const HelpArrow = styled.div`
	background-image:url(${Arrow});
	background-repeat: no-repeat;
	height:${({active}) => active ? "16px" : "24px"}; 
	width:${({active}) => active ? "16px" : "24px"}; 
	margin-left:auto;
	margin-top: ${({active}) => active ? "20px" : "0"};
	margin-right: ${({active}) => active ? "10px" : "0"};
	margin-bottom: ${({active}) => active ? "5px" : "0"};
	transform: rotate(${({active}) => active ? "90deg" : "0deg"});
	transition: 0.3s all;
`;

export const Visible = styled.div`
	display: flex;
	width:100%;
	align-items: center;
	@media(max-width: 768px){
		font-size: 13px;
		& > span{
			width: 85%;
		}
	}
`;

export const InVisible = styled.li`
	display: flex;
	width:100%;
	align-items: center;
`;

export const Active = {
	color: '#2bbfdf',
	fontSize:'14px',
	fontFamily: 'ClanOT-book',
	transition: 'color 0.15s'
}

export const invisibleStyleOpen = {
	paddingLeft: "0px",
	listStyleType: "disc",
	transition: 'max-height 0.25s'	,
	fontSize:'12px',
	marginRight: 'auto'
}