import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Indexpage(){
    const[places,setPlaces] =useState([]);
    useEffect(()=>{
        axios.get('/places').then(response =>{
           setPlaces( response.data);
        });
    }, []);
    return(
    <div className="mt-8 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-3" >
        {places.length > 0 && places.map(place => (
            <Link to ={'/place/'+place._id}>
        <div>
        {place.photos?.[0] && (
            <img className="rounded-2xl object-cover aspect-square" src={'http://localhost:4000/uploads/' + place.photos?.[0]} alt=""/>
        )}
        <h3 className="text-sm text-black-500">{place.title}</h3>
        <h2 className="font-bold">{place.address}</h2>
        <span className="font-bold">₹{place.price}</span> per night
          
        </div>
        </Link>
     ))}
     </div>
   );
   }