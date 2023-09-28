// import Image from "./Image.jsx";

export default function PlaceImg({NewPlace,index=0,className=null}) {
  if (!NewPlace.photos?.length) {
    return '';
  }
 
  if (!className) {
    className = 'object-cover';
  }
  return (
     
    <img src={NewPlace.photos[index]} alt=""/>
    
    );
}