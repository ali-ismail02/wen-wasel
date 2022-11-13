import { useEffect, useState } from 'react';
import Get from './Get';
import { jwt } from '../constants/JWT';

const GetFares = async (path) => {
    const response = await Get("user/get-fares", jwt);
    let price = 0;
    for(const trip of path){
        if(trip.name != "end_location"){
            if(trip.name.includes("service") && trip.name.includes("start")){
                price += response.data.fares[0].fare;
            }else if(trip.name.includes("van") && trip.name.includes("start")){
                price += response.data.fares[1].fare;
            }
        }
    }

    return price;
}

export default GetFares;