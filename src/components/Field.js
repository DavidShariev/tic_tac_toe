import { Box, Button, Grid, Typography } from "@mui/material"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { move, restart } from "../redux/actionCreators";
import socket from "../socket";

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
            && e.target.textContent === ""){
            const cellId = e.target.getAttribute("id");
            const sym = state.sym;
            await socket.emit("ROOM:MOVE", {roomId: state.roomId, cellId, sym})
            dispatch(move(cellId, sym));
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
        
    }, [])

    return(<Box sx={{
        width: 600,
        maxWidth: "90%",
        height: 600,
        m: "auto",
        mt: "150px", 
        backgroundColor: "#fff",
        borderRadius: "5px",
        overflow: "hidden",
        position: "relative"
    }}>
        <Box sx={{
            width: "100%",
            height: "100px",
            backgroundColor: "#359ff4",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 30px"
        }}>
            <Typography variant="h5" color="#fff" fontWeight="bold">
                {state.users[0]}
            </Typography>

            <Typography variant="h5" color="#fff" fontWeight="bold">
                {state.users[1]}
            </Typography>
        </Box>

        <Grid sx={{
            width: "330px",
            height: "330px",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            margin: "auto",
            backgroundColor: "#0276aa",
            alignContent: "space-between",
            mt: "35px"
        }}> 
            { state.data.map( (cell, id) => {
                return (<Box key={id} id={id}
                    onClick={cellClick}
                    sx={{
                        width: "32%",
                        height: "32%",
                        backgroundColor: "#fff",
                        cursor: "pointer",
                        textAlign: "center",
                        lineHeight: "100%"
                }}>
                    <Typography fontWeight={400} fontSize={"60px"} lineHeight={"100px"} color="#35baf6" fontWeight="bold">
                        {cell.sym}
                    </Typography>
                </Box>)
            })}
        </Grid>

        <Box sx={{
            width: "100%",
            height: "100px",
            backgroundColor: "#359ff4",
            display: "flex",
            position: "absolute",
            bottom: 0,
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 30px"
        }}>
            <Button variant="contained" onClick={onClickRestart}>Переиграть</Button>
        </Box>
    </Box>)
}

export default Field;