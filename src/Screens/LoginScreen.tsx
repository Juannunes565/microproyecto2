import { useState } from "react";
import Login from "../Components/Login/Login";
import Register from "../Components/Register/Register";



const LoginScreen = () => {

    const [register, setRegister] = useState(false);

    

    return (
      <div>
        { register ? 
            <div>
              <Register/>
              <p>Ya tienes cuenta?</p>
              <button onClick={() => {setRegister(!register)}}>Inicia sesion</button>
            </div>
           : 
            <div>
               <Login/>
               <p>No tienes cuenta?</p>
               <button onClick={() => {setRegister(!register)}}>Registrate</button>
            </div>}
      </div>
    );


}

export default LoginScreen;