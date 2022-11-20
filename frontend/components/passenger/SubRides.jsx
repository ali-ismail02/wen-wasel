import { useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';
import { Google_API_Key } from '../../constants/GoogleAPIKey';
import GetTripType from '../../hooks/passenger/GetTripType';
import UpdateBooking from '../../hooks/passenger/UpdateBooking';
import Button from '../Button';

const SubRides = ({ path, setPath, setState, setCenter, style, colorScheme }) => {
    const [destination, setDestination] = useState('');
    const [time, setTime] = useState('');
    const [imageName, setImageName] = useState('');
    const [buttonImage, setButtonImage] = useState('');

    // handling user's arrival at every route
    const update = async (path) => {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${path[1].location}&key=${Google_API_Key}`;
        await fetch(url)
            .then((response) => response.json())
            .then((data) => {
                setDestination(data.results[3].address_components[0].long_name);
            })
            .catch((error) => {
                console.error(error);
            });
        let time = new Date();
        // add path[0].time seconds to time
        time.setSeconds(time.getSeconds() + path[0].time);
        // display only hours and minutes
        setTime(time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        setTime(path[0].cost)

        if (GetTripType(path[0]) == 'service') {
            setImageName('car');
        } else if (GetTripType(path[0]) == 'van') {
            setImageName('van');
        } else setImageName('walking');


        if (path[1].name == "end_location") {
            setButtonImage('waypoint')
        } else if (GetTripType(path[1]) == 'service') {
            setButtonImage('car');
        } else if (GetTripType(path[1]) == 'van') {
            setButtonImage('van');
        } else setButtonImage('walking');

    };

    useEffect(() => {
        if (path.length > 1) {
            update(path);
        }
    }, []);

    // remove first element from path array using setPath
    const removePath = async () => {
        setCenter(true);
        if (path.length === 2) {
            setPath([]);
            setState('done');
            return;
        }

        if (path[0].reservation != undefined) {
            const response = await UpdateBooking(path[0].reservation);
        }

        if (path.length > 1) {
            setPath(path.slice(1));
            let path1 = path.slice(1)
            update(path1);
        }
    };

    if (path.length > 1) {
        return (
            <View style={style.bottomPopupContainer}>
                <View style={style.subRides}>
                    {imageName == "car" && colorScheme == "dark" ?
                        <Image source={require("../../assets/images/car_dark.png")} style={{ width: 40, height: 30 }} /> :
                        imageName == "car" && <Image source={require("../../assets/images/car.png")} style={{ width: 40, height: 30 }} />}
                    {imageName == "van" && colorScheme == "dark" ?
                        <Image source={require("../../assets/images/van_dark.png")} style={{ width: 40, height: 30 }} /> :
                        imageName == "van" && <Image source={require("../../assets/images/van.png")} style={{ width: 40, height: 30 }} />}
                    {imageName == "walking" && colorScheme == "dark" ?
                        <Image source={require("../../assets/images/walking_dark.png")} style={{ width: 20, height: 40 }} />:
                        imageName == "walking" && <Image source={require("../../assets/images/walking.png")} style={{ width: 20, height: 40 }} />}
                    <View style={style.subRideText}>
                        <Text style={style.subRideTextDestination}>To {destination}</Text>
                        <Text style={style.subRideTextTime}>Arrive at {time}</Text>
                    </View>
                </View>
                <Button text={'Change destination'} image={buttonImage} color={'#FF9E0D'} width={"100%"} onPress={removePath} style={style} />
            </View>
        )
    }
};

export default SubRides;
