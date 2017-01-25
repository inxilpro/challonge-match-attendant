import React, { Component } from 'react';
import { connect } from 'react-redux';
import JsonTree from 'react-json-tree';
import { ensureState } from 'redux-optimistic-ui';
import localForage from 'localforage';
import Challonge from './challonge';
import Login from './components/Login';
import Loader from './components/Loader';
import { setApiKey, loadTournaments, loadTournamentsDone } from './redux';
import './App.css';

class App extends Component {
	state = {
		api: null
	};
	
	render() {
		return (
			<div className="App container">
				{ this.renderChildren() }
				<JsonTree data={this.props} />
				<Loader loading={this.props.loading} />
			</div>
		);
	}
	
	componentDidMount() {
		localForage.getItem('api_key', (err, value) => {
			if (!err && value) {
				this.props.dispatch(setApiKey(value));
			}
		});
		
		this.load();
	}
	
	componentWillReceiveProps() {
		this.load();
	}
	
	renderChildren() {
		const { apiKey, loggedIn, authError } = this.props;
		
		if (!loggedIn) {
			return (
				<Login
					apiKey={apiKey}
					authError={authError}
					onApiKey={apiKey => this.onNewKey(apiKey)} />
			);
		}
		
		return "Route needed!";
	}
	
	onNewKey(apiKey) {
		this.props.dispatch(setApiKey(apiKey));
		localForage.setItem('api_key', apiKey, console.error);
	}
	
	load() {
		const { apiKey, tournaments, dispatch } = this.props;
		
		if (!this.state.api && apiKey && apiKey.length === 40) {
			dispatch(loadTournaments());
			this.setState({
				...this.state,
				api: new Challonge(apiKey)
			});
		}
		
		if (!tournaments && this.state.api) {
			this.state.api.listTournaments().then(data => {
				console.log(data);
				dispatch(loadTournamentsDone(data));
			});
		}
	}
}

export default connect(state => ensureState(state))(App);
