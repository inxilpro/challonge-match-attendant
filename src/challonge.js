import 'whatwg-fetch';
import { stringify } from 'qs';

export default class Challonge {
	baseUrl = "https://api.challonge.com/v1/";
	apiKey = null;
	
	constructor(apiKey) {
		this.apiKey = apiKey;
	}
	
	listTournaments(opts) {
		return this.get('tournaments', opts);
	}
	
	listParticipants(tournamentId) {
		return this.get(`tournaments/${tournamentId}/participants`);
	}
	
	listMatches(tournamentId, state = "all") {
		return this.get(`tournaments/${tournamentId}/matches`, { state });
	}
	
	get(path, params = {}) {
		const query = stringify({
			api_key: this.apiKey,
			...params
		});
		
		const url = `${this.baseUrl}/${path}.json?${query}`;
		const proxiedUrl = `https://cors-anywhere.herokuapp.com/${url}`;
		
		console.log(`Requesting ${proxiedUrl}`);
		
		return fetch(proxiedUrl)
			.then(this.parseApiResponse.bind(this))
			.then(res => {
				console.log('API Response', res);
				return res;
			});
	}
	
	parseApiResponse(res) {
		switch (res.status) {
			case 200:
				return this.buildResponse(res);
			
			case 401:
				return this.buildError({
					message: 'Unauthorized',
					code: 401
				});
			
			case 404:
				return this.buildError({
					message: 'Not found',
					code: 404
				});
			
			case 406:
				return this.buildError({
					message: 'Unsupported format',
					code: 406
				});
			
			case 422:
				return this.buildValidationErrors(res);
			
			default:
				return this.buildError({
					message: 'Unknown error',
					code: 500
				});
		}
	}
	
	buildError(error) {
		return {
			ok: false,
			error
		};
	}
	
	buildValidationErrors(res) {
		return new Promise((resolve, reject) => {
			res.json().then(data => {
				resolve(this.buildError({
					message: 'Validation errors',
					code: 422,
					validationMessages: data.errors
				}));
			}).catch(reject);
		});
	}
	
	buildResponse(res) {
		return new Promise((resolve, reject) => {
			res.json().then(data => {
				resolve({
					ok: true,
					data
				});
			}).catch(reject);
		});
	}
}