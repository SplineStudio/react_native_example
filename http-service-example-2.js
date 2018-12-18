import { Toast } from 'native-base';
import { AsyncStorage } from 'react-native';
import I18n from '@locales/config';
import route from '@services/route';

function post(URL, BODY = {}, SESSION = true) {
    const HEADERS = { 'Accept': 'application/json', 'Content-Type': 'application/json' };
    const OPTIONS = {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify(BODY)
    }
    return request(URL, OPTIONS, SESSION);
}

function request(URL, OPTIONS, SESSION) {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem('session').then((session) => {
            let data = JSON.parse(OPTIONS.body);
            SESSION && session !== null ? data.session_id = session : null;
            OPTIONS.body = JSON.stringify(data);
            let timeout = setTimeout(() => {
                reject({ status: 408, statusText: I18n.t('ALERT.TIMEOUT') });
                Toast.show({ text: I18n.t('ALERT.TIMEOUT'), buttonText: "OK", type: "warning", duration: 5000 });
            }, 60000);
            fetch(URL, OPTIONS).then((response) => {
                if (response.status == 200) {
                    response.json().then((result) => {
                        if (result.code >= 0) {
                            clearTimeout(timeout);
                            resolve(result);
                        } else {
                            if (
                                result.message == 'No session' ||
                                result.message == 'user not found' ||
                                result.message == 'The session has expired' ||
                                result.message == 'USER_NOT_FOUND' ||
                                result.message == 'not have session_id'
                            ) {
                                clearTimeout(timeout);
                                Toast.show({
                                    text: I18n.t('ALERT.SESSION'),
                                    buttonText: "OK",
                                    type: "warning",
                                    duration: 100000
                                });
                                route.navigate('START')
                            } else {
                                clearTimeout(timeout);
                                if (typeof result.message == 'object') {
                                    let message = result.message.filter((item) => {
                                        if (item.lang == I18n.defaultLocale) {
                                            return item;
                                        }
                                    })
                                    reject({ code: result.code, message: message[0].descr });
                                } else {
                                    reject({ code: result.code, message: result.message });
                                }
                            }
                        }
                    })
                } else {
                    clearTimeout(timeout);
                    reject({ status: response.status, statusText: response.statusText });
                    Toast.show({ text: I18n.t('ALERT.SERVER_ERROR'), buttonText: "OK", type: "warning", duration: 5000 });
                }
            }).catch((error) => {
                clearTimeout(timeout);
                reject({ status: undefined, statusText: I18n.t('ALERT.NETWORK_ERROR') });
                Toast.show({ text: I18n.t('ALERT.NETWORK_ERROR'), buttonText: "OK", type: "warning", duration: 5000 });
                route.navigate('START');
            });
        });
    });
}

export default {
    post
}
