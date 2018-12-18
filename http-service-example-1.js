
/**
 * @param { string } url API link
 * @param { boolean } token if token does't need set false
 */
export const httpGet = (url, token) => {
    const defaultHeaders = {
        Accept: "application/json",
        "Content-Type": "application/json"
    };
    const OPTIONS = {
        method: "GET",
        headers:
            token
                ? {
                    ...defaultHeaders,
                    Authorization: `JWT ${token}`
                }
                : { ...defaultHeaders }
    };
    return sendRequest(url, OPTIONS);
};

/**
 *
 * @param { string } url API link
 * @param { Object } body parameters
 * @param { boolean } token if token does't need set false
 * @param { boolean } formData if we send media data set true (default false)
 */
export const httpPost = (url, body, token, formData) => {
    const defaultHeaders = {
        "Content-Type": !formData ? "application/json" : "application/x-www-form-urlencoded"
    };
    const OPTIONS = {
        method: "POST",
        headers:
            token
                ? {
                    ...defaultHeaders,
                    Authorization: `JWT ${token}`
                }
                : { ...defaultHeaders },
        body: body
    };

    return sendRequest(url, OPTIONS);
};
/**
 * @param { string } url API link
 * @param { Object } OPTIONS parameters for configuring request
 */
function sendRequest(url, OPTIONS) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject({ code: 408, statusText: "Request Timeout" });
        }, 45000);
        fetch(url, OPTIONS).then(response => {
            if (response.status >= 200 && response.status < 300) {
                response.json().then(body => {
                    resolve({
                        body,
                        status: response.status,
                        statusText: response.statusText
                    });
                });
            } else {
                reject({
                    body: {},
                    code: parseInt(`${response.status}`)
                });
            }
        });
    });
}

