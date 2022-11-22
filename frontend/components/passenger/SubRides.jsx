import { useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';
import { Google_API_Key } from '../../constants/GoogleAPIKey';
import GetTripType from '../../hooks/passenger/GetTripType';
import UpdateBooking from '../../hooks/passenger/UpdateBooking';
import Button from '../Button';
import Icon from 'react-native-vector-icons/FontAwesome5';

const SubRides = ({ path, setPath, setState, setCenter, style, colorScheme }) => {
    const [destination, setDestination] = useState('');
    const [time, setTime] = useState('');
    const [imageName, setImageName] = useState('');
    const [buttonImage, setButtonImage] = useState('');
    const [color, setColor] = useState('');

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
        // add path[0].cost minutes to the current time
        time.setMinutes(time.getMinutes() + path[0].cost);
        // format the time to HH:MM
        time = time.toTimeString().split(' ')[0].slice(0, 5);
        setTime(time);

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
        {colorScheme == 'dark' ? setColor('#fff') : setColor('#000')}
        if (path.length > 1) {
            update(path);
        }
    }, [colorScheme]);

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
                    {imageName == "car" && <Icon name="shuttle-van" size={30} color={color} />}
                    {imageName == "van" && <Icon name="taxi" size={30} color={color} />}
                    {imageName == "walking" && <Icon name="walking" size={30} color={color} />}
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
