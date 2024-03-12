import React, { useEffect, useState } from "react";
import "./MainBar.css"
import { useNavigate } from "react-router-dom";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import firebase from "../../firebaseConfig"

const auth = getAuth(firebase);

const MainBar = (props: any) => {
    const navigate = useNavigate();  

    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {                               
                setUser(user); //logueado
            } else {            
                setUser(null); //no logueado
                navigate("/");
            }
        });
        
        return () => unsubscribe();
    }, []);

    const showProfile = () => {
        navigate("/home/profile", {state: {email: user.email}});
    }

    return (
        <div className="container-MainBar">
            <div className="subcontainer1-MainBar">
                <p>Logo</p>
            </div>
            <div className="subcontainer2-MainBar">
                <button onClick={showProfile} className="profileButton-MainBar">{props.dataUser.usuario}</button>
            </div>
        </div>
    )
}

export default MainBar;


