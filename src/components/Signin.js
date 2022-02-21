import { Box, Typography, TextField, Button }  from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { disconnect, restart, set_users } from "../redux/actionCreators";
import socket from "../socket";
const SignIn = () => {

    let [userName, setUserName] = useState(" ");
    let [roomId, setRoomId] = useState(" ");

    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(false)

    const changeUserName = (e) => {
        setUserName(e.target.value);
    }

    const changeRoomId = (e) => {
        setRoomId(e.target.value);
    }

    const open = async () => {
        setIsLoading(true);

        userName = userName.trim();
        roomId = roomId.trim();

        if(userName && roomId){
            await socket.emit("ROOM:JOIN", { roomId, userName });
        }
    }

    const [loginError, setloginError] = useState("");
    useEffect(() => {
        socket.on("ROOM:USER_LOGIN", ({ name, roomId, users, error }) => {
            if (error) {
                console.log(error)
                setloginError(error)
                setRoomId("");
                setIsLoading(false);
                return;
            }
            dispatch(set_users(roomId, users, name));
        })
        socket.on("ROOM:DISCONNECT", ({ name, roomId, users, error}) => {
            dispatch(disconnect(roomId, users, name));
            dispatch(restart());
        })
    }, [])

    return(
        <Box sx={{
            width: 360,
            margin: "auto",
            marginTop: "100px",
            backgroundColor: "#fff",
            borderRadius: "5px",
            overflow: "hidden",
            paddingBottom: "25px"
        }}>
            <Box sx={{
                backgroundColor: "#359ff4",
                padding: "15px 20px",
            }}>
                <Typography variant="h6" color={"#fff"}>Регистация</Typography>
            </Box>

            <Typography variant="body2" height="20px" color={"error"} padding={"20px 20px 5px"}>
                {loginError}
            </Typography>

            <TextField
                id="outlined-required"
                label="User Name"
                defaultValue={userName}
                onChange={changeUserName}
                sx={{
                    width: "90%",
                    m: "5%",
                    mt: "40px"
                }}
            />
            <TextField
                id="outlined-required"
                label="Room ID"
                defaultValue={roomId}
                onChange={changeRoomId}
                sx={{
                    width: "90%",
                    m: "5%",
                    mt: "10px"
                }}
            />

            <Button variant="contained"
                sx={{
                    width: "90%",
                    padding: "15px",
                    m: "5%",
                    mt: "30px",
                }}
                onClick={open}
            >
                {isLoading ? "ВХОД..." : "ВОЙТИ"}
            </Button>
        </Box>
    )
}

export default SignIn;