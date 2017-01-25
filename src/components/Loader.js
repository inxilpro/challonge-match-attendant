import React, { Component } from 'react';
import Pace from 'pace';
import 'pace/themes/blue/pace-theme-flash.css';

export default class Loader extends Component {
	render() {
		const { loading } = this.props;
		
		if (loading) {
			this.start();
		} else {
			this.stop();
		}
		
		return <span className={`pace-${loading} ? 'loaded' : 'unloaded'`}></span>;
	}
	
	start() {
		Pace.start({
			ajax: false,
			document: false,
			eventLag: false
		});
	}
	
	stop() {
		Pace.stop();
	}
}