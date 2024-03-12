
import './App.css';
import LoginScreen from './Screens/LoginScreen';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'; // Importa Routes
import HomeScreen from './Screens/HomeScreen';
import GameScreen from './Screens/GameScreen';
import ProfileScreen from './Screens/ProfileScreen';
import GroupScreen from './Screens/GroupScreen';
import EditScreen from './Screens/EditScreen';



function App() {


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
