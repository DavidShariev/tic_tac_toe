const { SET_USERS, MOVE, RESTART, WIN, DISCONNECT } = require("./actionTypes");

export const set_users = ( roomId, users, name ) => {
    return ({
        type: SET_USERS,
        roomId,
        users,
        name
    })
}

export const move = (cellId, sym) => {
    return ({
        type: MOVE,
        cellId,
        sym
    })
}

export const win = (winner) => {
    return ({
        type: WIN,
        winner
    })
}

export const restart = () => {
    return ({
        type: RESTART

    })
}

export const disconnect = (roomId, users, name) => {
    return ({
        type: DISCONNECT,
        roomId,
        users,
        name
    })
}