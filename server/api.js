const cors = require('cors');
const express = require('express');
const req = require('express/lib/request');
const helmet = require('helmet');
require('dotenv').config();
const {MongoClient} = require('mongodb');
const db = require('./db');

const PORT = 8092;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({'ack': true});
});

app.get('/products/search', async (request, response) => {
  let limit;
  if (request.query.limit == undefined) 
    limit = 12;
  else 
    limit = parseInt(request.query.limit);

  let currentPage;
  if (request.query.currentPage == undefined) 
    currentPage = 1;
  else 
    currentPage = parseInt(request.query.currentPage);

  let brand;
  if (request.query.brand == undefined) 
    brand = 'all';
  else 
    brand = request.query.brand;

  let sort;
  if (request.query.sort == undefined) 
    sort = -1;
  else 
    sort = request.query.sort;

  let price;
  if (request.query.price == undefined || request.query.price == 'all') 
    price = -1;
  else 
    price = parseFloat(request.query.price);

  let db_request = {};
  if (brand != 'all') 
    db_request['brand'] = brand;
  if (price >= 0) 
    db_request['price'] = {'$gt' : 0.75*price,'$lt' :1.25*price };

  const product = await db.find_limit(db_request,currentPage,limit,sort);

  const nb_tot = 690;
  pageCount = Math.ceil(nb_tot/limit);
  response.status(200).json({'success':true,'data' : {'result':product,'meta':{'currentPage':currentPage,'pageCount':pageCount,'pageSize':limit,'count':nb_tot}}});
});

app.get('/products/:id', async (request, response) => {
  const id = parseInt(request.params.id);
  const product = await db.find({'_id' : id});
  response.status(200).json({'result' : product});
});

app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);