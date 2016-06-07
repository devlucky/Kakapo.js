#Kakapo Dummy App example
> Just shows how to integrate Kakapo.js in you app in multiple flavours

This Example shows different ways of requiring Kakapo.js in your app:

##ES6 Module

`$ npm i kakapo -D`

`$ npm run browserify` 

```javascript
import {Server, Router} from 'kakapo';

const server = new Server();
const router = new Router();
```

##AMD

`$ npm i kakapo -D`

`$ npm run browserify_require`

```javascript
const kakapo = require('kakapo');

const server = new kakapo.Server();
const router = new kakapo.Router();
```

##Bower

`$ bower i kakapo -D`

Include **bower_components/kakapo/lib/kakapo.js** 

```javascript
const server = new Kakapo.Server();
const router = new Kakapo.Router();
```
