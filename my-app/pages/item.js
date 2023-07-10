import Head from 'next/head'
import NavBar from '../components/NavBar/'
import Item from '../components/Item/'

export default function Home() {
  return (
    <>
      <Head>
        <title>Item</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar/>
      <h1 className="header">Add Item</h1>
      <Item/>
    </>
  )
}