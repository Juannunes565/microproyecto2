import { collection, getDocs, getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import firebase from "../firebaseConfig"
import { getAuth, onAuthStateChanged } from "firebase/auth";

const ProfileScreen = () => {
    const location = useLocation();
    
    const [user, setUser] = useState<any>(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const [email, setEmail] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        try{
            const state = location.state.email;
            setEmail(state);
        }
        catch(e){
            navigate("/");
        }
        
    }, [location, navigate]);


    useEffect(() => {
        const auth = getAuth(firebase);
        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
            if (authUser) {           
                setUser(authUser); // Establece el usuario autenticado
            } else {            
                    
                setUser(null); // No hay usuario autenticado
            }
        });
        
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const getUser = async() => {
            try {
                const firestore = getFirestore(firebase);
                const collectionUser = collection(firestore, "Usuario");                    
                const querySnapshot = await getDocs(collectionUser);
                
                for (const doc of querySnapshot.docs) {
                    const userData = doc.data();
                    if (userData.correo === email) {
                        setUser(userData);
                        break; 
                    }
                }
                setLoadingUser(false);
            } catch (e) {
                console.error('Error obteniendo usuario: ', e);
                setLoadingUser(false);
            }
        }

        
        getUser();
        
    }, [email, user])

    const handleLogout = () => {
        const auth = getAuth(firebase);
        auth.signOut()
        .then(() => {
            console.log('Sesión cerrada exitosamente');
            navigate("/");
        })
        .catch((error) => {
            console.error('Error al cerrar sesión:', error);
        });
    }

    const toEdit = () => {
        navigate("/home/profile/edit", {state : {user: user}});
    }

    return (
        <div>
            {loadingUser ? 
            <h1>Cargando</h1>
            :
            <div>
                <h1>Perfil</h1>
                <p>Nombre: {user.nombre}</p>
                <p>Apellido: {user.apellido}</p>
                <p>Usuario: {user.usuario}</p>
                <p>Correo: {user.correo}</p>
                <p>Juego favorito: {user.juego_favorito}</p>
                <button onClick={() => navigate("/home", {state:{email: email}})}>Regresar</button>
                <button onClick={handleLogout}>Cerrar sesión</button>
                <button onClick={toEdit}>Editar perfil</button>
            </div>
            }
        </div>
    )
}

export default ProfileScreen;
