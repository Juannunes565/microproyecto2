import { useEffect, useState } from "react";
import firebase from "../firebaseConfig";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import React from "react";
import HomeScreen from "./HomeScreen";
import Login from "../Components/Login/Login";
import Register from "../Components/Register/Register";


const auth = getAuth(firebase);

const LoginScreen = () => {

  
    const [user, setUser] = useState<any>(null);
    const [register, setRegister] = useState(false);

    
    useEffect(() => {
      onAuthStateChanged(auth, (userFirebase)=>{
          if(userFirebase){
              setUser(userFirebase);
          }
          else{
              setUser(null);
          }
      });
      
    })
    

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