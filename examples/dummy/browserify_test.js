import {Server, Router} from 'kakapo';

const server = new Server();
const router = new Router();

router.get('/users', _ => {
  return {
    foo: 'bar'
  }
});

server.use(router);

fetch('/users').then(r => r.json()).then(r => {
  console.log(r)
});