import PhotosUploader from "../PhotosUploader";
import Perks from "../perks";
import {useEffect, useState} from "react";
import AccountNav from "../AccountNav";
import axios from "axios";
import {Navigate, useParams} from "react-router-dom";

export default function PlacesFormPage(){
    const{id} = useParams();
    console.log({id});
    const[title,setTitle] = useState('');
    const[address,setAddress] = useState('');
    const[addedPhotos,setAddedPhotos] = useState([]);
    const[perks,setPerks] = useState([]);
    const[description,setDescription] = useState('');
    const[extraInfo,setExtraInfo] = useState('');
    const[checkIn,setCheckIn] = useState('');
    const[checkOut,setCheckOut] = useState('');
    const[maxGuests,setMaxGuests] = useState(1); 
    const[price,setPrice] = useState('100');
    const[redirect,setRedirect] = useState(false);
    useEffect(() => {
        if (!id) {
          return;
        }
        axios.get('http://localhost:4000/places/' + id)
.then(response => {
           const {data} = response;
           setTitle(data.title);
           setAddress(data.address);
           setAddedPhotos(data.photos);
           setDescription(data.description);
           setPerks(data.perks);
           setExtraInfo(data.extraInfo);
           setCheckIn(data.checkIn);
           setCheckOut(data.checkOut);
           setMaxGuests(data.maxGuests);
           setPrice(data.price);
        });
      }, [id])

function inputHeader(text){
    return(
    <h2 className="text-2xl mt-4">{text}</h2>
    );
}
function inputDescription(text)
{
    return(
        <p className="text-gray-500 text-sm">{text}</p>
    );
}   
function preInput(header,description){
    return(
        <>
            {inputHeader(header)}
            {inputDescription(description)}
        </>
    );
}
 async function saveNewPlace(ev){
ev.preventDefault();
const NewPlaceData = {
    title,address,addedPhotos, 
     description,perks,extraInfo,
     checkIn,checkOut,maxGuests,price,
};
if (id) {
    // update
    await axios.put('/places', {
      id, ...NewPlaceData
    });
    setRedirect(true);
  } else {
    // new place
    await axios.post('/places', NewPlaceData);
    setRedirect(true);
  }

}
 
    if(redirect){
        return <Navigate to= {'/account/places'} />
    }
    return( 
    <div>
    <AccountNav/>
        <form onSubmit={saveNewPlace}>
        {preInput('Title', 'Title for your place should be catchy as in advertisement')}
           <input type="text" value={title} onChange={ev => setTitle(ev.target.value) }placeholder="Title, for example: My Lovely House"/>
        {preInput('Address','Address to this place')}
            <input type="text" value={address} onChange={ev => setAddress(ev.target.value) } placeholder="address"/>
        {preInput('Photos','More = Better')}
           <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos}/>
        {preInput('Description','Description of the place')}

        <textarea value={description} onChange={ev => setDescription(ev.target.value) }/>
        {preInput('Perks','Select All the perks you want')}
        
        <div className="grid gap-2 grid-cols-2 md:grid-cols-3 ">
        <Perks selected={perks} onChange={setPerks}/>
            </div>
        {preInput('Extra Info','House Rules,etc')}
            <textarea value={extraInfo} onChange={ev => setExtraInfo(ev.target.value) }/>
            {preInput('CheckIn & CheckOut Times','add checkin and out time,remember to have some time for cleaning windows')}
     <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
        <div>
        <h3 className ="mt-2 -mb-1">Check in Time</h3>
        <input type="text" value={checkIn} onChange={ev => setCheckIn(ev.target.value) } placeholder = "14:00"/>
        </div>
        <div>
      <h3 className ="mt-2 -mb-1"> Check out Time</h3>
        <input type="text" value={checkOut} onChange={ev => setCheckOut(ev.target.value) }placeholder = "11:00"/>
        </div>
        <div><h3 className ="mt-2 -mb-1">Max Number Of Guests</h3>
        <input className="mb-1 mt-2 h-33 "type="number"value={maxGuests}
         onChange={ev => setMaxGuests(ev.target.value) }/>
        </div>
        <div><h3 className="mt-2 -mb-1">Price per night</h3>
            <input className="mb-1 mt-2 h-33"type="number" value={price}
        onChange={ev => setPrice(ev.target.value) }/>
        </div>
     </div>
     <div>
     <button className="primary my-4">Save</button>
     </div>
        </form>
        </div>);
}



