import React, { useEffect, useState } from 'react';
import './App.css';
import LoginScreen from './Screens/LoginScreen';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import firebase from './firebaseConfig';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import ClubView from './Components/ClubView/ClubView';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Importa Routes
import HomeScreen from './Screens/HomeScreen';
import GameScreen from './Screens/GameScreen';
import ProfileScreen from './Screens/ProfileScreen';
import GroupScreen from './Screens/GroupScreen';
import EditScreen from './Screens/EditScreen';

const auth = getAuth(firebase);
const firestore = getFirestore(firebase);


function App() {
  
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {        
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    
    return () => unsubscribe();
  }, []);
  
  
  /*
  const collectionClub = collection(firestore, "videojuego");
  const datos: any = []
  
  const insert = async() => {
    try {
        datos.forEach( async(data: any) =>{
          const docRef = await addDoc(collectionClub, data);
        })

    } catch (error) {
        console.error('Error al insertar documento: ', error);
    }

  }
  */



  return (
    <Router>
      <Routes> 
        <Route path="/" element={<LoginScreen />} />
        <Route path="/home" element={<HomeScreen />} />        
        <Route path="/game" element={<GameScreen />} />    
        <Route path="/home/profile" element={<ProfileScreen />} />    
        <Route path="/home/profile/edit" element={<EditScreen />} />    
        <Route path="/home/group" element={<GroupScreen />} />    
      </Routes>
    </Router>
  );
}


export default App;
