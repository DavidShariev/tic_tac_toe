
import { Box, Typography } from "@mui/material"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { move, restart, win } from "../redux/actionCreators";
import socket from "../socket";

let clicked = [];

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

const Field = () => {

    const state = useSelector( state => state)
    console.log(state);
    
    
    const dispatch = useDispatch();

    const onClickRestart = async () => {
        await socket.emit("ROOM:RESTART", { roomId: state.roomId});
        dispatch(restart());
    }

    const cellClick = async (e) => {
        if(state.turn === state.name 
        && state.users.length > 1
        && e.target.textContent === "" && !state.winner){
            const cellId = e.target.getAttribute("id");
            const sym = state.sym;
            await socket.emit("ROOM:MOVE", {roomId: state.roomId, cellId, sym})
            await dispatch(move(cellId, sym));

            clicked.push(+cellId)
            winCollection.forEach(arr => {
                if(clicked.indexOf(arr[0]) < 0)
                    return
                if(clicked.indexOf(arr[1]) < 0)
                    return
                if(clicked.indexOf(arr[2]) < 0)
                    return
                const winnerID = state.name === state.users[0] ? 0 : 1;
                dispatch(win(winnerID));
                alert("Ты победил");
                clicked = [];
                socket.emit("ROOM:WIN", {roomId: state.roomId});
            })
        }else if(state.users.length <= 1){
            alert("Дождитесь опонента");
        }else if(state.turn !== state.name){
            alert("ход опонента")
        }
        
    };
    useEffect(() => {
        socket.on("ROOM:RESTART", ({ roomId }) => {
            console.log("restratign")
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

    return(
        <Box className="game" marginRight={"auto"} marginLeft={"auto"}>
            <Typography mb={"40px"} className="game__title" variant="h2" fontFamily={"Indie Flower"}>
                tic tac toe
            </Typography>
            <Box className="header" sx={{display: "flex", justifyContent: "space-between"}}>
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
                {state.data.map((cell, id) => {
                    return (<div key={id} id={id} className="cell"
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

export default Field;