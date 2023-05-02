import React, {useState, useContext} from "react";
import {UserContext} from "../context/UserContext";
import axios from "axios";
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';

function Login(props) {

  const [user, setUser] = useState({email:"", password:""});
  const {userContext, setUserContext} = useContext(UserContext);
  const [, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");


  function handleChange(event) {
    setUser({...user, [event.target.name]:event.target.value});
  }


  //Login handler
  async function loginAction(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(""); 
    try {
      const res = await axios.post(process.env.REACT_APP_API_ENDPOINT+"auth/login", JSON.stringify(user), {headers: { "Content-Type": "application/json" }});
      const data = res.data;
      console.log(data)
      setUserContext(prev => {
            return { ...prev, token: data.token, details: {...data.details} }
      })
    }
    catch(err) {
      setIsSubmitting(false);
      console.log(err);
      ({...err}.response.status === 401)?setError("User name or Password incorrect!"):setError("Other Error");
    }

  }

  //Initialize Database
  async function resetAction(event) {
    event.preventDefault();
    try {
      await axios.delete(process.env.REACT_APP_API_ENDPOINT+"order/deleteall");
      await axios.patch(process.env.REACT_APP_API_ENDPOINT+"product/resetinventory");
      setError("Database Reset!");
    } catch (err) {
      
    }
  }
  

  return (
    <div>
      {error}
    <div className="field grid">
      <label htmlFor="username" className="col-fixed" >User Name:</label>
        <div className="col">
        <InputText id="email" name="email" value={user.email} onChange={handleChange}/>
        </div>
    </div>
    <div className="field grid">
      <label htmlFor="password" className="col-fixed" >Password</label>
      <div className="col">
        <Password id="password" name="password" value={user.password} onChange={handleChange}/>
      </div>
    </div>
    <div className="field grid">
      <Button label="Login" className="p-button-rounded" icon="pi pi-check" iconPos="right" onClick={loginAction}/>
      <Button label="Reset DB" className="p-button-rounded p-button-warning" onClick={resetAction} />
    </div>
 
    </div>
  )
}

export default Login;
