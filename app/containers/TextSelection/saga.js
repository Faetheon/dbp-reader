import { takeLatest, call, fork, put } from 'redux-saga/effects';
import { fromJS } from 'immutable';
import cachedFetch from '../../utils/cachedFetch';
import territoryCodes from '../../utils/territoryCodes.json';
import request from '../../utils/request';
import {
	GET_COUNTRIES,
	GET_COUNTRY,
	GET_DPB_TEXTS,
	GET_LANGUAGES,
	ERROR_GETTING_LANGUAGES,
	ERROR_GETTING_VERSIONS,
	CLEAR_ERROR_GETTING_VERSIONS,
	CLEAR_ERROR_GETTING_LANGUAGES,
	LOAD_COUNTRIES_ERROR,
} from './constants';
import { loadTexts, loadCountries, setLanguages } from './actions';

const oneDay = 1000 * 60 * 60 * 24;

export function* getCountries() {
	const requestUrl = `${process.env.BASE_API_ROUTE}/countries?key=${
		process.env.DBP_API_KEY
	}&v=4&asset_id=${
		process.env.DBP_BUCKET_ID
	}&has_filesets=true&include_languages=true`;

	try {
		const response = yield call(cachedFetch, requestUrl, {}, oneDay);
		// console.log('countries response', response);
		const countriesObject = response.data.reduce((acc, country) => {
			const tempObj = acc;
			if (typeof country.name !== 'string') {
				tempObj[country.name.name] = { ...country, name: country.name.name };
			} else if (country.name === '' || territoryCodes[country.codes.iso_a2]) {
				return acc;
			} else {
				tempObj[country.name] = country;
			}
			return tempObj;
		}, {});
		countriesObject.ANY = {
			name: 'ANY',
			languages: { ANY: 'ANY' },
			codes: { iso_a2: 'ANY' },
		};
		const countries = fromJS(countriesObject)
			.filter((c) => c.get('name'))
			.sort((a, b) => {
				if (a.get('name') === 'ANY') {
					return -1;
				} else if (a.get('name') > b.get('name')) {
					return 1;
				} else if (a.get('name') < b.get('name')) {
					return -1;
				}
				return 0;
			});

		yield put(loadCountries({ countries }));
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error(err); // eslint-disable-line no-console
		}
		yield put({ type: LOAD_COUNTRIES_ERROR });
	}
}

export function* getCountry() {
	// const requestUrl = `${process.env.BASE_API_ROUTE}/countries?key=${process.env.DBP_API_KEY}&v=4&asset_id=${process.env.DBP_BUCKET_ID}&has_filesets=true&include_languages=true&iso=${iso}`;

	try {
		// const response = yield call(request, requestUrl);
		//
		// yield put(loadCountry({ country: response.country }));
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error(err); // eslint-disable-line no-console
		} else if (process.env.NODE_ENV === 'production') {
			// const options = {
			// 	header: 'POST',
			// 	body: formData,
			// };
			// fetch('${process.env.BASE_API_ROUTE}/error_logging', options);
		}
	}
}

