
import "./ClubView.css"
import { useNavigate } from "react-router-dom";


const ClubView = (props: any) => {
    

    const navigate = useNavigate();

    const toGroup = () => {
        navigate("/home/group", {state: {club: props.club, user: props.user}});
    }
    

    return (
        <div className="container-ClubView">
            <h4>{props.club.nombre}</h4>                    
            <button onClick={toGroup}>Ver grupo</button>
        </div>
    )
}

export default ClubView;