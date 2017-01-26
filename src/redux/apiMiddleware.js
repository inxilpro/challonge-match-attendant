
import { BEGIN, COMMIT, REVERT } from 'redux-optimistic-ui';
import Challonge from '../challonge';

const API_REQUEST = 'challonge-match-attendant/API_REQUEST';
const _SUCCESS = '_SUCCESS';
const _ERROR = '_ERROR';

let api;
let nextTransactionID = 0;

export default store => next => action => {
	const { type, payload, meta } = action;
	
	// Set API Key
	if ('challonge-match-attendant/API_KEY' === type && 40 === payload.length && (!api || payload !== api.apiKey)) {
		console.log(`New API initialized with key '${payload}'`);
		api = new Challonge(payload);
		return next(action);
	}
	
	// Skip non-API requests
	if (!api || API_REQUEST  !== type) {
		return next(action);
	}
	
	let transactionID = nextTransactionID++;
	let actionType = meta.actionType ? meta.actionType : type;
	
	// If synthetic action type is different, dispatch original action first
	if (actionType !== type) {
		next(action);
	}
	
	next({
		...action,
		type: actionType,
		meta: {
			...action.meta,
			optimistic: {
				type: BEGIN,
				id: transactionID
			}
		}
	});
	
	const { method, params } = payload;
	
	if (!api[method]) {
		const errorAction = {
			type: `${actionType}${_ERROR}`,
			error: 'No such method',
			payload: null,
			meta: {
				optimistic: {
					type: REVERT,
					id: transactionID
				}
			}
		};
		console.error(`No such API method: "${method}"`, errorAction);
		return next(action);
	}
	
	console.log(`Calling API method: "${method}"`);
	
	setTimeout(() => {
		
		api[method].apply(api, params).then(res => {
			next({
				type: API_REQUEST + (res.ok ? _SUCCESS : _ERROR),
				error: res.ok ? null : res.error,
				payload: res.ok ? res.data : null
			});
			next({
				type: actionType + (res.ok ? _SUCCESS : _ERROR),
				error: res.ok ? null : res.error,
				payload: res.ok ? res.data : null,
				meta: {
					optimistic: {
						type: res.ok ? COMMIT : REVERT,
						id: transactionID
					}
				}
			});
		}).catch(e => {
			console.error('API error', e);
			throw e;
		});
		
	}, 2000);
};