import { takeLatest, call, put } from 'redux-saga/effects';
import request from 'utils/request';
import {
	// LOAD_USER_DATA,
	USER_LOGGED_IN,
	// GET_USER_DATA,
	// SEND_LOGIN_FORM,
	SEND_SIGNUP_FORM,
	// UPDATE_PASSWORD,
	// RESET_PASSWORD,
	// DELETE_USER,
} from './constants';

// export function* getUserNotes({ userId }) {
// 	const requestUrl = `https://api.bible.build/users/${userId}/notes?key=${process.env.DBP_API_KEY}&v=4&pretty`;

// 	try {
// 		// const response = yield call(request, requestUrl);
// 		//
// 		// yield put('action', response);
// 	} catch (err) {
// 		if (process.env.NODE_ENV === 'development') {
// 			console.error(err); // eslint-ignore-line no-console
// 		}
// 	}
// }

// export function* getUserData({ userId }) {
// 	const requestUrl = `https://api.bible.build/users/${userId}?key=${process.env.DBP_API_KEY}&v=4&pretty`;

// 	try {
// 		// const response = yield call(request, requestUrl);
// 		// console.log(response);
// 		//
// 		// yield put(LOAD_USER_DATA, { data: 'data' });
// 	} catch (err) {
// 		if (process.env.NODE_ENV === 'development') {
// 			console.error(err); // eslint-ignore-line no-console
// 		}
// 	}
// }

export function* sendSignUpForm({ password, email, username }) {
	const requestUrl = `https://api.bible.build/users?key=${process.env.DBP_API_KEY}&v=4&pretty`;
	const data = new FormData();

	data.append('email', email);
	data.append('password', password);
	data.append('name', username);

	const options = {
		method: 'POST',
		body: data,
	};

	try {
		const response = yield call(request, requestUrl, options);

		if (response.success) {
			yield put(USER_LOGGED_IN);
		} else if (response.error) {
			yield put('user-login-failed', response.error.message);
		}
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error(err); // eslint-ignore-line no-console
		}
	}
}

// export function* sendLoginForm({ password, email, username }) {
// 	const requestUrl = `https://api.bible.build/users?key=${process.env.DBP_API_KEY}&v=4&pretty`;
// 	const options = {
// 		method: 'GET',
// 		body: {
// 			password,
// 			email,
// 			name,
// 		},
// 	};

// 	try {
// 		// const response = yield call(request, requestUrl, options);

// 		// if (response.data.user_id) {
// 		// 	yield put(USER_LOGGED_IN, response.data.user_id);
// 		// } else {
// 		// 	yield put('user-login-failed', response);
// 		// }
// 	} catch (err) {
// 		if (process.env.NODE_ENV === 'development') {
// 			console.error(err); // eslint-ignore-line no-console
// 		}
// 	}
// }

// export function* updatePassword() {
// 	const requestUrl = `https://api.bible.build/?key=${process.env.DBP_API_KEY}&v=4&pretty`;

// 	try {
// 		// const response = yield call(request, requestUrl);
// 		//
// 		// yield put('action', response);
// 	} catch (err) {
// 		if (process.env.NODE_ENV === 'development') {
// 			console.error(err); // eslint-ignore-line no-console
// 		}
// 	}
// }

// export function* resetPassword() {
// 	const requestUrl = `https://api.bible.build/?key=${process.env.DBP_API_KEY}&v=4&pretty`;

// 	try {
// 		// const response = yield call(request, requestUrl);
// 		//
// 		// yield put('action', response);
// 	} catch (err) {
// 		if (process.env.NODE_ENV === 'development') {
// 			console.error(err); // eslint-ignore-line no-console
// 		}
// 	}
// }

// export function* deleteUser({ userId, email, username }) {
// 	const requestUrl = `https://api.bible.build/?key=${process.env.DBP_API_KEY}&v=4&pretty`;

// 	try {
// 		// const response = yield call(request, requestUrl);
// 		//
// 		// yield put('action', response);
// 	} catch (err) {
// 		if (process.env.NODE_ENV === 'development') {
// 			console.error(err); // eslint-ignore-line no-console
// 		}
// 	}
// }

// Individual exports for testing
export default function* defaultSaga() {
	// yield takeLatest(GET_USER_DATA, getUserData);
	yield takeLatest(SEND_SIGNUP_FORM, sendSignUpForm);
	// yield takeLatest(SEND_LOGIN_FORM, sendLoginForm);
	// yield takeLatest(UPDATE_PASSWORD, updatePassword);
	// yield takeLatest(RESET_PASSWORD, resetPassword);
	// yield takeLatest(DELETE_USER, deleteUser);
}
