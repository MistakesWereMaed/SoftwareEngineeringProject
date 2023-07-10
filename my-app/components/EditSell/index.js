import Link from 'next/link';
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../contexts/UserContext";

//TODO: make default form values the current listing values
export default function EditSell() {

  const { user, setUser } = useContext(UserContext);
  const [items, setItems] = useState([]);
  const [updateFailed, setUpdateFailed] = useState(false);
  console.log("User: " + user.token)
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

  async function handleUpdate(event) {
    event.preventDefault();
    const { item, price, quantity, img_url } = event.target;
    const body = JSON.stringify({
      user_id: user.user_id,
      item: item.value,
      price: price.value,
      quantity: quantity.value,
      img_url: img_url.value
    });
    const requestOptions = {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: body,
    };
    const repsonse = await fetch('http://localhost:3000/api/listing?',
      requestOptions);
    const json = await repsonse.json();
    if (repsonse.status == 500) {
      setUpdateFailed(true);
      return;
    }
    console.log(json.query);
  }

  const getItems = () => {
    for (var index in items) {
      var select = document.getElementById("item");
      select.options[select.options.length] = new Option(items[index].name, index);
    }
  };

  return (
    <section>
      <form className="pagebox" onSubmit={handleUpdate}>
        <div className="pagecontents">
          <h1 className="header">Update Product</h1>
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
          <br />
          <p >Change your mind? <Link href="/user" className="loglink">Go Back</Link></p>
        </div>
      </form>
    </section>
  );
}