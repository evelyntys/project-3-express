const bookshelf = require('../bookshelf');

const Figure = bookshelf.model('Figure', {
    tableName: 'figures'
})

module.exports = { Figure };