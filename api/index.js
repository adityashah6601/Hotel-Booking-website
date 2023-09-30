const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User.js');
const NewPlace = require('./models/NewPlace.js');
const Booking =require('./models/Booking.js');
require('dotenv').config();
const app = express();
const cookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'fasfeffnbjnbokfbrj30r92jr4';
const multer = require('multer');
const fs = require('fs');
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname+'/uploads')); 
app.use(cors({
    credentials:true,
    origin:'https://hotel-booking-website-md5h.onrender.com'
}));

mongoose.connect(process.env.MONGO_URL);

function getUserDataFromReq(req){
  return new Promise((resolve, reject)=>{
  jwt.verify(req.cookies.token, jwtSecret, {}, async(err, userData) =>{
     if(err) throw err;
    resolve(userData);
    });
  });
}

app.get('/',(req,res)=> { 
    res.json('test ok');
});

app.post('https://hotel-booking-website-md5h.onrender.com/register', async (req,res) => {  
  const {name,email,Password}=req.body;
  const userDoc = await User.create({
      name,
      email,
      Password:bcrypt.hashSync(Password, bcryptSalt),
   });
   res.json(userDoc); 
});
app.post('https://hotel-booking-website-md5h.onrender.com/login', async (req,res) => {
    const{email,Password} =req.body;
    const userDoc = await User.findOne({email});
    if(userDoc){
    const passOk = bcrypt.compareSync(Password, userDoc.Password);
    if(passOk){

    jwt.sign({email:userDoc.email,
       id:userDoc._id,
       },
       jwtSecret,{},(err,token)=>{
      if(err) throw err;
      res.cookie('token',token).json(userDoc);
    }); 
    }
    else{
      res.status(422).json('pass not ok');
      }
    }
    else{
      res.json('not found');
    }
});
 app.get('https://hotel-booking-website-md5h.onrender.com/profile',(req,res) =>{
const{token} = req.cookies;
if(token){
  jwt.verify(token, jwtSecret, {}, async(err, userData) =>{
     if(err) throw err;
     const {name,email,_id} = await User.findById(userData.id);
     res.json({name,email,_id});
    });
}else{
  res.json(null);
}
  
 }) 
 app.post('https://hotel-booking-website-md5h.onrender.com/logout',(req,res) =>{
  res.cookie('token', '').json(true);
 })
 console.log({__dirname});
 
 app.post('https://hotel-booking-website-md5h.onrender.com/upload-by-link', async(req,res) =>{
  const{link} = req.body;
  const newName = 'photo'+ Date.now() + '.jpg';
 await imageDownloader.image({
  url:link,
  dest: __dirname + '/uploads/' + newName,
 });
  res.json(newName);
 });

 const photosMiddleware = multer({dest:'uploads/'});
 app.post('https://hotel-booking-website-md5h.onrender.com/upload',photosMiddleware.array('photos',100),(req,res) => {
const uploadedFiles = [];
  for(let i=0;i<req.files.length;i++){
  const {path,originalname} = req.files[i];
  const parts = originalname.split('.');
  const ext= parts[parts.length-1];
  const newPath = path + '.' +ext;
  fs.renameSync(path, newPath);
  uploadedFiles.push(newPath.replace('uploads/',''));
}
  res.json(uploadedFiles);
 });

 app.post('https://hotel-booking-website-md5h.onrender.com/places',(req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const{token} = req.cookies;
  const {title,address,addedPhotos,description,
  perks,extraInfo,checkIn,checkOut,maxGuests,price,
}=req.body;

  jwt.verify(token, jwtSecret, {}, async(err, userData) =>{
    if(err) throw err;
    const NewPlaceDoc = await NewPlace.create({
      owner:userData.id,price,
      title,address,photos:addedPhotos,description,
      perks,extraInfo,checkIn,checkOut,maxGuests,
    });
 res.json(NewPlaceDoc);
  })
 });
 app.get('https://hotel-booking-website-md5h.onrender.com/user-places', (req,res)=> {
  // mongoose.connect(process.env.MONGO_URL);
  const{token} = req.cookies;
  jwt.verify(token, jwtSecret, {}, async(err, userData) =>{
  const {id} = userData;
  res.json( await NewPlace.find({owner:id}) );
  });
});
app.get('https://hotel-booking-website-md5h.onrender.com/:id', async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {id} = req.params;
  res.json(await NewPlace.findById(id));
});
app.put('https://hotel-booking-website-md5h.onrender.com/places', async (req,res) => {
  const{token} = req.cookies;
  const {
  id,title,address,addedPhotos,description,
  perks,extraInfo,checkIn,checkOut,maxGuests,price,
}=req.body;
jwt.verify(token, jwtSecret, {}, async(err, userData) =>{
  const NewPlaceDoc = await NewPlace.findById(id); 
  if(userData.id === NewPlaceDoc.owner.toString()){
      NewPlaceDoc.set({
      title,address,photos:addedPhotos,description,
      perks,extraInfo,checkIn,checkOut,maxGuests,price,
      });
      await NewPlaceDoc.save();
      res.json('ok');
    }
});
});
app.get('https://hotel-booking-website-md5h.onrender.com/places', async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  res.json( await NewPlace.find() );
});
app.post('https://hotel-booking-website-md5h.onrender.com/api/bookings', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const userData = await getUserDataFromReq(req);
  const {
    place,checkIn,checkOut,numberOfGuests,name,phone,price,
  } = req.body;
  Booking.create({
    place,checkIn,checkOut,numberOfGuests,name,phone,price,
    user:userData.id,
  }).then((doc) => {
    res.json(doc);
  }).catch((err) => {
    throw err;
  });
});
app.get('https://hotel-booking-website-md5h.onrender.com/bookings',async (req,res) => { 
  const userData = await getUserDataFromReq(req);
 res.json( await Booking.find({user:userData.id}).populate('place') );
});
app.listen(https://booking-app-rgop.onrender.com);
//6:27:15 se dekhna h
//password for atlas booking-app
//3KL2qn9sMBIqCrnr
