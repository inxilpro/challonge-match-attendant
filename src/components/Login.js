import React, { Component } from 'react';
import { Row, Col, Panel, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';

export default class Login extends Component {
	keyInput = null;
	
	constructor() {
		super();
		this.onChange = this.onChange.bind(this);
	}
	
	render() {
		// TODO: How can we pass in key and debounce at same time?
		const { apiKey, authError } = this.props;
		
		let message;
		if (apiKey && apiKey.length > 0 && 40 !== apiKey.length) {
			message = 'Your API key should be 40 characters.';
		}
		
		if (authError) {
			message = 'Unable to log in with that key. Make sure to copy and paste it exactly as-is.';
		}
		
		return (
			<Row>
				<Col md={6} mdOffset={3}>
					<Panel header="Log In">
						
						<div className="lead">
							Please enter your <a href="https://challonge.com/settings/developer" target="_blank">Challonge API Key</a> to
							continue. Your key will only be used to access your current tournaments,
							and is only stored locally in your browser.
						</div>
						
						<FormGroup validationState={message ? "error" : null}>
							<ControlLabel>API Key</ControlLabel>
							<FormControl
								type="text"
								onChange={this.onChange}
								value={apiKey}
								inputRef={el => this.keyInput = el} />
							{message && <HelpBlock>{message}</HelpBlock>}
						</FormGroup>
						
					</Panel>
				</Col>
			</Row>
		);
	}
	
	onChange() {
		this.props.onApiKey(this.keyInput.value);
	}
}