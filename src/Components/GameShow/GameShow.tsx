import { useNavigate } from "react-router-dom";
import "./GameShow.css"


const GameShow = (props: any) => {
    
    const navigate = useNavigate();    

    const redirectToGame: any = (element: any) => {
        navigate("/game", {state : {title: element}});
    }

    return (
        <div className="container-GameShow">
            {props.titles.map((element: any, index: any) => (
                <div onClick={() => redirectToGame(element)} className="subcontainer-GameShow" key={index}>
                    <p>{element}</p>
                </div>
            ))}            
        </div>
    );
}

export default GameShow;