import { query } from '../../lib/sql_wrapper';

async function handleCreate(req, res) {

  const { user_id, item_id, price, quantity, img_url } = req.body;

  try {
    const queryStr = `
      INSERT INTO LISTING (
        LISTING_QUANTITY, LISTING_PRICE, LISTING_DATE, ITEM_ID, USER_ID, LISTING_IMG
      )
      VALUES (${quantity}, ${price}, CURDATE(), ${item_id}, ${user_id}, '${img_url}')
    `;
    
    const result = [];
    const data = await query({ query: queryStr, values: [result] });
    res.status(200).json({ data: data });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
}

async function handleEdit(req, res) {

    const { listing_id, price, quantity } = req.body;

    let updates = [];
    if (price) {
      updates.push(`LISTING_PRICE = ${price}`);
    }
    if (quantity) {
      updates.push(`LISTING_QUANTITY = ${quantity}`);
    }

    //check if any update requests have been provided
    if (updates.length == 0) {
      res.status(400).json({ error: "No fields to update" });
      return;
    }
    
    updates = updates.join(', ');

    try {
      const queryStr = 
        `UPDATE LISTING SET ${updates} ` +
        `WHERE LISTING_ID = ${listing_id};`
      
      const result = [];
      const data = await query({ query: queryStr, values: [result] });
      res.status(200).json({ data: data });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
}

async function handleDelete(req, res) {

  const { listing_id } = req.body;

  try {
    const queryStr = 
      `DELETE FROM LISTING WHERE LISTING_ID = '${listing_id}'`;
    
    const result = [];
    const data = await query({ query: queryStr, values: [result] });
    res.status(200).json({ query: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

}

async function handleSearch(req, res) {
  //optional search parameters
  //const { search_str, order_by_price, order_by_stock, user_id } = req.query;
  const { search_str, order_by, user_id } = req.query;

  var order_by_query = '';
  //let order_by_query = [];

  //sort by listing price if selcted
  /*if (order_by_price == 'lowestPrice') {
    order_by_query.push(`LISTING.LISTING_PRICE ASC`);
  }
  if (order_by_price == 'highestPrice') {
    order_by_query.push(`LISTING.LISTING_PRICE DESC`);
  }
  
  //sorts listings by current stock if selected
  if (order_by_stock == 'mostStock') {
    order_by_query.push(`LISTING.LISTING_QUANTITY DESC`);
  }
  if (order_by_stock == 'leastStock') {
    order_by_query.push(`LISTING.LISTING_QUANTITY ASC`);
  }
  
  if (order_by_query.length > 0) {
    order_by_query = 'ORDER BY ' + order_by_query.join(',');
  }*/

  if (order_by == 'lowestPrice') {
    order_by_query = `LISTING.LISTING_PRICE ASC`;
  }
  if (order_by == 'highestPrice') {
    order_by_query = `LISTING.LISTING_PRICE DESC`;
  }
  
  //sorts listings by current stock if selected
  if (order_by == 'mostStock') {
    order_by_query = `LISTING.LISTING_QUANTITY DESC`;
  }
  if (order_by == 'leastStock') {
    order_by_query = `LISTING.LISTING_QUANTITY ASC`;
  }
  
  if (order_by_query.length > 0) {
    order_by_query = 'ORDER BY ' + order_by_query;
  }
  
  //Search matches either item name or item description
  let where_query = [];
  if (search_str !== undefined) {
    where_query.push(`CONCAT(ITEM.ITEM_NAME, ' ', ITEM.ITEM_DESC) LIKE '%${search_str}%'`);
  }
  //if user_id is provided, only return listings from that user
  if (user_id !== undefined) {
    console.log(user_id)
    where_query.push(`USER_ID = ${user_id}`);
  }
  
  if (where_query.length > 0) {
    where_query = 'WHERE ' + where_query.join(' AND ');
  }

  try {
    const queryStr =`
      SELECT 
        LISTING.LISTING_ID, LISTING.LISTING_PRICE, LISTING.LISTING_QUANTITY, LISTING.LISTING_DATE, LISTING.LISTING_IMG,
        ITEM.ITEM_ID, ITEM.ITEM_DESC, ITEM.ITEM_TYPE, ITEM.ITEM_NAME
      FROM LISTING
      JOIN ITEM ON ITEM.ITEM_ID = LISTING.ITEM_ID
      ${where_query}
      ${order_by_query}
    `;

    const result = [];
    const data = await query({ query: queryStr, values: [result] });

    //Convert query into custom object
    const listings = [];
    for (let i = 0; i < data.length; i++) {
      const listing = {
        listing_id: data[i].LISTING_ID,
        price: data[i].LISTING_PRICE,
        quantity: data[i].LISTING_QUANTITY,
        date: data[i].LISTING_DATE,
        img_url: data[i].IMAGE_URL,
        name: data[i].ITEM_NAME,
        type: data[i].ITEM_TYPE,
        item_id: data[i].ITEM_ID
      }
      listings.push(listing);
    }
    res.status(200).json({ listings: listings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

}

export default async function handler(req, res) {

  switch (req.method) {
    case 'GET':
      handleSearch(req, res);
      break;
    case 'POST':
      handleCreate(req, res);
      break;
    case 'PATCH':
      handleEdit(req, res);
      break;
    case 'DELETE':
      handleDelete(req, res);
      break;
    default:
      res.status(400).json({ error: "Invalid request" });
  }
}