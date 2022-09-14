const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Product =  require('./models/product');
const Farm = require('./models/farm')
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');

const sessionOptions = {
    secret: 'thisisnotagoodsecret',
    resave: false,
    saveUninitialized: true
};
app.use(session(sessionOptions));

mongoose.connect('mongodb://localhost:27017/flashDemo')
.then(() => {
    console.log('SUCCESSFULLY CONNECTED!!!');
})
.catch ( err => {
    console.log('SORRYYYY!!!');
    console.log(err);
})

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(flash())

const categories = ['fruit', 'vegetable', 'dairy'];
//Farm Routes
app.get('/farms', async (req, res) => {
    const farms = await Farm.find({});
    res.render('farms/index', {farms, messages: req.flash('success')});
})
app.get('/farms/new', (req, res) => {
    res.render('farms/new');
})

app.get('/farms/:id', async (req, res) => {
    const { id } = req.params
    const farm = await Farm.findById(id).populate('products');
    res.render('farms/show', {farm});
})

app.post('/farms', async (req, res) => {
    const farm = new Farm(req.body);
    await farm.save();
    req.flash('success', 'You have successfully created a farm!')
    res.redirect('/farms');
});

app.get('/farms/:id/products/new', async (req, res) => {
    const { id } = req.params;
    const farm = await Farm.findById(id);
    res.render('products/new', {categories, farm});
});

app.post('/farms/:id/products', async (req, res) => {
    const {id} = req.params;
    const farm = await Farm.findById(id);
    const {name , price, category } = req.body;
    const product = new Product({name, price, category});
    farm.products.push(product);
    product.farm = farm;
    await farm.save();
    await product.save();
    res.redirect(`/farms/${id}`);
});

app.delete('/farms/:id', async (req, res) => {
    const {id} = req.params;
    const farm = await Farm.findByIdAndDelete(id);
     res.redirect('/farms')
});
//Product Routes


app.get('/products', async (req, res) => {
   const {category} = req.query;
   if(category){
        const products =  await Product.find({category});
        res.render('products/index', {products, category});
        console.log(products);
   } else {
        const products =  await Product.find({});
        res.render('products/index', {products, category: 'All'});
        console.log(products);
   }
})

app.get('/products/new', (req, res) => {
    res.render('products/new', {categories});
})

app.post('/products', async (req, res) => {
   const newProduct = new Product(req.body)
   await newProduct.save()
    console.log(newProduct);
    res.redirect(`/products/${newProduct._id}`);
});

app.get('/products/:id', async (req, res) => {
    const{id} = req.params;
    const product = await Product.findById(id).populate('farm', 'name');
    console.log(product);
    res.render('products/show', {product})
});


app.get('/products/:id/edit', async (req, res) => {
    const{id} = req.params;
    const product = await Product.findById(id);
    res.render('products/edit', {product, categories});
});

app.put('/products/:id', async (req, res) => {
    const {id} = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, {runValidators: true, new: true})
    console.log(product);
    res.redirect(`/products/${product._id}`);
});


app.delete('/products/:id', async (req, res) => {
     const {id} = req.params;
     await Product.findByIdAndDelete(id);
     res.redirect('/products');
});


const port = 3000;
app.listen(port, () => {
    console.log(`SERVER IS LISTENING TO ${port}`);
});
