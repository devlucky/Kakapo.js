# Kakapo.js ![](http://a.deviantart.net/avatars/k/a/kakapoplz.gif?1) ![Build Status](https://travis-ci.org/devlucky/Kakapo.js.svg?branch=master) [![](https://david-dm.org/devlucky/Kakapo.js.svg)](https://david-dm.org/devlucky/Kakapo.js) ![npm license](https://img.shields.io/npm/l/awesome-badges.svg)

> Next generation mocking library in Javascript

**DISCLAIMER** This software is under pre-alpha status, use it under your own risk **DISCLAIMER**

Teach Kakapo how to respond!!! that's the motto behind Kakapo.js, the client-side framework for http mocking.

## Contents
- [Features](#features)
- [Introduction](#introduction)
  - [Why Kakapo?](#why-kakapo)
  - [Concepts](#concepts)
  - [How it works?](#how-it-works)
- [Usage](#usage)
  - [Installation](#installation)
  - [Examples](#examples)
- [Components](#components)
  - [Server](#server)
  - [Router](#router)
  - [Database](#database)
  - [Factories](#factories)
  - [Scenarios](#scenarios)
  - [Serializers](#serializers)
  - [Fake Data](#fake-data)
  - [Interceptors](#interceptors)


## Features

- Fetch Api & XMLHttpRequest support
- Advanced route handling
- Full control of request
- Hackable and elegant programmatic API
- Featured built-in router with custom response handling
- **CRUD support** out of the box
- **JSON-Api** first
- Hierarchical and composable 
- Supports all common HTTP abstrations (Status code, body, headers...)
- **TDD support** by default + extendable scenarios
- Easily to extend with custom components per entity
- Built-in Serializers
- Built-in Interceptors
- Able to run in **different environments** (test, development, hight performance cases...)
- Stateful database with convinience methods 

## Introduction


### Why Kakapo?


### Concepts


### How it works?


## Usage

```javascript
import {Router, DB, Server} from 'Kakapo';

const db = new DB();
db.register('user', (faker) => {
  return {
    firstName: faker.name.firstName,
    lastName: 'Zarco',
    avatar: faker.internet.avatar,
    age: 24
  };
});
db.create('user', 20);

const router = new Router({host: 'custom'});
router.get('/users/', (request, db) => {
  return db.all('user');
});
router.get('/users/:user_id', (request, db) => {
  return db.find('user', request.params.id);
});
router.post('/users/', (request, db) => {
  const createdUser = db.create('user', request.body.user.id);

  return createdUser;
});

const server = new Server({requestDelay: 500});
server.use(db);
server.use(router);
```

### Installation
`$ npm i kakapo`

`$ bower i kakapo`

### Examples

Basic example
```javascript

```

Factories
```javascript

```

Fake Data
```javascript

```

Relationships
```javascript

```

Multiple scenarios
```javascript

```

## Components

TODO

### Router

```javascript
import {Router} from 'Kakapo';

const router = new Router();

router.get('/users');
router.get('/users/:id');
router.post('/users');
router.put('/users');
router.delete('/users/:id');

```

### Database

**register**

**create**

**find**

**filter**

**push**

**all**

**reset**

### Factories

```javascript
import {DB} from 'Kakapo';

db.register('user', () => {
  return {
    firstName: 'Hector',
    lastName: 'Zarco'
  };
});

db.register('comment', () => {
  return {
    text: '¯\_(ツ)_/¯',
    author_id: 1
  };
});

db.create('user', 1);
db.create('comment', 10);
```

### Scenarios

TODO

### Serializers

```javascript
import {DB, JSONApiSerializer} from 'Kakapo';

const db = new DB();

//Using a built-in Serializer
db.register('/v2/user', (faker) => {
  return JSONApiSerializer({
    firstName: faker.name.firstName,
    lastName: 'Zarco',
    avatar: faker.internet.avatar,
    age: 24
  });
});

//Defining a custom serializer
const ApiV1Serializer = (payload) => {
  return {
    version: 'v1',
    data: payload,
    status: {
      code: 200,
      text: 'Success'
    }
  };
};

//Using the custom Serializer
db.register('/v1/user', (faker) => {
  return ApiV1Serializer({
    firstName: faker.name.firstName,
    lastName: 'Zarco',
    avatar: faker.internet.avatar,
    age: 24
  });
});
```

### Fake Data

Kakapo comes with [Faker.js](https://github.com/Marak/faker.js) which provides an insane amount of method for create fake data.

Some useful examples:

* `faker.address.city()`
* `faker.internet.avatar()`
* `faker.internet.color()`
* `faker.internet.email()`
* `faker.internet.userAgent()`
* `faker.lorem.word()`
* `faker.lorem.sentences()`
* `faker.name.firstName()`
* `faker.name.title()`
* `faker.random.number()`
* `faker.random.arrayElement()`
* `faker.random.objectElement()`
* `faker.random.uuid()`
* `faker.system.fileName()`
* `faker.system.mimeType()`

Don't forget to check all the [Api Docs](http://marak.com/faker.js/)

### Interceptors

- Fetch
- XMLHttpRequest

# Authors 

[@oskarcieslik](https://github.com/oskarcieslik) - [@zzarcon](https://github.com/zzarcon)