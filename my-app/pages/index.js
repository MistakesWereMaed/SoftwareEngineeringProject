import Head from 'next/head'
import NavBar from '../components/NavBar/'
import ViewListings from '../components/ViewListings/home'

//import { Inter } from 'next/font/google'
//const inter = Inter({ subsets: ['latin'] })

//import styles from '@next/styles/Home.module.css'

//import create listing component
//import CreateListing from '../components/CreateListing/'

export default function Home() {
  return (
    <>
      <Head>
        <title>Synth Mart</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar/>
      <h1 className="header">Browse Listings</h1>
      <ViewListings/>
    </>
  )
}
