import SubRides from "./SubRides";
import Booked from "./Booked";

const BookedOrNoBookingState = ({ path, setPath, setState, setCenterMap, style, colorScheme, status }) => {

    return (
        <>
            <SubRides path={path} setPath={setPath} setState={setState} setCenter={setCenterMap} style={style} colorScheme={colorScheme} />
            <Booked status={status} style={style} />
        </>
    )
}

export default BookedOrNoBookingState;