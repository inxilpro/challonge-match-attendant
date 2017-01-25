import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './redux/configureStore';
import App from './App';
import 'bootstrap/dist/css/bootstrap.css';

const store = window.reduxStore = configureStore();

render((
	<Provider store={store}>
		<App />
	</Provider>
), document.getElementById('root'));