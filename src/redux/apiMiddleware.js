
import { BEGIN, COMMIT, REVERT } from 'redux-optimistic-ui';
import Challonge from '../challonge';

const _SUCCESS = '_SUCCESS';
const _ERROR = '_ERROR';

let api;
let nextTransactionID = 0;

export default store => next => action => {
	const { type, payload } = action;
	
	// Set API Key
	// TODO This doesn't work on restore
	if ('challonge-match-attendant/API_KEY' === type && 40 === payload.length) {
		console.log(`New API initialized with key '${payload}'`);
		api = new Challonge(payload);
		return next(action);
	}
	
	// Skip non-API requests
	if ('challonge-match-attendant/API_REQUEST' !== type) {
		return next(action);
	}
	
	// TODO: Throw error if API is not set
	
	let transactionID = nextTransactionID++;
	next({
		...action,
		meta: {
			...action.meta,
			optimistic: {
				type: BEGIN,
				id: transactionID
			}
		}
	});
	
	const { method, params } = payload;
	api[method].apply(api, params).then(res => {
		next({
			type: type + (res.ok ? _SUCCESS : _ERROR),
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
		throw e;
	});
};