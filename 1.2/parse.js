const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));;
const { parse } = require('node-html-parser');

const translate = async word =>
    parse(await (await fetch('https://en.openrussian.org/en/' + encodeURIComponent(word))).text())
        .querySelectorAll('ul.tls>li>h2>a')
        .map(aNode => aNode.innerText);
    
const parsedWords = {};

const parseSites = async () => [ // readability lv100 xD
        ...parse(await (await fetch('https://englishstudyhere.com/grammar/100-abstract-nouns-in-english/')).text())
            .querySelectorAll('div.thecontent.clearfix>ul>li')
            .map(liNode => liNode.innerText)
            .filter(word => word != '\n')
            .flat(1),
        ...parse(await (await fetch('https://englishstudyonline.org/abstract-nouns/')).text())
            .querySelectorAll('ul')
            .filter((_, i) => [9, 10].includes(i)) // mmm, magic numbers. Couldn't come up with a better idea for the filter.
            .map(ulNode => ulNode.querySelectorAll('li'))
            .flat(1)
            .map(liNode => liNode.innerText)

    ]
        .filter(word => (!(word in parsedWords) ? parsedWords[word] = true : false))
        .map(async word => ({
            word,
            translations: await translate(word)
        }));

(async () => {
    let parsed = await parseSites();
    for (let [k, promise] of Object.entries(parsed))
        parsed[k] = await promise;
    parsed = parsed
        .map(({ word, translations }) => translations.map(translation => ({ word, translation })))
        .flat(1);
    
    process.stdout.write(JSON.stringify(parsed) + '\n');
    // console.log(parsed.length);
})();