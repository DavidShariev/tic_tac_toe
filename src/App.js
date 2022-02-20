import "./style/main.scss";
import { useDispatch, useSelector } from "react-redux";
import Field from "./components/Field";
import SignIn from "./components/Signin";

function App() {
  const { users } = useSelector(state => state);
  const dispatch = useDispatch();
 
  return (
    <div className="App">
      { users.length > 0 ? <Field></Field> : <SignIn ></SignIn> }
    </div>
  );
}

export default App;
