import { collection, doc, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import firebase from "../firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";


const EditScreen = () => {
    const location = useLocation();

    const [user, setUser] = useState<any>(null); 
    const [userLoading, setUserLoading] = useState(true);    
    const [userData, setUserData] = useState<any>(null);
    const navigate = useNavigate();
    const [games, setGames] = useState<any>([]);

    useEffect(() => {
        const getUser = () => {
            try{
                const userData = location.state.user;
                setUser(userData); 
                setUserLoading(false);   
            }
            catch(e){
                console.log(e);
                navigate("/");
            }
        }

        getUser();
    }, [])

    useEffect(() => {
        const auth = getAuth(firebase);
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {                              
                setUserData(user); //logueado
            } else {            
                setUserData(null); //no logueado
                navigate("/");
            }
        });
        
        return () => unsubscribe();
    }, []);

    

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            
            console.log(user);
            const firestore = getFirestore(firebase);
            const userCollection = collection(firestore, "Usuario");
            const userQuery = query(userCollection, where('usuario', '==', user.usuario));
            const querySnapshot = await getDocs(userQuery);
            
            if (!querySnapshot.empty) {                
                const userDocSnapshot = querySnapshot.docs[0];
                const userId = userDocSnapshot.id;
                const data = userDocSnapshot.data();  


                let nombre = e.target.name.value;
                if(nombre == ""){
                    nombre = user.nombre;
                }
                let apellido = e.target.lastname.value;
                if(apellido == ""){
                    apellido = user.apellido;
                }
                let juego_favorito = e.target.favoriteGame.value;
                if(juego_favorito == ""){
                    juego_favorito = user.juego_favorito;
                }
                
                const newData = {
                    ...data,

                    nombre : nombre,
                    apellido : apellido,
                    juego_favorito : juego_favorito,
                }

                await updateDoc(doc(userCollection, userId), newData);
                alert("Cambios guardados con exito")
                navigate("/home", {state: {email: userData.email}});
                
            } else {
                console.log('No se encontró ningún usuario con ese nombre.');
            }
                
            
        }catch (error) {
            console.error('Error al actualizar el perfil:', error);
        }
    }

    const toHome = () => {
        console.log(userData.email);
        navigate("/home/profile", {state: {email: userData.email}});
    }

    useEffect(() => {
        const getGames = async () => {
            const firestore = getFirestore(firebase);
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
        <div>
                {userLoading ? 
                <p>Cargando</p>
                :
                <div>

                    <form onSubmit={handleSubmit}>
                        <fieldset>
                            <legend>Nombre</legend>
                            <input type="text" id="name" placeholder={user.nombre} autoComplete="off"></input>
                        </fieldset>
                        <fieldset>
                            <legend>Apellido</legend>
                            <input type="text" id="lastname" placeholder={user.apellido} autoComplete="off"></input>
                        </fieldset>
                        <fieldset>
                            <legend>Juego Favorito</legend>
                            <input type="text" id="favoriteGame" list="games-list" placeholder={user.juego_favorito} autoComplete="off"></input>
                            <datalist id="games-list">
                                {games.map((element: any, index: number) => (
                                    <option key={index} value={element.titulo}/>
                                ))}
                            </datalist>
                        </fieldset>
                        <input type="submit" value="Guardar Cambios" className="submitButton-Register"></input>
                    </form>
                    <button onClick={toHome}>Regresar</button>
                </div>
                }
        </div>
    )

}

export default EditScreen;