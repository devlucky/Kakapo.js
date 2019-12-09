// @TODO Test Server's config
import { Database, Router, Server } from '../src';

const xhrRequest = (url: string) => {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {};
    xhr.open('GET', url, true);
    xhr.send();
};

describe.skip('Server', () => {
    test('Server # use database', () => {
        expect.assertions(2);

        const myDB = new Database();
        const router = new Router();
        const server = new Server();

        router.get('/fetch', (request, db) => {
            expect(db == myDB).toBeTruthy();
        });
        router.get('/xhr', (request, db) => {
            expect(db == myDB).toBeTruthy();
        });

        server.use(myDB);
        server.use(router);

        fetch('/fetch');
        xhrRequest('/xhr');
    });

    test('Server # use router', () => {
        const router = new Router();
        const server = new Server();

        router.get('/comments', _ => {
            //Should not reach this handler since the request is fired before "server.use"
        });

        router.get('/users', _ => {
            //It must only enter in this handler since the request has been triggered after the registration
            expect(true).toBeTruthy();
        });

        fetch('/comments');
        server.use(router);
        fetch('/users');
    });

    test('Server # remove database', () => {
        expect.assertions(2);

        const myDB = new Database();
        const router = new Router();
        const server = new Server();

        router.get('/fetch_db', (_request, db) => {
            expect(db == myDB).toBeTruthy();
        });
        router.get('/fetch_nodb', (_request, db) => {
            expect(db == null).toBeTruthy();
        });

        server.use(myDB);
        server.use(router);
        fetch('/fetch_db');

        server.remove(myDB);
        fetch('/fetch_nodb');
    });

    test('Server # remove router', () => {
        expect.assertions(2);

        const router = new Router();
        const server = new Server();

        router.get('/fetch', _ => {
            //Server is active before being removed
            expect(true).toBeTruthy();
        });
        router.get('/fetch_fail', _ => {
            //Request is being intercepted when router is removed
        });

        server.use(router);
        fetch('/fetch');

        server.remove(router);
        fetch('/fetch_fail').then(response => {
            //Server is inactive after removal
            expect(response.status).toEqual(404);
        });
    });
});
