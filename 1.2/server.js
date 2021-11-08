const express = require('express');
const bodyParser = require('body-parser');
const Database = require('better-sqlite3');

const app = express();
app.set('view engine', 'ejs');

app.get('/', (rq, rs) => {
    const db = new Database('../db.sqlite3');
    

    rs.render('index', {

    });
});