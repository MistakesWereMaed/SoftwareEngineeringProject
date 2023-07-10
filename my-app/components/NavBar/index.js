import { useContext } from "react";
import { useRouter } from 'next/router'
import Link from 'next/link';
import Image from "next/image";
import styles from './navbar.module.css'

import { UserContext } from "../../contexts/UserContext";

function LinkText(props) {
  return (
    <Link style={{textDecoration: 'none'} } href={props.href}>
      <p className={styles.link}>{props.text}</p>
    </Link>
  )
}

export default function NavBar() {

  const router = useRouter();
  const { user, setUser } = useContext(UserContext);
  const loggedIn = user.token ? true : false;
  var isAdmin = (user.type === 'ADMIN' ? true : false);

  async function handleLogout() {
    setUser({name: null, token: null});
    localStorage.removeItem('token');
    router.push('/');
  }

  return (
    <div>
      <nav className={styles.navbar}>
        <Image src="/SmallSynthMart-04.png" alt="Synth Mart Logo" width={200} height={100}/>
        <LinkText href="/" text="HomeBUYY"/>
      
        <LinkText href={loggedIn ? "/user" : "/login"} text="User"/>
      
        <LinkText href={loggedIn ? "/sell" : "/login"} text="Sell"/>
      
        <LinkText href={loggedIn ? "/cart" : "/login"} text="Shopping Cart"/>

        { loggedIn ?
          <p className={styles.link} onClick={handleLogout}>Log out</p> :
          <LinkText href="/login" text="Sign in / Register"/>
        }

        { isAdmin ?
          <LinkText href="/admin" text="Admin"/> : null
        } 
      </nav>
    </div>
  );
}
