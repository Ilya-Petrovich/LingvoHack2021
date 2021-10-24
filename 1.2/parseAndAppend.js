const Database = require('better-sqlite3');
const { promisify } = require('util');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));;
const { parse } = require('node-html-parser');

const DB_PATH = '../db.sqlite3';


const prepareDB = () => {
    const db = new Database(DB_PATH);
    // db.exec('DROP TABLE Table1');
    db.exec('CREATE TABLE IF NOT EXISTS Table1 (word VARCHAR(255), translation VARCHAR(255), abst BOOLEAN DEFAULT TRUE);');
    db.exec('DELETE FROM Table1 WHERE abst IS TRUE');

    return db;
};

const translate = async word =>
    parse(await (await fetch('https://en.openrussian.org/en/' + encodeURIComponent(word))).text())
    .querySelectorAll('ul.tls>li>h2>a')
    .map(liNode => liNode.innerText);

const parseSites = async () => [ // readability lvl 100. I did my best xD
    ...parse(await (await fetch('https://englishstudyhere.com/grammar/100-abstract-nouns-in-english/')).text())
    .querySelectorAll('div.thecontent.clearfix>ul')
    .map(ulNode => ulNode.childNodes.map(liNode => liNode.innerText).filter(word => word != '\n'))
    .flat(1)
    .map(async word => ({ word, translations: await translate(word) }))
];

const parseAndFillDB = async () => {
    const db = prepareDB();

    let parsed = (await parseSites());
    for (let [k, promise] of Object.entries(parsed))
        parsed[k] = await promise;
    parsed = parsed
    .map(({word, translations}) => translations.map(translation => ({ word, translation })))
    .flat(1);

    let insert = db.prepare('INSERT INTO Table1 (word, translation) VALUES(@word, @translation)');
    db.transaction(() => {
        for (let v of parsed) {
            console.log(v);
            insert.run(v);
        }
    })();

    db.close();
};
parseAndFillDB();