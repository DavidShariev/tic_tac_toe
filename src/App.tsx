import { userInfo } from "os";
import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Signin from "./components/Signin";
import Field from "./components/Field";

import { set_users } from "./redux/actionCreators";

import { IinitialState } from "./redux/reducer";

const App: FC = () => {
    const data = useSelector<IinitialState, IinitialState>(state => state);
    const dispatch = useDispatch();

    useEffect(() => {
        
    }, []);
    console.log(data);

    return(<div className="App">
        { data.users.length > 0 ? <Field></Field> : <Signin></Signin>}
    </div>)
}

export default App;