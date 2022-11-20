import SubRides from "./SubRides";
import Booked from "./Booked";

const BookedState = ({ path, setPath, setState, setCenterMap, style, colorScheme }) => {

    return (
        <>
            <SubRides path={path} setPath={setPath} setState={setState} setCenter={setCenterMap} style={style} colorScheme={colorScheme} />
            <Booked status={1} style={style} />
        </>
    )
}

export default BookedState;