const bookshelf = require('../bookshelf');

const Figure = bookshelf.model('Figure', {
    tableName: 'figures',
    figure_type() {
        return this.belongsTo('FigureType')
    },
    series(){
        return this.belongsTo('Series')
    }
})

const FigureType = bookshelf.model('FigureType', {
    tableName: 'figure_types',
    figures() {
        return this.hasMany('Figure')
    }
})

const Series = bookshelf.model('Series', {
    tableName: 'series',
    series(){
        return this.hasMany('Figure')
    }
})

module.exports = { Figure, FigureType, Series };