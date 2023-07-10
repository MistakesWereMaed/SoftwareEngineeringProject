import React from 'react';
import { useEffect, useState, useContext } from 'react';
import { UserContext } from "../../contexts/UserContext";

export default function ListingForm() {

    //TODO: display input validation errors
    const { user, setUser } = useContext(UserContext);
    const [items, setItems] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            };
            const response = await fetch('http://localhost:3000/api/item?', requestOptions);
            const json = await response.json();
            setItems(json.items);
        };
        fetchData();
    }, []);

    async function handleSubmit(event) {
        event.preventDefault();

        const { item, price, quantity, img_url } = event.target;

        console.log(item.value);

        const body = JSON.stringify({
            user_id: user.token,
            item_id: item.value,
            price: price.value,
            quantity: quantity.value,
            img_url: img_url.value
        });
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: body,
        };
        const repsonse = await fetch('http://localhost:3000/api/listing?',
            requestOptions);
        const json = await repsonse.json();
        console.log(json.query);
    }

    return (
        <form className="pagebox" onSubmit={handleSubmit}>
            <div className="pagecontents">
                <h1 className="header">Sell Products</h1>
                <label htmlFor="item">Item to Sell: </label>
                <select name="item">
                    {items.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select><br />

                <label htmlFor="price">Selling Price: </label>
                <input type="number" name="price" id="price" /><br />
                <label htmlFor="quantity">Quantity: </label>
                <input type="number" name="quantity" id="quantity" defaultValue="1" /><br />
                <label htmlFor="img_url">Image: </label>
                <input type="text" name="img_url" id="img_url" defaultValue="" /><br /><br />
                <button type="submit" className="button">Submit</button>
            </div>
        </form>
    );
}