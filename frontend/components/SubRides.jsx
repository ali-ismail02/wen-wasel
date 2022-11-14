import { View, Text, Image } from 'react-native';
import styles from '../styles/styles';
import { Google_API_Key } from '../constants/GoogleAPIKey';
import { useEffect, useState } from 'react';
import Button from './Button';
import GetTripType from '../hooks/GetTripType';
import UpdateBooking from '../hooks/UpdateBooking';

const SubRides = ({ path, setPath }) => {
    const [destination, setDestination] = useState('');
    const [time, setTime] = useState('');
    const [imageName, setImageName] = useState('');
    const [buttonImage, setButtonImage] = useState('');

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
            console.log(path.length)
            update(path);
        }
    }, []);

    // remove first element from path array using setPath
    const removePath = async () => {
        console.log(path[0].reservation)
        if(path[0].reservation != undefined){
            console.log("hello")
            const response = await UpdateBooking(path[0].reservation);
            console.log(response);
        }

        if (path.length > 1) {
            setPath(path.slice(1));
            let path1 = path.slice(1)
            update(path1);
        }
    };

    if (path.length > 1) {
        return (
            <View style={styles.bottomPopupContainer}>
                <View style={styles.subRides}>
                    {imageName == "car" ? <Image source={require("../assets/images/car.png")} style={{ width: 40, height: 30 }} /> :
                        imageName == "van" ? <Image source={require("../assets/images/van.png")} style={{ width: 40, height: 30 }} /> :
                            <Image source={require("../assets/images/walking.png")} style={{ width: 20, height: 40 }} />}
                    <View style={styles.subRideText}>
                        <Text style={styles.subRideTextDestination}>To {destination}</Text>
                        <Text style={styles.subRideTextTime}>Arrive at {time}</Text>
                    </View>
                </View>
                <Button text={'Change destination'} image={buttonImage} color={'#FF9E0D'} width={"100%"} onPress={removePath} />
            </View>
        )
    }
};

export default SubRides;
