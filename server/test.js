const cors = require('cors');
const express = require('express');
const req = require('express/lib/request');
const helmet = require('helmet');
require('dotenv').config();
const {MongoClient} = require('mongodb');
const db = require('./db');
    
    let limit;
    limit = 12;

    let currentPage;
    currentPage = 1;

    let brand;
    brand = 'all';

    let price;
    price = -1;
  
    let db_request = {};
    if (brand != 'all') 
      db_request['brand'] = brand;
    if (price >= 0) 
      db_request['price'] = {'$gt' : 0.75*price,'$lt' :1.25*price };
  

    const product = db.find_limit(db_request,currentPage,limit);
    console.log(product)

    const nb_tot = product.length;
    console.log(nb_tot)

    pageCount = Math.ceil(nb_tot/limit);
    console.log(JSON.stringify({'success':true,'data' : {'result':product,'meta':{'currentPage':currentPage,'pageCount':pageCount,'pageSize':limit,'count':nb_tot}}}));