export function* getTexts({ languageCode }) {
	let requestUrl = '';
	// console.log('active language code', languageCode);

	// if (languageISO === 'ANY') {
	//   requestUrl = `${process.env.BASE_API_ROUTE}/bibles?&asset_id=${
	//     process.env.DBP_BUCKET_ID
	//   }&key=${process.env.DBP_API_KEY}&v=4`;
	// } else {
	requestUrl = `${process.env.BASE_API_ROUTE}/bibles?asset_id=${
		process.env.DBP_BUCKET_ID
	}&key=${process.env.DBP_API_KEY}&language_code=${languageCode}&v=4`;
	// }
	const videoRequestUrl = `${
		process.env.BASE_API_ROUTE
	}/bibles?asset_id=dbp-vid&key=${
		process.env.DBP_API_KEY
	}&language_code=${languageCode}&v=4`;
	// }
	// https://api.dbp4.org/bibles?&asset_id=$dbp-prod&key=1234&language_code=8076&v=4
	try {
		const response = yield call(request, requestUrl);
		const videoRes = yield call(request, videoRequestUrl);
		// console.log('getting bibles for the selector', response.data);
		// console.log('video response', videoRes);
		// Some texts may have plain text in the database but no filesets
		// This filters out all texts that don't have a fileset
		// console.log('response', response);
		const videos = videoRes.data.filter(
			(video) => video.abbr && video.language && video.language_id && video.iso,
		);

		const texts = response.data.filter(
			(text) =>
				text.language &&
				text.iso &&
				text.abbr &&
				(text.filesets[process.env.DBP_BUCKET_ID] &&
					text.filesets[process.env.DBP_BUCKET_ID].find(
						(f) =>
							f.type === 'audio' ||
							f.type === 'audio_drama' ||
							f.type === 'text_plain' ||
							f.type === 'text_format',
					)),
		);
		// console.log('videos', videos);
		// console.log('texts', texts);
		// Create map of videos for constant time lookup when iterating through the texts
		const videosMap = videos.reduce((a, c) => ({ ...a, [c.abbr]: c }), {});
		// console.log('videos map', videosMap);
		// Find any overlapping bibles between the videos and texts
		// Combine the filesets for only those overlapping bibles
		const mappedTexts = texts.map((text) => ({
			...text,
			filesets: videosMap[text.abbr]
				? [
						...text.filesets[process.env.DBP_BUCKET_ID].filter(
							(f) =>
								f.type === 'audio' ||
								f.type === 'audio_drama' ||
								f.type === 'text_plain' ||
								f.type === 'text_format',
						),
						...videosMap[text.abbr].filesets['dbp-vid'],
				  ] || []
				: text.filesets[process.env.DBP_BUCKET_ID].filter(
						(f) =>
							f.type === 'audio' ||
							f.type === 'audio_drama' ||
							f.type === 'text_plain' ||
							f.type === 'text_format',
				  ) || [],
		}));
		// console.log(texts);
		// console.log('mappedTexts', mappedTexts);

		yield put({ type: CLEAR_ERROR_GETTING_VERSIONS });
		yield put(loadTexts({ texts: mappedTexts }));
	} catch (error) {
		if (process.env.NODE_ENV === 'development') {
			console.error(error); // eslint-disable-line no-console
		} else if (process.env.NODE_ENV === 'production') {
			// const options = {
			// 	header: 'POST',
			// 	body: formData,
			// };
			// fetch('${process.env.BASE_API_ROUTE}/error_logging', options);
		}

		yield put({ type: ERROR_GETTING_VERSIONS });
	}
}

export function* getLanguages() {
	const requestUrl = `${process.env.BASE_API_ROUTE}/languages?key=${
		process.env.DBP_API_KEY
	}&v=4&asset_id=${
		process.env.DBP_BUCKET_ID
	}&has_filesets=true&asset_id=dbp-prod,dbp-vid`;

	try {
		const response = yield call(cachedFetch, requestUrl, {}, oneDay);
		// Sometimes the api returns an array and sometimes an object with the data key
		const languages = response.data || response;
		// languages.unshift({ name: 'ANY', iso: 'ANY', alt_names: [] });

		yield put(setLanguages({ languages }));
		yield put({ type: CLEAR_ERROR_GETTING_LANGUAGES });
		yield fork(getLanguageAltNames);
	} catch (error) {
		if (process.env.NODE_ENV === 'development') {
			console.error(error); // eslint-disable-line no-console
		}
		yield put({ type: ERROR_GETTING_LANGUAGES });
	}
}

function sortLanguagesByVname(a, b) {
	if (a.vernacular_name > b.vernacular_name) return 1;
	if (a.vernacular_name < b.vernacular_name) return -1;
	return 0;
}
// Second call for the more robust language data
export function* getLanguageAltNames() {
	const requestUrl = `${process.env.BASE_API_ROUTE}/languages?key=${
		process.env.DBP_API_KEY
	}&v=4&asset_id=${
		process.env.DBP_BUCKET_ID
	}&has_filesets=true&include_alt_names=true&asset_id=dbp-prod,dbp-vid`;
	try {
		const response = yield call(cachedFetch, requestUrl, {}, oneDay);
		const languageData = response.data || response;
		const languages = languageData
			.map((l) => {
				if (l.translations) {
					const altSet = new Set(
						Object.values(l.translations).reduce((a, c) => [...a, c], []),
					);
					return {
						...l,
						vernacular_name: l.autonym,
						alt_names: Array.from(altSet),
						englishName: l.name,
					};
				}
				return {
					...l,
					alt_names: [],
					vernacular_name: l.autonym,
					englishName: l.name,
				};
			})
			.sort(sortLanguagesByVname);
		// languages.unshift({ name: 'ANY', iso: 'ANY', alt_names: [] });
		// console.log('Done getting the alt names');
		yield put(setLanguages({ languages }));
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error(err); // eslint-disable-line no-console
		}
	}
}

// Individual exports for testing
export default function* defaultSaga() {
	yield takeLatest(GET_DPB_TEXTS, getTexts);
	yield takeLatest(GET_COUNTRY, getCountry);
	yield takeLatest(GET_LANGUAGES, getLanguages);
	yield takeLatest(GET_COUNTRIES, getCountries);
}
