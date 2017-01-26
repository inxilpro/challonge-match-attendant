import React, { Component } from 'react';
import { connect } from 'react-redux';
// import JsonTree from 'react-json-tree';
import { ensureState } from 'redux-optimistic-ui';
import localForage from 'localforage';
import Login from './components/Login';
import TournamentList from './components/TournamentList';
import Loader from './components/Loader';
import * as actions from './redux';
import './App.css';

class App extends Component {
	render() {
		return (
			<div className="App container">
				{ this.renderChildren() }
				<Loader loading={this.props.loading} />
			</div>
		);
		
		// <JsonTree data={this.props} />
	}
	
	componentDidMount() {
		localForage.getItem('api_key', (err, value) => {
			if (!err && value) {
				this.props.actions.setApiKey(value);
			}
		});
		
		this.load();
	}
	
	componentDidUpdate() {
		this.load();
	}
	
	renderChildren() {
		const { apiKey, loggedIn, authError, tournaments, actions } = this.props;
		
		if (!loggedIn) {
			return (
				<Login
					apiKey={apiKey}
					authError={authError}
					onApiKey={apiKey => this.onNewKey(apiKey)} />
			);
		}
		
		return <TournamentList tournaments={tournaments} actions={actions} />;
	}
	
	onNewKey(apiKey) {
		this.props.actions.setApiKey(apiKey);
		localForage.setItem('api_key', apiKey);
	}
	
	load() {
		const { apiKey, loading, tournaments, actions } = this.props;
		
		if (!loading && apiKey && apiKey.length === 40 && !tournaments) {
			actions.listTournaments();
		}
	}
}

function mapStateToProps(state) {
	const nextState = ensureState(state);
	return nextState;
}

function mapDispatchToProps(dispatch) {
	const dispatchActions = {};
	Object.keys(actions).forEach(key => {
		dispatchActions[key] = (...args) => {
			return dispatch(actions[key].apply(actions, args));
		}
	});
	
	return {
		actions: dispatchActions
	};
}

function mergeProps(stateProps, dispatchProps, ownProps) {
	return {
		...ownProps,
		...stateProps,
		...dispatchProps
	};
}

const connectOpts = {
	areStatesEqual: (prev, next) => {
		return ensureState(prev) === ensureState(next);
	}
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps, connectOpts)(App);
