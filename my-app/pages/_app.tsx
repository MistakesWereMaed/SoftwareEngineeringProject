//import '@next/styles/globals.css'
//import Navbar from "../components/Navbar";
import { useEffect, useState } from 'react'
import '../components/_stylepage.css'
import type { AppProps } from 'next/app'

import { UserContext } from '../contexts/UserContext'
import { CartContext } from '../contexts/CartContext'

export default function App({ Component, pageProps }: AppProps) {
 
  const [ user, setUser ] = useState(
    { name: null, type: 'user', token: null}
  )
  const [ cart, setCart ] = useState([])
  
  useEffect(() => {
    if (typeof window !== 'undefined') {  
      // @ts-ignore
      setUser({ ...user, token: localStorage.getItem('token')})
    }
  }, []);

  return (
    <>
      {/*@ts-ignore*/}
      <CartContext.Provider value={{ cart, setCart }}>
      {/*@ts-ignore*/}
      <UserContext.Provider value={{ user, setUser }}>
        <Component {...pageProps} />
      </UserContext.Provider>
      </CartContext.Provider>
    </>
  )
}
