/*
 * Copyright (c) 2017 International Association of Certified Home Inspectors.
 */

import { optimistic } from 'redux-optimistic-ui';
import { createAction, handleActions } from 'redux-actions';
import initialState from './initialState';

/*
 * Action Constants
 */

const API_KEY = action('API_KEY');
const API_REQUEST = action('API_REQUEST');
const API_REQUEST_SUCCESS = action('API_REQUEST_SUCCESS');
const API_REQUEST_ERROR = action('API_REQUEST_ERROR');

const FAVICON_COUNT = action('FAVICON_COUNT');

const LIST_TOURNAMENTS = action('LIST_TOURNAMENTS');
const LIST_TOURNAMENTS_SUCCESS = action('LIST_TOURNAMENTS_SUCCESS');
const LIST_TOURNAMENTS_ERROR = action('LIST_TOURNAMENTS_ERROR');

const LIST_PARTICIPANTS = action('LIST_PARTICIPANTS');
const LIST_PARTICIPANTS_SUCCESS = action('LIST_PARTICIPANTS_SUCCESS');
const LIST_PARTICIPANTS_ERROR = action('LIST_PARTICIPANTS_ERROR');

const LIST_MATCHES = action('LIST_MATCHES');
const LIST_MATCHES_SUCCESS = action('LIST_MATCHES_SUCCESS');
const LIST_MATCHES_ERROR = action('LIST_MATCHES_ERROR');

/*
 * Internal functions
 */

function action(name) {
	return `challonge-match-attendant/${name}`;
}

/*
 * Action creators
 */

export const setApiKey = createAction(API_KEY);
export const faviconCount = createAction(FAVICON_COUNT);

export const apiRequest = createAction(API_REQUEST, (method, actionType, params = []) => {
	return {
		method,
		params
	};
}, (method, actionType) => ({ actionType }));

export const listTournaments = () => apiRequest('listTournaments', LIST_TOURNAMENTS);
export const listParticipants = (tournamentId) => apiRequest('listParticipants', LIST_PARTICIPANTS, [tournamentId]);
export const listMatches = (tournamentId, state = "all") => apiRequest('listMatches', LIST_MATCHES, [tournamentId, state]);

/*
 * Reducer
 */

const reducer = handleActions({
	
	[API_KEY]: (state, { payload }) => {
		return {
			...state,
			apiKey: payload,
		}
	},
	
	[FAVICON_COUNT]: (state, { payload }) => {
		return {
			...state,
			faviconCount: payload,
		}
	},
	
	[API_REQUEST]: (state, { payload }) => {
		return {
			...state,
			loading: true
		};
	},
	
	[API_REQUEST_SUCCESS]: (state, { payload }) => {
		return {
			...state,
			loading: false
		};
	},
	
	[API_REQUEST_ERROR]: (state, { error }) => {
		const nextState = {
			...state,
			loading: false
		};
		
		if (401 === error.code) {
			nextState.authError = true;
			nextState.loggedIn = false;
		}
		
		return nextState;
	},
	
	[LIST_TOURNAMENTS]: state => {
		return {
			...state,
			tournaments: Array(3).fill({placeholder: true}),
			loading: true,
			loggedIn: true
		};
	},
	
	[LIST_TOURNAMENTS_SUCCESS]: (state, { payload }) => {
		return {
			...state,
			tournaments: payload.map(row => row.tournament)
		}
	},
	
	[LIST_TOURNAMENTS_ERROR]: (state, action) => {
		const nextState = {
			...state
		};
		
		if (nextState.tournaments) {
			delete nextState.tournaments;
		}
		
		// TODO: Set error message somewhere
		
		return nextState;
	}
	
}, initialState);

export default optimistic((state = initialState, action) => {
	if (!action.type) {
		return state;
	}
	
	return reducer(state, action);
});