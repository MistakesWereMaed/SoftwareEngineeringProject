import { query } from '../../lib/sql_wrapper';

async function handleCreate(req, res) {

}

async function handleEdit(req, res) {

}

async function handleDelete(req, res) {

}

async function handleSearch(req, res) {
  //optional search parameters
  const { search_str } = req.query;

  //Search matches either item name or item description
  var where_query = '';
  if (search_str !== undefined) {
    where_query = `WHERE CONCAT(ITEM.ITEM_NAME, ' ', ITEM.ITEM_DESC) LIKE '%${search_str}%'`;
  }

  try {
    const queryStr =`
      SELECT 
        ITEM.ITEM_ID, ITEM.ITEM_DESC, ITEM.ITEM_TYPE, ITEM.ITEM_NAME
      FROM ITEM
      ${where_query}
    `;

    const result = [];
    const data = await query({ query: queryStr, values: [result] });
    
    //Convert query into custom object
    const items = [];
    for (let i = 0; i < data.length; i++) {
        const item = {
            name: data[i].ITEM_NAME,
            type: data[i].ITEM_TYPE,
            desc: data[i].ITEM_DESC,
            id: data[i].ITEM_ID
        }
        items.push(item);
    }
    res.status(200).json({ items: items });
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
    default:
      res.status(400).json({ error: "Invalid request" });
  }

}