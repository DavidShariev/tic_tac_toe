const { MOVE, SET_USERS, RESTART, WIN, DISCONNECT } = require("./actionTypes");

const initialState = {
    data: [
        { sym: null },
        { sym: null },
        { sym: null },
        { sym: null },
        { sym: null },
        { sym: null },
        { sym: null },
        { sym: null },
        { sym: null },
    ],
    name: null,
    users: [],
    roomId: null,
    sym: null,
    turn: null,
    score: [0, 0],
    winner: null,
}

const reducer = (state = initialState, action) => {
    switch(action.type){
        case MOVE: {

            return({
                ...state,
                data: state.data.map( (el, id) => {
                    if(id == action.cellId)
                        return { sym: action.sym}
                    return el
                }),
                turn: state.turn === state.users[0] ? 
                    state.users[1] : state.users[0],
            })
            break;
        }
        case WIN: {
            const sc = state.score;
            sc[action.winner]++;

            return ({
                ...state,
                winner: action.winner,
                score: sc
            })
        }
        case SET_USERS: {
            return({
                ...state,
                sym: state.users[0] ? "x" : "o",
                name: state.name ? state.name : action.name,
                users: action.users,
                turn: action.users[0],
                roomId: action.roomId
            })
            break;
        }
        case RESTART: {
            console.log("restart")
            return ({
                ...state,
                data: initialState.data,
                winner: null,
                turn: state.turn === state.users[0] ?
                    state.users[1] : state.users[0],
            })
        }
        case DISCONNECT: {
            console.log("diconnected");
            return ({
                ...state,
                sym: state.users[0] ? "x" : "o",
                name: state.name ? state.name : action.name,
                users: action.users,
                turn: action.users[0],
                roomId: action.roomId,
                score: [0, 0],

            })
        }
        default: return state;
    }
}

export default reducer;