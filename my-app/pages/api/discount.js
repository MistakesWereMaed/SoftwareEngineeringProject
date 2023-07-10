import { query } from '../../lib/sql_wrapper';

async function handleCreate(req, res) {
  const { disc_id, disc_percent } = req.body;

  try {
    const queryStr = `
      INSERT INTO DISCOUNT (
        DISCOUNT_ID, DISCOUNT_PERCENT
      )
      VALUES (${disc_id}, ${disc_percent})
    `;
    
    const result = [];
    const data = await query({ query: queryStr, values: [result] });
    res.status(200).json({ query: data });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
}

async function handleEdit(req, res) {
  const { disc_id, disc_percent } = req.body;

    let updates = [];
    if (price) {
      updates.push(`DISCOUNT_ID = ${disc_id}`);
    }
    if (quantity) {
      updates.push(`DISCOUNT_PERCENT = ${disc_percent}`);
    }

    //check if any update requests have been provided
    if (updates.length == 0) {
      res.status(400).json({ error: "No fields to update" });
      return;
    }
    
    updates = updates.join(', ');

    try {
      const queryStr = 
        `UPDATE DISCOUNT SET ${updates} ` +
        `WHERE DISCOUNT_ID = ${disc_id};`
      
      const result = [];
      const data = await query({ query: queryStr, values: [result] });
      res.status(200).json({ data: data });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
}

async function handleDelete(req, res) {
  const { disc_id } = req.body;

  try {
    const queryStr = 
      `DELETE FROM DISCOUNT WHERE DISCOUNT_ID = '${disc_id}'`;
    
    const result = [];
    const data = await query({ query: queryStr, values: [result] });
    res.status(200).json({ query: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function handleSearch(req, res) {
 
  const { id } = req.query;

  if (id) { //verify for existence of specific discount id
    try {
      const queryStr =`
        SELECT *
        FROM DISCOUNT
        WHERE DISCOUNT_ID = ${id}
      `;

      const result = [];
      const data = await query({ query: queryStr, values: [result] });

      if (data.length == 0) {
        res.status(404).json({ error: "No discount found" });
        return;
      }
      //Convert query into custom object
      const discount = {
        id: data[0].DISCOUNT_ID,
        percent: data[0].DISCOUNT_PERCENT,
      }
      res.status(200).json(discount);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
    return;
  }

  try {
    const queryStr =`
      SELECT *
      FROM DISCOUNT
      ORDER BY DISCOUNT.DISCOUNT_ID
    `;

    const result = [];
    const data = await query({ query: queryStr, values: [result] });

    //Convert query into custom object
    const discounts = [];
    for (let i = 0; i < data.length; i++) {
      const discount = {
        disc_id: data[i].DISCOUNT_ID,
        disc_percent: data[i].DISCOUNT_PERCENT,
      }
      discounts.push(discount);
    }
    res.status(200).json({ discounts: discounts });
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