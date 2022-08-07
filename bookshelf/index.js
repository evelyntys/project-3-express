const knex = require('knex')({
    client: 'mysql',
    connection: {
        user: 'admin',
        password: 'admin123',
        database: 'figurines'
    }
})

const bookshelf = require('bookshelf')(knex);

module.exports = bookshelf