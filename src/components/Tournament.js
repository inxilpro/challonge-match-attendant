import React, { Component } from 'react';
import { ListGroupItem } from 'react-bootstrap';

export default class Tournament extends Component {
	render() {
		const { placeholder, name } = this.props;
		
		if (placeholder) {
			return <ListGroupItem>&nbsp;</ListGroupItem>;
		}
		
		return (
			<ListGroupItem onClick={() => this.onClick()}>
				{name}
			</ListGroupItem>
		);
	}
	
	onClick() {
		return this.props.onClick ? this.props.onClick() : null;
	}
}