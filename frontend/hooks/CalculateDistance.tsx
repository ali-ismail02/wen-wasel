// Calculate distance between two geo points in many units 
const calculateDistance = (start_location: string, end_location: string, unit: string) => {
    const lat1 = parseFloat(start_location.split(",")[0]);
    const lon1 = parseFloat(start_location.split(",")[1]);
    const lat2 = parseFloat(end_location.split(",")[0]);
    const lon2 = parseFloat(end_location.split(",")[1]);

    if ((lat1 === lat2) && (lon1 === lon2)) {
        return 0;
    }
    else {
        const radlat1 = Math.PI * lat1 / 180;
        const radlat2 = Math.PI * lat2 / 180;
        const theta = lon1 - lon2;
        const radtheta = Math.PI * theta / 180;
        let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit === "K") { dist = dist * 1.609344 }
        if (unit === "N") { dist = dist * 0.8684 }
        return dist;
    }
}

export default calculateDistance; 