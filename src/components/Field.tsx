import React from 'react'
import { FC } from 'react'

import { Box, Typography } from "@mui/material"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { move, restart, win } from "../redux/actionCreators";
import socket from "../socket";
import { IinitialState } from '../redux/reducer';

let clicked: number[] = [];

const winCollection = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

const Field: FC = () => {

  const state = useSelector<IinitialState, IinitialState>( state => state);
  const dispatch = useDispatch();

  const onClickRestart = async () => {
    await socket.emit("ROOM:RESTART", { roomId: state.roomId });
    clicked = [];
    dispatch(restart());
  }

  const cellClick = async (e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as Element;
    if (state.turn === state.name
      && state.users.length > 1
      && target.textContent === "" && !state.winner) {
      const cellId: number | null = Number(target.getAttribute("id"));
      const sym: string | null = state.sym;
      await socket.emit("ROOM:MOVE", { roomId: state.roomId, cellId, sym })
      
      if(cellId !== undefined){
        if(sym !== null) await dispatch(move(cellId, sym));
        clicked.push(cellId)
      }
     

      console.log(clicked)
      winCollection.forEach(arr => {
        if (clicked.indexOf(arr[0]) < 0)
          return
        if (clicked.indexOf(arr[1]) < 0)
          return
        if (clicked.indexOf(arr[2]) < 0)
          return
        const winnerID = state.name === state.users[0] ? 0 : 1;
        dispatch(win(winnerID));
        alert("Ты победил");
        clicked = [];
        socket.emit("ROOM:WIN", { roomId: state.roomId });
      })
    } else if (state.users.length <= 1) {
      alert("Дождитесь опонента");
    } else if (state.turn !== state.name) {
      alert("ход опонента")
    }

  };


  useEffect(() => {
    socket.on("ROOM:RESTART", ({ roomId }) => {
      console.log("restratign")
      clicked = []
      dispatch(restart());
    })
    socket.on("ROOM:MOVE", ({ cellId, sym }) => {
      dispatch(move(cellId, sym));
    });
    socket.on("ROOM:ENEMY_WIN", () => {
      alert("Опонент победил");
      clicked = [];
      const winnerID = state.name === state.users[0] ? 1 : 0;
      dispatch(win(winnerID))
    })
  }, [])

  return (
    <Box className="game" marginRight={"auto"} marginLeft={"auto"}>
      <Typography mb={"40px"} className="game__title" variant="h2" fontFamily={"Indie Flower"}>
        tic tac toe
      </Typography>
      <Box className="header" sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography color={"#f81c81"} className="game__user game__user--x" variant="h5" fontFamily={"Indie Flower"}>
          {state.users[0]}: {state.score[0]}
        </Typography>
        <Typography color={"#55b3f9"} className="game__user game__user--y" variant="h5" fontFamily={"Indie Flower"}>
          {state.score[1]} :{state.users[1] ? state.users[1] : "not_playing"}
        </Typography>
      </Box>
      <Box className="field" sx={{
        width: 460,
        height: 400,
        borderRadius: "5px",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "space-between",
        paddingLeft: "10px"
      }}>
        {state.data.map((cell, id: number) => {
          return (<div key={id} id={String(id)} className="cell"
            style={{
              width: "30%",
              height: "30%",
              textAlign: "center",
              lineHeight: "140%",
              fontSize: "100px",
              color: cell.sym === "x" ? "#f81c81" : "#55b3f9",
            }}
            onClick={cellClick}
          >
            {cell.sym}
          </div>)
        })}

      </Box>

      <button className="repeact" onClick={onClickRestart}>
        repeat
      </button>

    </Box>

  )
}

export default Field