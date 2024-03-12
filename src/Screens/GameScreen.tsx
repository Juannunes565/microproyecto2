import { collection, getDocs, getFirestore } from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom"
import firebase from "../firebaseConfig"
import { useEffect, useState } from "react";
import {getAuth, onAuthStateChanged} from "firebase/auth";


const GameScreen = () => {
    const [loadingGame, setLoadingGame] = useState(true);
    const [game, setGame] = useState<any>([]);
    const [user, setUser] = useState<any>(null);
    const [titleGame, setTitleGame] = useState<any>(null);
    const navigate = useNavigate();  

    const location = useLocation()

    useEffect(() => {
        try{
            const state = location.state.title;
            setTitleGame(state);
        }
        catch(e){
            navigate("/");
        }
        
    }, [location, navigate]);

    const toHome = () => {        
        navigate("/home", {state: {email: user.email}})
    }

    useEffect(() => {
        const auth = getAuth(firebase);
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {           
                console.log(user.email)     
                setUser(user); //logueado
            } else {            
                setUser(null); //no logueado
                navigate("/");
            }
        });
        
        return () => unsubscribe();
    }, []);
                    
    
    useEffect(() => {
        const getGame = async () => {
            try {
                const firestore = getFirestore(firebase);
                const collectionUser = collection(firestore, "videojuego");
                const querySnapshot = await getDocs(collectionUser);
                const gameData = querySnapshot.docs
                    .filter((doc) => doc.data().titulo === titleGame)
                    .map((doc) => doc.data());
                
                setLoadingGame(false);
                setGame(gameData[0]); 
            } catch (error) {
                console.error("Error al obtener el juego:", error);
            }
        };

        getGame();
    }, [titleGame]);

    

    return (
        <div>
            {loadingGame ? 
            <h1>Cargando</h1>
            :
            <div>
                <h1>{game.titulo}</h1>
                <h3>Genero</h3>
                <p>{game.genero}</p>
                <h3>Descripcion</h3>
                <p>{game.descripcion}</p>
                <button onClick={toHome}>Regresar</button>
            </div>
            }

        </div>
    )
}

export default GameScreen;