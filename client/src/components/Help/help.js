import React, { Component } from 'react';
import styled from 'styled-components';
import { HelpContainer, TitleContainer, QuestionIcon, Title, HelpBox, HelpList, Active, invisibleStyleOpen } from './helpStyle';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';
import HelpRow from './helpRow';
import { getContent } from './content';


class Help extends Component {

	constructor(props) {
		super(props);
	}

	componentDidMount(){
		this.props.setPage('help');
	}

	render() {
		
		return (
			<HelpContainer>
				<TitleContainer>
					<QuestionIcon />
					<Title>Help</Title>
				</TitleContainer>
				<HelpBox>
					<HelpList>
					{
						getContent().map((row,idx) => <HelpRow key={idx} visibleText={row.question} hiddenText={row.answer} />)
					}
					</HelpList>
				</HelpBox>
			</HelpContainer>
		);
	}
}


const mapDispatchToProps = dispatch => {
    return {
        setPage: page => dispatch(actions.setPage(page)),
    };
};

export default connect( null, mapDispatchToProps )( Help );