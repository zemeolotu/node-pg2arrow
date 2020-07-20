# node-pg2arrow

Simple library to query postgres and return result in an Apache Arrow format.

Library uses the [pg-native](https://github.com/brianc/node-pg-native). 

## install

You'll need to install `libpq` to use this library. See `pg-native` [docs](https://github.com/brianc/node-pg-native/blob/master/README.md) for prerequisite

```sh
$ npm i pg2arrow
```

## use

  If no connection details are supplied, `libpq` will use environment variables as per [docs](https://www.postgresql.org/docs/9.3/libpq-envars.html)

```js 
    const pg2arrow = require('pg2arrow');
    const arrow = await pg2arrow('SELECT $1::text as name', ['Zeme']);

    // or 

    const arrow = await pg2arrow({ connectionString, query: 'SELECT $1::text as name', params: ['Zeme'] });
```