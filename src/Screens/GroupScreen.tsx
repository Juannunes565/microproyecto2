import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./GroupScreen.css"
import firebase from "../firebaseConfig";
import { collection, doc, getDocs, getFirestore, updateDoc} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";



const GroupScreen = () => {

    //Estados
    const [club, setClub] = useState({ID: "", descripcion: "", nombre: "", videojuegos: []});
    const [user, setUser] = useState<any>({nombre: "", apellido: "", email: "", username: "", membresias: [], videojuego_preferido: ""})
    const [loadingUser, setLoadingUser] = useState<any>(true);
    const [userId, setUserId] = useState<any>({});
    const [games, setGames] = useState<any>([]);

    //Hooks
    const location = useLocation()
    const navigate = useNavigate();

    //Firestore
    const firestore = getFirestore(firebase);


    //====================Funciones==================
    //Redirigir si no esta logueado
    useEffect(() => {
        const redirectIfNotAuthenticated = () => {
            const auth = getAuth(firebase);
            onAuthStateChanged(auth, (user) => {
                if (!user) {
                    navigate("/");
                }
            });
        };
    
        redirectIfNotAuthenticated();
    }, [navigate]);

    //Funcion para saber si el usuario esta afiliado al grupo
    function estaAfiliado(): boolean {
        const membresiasUser: any[] = user.membresias;
        for (const element of membresiasUser) {
            if (element.ID === club.ID) {
                return true;
            }
        }
        return false;
    }


    //Obtener club
    try{
        useEffect(() => {
            const getClub = () => {
                try{
                    const clubData = location.state.club;
                    setClub(clubData);
                }
                catch(e){
                    navigate("/");
                }
            }
        
            getClub();
        }, [location.state.club]);
    }
    catch(e){
        navigate("/");
    }
    

    //Obtener usuario
    try{
        useEffect(() => {
            const getUser = async() => {
                try{
                    const email = location.state.user.email;
                    const userCollection = collection(firestore, "Usuario");
                    const querySnapshot = await getDocs(userCollection);
        
                    if (!querySnapshot.empty) {
                        for (const doc of querySnapshot.docs) {
                            const userData = doc.data();
                            if (userData.correo === email) {
                                setUser(userData);
                                setUserId(doc.id);
                                break; 
                            }
                        }               
                    }
                    setLoadingUser(false);
                    
                }
                catch(e){
                    navigate("/");
                }
            }
    
            getUser();
        }, [location.state.user])
    }
    catch(e){
        navigate("/");
    }

    //Obtener juegos del club
    useEffect(() => {
        const getGames = async() => {
            const gamesCollection = collection(firestore, "videojuego");
            const querySnapshot = await getDocs(gamesCollection);

            const games = []
            const clubGames: any[] = club.videojuegos;
            if (!querySnapshot.empty) {
                for (const doc of querySnapshot.docs) {
                    const gameData = doc.data();
                    for(const gameAux of clubGames){                        
                        if (gameData.ID === gameAux) {
                            games.push(gameData);                                                    
                        }
                    }
                }               
            }
            setGames(games);            
        }

        getGames()
    }, [club])

    //afiliarse a un grupo
    const afiliarse = async() => {
        if(!estaAfiliado()){
            user.membresias.push(club);
            setUser(user);
            const documentRef = doc(firestore, "Usuario", userId);
            await updateDoc(documentRef, user);             
            alert("Se ha afiliado al grupo exitosamente!");              
        }
    }

    //deafiliarse de un grupo
    const desafiliarse = async() => {
        if(estaAfiliado()){            
            for (let i = 0; i < user.membresias.length; i++) {
                const element = user.membresias[i];
                if(element.ID === club.ID){
                    user.membresias.splice(i, 1);
                }                
            }
            setUser(user);
            const documentRef = doc(firestore, "Usuario", userId);
            await updateDoc(documentRef, user);            
            alert("Se ha desafiliado del grupo exitosamente!");                   
        }
    }
    

    const toHome = () => {
        console.log(user.email)
        navigate("/home", {state: {email: location.state.user.email}})
    }




    return (
        <div>
            {loadingUser ? 
            <h1>Cargando</h1>
            :
            <div className="container-GroupScreen">
                <p>Bienvenido {user.nombre}!</p>
                <h1>{club.nombre}</h1>
                <h2>Descripcion</h2>
                <p>{club.descripcion}</p>
                <h2>Juegos</h2>
                <div className="gamesContainer-GroupScreen">
                    {games.map((element: any, index: number) => (
                        <p key={index}>{element.titulo}</p>
                    ))}
                </div>

                <button onClick={afiliarse}>{estaAfiliado() ? "Ya esta afiliado" : "Afiliarse"}</button>
                <button onClick={desafiliarse}>Desafiliarse</button>
                <button onClick={toHome}>Regresar</button>
            </div>
        }
            
        </div>
    )
}

export default GroupScreen;