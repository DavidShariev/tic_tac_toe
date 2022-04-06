import { stringify } from "querystring";
import { SET_USERS, MOVE, RESTART, WIN, DISCONNECT } from "./actionsTypes";

export const win = (winner: number): {
    type: string,
    winner: number
} => {
    return ({
        type: WIN,
        winner
    })
};

export const move = (
    cellId: number,
    sym: string
): {
    type: string,
    cellId: number,
    sym: string
} => {
    return {
        type: MOVE,
        cellId,
        sym
    }
}

export const set_users = (roomId: string, users: string[], name: string): 
{
    type: string,
    roomId: string,
    users: string[],
    name: string
} => {
    return {
        type: SET_USERS,
        roomId,
        users,
        name
    }
}

export const disconnect = (roomId: string, users: string[], name: string):
{
    type: string,
    roomId: string,
    users: string[],
    name: string
} => {
    return {
        type: DISCONNECT,
        roomId,
        users,
        name
    }
}

export const restart = (): {type: string} => {
    return ({
        type: RESTART

    })
}