const { json } = require("express");
var express = require("express");
var router = express.Router();
const fs = require("fs");

var Datastore = require("nedb");
var db = new Datastore({ filename: "nndatabase.db" });
db.loadDatabase();
//db.remove({}, { multi: true });

const SneaksAPI = require("sneaks-api");
const sneaks = new SneaksAPI();

function getShoeAttributes(shoeNames) {
  const jsonGen = (product) => {
    return {
      name: product.shoeName,
      brand: product.brand,
      //color: product.colorway,
      //styleID: product.styleID,
      resellPrice: product.lowestResellPrice,
      retailPrice: product.retailPrice,
      sneakerValue: ((500-product.retailPrice)/product.retailPrice)*100,
      //releaseDate: product.releaseDate,
      //thumbnailImgage: product.thumbnail,
    };
  };
  for (shoe of shoeNames) {
    sneaks.getProducts(shoe, function (err, products) {
      if (err) {
        return console.error(err);
      }
      console.log(products.length);
      for (product of products) {
        db.insert(jsonGen(product));
      }
    });
  }
}

function getMin(shoe) {
  //var min = 50000;
  return Math.min(shoe.resellPrice.stockX, shoe.resellPrice.stadiumGoods, shoe.resellPrice.goat, shoe.resellPrice.flightClub);
}

getShoeAttributes([
  "Jordan 1",
  "Nike Air Force One",
  "Off-White",
  "Yeezy 350 Boost",
  "Reebok",
  "Yeezy 700 Boost",
  "Jordan 4",
  "Jordan 11",
  "Air Max 97",
  "Converse"
]);