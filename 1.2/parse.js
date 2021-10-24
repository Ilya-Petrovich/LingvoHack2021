const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));;
const { parse } = require('node-html-parser');

const translate = async word =>
    parse(await (await fetch('https://en.openrussian.org/en/' + encodeURIComponent(word))).text())
        .querySelectorAll('ul.tls>li>h2>a')
        .map(liNode => liNode.innerText);

const parseSites = async () => [ // readability lv100 xD
    ...parse(await (await fetch('https://englishstudyhere.com/grammar/100-abstract-nouns-in-english/')).text())
        .querySelectorAll('div.thecontent.clearfix>ul')
        .map(ulNode => ulNode.childNodes.map(liNode => liNode.innerText).filter(word => word != '\n'))
        .flat(1)
        .map(async word => ({
            word,
            translations: await translate(word)
        }))
];

(async () => {
    let parsed = await parseSites();
    for (let [k, promise] of Object.entries(parsed))
        parsed[k] = await promise;
    parsed = parsed
        .map(({ word, translations }) => translations.map(translation => ({ word, translation })))
        .flat(1);
    
    console.log(JSON.stringify(parsed));
})();