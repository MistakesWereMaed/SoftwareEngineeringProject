import mysql from 'mysql2/promise';

export async function query({ query, values = [] }) {

    const db = await mysql.createConnection({
        host     : 'localhost',
        port     : '3306',
        user     : 'root',
        password : 'ApplicationProject',
        database : 'SWE-Database'
    });
    try {
        const [results] = await db.execute(query, values);
        db.end();
        return results;
    } catch (err) {
        throw Error(err.message);
    } 

}