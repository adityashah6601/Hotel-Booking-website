import {Link, Navigate} from "react-router-dom";
import { useContext,useState } from "react";
import axios from 'axios';
import { UserContext } from "../UserContext";

export default function LoginPage(){    
    const[email, setEmail] = useState('');
    const[Password, setPassword] = useState('');
    const[redirect, setRedirect] = useState('');
    const{setUser}= useContext(UserContext);
    async function handleLoginSubmit(ev){
        ev.preventDefault(); 
        try{
          const {data} = await axios.post('/login',{email,Password}, {withCredentials:true});
          setUser(data);  
          alert('Login Successful') ; 
            setRedirect(true);
         }catch (e){
            alert('Login Failed');
        }
    }
    if(redirect){
       return <Navigate to ={'/'} /> 
    }
    return (
        <div className="mt-4 grow flex items-center justify-around">
        <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Login</h1>
            <form className="max-w-md mx-auto border" onSubmit={handleLoginSubmit}>
                <input type="email" 
                placeholder="your@email.com" 
                value={email} onChange={ev => setEmail(ev.target.value)}/>
                <input type="Password" 
                placeholder="password" 
                value={Password} onChange={ev => setPassword(ev.target.value)}/>
                <button className="primary">Login</button>
                 <div className="text-center py-2x text-gray-500">Don't have an account yet?
                 <Link  className=" underline text-black text-bold" to={'/register'}> Register Here!</Link>
                 </div>
            </form> 
            </div>
        </div>  
    ) 
}