const { SET_USERS, MOVE, RESTART } = require("./actionTypes");

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

export const restart = () => {
    return ({
        type: RESTART

    })
}