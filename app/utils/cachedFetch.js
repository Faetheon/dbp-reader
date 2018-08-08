import lscache from 'lscache';
import fetch from 'isomorphic-fetch';

const TTL_MINUTES = 5;

export default async function cachedFetch(url, options) {
	// We don't cache anything when server-side rendering.
	// That way if users refresh the page they always get fresh data.
	if (typeof window === 'undefined') {
		// console.log('Using fetch without a catch statement');

		return fetch(url, options).then((response) => response.json());
	}

	let cachedResponse = lscache.get(url);
	// console.log('cachedResponse', cachedResponse);
	// If there is no cached response,
	// do the actual call and store the response
	if (cachedResponse === null) {
		cachedResponse = await fetch(url, options).then((response) =>
			response.json(),
		);
		lscache.set(url, cachedResponse, TTL_MINUTES);
	}

	return cachedResponse;
}

export function overrideCache(key, val) {
	lscache.set(key, val, TTL_MINUTES);
}