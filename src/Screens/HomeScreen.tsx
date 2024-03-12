import React, { useEffect, useState } from "react";
import firebase from "../firebaseConfig"
import {getAuth} from "firebase/auth";
import {getFirestore, collection, getDocs} from "firebase/firestore";
import MainBar from "../Components/MainBar/MainBar";
import ClubView from "../Components/ClubView/ClubView";
import "./HomeScreen.css"
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import GameShow from "../Components/GameShow/GameShow";


const auth = getAuth(firebase);


const HomeScreen = () => {
    const [dataUser, setDataUser] = useState<any>({});
    const [loadingUser, setLoadingUser] = useState(true);
    const [loadingClubs, setLoadingClubs] = useState(true);
    const [loadingGames, setLoadingGames] = useState(true);
    const [elements, setElements] = useState<any>([]);   
    const [games, setGames] = useState<any>([]);
    const [searchTerm, setSearchTerm] = useState('');    
    const location = useLocation();
    const user = location.state;
    const navigate = useNavigate();

    useEffect(() => {
        const getDataUser = async () => {
            
            if (user != null && user.email != undefined) {
                
                try {
                    const firestore = getFirestore(firebase);
                    const collectionUser = collection(firestore, "Usuario");                    
                    const querySnapshot = await getDocs(collectionUser);
                    
                    for (const doc of querySnapshot.docs) {
                        const userData = doc.data();
                        if (userData.correo === user.email) {
                            setDataUser(userData);
                            break; 
                        }
                    }
                    setLoadingUser(false);
                } catch (e) {
                    console.error('Error obteniendo usuario: ', e);
                    setLoadingUser(false);
                }
            }
            else{
                navigate("/");
            }
        };
    
        const loadClubs = async () => {
            try {
                const firestore = getFirestore(firebase);
                const collectionClub = collection(firestore, "Club");
                const querySnapshot = await getDocs(collectionClub);
                const elementData = querySnapshot.docs
                    .filter((doc) => doc.data().nombre !== "")
                    .map((doc) => doc.data());

                setElements(elementData);
                setLoadingClubs(false);
            } catch (error) {
                console.error('Error cargando clubs: ', error);
                setLoadingClubs(false);
            }
        };

        const loadGames = async() => {
            try{
                const firestore = getFirestore(firebase);
                const collectionClub = collection(firestore, "videojuego");
                const querySnapshot = await getDocs(collectionClub);
                const gamesData = querySnapshot.docs.filter((doc) => doc.data().titulo !== "").map((doc) => doc.data());
                setGames(gamesData);
                setLoadingGames(false);
            }
            catch(e){
                console.error('Error cargando videojuegos: ', e);
                setLoadingClubs(false);
            }

        }
        
        getDataUser();
        loadClubs();
        loadGames();
    }, [user]);


    const handleInputChange = (event: any) => {
        setSearchTerm(event.target.value);
    }

    const [titles, setTitles] = useState([]);    
    useEffect(() => {

        const searchGame = () => {
            let titlesData: any = [];
            games.forEach((element: any) => {
                if (element.titulo.toLowerCase().startsWith(searchTerm.toLowerCase())) {
                    titlesData.push(element.titulo);
                }
            });
            setTitles(titlesData);
        };
    
        searchGame();
    }, [games, searchTerm]);
    


    
    return (
        <div>
            {loadingUser || (
                loadingClubs || (
                    loadingGames || (
            <div>
                <MainBar dataUser={dataUser} />
                <h1 className="h1-HomeScreen">Clubs de Videojuegos</h1>
                <div className="clubsContainer-HomeScreen">
                    {elements.map((element: any, index: any) => (
                        <ClubView club={element} user={user} index={index} key={index}/>
                    ))}
                </div>
                <h2>Videojuegos</h2>
                <form className="form-HomeScreen">
                    <div>
                        <input autoComplete="off" onChange={handleInputChange} id="game" className="searchGame-HomeScreen" placeholder="Busca un juego"></input>                        
                        <GameShow titles={titles}/>
                    </div>
                    
                </form>                
            </div>
                    )
                )
            )}
        </div>
    );
}

export default HomeScreen;