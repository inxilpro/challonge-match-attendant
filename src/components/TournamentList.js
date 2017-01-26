import React, { Component } from 'react';
import { ListGroup } from 'react-bootstrap';
import Tournament from './Tournament';

export default class TournamentList extends Component {
	render() {
		const { tournaments } = this.props;
		
		return (
			<ListGroup>
				{tournaments.map((tournament, index) => {
					return (
						<Tournament
							key={index}
							onClick={() => this.onSelect(tournament)}
							{...tournament} />
					);
				})}
			</ListGroup>
		);
	}
	
	onSelect(tournament) {
		console.log(tournament);
		this.props.actions.listMatches(tournament.url);
	}
}