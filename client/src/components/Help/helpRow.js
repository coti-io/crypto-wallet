import React, { Component } from 'react';
import styled from 'styled-components';
import {HelpRowContainer, Visible, HelpArrow, InVisible, Active, invisibleStyleOpen} from './helpStyle';

export default class HelpRow extends Component {


	constructor(props) {
		super(props);
    }
	
	state = {
		visible:false,	
	}

	render() {
		let ActiveStyle = {color:'inherit' ,fontSize:'14px',
		fontFamily: 'ClanOT-book' };		
		if(this.state.visible) {
			ActiveStyle = Object.assign({},Active);
		}
		
		return (
			<HelpRowContainer active={this.state.visible} onClick={()=>this.setState({...this.state, visible:!this.state.visible})}>
				<Visible>
					<span onClick={()=>this.setState({visible:!this.state.visible})} style={ActiveStyle}>{this.props.visibleText}</span>
					<HelpArrow active={this.state.visible} onClick={()=>this.setState({...this.state, visible:!this.state.visible})}/>
				</Visible>
				{this.state.visible && 
					<ul style={invisibleStyleOpen}> 
						{this.props.hiddenText.map((answer, idx) => <InVisible key={idx}>{answer}</InVisible>) }
					</ul>
				}
			</HelpRowContainer>
		);
	}
}