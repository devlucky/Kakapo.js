'use strict';
const fs = require('fs');
const request = require('superagent');
const readmeUrl = 'https://cdn.rawgit.com/devlucky/devlucky.github.io/master/kakapo-js.md';

request
  .get(readmeUrl)
  .end(function(err, res) {
    if (err) {
      return console.log(err);
    }

    const text = res.text;
    const content = text.split('# Getting started')[1].replace(/\<\/div>/g, '');
    const start = getFile('start');
    const end = getFile('end');
    const readme = [start, content, end].join('');
    
    fs.writeFileSync('./README.md', readme);
  });

const getFile = uri => fs.readFileSync(`./md/${uri}.md`).toString();