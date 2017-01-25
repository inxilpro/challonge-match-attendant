import { createStore, applyMiddleware, compose } from 'redux';
import { persistState as persistDevtoolsState } from 'redux-devtools';
import reducer from './index';
import defaultInitialState from './initialState';
import apiMiddleware from './apiMiddleware';

export default function configureStore(initialState = defaultInitialState) {
	const middleware = [apiMiddleware];
	if ('production' !== process.env.NODE_ENV) {
		middleware.push(require('redux-immutable-state-invariant')());
	}
	
	const getDebugSessionKey = () => {
		// By default we try to read the key from ?debug_session=<key> in the address bar
		const matches = window.location.href.match(/[?&]debug_session=([^&]+)\b/);
		return (matches && matches.length) ? matches[1] : null;
	};
	
	const enhancer = compose(
		applyMiddleware(...middleware),
		window.devToolsExtension ? window.devToolsExtension() : noop => noop,
		persistDevtoolsState(getDebugSessionKey()),
	);
	
	const store = createStore(reducer, initialState, enhancer);
	
	// Enable Webpack hot module replacement for reducers
	if (module.hot) {
		module.hot.accept('./index', () =>
			store.replaceReducer(require('./index').default)
		);
	}
	
	return store;
}