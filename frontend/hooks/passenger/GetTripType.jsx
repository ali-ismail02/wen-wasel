const GetTripType = (trip) => {
    if (trip.name.includes('service') && trip.name.includes('start')) {
        return 'service';
    } else if (trip.name.includes('van') && trip.name.includes('start')) {
        return 'van';
    } else return 'walking';
};

export default GetTripType;