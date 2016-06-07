const kakapo = require('kakapo');
const server = new kakapo.Server();
const router = new kakapo.Router();

console.log(kakapo);

router.get('/users', _ => {
  return {
    foo: 'bar'
  }
});

server.use(router);

fetch('/users').then(r => r.json()).then(r => {
  console.log(r)
});