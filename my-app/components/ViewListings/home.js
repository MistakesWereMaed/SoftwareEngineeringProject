import React from 'react';
import { useEffect, useState, useContext } from 'react';
import styles from './listing.module.css'

import { CartContext } from '../../contexts/CartContext';

const imgHeight = 200, imgWidth = 200

//Html component for an item in the list
//will change this later, just testing listing css
//TODO: change from static variables
function ListItem({ listing }) {

  const { cart, setCart } = useContext(CartContext);
  const [ inCart, setInCart ] = useState(false);

  function addToCart() {
    setCart([...cart, { ...listing, buy_quantity: 1 }]);
    setInCart(true);
    console.log(cart);
  }

  function removeFromCart() {
    //searches for the listing of the item to remove
    setCart(cart.filter(cart_item => cart_item !== listing)); 
    setInCart(false);
  }

  return (
    <div className={styles.card}>
      <p className={styles.titlelisting}>Model: {listing.name}</p>
      <img className={styles.img1} src={listing.img_url} alt="No image for this listing."></img>
      <p>Price: ${listing.price}</p>
      <p>In stock: {listing.quantity}</p>
      { inCart
        ? <button className={styles.button1} onClick={removeFromCart}>Remove from cart</button>
        : <button className={styles.button1} onClick={addToCart}>Add to cart</button>
      }
    </div>
  )
}

export default function ViewListings() {

  //Optional search states
  //The search bar will call 'setSearchStr(SEARCH_TERM)' to update the search term
  const [searchStr, setSearchStr] = useState(null) //What is the user's search string?
  //const [orderByPrice, setPriceOrder] = useState(null) // Does the user want to sort by price?
  //const [orderByStock, setStockOrder] = useState(null) // Does the user want to sort by stock?
  const [orderBy, setOrder] = useState(null) // How does the user want to filter the search results?
  const [listings, setListings] = useState([]);//Holds the fetched listings from the database

  useEffect(() => {
    async function fetchData()  {
      const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }

      let query = [];
      if (searchStr)
        query.push(`search_str=${searchStr}`);
      if (orderBy)
        query.push(`order_by=${orderBy}`);
      //if (orderByPrice)
        //query.push(`order_by_price=${orderByPrice}`);
      //if (orderByStock)
        //query.push(`order_by_stock=${orderByStock}`);
      query = query.join('&');

      console.log("searching for: " + query);

      const response = await fetch(
        `http://localhost:3000/api/listing?` + query,
        requestOptions
      );
      const data = await response.json();
      setListings(data.listings);
      console.log(data);
    };
    fetchData();
  //}, [ searchStr, orderByPrice, orderByStock ]);//re-query the database when the search parameters change
  }, [ searchStr, orderBy]);//re-query the database when the search parameters change

  const viewable_listings = listings.map(listing => 
    <ListItem
      key={listing.listing_id}
      listing={listing}
    />
  );

  return (
    <>
      <div id="searchCriteria" className={styles.searchCriteria}>
        Search: <input type="search" id="searchBar" onChange={
            event => setSearchStr(event.target.value)
        }/>
        <div>

          {/*Price Filter:
          <select id="order_by_price" onChange={event => setPriceOrder(event.target.value)}>
            <option value={null}>None</option>
        
            <option value="lowestPrice">Lowest price</option>
            <option value="highestPrice">Highest price</option>
            
          </select>*/ }

          Filter by: 
          <select id="order_by" onChange={event => setOrder(event.target.value)}>
            <option value={null}>None</option>
            <option value="lowestPrice">Lowest price</option>
            <option value="highestPrice">Highest price</option>
            <option value="mostStock">Most stock first</option>
            <option value="leastStock">Least stock first</option>
          </select>

          {/*Stock Filter:
          <select id="order_by_stock" onChange={event => setStockOrder(event.target.value)}>
            <option value={null}>None</option>
            <option value="mostStock">Most stock first</option>
            <option value="leastStock">Least stock first</option>
        </select>*/}

        </div>
      </div>

      <div>{viewable_listings}</div>
        
    </>

);
}