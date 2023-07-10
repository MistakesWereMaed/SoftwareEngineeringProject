import mysql from 'mysql2/promise';

export async function query({ query, values = [] }) {

    const db = await mysql.createConnection({
        host     : 'swe-project.ccyzsw6kb7va.us-east-2.rds.amazonaws.com',
        port     : '3306',
        user     : 'admin',
        password : 'SWEProject',
        database : 'SWE-Database'
    });
    try {
        const [results] = await db.execute(query, values);
        db.end();
        return results;
    } catch (err) {
        throw Error(err.message);
        return { error };
    } 

}