const mongoose = require('mongoose');
const Product = require('./models/product')

mongoose.connect('mongodb://localhost:27017/farmStand')
.then(() => {
    console.log('SUCCESSFULLY CONNECTED!!!');
})
.catch ( err => {
    console.log('SORRYYYY!!!');
    console.log(err);
})

// const p = new Product({
//     name: 'Ruby Grape Fruit',
//     price: 200,
//     category: 'fruit'
// })

// p.save()
//  .then(p => console.log(p))
//  .catch(err => console.log(err))

const seedProducts = [
    {
        name: 'Fairy Eggplant',
        price: 100,
        category: 'vegetable'
    },
    {
        name: 'Organic Goddess Melon',
        price: 490,
        category: 'fruit'
    },
    {
        name: 'Organic Mini Seedless Watermelon',
        price: 399,
        category: 'fruit'
    },
    {
        name: 'Organic Celery',
        price: 150,
        category: 'vegetable'
    },
    {
        name: 'Chocolate Whole Milk',
        price: 269,
        category: 'dairy'
    },
]

Product.insertMany(seedProducts)
.then( res => console.log(res))
.catch(err => console.log(err));
