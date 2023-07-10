import { useContext } from "react";
import { useEffect, useState } from 'react';
import styles from '../ViewListings/listing.module.css'
import divider from '../Admin/admin.module.css'

import EditSell from '../EditSell/index.js'
import EditUser from '../EditUser/index.js'

function ViewCodes() {

  function ListItem({ code }) {

      return (
        <div className={styles.card}>
          <p className={styles.titlelisting}>Code: {code.disc_id}</p>
          <p>Amount: ${code.disc_percent}</p>
        </div>
      )
    }

    const [codes, setCodes] = useState([])

  useEffect(() => {
    async function fetchData()  {
      const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }

      const response = await fetch(
        `http://localhost:3000/api/discount?`,
        requestOptions
      );
      const data = await response.json();
      setCodes(data.discounts);
    };
    fetchData();
  }, []);

  const viewable_codes = codes.map(code => 
    <ListItem
      key={code.disc_id}
      code={code}
    />
  );

  return (
    <>

      <div>{viewable_codes}</div>
        
    </>

);
}

function ViewListings() {

    function ListItem({ listing }) {
 
        return (
          <div className={styles.card}>
            <p className={styles.titlelisting}>Model: {listing.name}</p>
            <img className={styles.img1} src={listing.img_url} alt="No image for this listing."></img>
            <p>Price: ${listing.price}</p>
            <p>In stock: {listing.quantity}</p>
            <button className={styles.button1} onClick={EditSell}>Edit Listing</button>
          </div>
        )
      }

    //Optional search states
    //The search bar will call 'setSearchStr(SEARCH_TERM)' to update the search term
    const [searchStr, setSearchStr] = useState(null) //What is the user's search string?
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
    }, [ searchStr, orderBy ]);//re-query the database when the search parameters change
  
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
            Filter by: 
            <select id="order_by" onChange={event => setOrder(event.target.value)}>
              <option value={null}>None</option>
              <option value="lowestPrice">Lowest price</option>
              <option value="highestPrice">Highest price</option>
              <option value="mostStock">Most stock first</option>
              <option value="leastStock">Least stock first</option>
          </select>
          </div>
        </div>
  
        <div>{viewable_listings}</div>
          
      </>
  
  );
  }

  function ViewUsers(){

    function ListItem({ user }) {
 
        return (
          <div className={styles.card}>
            <p>User: {user.username}</p>
            <p>ID: ${user.id}</p>
            <button className={styles.button1} onClick={EditUser}>Edit User</button>
          </div>
        )
      }

    const [users, setUsers] = useState([])

      useEffect(() => {
        async function fetchData()  {
            const requestOptions = {
                method: 'GET',
                headers: { 
                  'Content-Type': 'application/json',
                  'mode': 'search'
                },
              };
          const response = await fetch(
            `http://localhost:3000/api/user?`,
            requestOptions
          );
          const data = await response.json();
          setUsers(data.users);
        };
        fetchData();
      }, []);

     const viewable_users = users.map(user => 
        <ListItem
          key={user.user_id}
          user={user}
        />
      );

      return (
        <>
        <div>{viewable_users}</div>
        </>
      )
  }

  function ViewOrders(){

    function ListItem({ order }) {
 
      const [listings, setListings] = useState([]);

      useEffect(() => {
        setListings(order.listings)
      }, []);

      function Listing({ listing }){

        return(
          <>
            <div className={styles.card}>
            <p>Seller ID: {listing.seller_id}</p>
            <p>Listing ID: {listing.listing_id}</p>
            <p>Quantity: {listing.quantity}</p>
            <p>Subtotal: {listing.subtotal}</p>
          </div>
          </>
        )
      }

      const order_listings = listings.map(listing => 
        <Listing
          key={listing.listing_id}
          listing={listing}
        />);

        return (
          <div className={styles.card}>
            <p>Order ID: {order.order_id}</p>
            <p>Order Date: {order.order_date}</p>
            <p>Order Total: {order.order_total}</p>
            <p>Buyer ID: {order.buyer_id}</p>
            <div>{order_listings}</div>
          </div>
        )
      }

    const [orders, setOrders] = useState([])

    useEffect(() => {
        async function fetchData()  {
            const requestOptions = {
                method: 'GET',
                headers: { 
                  'Content-Type': 'application/json'
                },
              };
          const response = await fetch(
            `http://localhost:3000/api/order?`,
            requestOptions
          );
          const data = await response.json();
          setOrders(data.orders);
        };
        fetchData();
      }, []);

     const viewable_orders = orders.map(order => 
        <ListItem
          key={order.order_id}
          order={order}
        />
      );

      return (
        <>
        <div>{viewable_orders}</div>
        </>
      )

  }

  export default function AdminView(){

    async function CreateDiscount(event) {
      
      event.preventDefault();

      const { code, percent} = event.target;

      const body = JSON.stringify({
        disc_id: code.value,
        disc_percent: percent.value
    });

      const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: body
      };
      const repsonse = await fetch(`http://localhost:3000/api/discount?`,
          requestOptions);        
      const json = await repsonse.json();
    } 

    const codes = ViewCodes()
    const listings = ViewListings()
    const users = ViewUsers()
    const orders = ViewOrders()

    return (
        <>
            <div className={divider.row}>
                <div className={divider.column}>
                <br></br>
                    <h1>Discounts</h1>
                    <form className="page" onSubmit={CreateDiscount}>
                      <label htmlFor="item">Code: </label>
                      <input type="number" name="code" id="code" /><br/>
                      <label htmlFor="item">Amount: </label>
                      <input type="number" name="percent" id="percent" /><br/>
                    <button type="submit" className="button" >Add Discount Code</button>
                   </form>
                    <hr class="rounded"></hr>
                    <div>{codes}</div>
                </div>
                <div className={divider.listingColumn}>
                <br></br>
                    <h1>Listings</h1>
                    <hr class="rounded"></hr>
                    <div>{listings}</div>
                </div>
                <div className={divider.userColumn}>
                <br></br>
                    <h1>Users</h1>
                    <hr class="rounded"></hr>
                    <div>{users}</div>
                </div>
                <div className={divider.column}>
                <br></br>
                    <h1>Orders</h1>
                    <hr class="rounded"></hr>
                    <div>{orders}</div>
                </div>
            </div>
        </>
        );
  }