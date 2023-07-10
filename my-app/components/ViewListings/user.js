import Link from 'next/link';
import React from 'react';
import { useEffect, useState } from 'react';
import { useContext } from "react";
import styles from '../ViewListings/listing.module.css'

import { UserContext } from "../../contexts/UserContext";

const imgHeight = 200, imgWidth = 200

//Html component for an item in the list
function ListItem({ listing }) {
  return (
    <div className={styles.sellcard}>
      <div className={styles.innercard}>
        <img className={styles.img1} src={listing.img_url} height={imgHeight} width={imgWidth} alt={listing.name}></img>
      </div>
      <div className={styles.innercard}>
        <p className={styles.titlelisting}>Model: {listing.name}</p>
        <p>Price: ${listing.price}</p>
        <p>In stock: {listing.quantity}</p>
        <Link className={styles.button1} href="/editsell">
          <p>Edit your Listing</p>
        </Link>
      </div>
    </div>
  )
}
// <button type="submit" className="button">Log in</button>
export default function ViewListings() {

  const [searchStr, setSearchStr] = useState(null) //What is the user's search string?
  const [orderBy, setOrderBy] = useState(null) // What is the user's order by criteria?

  const { user, setUser } = useContext(UserContext);
  const [listings, setListings] = useState([]);//Holds the fetched listings from the database

  useEffect(() => {
    async function fetchData() {
      const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
      console.log(user);

      let query = [];
      if (user.token)
        query.push(`user_id=${user.token}`);
      if (searchStr)
        query.push(`search_str=${searchStr}`);
      if (orderBy)
        query.push(`order_by=${orderBy}`);
      query = query.join('&');

      const response = await fetch(
        `http://localhost:3000/api/listing?` + query,
        requestOptions
      );
      const data = await response.json();
      setListings(data.listings);
      console.log(data);
    };
    fetchData();
  }, []);

  const viewable_listings = listings.map(listing =>
    <ListItem
      key={listing.listing_id}
      listing={listing}
    />
  );

  return (
    <>
      <div>{viewable_listings}</div>
    </>

  );
}