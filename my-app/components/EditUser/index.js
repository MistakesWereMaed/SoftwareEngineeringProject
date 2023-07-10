import Link from 'next/link';
import Image from "next/image";
import { useRouter } from 'next/router'
import { useContext, useState } from "react";
import { UserContext } from "../../contexts/UserContext";


export default function EditUser() {

  const { user, setUser } = useContext(UserContext);
  const [updateFailed, setUpdateFailed] = useState(false);
  const router = useRouter();

  /*
    If I am correct this section is 'updating' your user credentials into the database.
  */
  async function handleUpdate(event) {
    event.preventDefault();
    const { username, password } = event.target;
    const requestOptions = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
    };

    const repsonse = await fetch(
      `http://localhost:3000/api/user?user_id=${user.token}&username=${username.value}&password=${password.value}`,
      requestOptions);

    if (repsonse.status == 401) {
      setUpdateFailed(true);
      return;
    }

    /* 
      This section was taken from LoginPage/index.js.
      When you update the user you will automatically sign in.
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
    setUser({ name: username, token: json.user_id });

    router.push('/');
  }

  return (
    <section className="logpage">
      <div className="icon">
        <Image src="/SynthMartIcon.png" alt="Synth Mart Icon" width={100} height={100} />
      </div>
      <h3>Edit User Credentials</h3>
      <form onSubmit={handleUpdate}>
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
          
        <p>{updateFailed ? 'Unable to update credentials' : ''}</p>
        <button type="submit" className="priotyButton">Update</button>
        
        <p className="logtext">Change your mind? <Link href="/user" className="loglink">Go Back</Link></p>
      </form>
    </section>
  );
}