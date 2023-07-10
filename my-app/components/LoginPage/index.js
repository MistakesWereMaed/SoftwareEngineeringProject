import Link from 'next/link';
import Image from "next/image";
import { useRouter } from 'next/router'
import { useContext, useState } from "react";
import { UserContext } from "../../contexts/UserContext";


export default function Login() {

  const { user, setUser } = useContext(UserContext);
  const [loginFailed, setLoginFailed] = useState(false);
  const router = useRouter();

  async function handleLogin(event) {
    event.preventDefault();
    const { username, password } = event.target;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'mode': 'auth'
      },
    };
    const repsonse = await fetch(
      `http://localhost:3000/api/user?username=${username.value}&password=${password.value}`,
      requestOptions);

    if (repsonse.status == 401) {
      setLoginFailed(true);
      return;
    }

    const json = await repsonse.json();
    setUser({ name: username, token: json.user_id, type: json.user_type });

    localStorage.setItem('token', json.user_id);

    router.push('/');
  }

  return (
    <section className="logpage">
      <div className="icon">
        <Image src="/SynthMartIcon.png" alt="Synth Mart Icon" width={100} height={100} />
      </div>
      <h3>Please log in to continue.</h3>
      <form onSubmit={handleLogin}>
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

        <p>{loginFailed ? 'Invalid username or password' : ''}</p>
        <button type="submit" className="priotyButton">Log in</button>

        <p className="logtext">Don't have an account? <Link href="/register" className="loglink">Sign Up</Link></p>
        <p className="logtext"><Link href="/" className="loglink">Click to Return Home</Link></p>
      </form>
    </section>
  );
}