import { urls } from "../constants/urls";
export const RETURN_DATA = 'socket/RETURN_DATA';

const initialState = {
    status: 0,
    products: [],
    message: "",
    total: 0,
};

export default (state = initialState, action) => {

    switch (action.type) {
        case RETURN_DATA:
            return Object.assign({}, { ...state, ...action.socket });
        default:
            return state;
    }
}

export const getSocket = (token, orderId) => async dispatch => {
    let socket = new WebSocket(urls.socket);
    let message = {
        orderId: orderId,
        token: token
    };
    socket.onopen = () => {
        socket.send(JSON.stringify(message));
        dispatch(returnData());
    };
    socket.onclose = (event) => {
        if (event.wasClean) { /*do something*/ } else { /*do something*/ }
    };

    socket.onmessage = (event) => {
        dispatch(returnData(JSON.parse(event.data).data));
    };
    socket.onerror = (event) => { /*do something on error*/ };
}

export const returnData = (socket) => ({
    type: RETURN_DATA, socket
});
