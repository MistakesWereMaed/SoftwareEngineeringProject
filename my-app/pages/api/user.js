import { query } from '../../lib/sql_wrapper';

async function handleCreate(req, res) {
  
  //const { username, password, email, fname, lname, type } = req.body;
  const { username, password, type } = req.query;
  try {
    const queryStr = `
      INSERT INTO USER (
        USER_USERNAME, USER_PASSWORD, USER_TYPE
      )
      VALUES ('${username}', '${password}', '${type}')
    `;
    
    const result = [];
    const data = await query({ query: queryStr, values: [result] });
    res.status(200).json({ data: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

}

async function handleEdit(req, res) {

  //fields that user can update
  const { user_id, username, password } = req.query;

  let updates = [];
  if (username) {
    updates.push(`USER_USERNAME = '${username}'`);
  }
  if (password) {
    updates.push(`USER_PASSWORD = '${password}'`);
  }

  if (updates.length == 0) {
    res.status(400).json({ error: "No fields to update" });
    return;
  }
  
  updates = updates.join(', ');

  try {
    const queryStr =
      `UPDATE USER SET ${updates} ` +
      `WHERE USER_ID = ${user_id};`;

    const result = [];
    const data = await query({ query: queryStr, values: [result] });
    res.status(200).json({ data: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

}

async function handleDelete(req, res) {

  const { user_id } = req.body;

  try {
    const queryStr = 
      `DELETE FROM USER WHERE USER_ID = '${user_id}'`;
    
    const result = [];
    const data = await query({ query: queryStr, values: [result] });
    res.status(200).json({ query: data });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }

}

async function handleAuth(req, res) {
  const { username, password } = req.query;

  try {
    const queryStr =
      `SELECT USER_ID, USER_TYPE FROM USER ` + 
      `WHERE USER_USERNAME = '${username}' AND USER_PASSWORD = '${password}'`;

    const result = [];
    const data = await query({ query: queryStr, values: [result] });
    
    if (data.length == 0) {
      res.status(401).json({ error: "Invalid credentials" })
      return;
    }
    res.status(200).json({ user_id: data[0].USER_ID, user_type: data[0].USER_TYPE });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }


}

async function handleSearch(req, res) {
  //optional search parameters
  const { search_str } = req.query;

  //Search matches either item name or item description
  var search_str_query = '';
  if (search_str !== undefined) {
    search_str_query = `WHERE CONCAT(USER.USER_USERNAME) LIKE '%${search_str}%'`;
  }

  try {
    const queryStr =
      `SELECT USER.USER_USERNAME, USER.USER_ID FROM USER ` +
      `${search_str_query}`
    ;

    const result = [];
    const data = await query({ query: queryStr, values: [result] });

    //Convert query into custom object
    const users = [];
    for (let i = 0; i < data.length; i++) {
      const user = {
        username: data[i].USER_USERNAME,
        id: data[i].USER_ID,
      }
      users.push(user);
    }
    res.status(200).json({ users: users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      if(req.headers.mode == 'auth') {
        handleAuth(req, res);
        break;
      }
      if(req.headers.mode == 'search') {
        handleSearch(req, res);
        break;
      }
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