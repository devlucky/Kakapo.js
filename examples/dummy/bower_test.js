const server = new Kakapo.Server();
const router = new Kakapo.Router();

router.get('/users', _ => {
  return {
    foo: 'bar'
  };
})

server.use(router);

fetch('/users').then(r => r.json()).then(console.log.bind(console));