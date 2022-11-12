import { View, Text, Image } from 'react-native';
import styles from '../styles/styles';
import { Google_API_Key } from '../constants/GoogleAPIKey';
import { useEffect, useState } from 'react';
import Button from './Button';

const SubRides = ({ path, setPath }) => {
    const [destination, setDestination] = useState('');
    const [time, setTime] = useState('');
    const [imageName, setImageName] = useState('');

    const update = async (coords) => {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords}&key=${Google_API_Key}`;
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

        if(path[1].name.includes('service') && path[1].name.includes('start')) {
            setImageName('car');
        } else if (path[1].name.includes('van') && path[1].name.includes('start')) {
            console.log(path[1].name)
            setImageName('van');
        } else  setImageName('walking');
    
    };

    useEffect(() => {
        if (path.length > 1) {
            update(path[1].location);
        }
    }, []);

    // remove first element from path array using setPath
    const removePath = () => {
        setPath(path.slice(1));
        update(path[2].location);
        console.log(path);
    };

    if (path.length > 1) {
        return (<>
            <View style={styles.subRides}>
                {imageName == "car" ? <Image source={require("../assets/images/car.png")} style={{width:40, height:30}} /> : 
                imageName == "van" ? <Image source={require("../assets/images/van.png")} style={{width:40, height:30}} /> : 
                <Image source={require("../assets/images/walking.png")} style={{width:20, height:40}} />}
                <View style={styles.subRidesText}>
                    <Text style={styles.subRidesTextDestination}>To {destination}</Text>
                    <Text style={styles.subRidesTextTime}>Arrive at {time}</Text>
                </View>
            </View>
            <Button text={'Change destination'} image={imageName} color={'#FF9E0D'} width={"100%"} onPress={removePath} />
            </>
        )
    }
};

export default SubRides;
