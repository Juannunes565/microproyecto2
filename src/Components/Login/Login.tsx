import React, { useState } from "react";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import firebase from "../../firebaseConfig";
import {getFirestore, collection, addDoc} from "firebase/firestore";
import "./Login.css"
import { useNavigate } from "react-router-dom";

const auth = getAuth(firebase);

const db = getFirestore(firebase);
const collectionRef = collection(db, "Usuario");

const Login = () => {

    const navigate = useNavigate();

    const autentication = async(e: any) => {
        e.preventDefault();
        const emailValue = e.target.email.value;
        const passwordValue = e.target.password.value;
        try{
            await signInWithEmailAndPassword(auth, emailValue, passwordValue);            
            navigate("/home", {state : {email: emailValue}});
            alert("Sesion iniciada con exito!");
        }
        catch(e){
            alert("Usuario no registrado");
        }
    }
    
    return (
        <div className="container-Login">
            <form onSubmit={autentication} className="form-Login">                
                <fieldset>
                    <legend>Correo electronico</legend>
                    <input type="text" id="email" autoComplete="off"></input>
                </fieldset>
                <fieldset>
                    <legend>Contraseña</legend>
                    <input type="password" id="password" autoComplete="off"></input>
                </fieldset>
                <input type="submit" value="Iniciar sesion" className="submitButton-Login" autoComplete="off"></input>
            </form>            
        </div>
    )
}




export default Login;