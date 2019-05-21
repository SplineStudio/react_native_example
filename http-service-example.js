/** @flow */
import { Toast } from 'native-base'
import AsyncStorage from '@react-native-community/async-storage'
import i18n from '@services/locale'

function post(URL: string, BODY: any = {}, SESSION: boolean = true): any {
	const HEADERS = { Accept: 'application/json', 'Content-Type': 'application/json' }
	const OPTIONS = {
		method: 'POST',
		headers: HEADERS,
		body: JSON.stringify(BODY),
	}
	return request(URL, OPTIONS, SESSION)
}

function get(URL: string, SESSION: boolean = false): any {
	const HEADERS = { Accept: 'application/json', 'Content-Type': 'application/json' }
	const OPTIONS = {
		method: 'GET',
		headers: HEADERS,
	}
	return request(URL, OPTIONS, SESSION)
}

function request(URL: string, OPTIONS: any, SESSION: boolean): any {
	return new Promise((resolve: any, reject: any) => {
		AsyncStorage.getItem('session').then((session: any) => {
			if (OPTIONS.method === 'POST') {
				const data = JSON.parse(OPTIONS.body)
				SESSION && session !== null ? (data.session_id = session) : null
				OPTIONS.body = JSON.stringify(data)
			}
			const timeout = setTimeout(() => {
				reject({ status: -408, statusText: i18n.t('ALERT.TIMEOUT') })
				Toast.show({ text: i18n.t('ALERT.TIMEOUT'), buttonText: 'OK', type: 'warning', duration: 5000 })
			}, 60000)
			fetch(URL, OPTIONS)
				.then((response: any) => {
					if (response.status === 200) {
						response.json().then((result) => {
							if (result.code >= 0) {
								clearTimeout(timeout)
								resolve(result)
							} else {
								clearTimeout(timeout)
								reject({ code: result.code, message: result.message })
							}
						})
					} else {
						clearTimeout(timeout)
						reject({ status: response.status, statusText: response.statusText })
						Toast.show({ text: i18n.t('ALERT.SERVER_ERROR'), buttonText: 'OK', type: 'warning', duration: 5000 })
					}
				})
				.catch(() => {
					clearTimeout(timeout)
					reject({ status: -408, statusText: i18n.t('ALERT.NETWORK_ERROR') })
					Toast.show({ text: i18n.t('ALERT.NETWORK_ERROR'), buttonText: 'OK', type: 'warning', duration: 5000 })
				})
		})
	})
}

export default {
	post,
	get,
}
