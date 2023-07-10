import Link from 'next/link';
import Image from "next/image";
import { useRouter } from 'next/router'
import { useContext, useState } from "react";
import { UserContext } from "../../contexts/UserContext";

export default function Register() {

    const { user, setUser } = useContext(UserContext);
    const [registrationFailed, setRegistrationFailed] = useState(false);
    const router = useRouter();
  
    /*
      If I am correct this section is 'posting' your new user credentials into the database.
    */
    async function handleRegistration(event) {
      event.preventDefault();
      const { username, password } = event.target;
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      };
      
      const repsonse = await fetch(
        `http://localhost:3000/api/user?username=${username.value}&password=${password.value}&type=USER`,
        requestOptions);
  
      if (repsonse.status == 401) {
        setRegistrationFailed(true);
        return;
      }
      
      /* 
        This section was taken from LoginPage/index.js.
        When you create a user you will automatically sign in.
      */
      const requestOptionsGet = {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'mode': 'auth'
        },
      };

      const repsonseGet = await fetch(
        `http://localhost:3000/api/user?username=${username.value}&password=${password.value}`,
        requestOptionsGet);

      const json = await repsonseGet.json();
      setUser({name: username, token: json.user_id});

      localStorage.setItem('token', json.user_id);
      
      router.push('/');
    }
  
    return (
      <section className="logpage">
        <div className="icon">
          <Image src="/SynthMartIcon.png" alt="Synth Mart Icon" width={100} height={100} />
        </div>
        <h3>Please Create an Account.</h3>
        <form onSubmit={handleRegistration}>
          <div className="box">
            <input type="text"
              id="username"
              minLength={'4'}
              maxLength={'30'}
              autoComplete="off"
              required
            /><span></span>
            <label htmlFor="username">Username: </label></div>
  
          <div className="box">
            <input type="password"
              id="password"
              minLength={'8'}
              maxLength={'30'}
              autoComplete="off"
              required
            /><span></span>
            <label htmlFor="password">Password: </label></div>
            
          <p>{registrationFailed ? 'Unable to register new user' : ''}</p>
          <button type="submit" className="priotyButton">Create Account</button>

          <p className="logtext">Already have an account? <Link href="/register" className="loglink">Log In</Link></p>
          <p className="logtext"><Link href="/" className="loglink">Click to Return Home</Link></p>
        </form>
      </section>
    );
  }