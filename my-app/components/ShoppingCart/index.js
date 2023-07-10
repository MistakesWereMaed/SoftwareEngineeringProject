import { useContext } from "react";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { CartContext } from "../../contexts/CartContext";
import { UserContext } from "../../contexts/UserContext";
import styles from '../ViewListings/listing.module.css'

const imgHeight = 200, imgWidth = 200

  export default function ViewListings() {

  const { cart, setCart } = useContext(CartContext);
  const { user, setUser } = useContext(UserContext);
  const [ discounts, setDiscounts ] = useState([]);
  const router = useRouter();

  function ListItem({ listing }) {
  
    const quantity = listing.buy_quantity;

    function removeFromCart() {
      //searches for the listing_id of the item to remove
      setCart(cart.filter(cart_item => cart_item !== listing)); 
    }

    function incrementQty() {

      const newQuantity = quantity + 1;

      let new_listings = [...cart]
      new_listings.map(cart_item => {
        if (cart_item.listing_id == listing.listing_id) {
          cart_item.buy_quantity = newQuantity; 
        }
      });
      setCart(new_listings);

    }

    function decrementQty() {
      
      if (quantity == 1)
        return;

      const newQuantity = quantity - 1;

      let new_listings = [...cart]
      new_listings.map(cart_item => {
        if (cart_item.listing_id == listing.listing_id) {
          cart_item.buy_quantity = newQuantity; 
        }
      });
      setCart(new_listings);
    }
    
    return (
      <div className={styles.sellcard}>

        <div className={styles.innercard}>
          <img className={styles.img1} src={listing.img_url} height={imgHeight} width={imgWidth} alt={listing.name}></img>
        </div>

        <div className={styles.innercard}>
          <p className={styles.titlelisting}>Model: {listing.name}</p>
          <p>Price: ${listing.price}</p>
          <p>In stock: {listing.quantity}</p>
          <button className={styles.button1} onClick={removeFromCart}>Remove from cart</button>
        </div>

        <div className={styles.innercard}>
          <div style={{display:'inline-block'}}>
            <p>Quantity:</p>
            <div className={styles.counter}>
              <button onClick={decrementQty}>-</button>
                <div>{quantity}</div>
              <button onClick={incrementQty}>+</button>
            </div>
            <p>Subtotal: {listing.price * quantity}</p>
          </div>
        </div>
      </div>
    )

  }

  async function addDiscount(event) {
      event.preventDefault();
      const code = event.target.code.value;
      const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
      const response = await fetch(
        `http://localhost:3000/api/discount?id=${code}`,
        requestOptions
      );
      //if discount not found,
      if (response.status == 404) {
        alert("Invalid discount code");
        return;
      }
      const data = await response.json();
      setDiscounts([...discounts, data]);
  }

  async function placeOrder() {

    const body = JSON.stringify({
      buyer_id: user.token,
      listings: cart.map(listing => { return { listing_id: listing.listing_id, quantity: listing.buy_quantity } }),
      discounts: discounts.map(discount => discount.id)
    });

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body
    } 
    const response = await fetch('http://localhost:3000/api/order', requestOptions);
    const json = await response.json();
    console.log(json);
    
    // router.push('/');  
    // alert("Your order has been placed!");
    // setCart([]);
  }

  const viewable_listings = cart.map(listing => 
    <ListItem
      key={listing.listing_id}
      listing={listing}
    />
  );

  const viewable_discounts = discounts.map(discount =>
    <div key={discount.id}>
      <p>{discount.percent}% off</p>
    </div>
  );

  const raw_total = cart.reduce((total, listing) => total + listing.price * listing.buy_quantity, 0);
  const taxed_ammount = parseFloat((raw_total * .0825).toFixed(2));//8.25% tax
  const taxed_total = raw_total + taxed_ammount;
  
  const discount_percent_total = discounts.reduce((total, discount) => total + discount.percent, 0);
  const discounted_ammount = parseFloat((taxed_total * (discount_percent_total/100)).toFixed(2));
  const final_total = parseFloat((taxed_total - discounted_ammount).toFixed(2));

  return (
    <>
      {cart.length == 0 ? 
      <h1>Your cart is empty.</h1>
       :<>
          <div>{viewable_listings}</div>
          <div className={styles.checkoutcard}>
            <p><strong>Order: {raw_total}</strong></p>
            <p><strong>Tax(8.25%): + {taxed_ammount}</strong></p>
            <p><strong>Discounted: - {discounted_ammount}</strong></p>
            <p><strong>Total: {final_total}</strong></p> 

            <button onClick={placeOrder}>Check Out</button>
          </div>
          <div>
            <div>Active discounts {viewable_discounts}</div>
            {/* form to enter a new discount */}
            <form onSubmit={addDiscount}>
              <label htmlFor="code">Enter a discount code:</label>
              <input type="text" id="code" name="code"/>
              <button type="submit">Add code</button>
            </form> 
          </div>
        </>
      }
    </>
  );
}