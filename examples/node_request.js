'use strict';
const querystring = require('querystring');
const http = require('http');
const https = require('https');
const getRequest = () => {
  const endpoint = 'https://api.github.com/emojis';
  const httpsOptions = {
    host: 'api.github.com',
    path: '/emojis'
  };
  const options = {
    host: 'personatestuser.org',
    path: '/email'
  };
  // const req = http.request(options, res => {
  const req = https.request(options, res => {
    console.log(res);
    let body = '';
    // const req = http.request(endpoint, function(res) {
    res.setEncoding('utf8');
    res.on('data', chunk => {
      body += chunk;
      // console.log('data' + chunk);
    });
    res.on('end', () => {
      const json = JSON.parse(body);
      // console.log('end', arguments);
      console.log('end', json);
    });
  });
  // req.write(data);
  req.end();
}

const httpsGet = () => {
  const options = {
    hostname: 'api.github.com',
    path: '/emojis',
    method: 'GET',
    headers: {
      'User-Agent': 'Awesome-Octocat-App'
    }
  };
  // https.get('https://api.github.com/emojis', (res) => {
  https.get(options, res => {
    console.log('statusCode: ', res.statusCode);
    console.log('headers: ', res.headers);

    res.on('data', (d) => {
      process.stdout.write(d);
    });

  }).on('error', (e) => {
    console.error(e);
  });
};

const postRequest = () => {
  const options = {
    host: 'closure-compiler.appspot.com',
    port: '80',
    path: '/compile',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(data)
    }
  };
  const data = querystring.stringify({
    'compilation_level': 'ADVANCED_OPTIMIZATIONS',
    'output_format': 'json',
    'output_info': 'compiled_code',
    'warning_level': 'QUIET',
    'js_code': codestring
  });

}

const httpsGet2 = () => {
  var options = {
    hostname: 'encrypted.google.com',
    port: 443,
    path: '/',
    method: 'GET'
  };

  var req = https.request(options, (res) => {
    console.log('statusCode: ', res.statusCode);
    console.log('headers: ', res.headers);

    res.on('data', (d) => {
      // console.log(d);
    });
  });
  req.end();

  req.on('error', (e) => {
    console.error(e);
  });
}

// getRequest();
httpsGet();
// httpsGet2();