/*
 * Copyright (c) 2017 International Association of Certified Home Inspectors.
 */

import { optimistic, ensureState } from 'redux-optimistic-ui';
import { createAction, handleActions } from 'redux-actions';
import initialState from './initialState';

/*
 * Action Constants
 */

const API_KEY = action('API_KEY');
const API_REQUEST = action('API_REQUEST');
const LOAD_TOURNAMENTS = action('LOAD_TOURNAMENTS');
const LOAD_TOURNAMENTS_DONE = action('LOAD_TOURNAMENTS_DONE');
const AUTH_ERROR = action('AUTH_ERROR');

/*
 * Internal functions
 */

function action(name) {
	return `challonge-match-attendant/${name}`;
}

function updateStateFromApiResponse(state, response) {
	const nextState = {...state};
	return nextState; // FIXME
	
	if (!response || !response.ok && 401 === response.error.code) {
		nextState.authError = true;
		nextState.loggedIn = false;
	}
	
	nextState.loading = false;
	return nextState;
}

/*
 * Action creators
 */

export const setApiKey = createAction(API_KEY);
export const loadTournaments = createAction(LOAD_TOURNAMENTS);
export const loadTournamentsDone = createAction(LOAD_TOURNAMENTS_DONE);
export const authError = createAction(AUTH_ERROR);

/*
 * Reducer
 */

export default optimistic(handleActions({
	
	[API_KEY]: (state, { payload }) => {
		return {
			...state,
			apiKey: payload
		}
	},
	
	[LOAD_TOURNAMENTS]: state => ({
		...state,
		loading: true
	}),
	
	[LOAD_TOURNAMENTS_DONE]: (state, { payload }) => {
		return updateStateFromApiResponse(state, payload);
	},
	
	[AUTH_ERROR]: state => ({
		...state,
		authError: true,
		loggedIn: false
	}),
	
	
	
}, initialState));