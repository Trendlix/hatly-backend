const categoryRouter = require("express").Router();
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


categoryRouter.get("/category", async(req, res) => {
  try {
    // // const [rows , ...rest] = await db.query(
    // //   "SELECT `tabItem`.`item_group` AS `item_group` FROM (`tabItem` JOIN `tabItem Price` ON (`tabItem`.`item_code` = `tabItem Price`.`item_code`)) GROUP BY `tabItem`.`item_group`"
    // // );
    // const products = await Product.find({
    //   isForSale: true,
    //   inStock: true,
    // })
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
    const categories = Array.from(
      new Set(
        data
          .filter((item)=> item.is_stock_item && item.is_sales_item)
          .map((item)=> item.item_group)
      )
    )

    // const categories = products.map((product) => product.group)
    return res.send(categories);
  } catch (er) { }
});

categoryRouter.get("/category/:category",async (req, res) => {
  const category = req.params.category;
  try {
    const db = connectToDB(); // Assuming this function is correctly defined elsewhere

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

    // Map price data to item data
    data.forEach((item) => {
      const price = priceList.find(p => p.item_code === item.item_code);
      if (price) {
        item.price = price.price_list_rate;
      }
    });

    // Filter and transform data
    let images = []
    const filteredData = data
      .map((item) => {
        if (item.image === null || item.image === "") {
          const firstChar = item.brand ? item.brand.charAt(0) : "";
          item.image = [...images, firstChar];
        } else {
          item.image = [...images,`${process.env.ERP_SERVER}/${item.image}`];
        }
        return item;
      })
      .filter((item) => item.item_group===category && item.is_stock_item && item.is_sales_item);

    res.status(200).json(filteredData);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }

});

module.exports = categoryRouter;
