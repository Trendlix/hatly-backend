const brandRouter = require("express").Router();
const Product = require("../models/productModel");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
let { PythonShell } = require("python-shell");
let editStock = new PythonShell("./python/editStock.py");

const { FrappeApp } = require("frappe-js-sdk");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const SITE_URL = process.env.FRAPPE_SITE_URL;
const API_SECRET = process.env.FRAPPE_SECERET;
const API_KEY = process.env.FRAPPE_API_KEY;
const API_USER = process.env.FRAPPE_USR;
const API_PWD = process.env.FRAPPE_PWD;
const credintials = { usr: API_USER, pwd: API_PWD, url: SITE_URL };

const connectToDB = () => {
  // connecting to erpNext
  const frappe = new FrappeApp(SITE_URL, {
    useToken: true,
    token: () => `${API_KEY}:${API_SECRET}`,
    type: "token",
  });
  const db = frappe.db();
  console.log("connected");
  return db;
};

brandRouter.get("/brand", async(req, res) => {
  try {
    const db = connectToDB();
    const data = await db.getDocList("Item", {
      filters: { has_variants: true },
      fields: [
        "name",
        "item_name",
        "item_code",
        "item_group",
        "description",
        "brand",
        "is_stock_item",
        "is_sales_item",
        "image",
        "has_variants",
        "variant_of",
      ],
      limit: 4000,
    });

    const priceList = await db.getDocList("Item Price", {
      fields: ["item_code", "price_list_rate"],
      limit: 4000,
    });

    data.forEach((item) => {
      const price = priceList.find(p => p.item_code === item.item_code);
      if (price) {
        item.price = price.price_list_rate;
      }
    });
    const brands = Array.from(
      new Set(
        data
          .filter((item)=> item.is_stock_item && item.is_sales_item && item.brand !== null)
          .map((item)=> item.brand)
      )
    )

    // const categories = products.map((product) => product.group)
    return res.send(brands);
  } catch (er) { 
    console.log(er);
    res.status(500).send(er);
  }
});

brandRouter.get("/brand/:category", async(req, res) => {
  const category = req.params.category;
  try {
    const db = connectToDB();
    const data = await db.getDocList("Item", {
      filters: { has_variants: true },
      fields: [
        "name",
        "item_name",
        "item_code",
        "item_group",
        "description",
        "brand",
        "is_stock_item",
        "is_sales_item",
        "image",
        "has_variants",
        "variant_of",
      ],
      limit: 4000,
    });

    const priceList = await db.getDocList("Item Price", {
      fields: ["item_code", "price_list_rate"],
      limit: 4000,
    });

    data.forEach((item) => {
      const price = priceList.find(p => p.item_code === item.item_code);
      if (price) {
        item.price = price.price_list_rate;
      }
    });
    const brands = Array.from(
      new Set(
        data
          .filter((item)=> item.is_stock_item && item.is_sales_item && item.brand !== null && item.item_group===category)
          .map((item)=> item.brand)
      )
    )

    // const categories = products.map((product) => product.group)
    return res.send(brands);
  } catch (er) { 
    console.log(er);
    res.status(500).send(er);
  }
});

module.exports = brandRouter;
