import React, { useEffect, useState } from "react";
import "./Register.css";
import firebase from "../../firebaseConfig";
import {getAuth, createUserWithEmailAndPassword} from "firebase/auth";
import {getFirestore, collection, addDoc, getDocs} from "firebase/firestore";

const auth = getAuth(firebase);

const db = getFirestore(firebase);
const collectionRef = collection(db, "Usuario");

const Register = () => {

    const [games, setGames] = useState<any>([]);

    const autentication = async(e: any) => {
        e.preventDefault();
        const data = {
            nombre : e.target.name.value,
            apellido : e.target.lastname.value,
            juego_favorito : e.target.favoriteGame.value,
            usuario : e.target.username.value,
            correo : e.target.email.value,
            membresias : []
        }

        try{
            await createUserWithEmailAndPassword(auth, e.target.email.value, e.target.password.value);
            await addDoc(collectionRef, data);
            alert("Registrado con exito!")
        }
        catch(e){
            console.log(e);
        }

    }

    useEffect(() => {
        const getGames = async () => {
            const firestore = db;
            const gamesCollection = collection(firestore, "videojuego");
            const querySnapshot = await getDocs(gamesCollection);
    
            const gamesList: any[] = [];
            for (const doc of querySnapshot.docs) {
                const gameData = doc.data();
                gamesList.push(gameData);
            }
            setGames(gamesList);        
        }
    
        
        getGames();
    }, []);
    

    return (
        <div className="container-Register">
            <form onSubmit={autentication} className="form-Register">
                <fieldset>
                    <legend>Nombre</legend>
                    <input type="text" id="name" autoComplete="off"></input>
                </fieldset>
                <fieldset>
                    <legend>Apellido</legend>
                    <input type="text" id="lastname" autoComplete="off"></input>
                </fieldset>
                <fieldset>
                    <legend>Juego Favorito</legend>
                    <input type="text" id="favoriteGame" list="games-list" autoComplete="off"></input>
                    <datalist id="games-list">
                        {games.map((element: any, index: number) => (
                            <option key={index} value={element.titulo}/>
                        ))}
                    </datalist>

                </fieldset>
                <fieldset>
                    <legend>Nombre de usuario</legend>
                    <input type="text" id="username" autoComplete="off"></input>
                </fieldset>
                <fieldset>
                    <legend>Correo electronico</legend>
                    <input type="text" id="email" autoComplete="off"></input>
                </fieldset>
                <fieldset>
                    <legend>Contraseña</legend>
                    <input type="text" id="password" autoComplete="off"></input>
                </fieldset>
                <input type="submit" value="Registrarse" className="submitButton-Register" autoComplete="off"></input>
            </form>            
        </div>
    )
}

export default Register;