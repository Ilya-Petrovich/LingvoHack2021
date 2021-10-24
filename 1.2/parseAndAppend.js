const Database = require('better-sqlite3');
const { exec } = require('child_process');
const { promisify } = require('util');

const DB_PATH = '../db.sqlite3';


const prepareDB = () => {
    const db = new Database(DB_PATH);
    // db.exec('DROP TABLE Table1');
    db.exec('CREATE TABLE IF NOT EXISTS Table1 (word VARCHAR(255), translation VARCHAR(255), abst BOOLEAN DEFAULT TRUE);');
    db.exec('DELETE FROM Table1 WHERE abst IS TRUE');

    return db;
};

(async () => {
    const db = prepareDB();

    let { stdout: sparsed } = await promisify(exec)('node --no-warnings parse.js');
    let parsedData = JSON.parse(sparsed);

    let insert = db.prepare('INSERT INTO Table1 (word, translation) VALUES(@word, @translation)');
    db.transaction(() => parsedData.forEach(v => insert.run(v)))();

    // console.log(db.prepare('SELECT * FROM Table1 WHERE abst IS TRUE').all());

    db.close();
})();