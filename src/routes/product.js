const productRouter = require("express").Router();
const db = require("../database");
const Product = require("../models/productModel");

productRouter.get("/products", async (req, res) => {
  try {
    // const [rows, ...rest] = await db.query(
    //   "SELECT `tabItem Price`.`price_list` AS `price_list`,`tabBin`.`actual_qty` AS `actual_qty`, `tabBin`.`projected_qty` AS `projected_qty`,`tabItem`.`item_name` AS `item_name`,`tabItem`.`item_group` AS `item_group`,`tabItem`.`image` AS `image`,`tabItem`.`description` AS `description`,`tabItem`.`brand` AS `brand`,`tabItem Price`.`price_list_rate` AS `price_list_rate`,tabItem.item_code ,`tabItem Price`.name AS id FROM ((`tabItem Price` JOIN `tabBin`  ON (`tabItem Price`.`item_code` = `tabBin`.`item_code`))  JOIN `tabItem` ON (`tabItem`.`item_code` = `tabItem Price`.`item_code`)) WHERE `tabItem`.`is_sales_item` = 1 and `tabBin`.`actual_qty` > 0 and `tabBin`.`warehouse` = 'Stores - H'",
    //   );
    await Product.find().then((allProducts)=>{
      console.log('here all products')
      return res.status(200).send(allProducts);
    }).catch(err => console.error(err));
  } catch (er) {
    res.status(500).send(er);
  }
});

productRouter.post("/products", async (req, res) => {
  try {
    // const [rows, ...rest] = await db.query(
    //   "SELECT `tabItem Price`.`price_list` AS `price_list`,`tabBin`.`actual_qty` AS `actual_qty`, `tabBin`.`projected_qty` AS `projected_qty`,`tabItem`.`item_name` AS `item_name`,`tabItem`.`item_group` AS `item_group`,`tabItem`.`image` AS `image`,`tabItem`.`description` AS `description`,`tabItem`.`brand` AS `brand`,`tabItem Price`.`price_list_rate` AS `price_list_rate`,tabItem.item_code ,`tabItem Price`.name AS id FROM ((`tabItem Price` JOIN `tabBin`  ON (`tabItem Price`.`item_code` = `tabBin`.`item_code`))  JOIN `tabItem` ON (`tabItem`.`item_code` = `tabItem Price`.`item_code`)) WHERE `tabItem`.`is_sales_item` = 1 and `tabBin`.`actual_qty` > 0 and `tabBin`.`warehouse` = 'Stores - H'",
    //   );
    const {
      code,
      name,
      group,
      color,
      storage,
      images,
      description,
      brand,
      priceFrom,
      priceTo,
      ram,
      inStockQuantity,
      inStock,
      isForSale
    } = req.body

    const newProduct = new Product({
      code,
      name,
      group,
      color,
      storage,
      images,
      description,
      brand,
      priceFrom,
      priceTo,
      ram,
      inStockQuantity,
      inStock,
      isForSale
    })
    await newProduct.save().then((product)=>{
      console.log('product saved')
      return res.status(200).send("Product is saved successfully");
    }).catch((err)=>{
      console.error('error saving product', err)
    })
  } catch (er) {
    res.status(500).send(er);
  }
});

productRouter.get("/products/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const [rows, ...rest] = await db.query(
      "SELECT `tabItem Price`.`price_list` AS `price_list`,`tabBin`.`actual_qty` AS `actual_qty`, `tabBin`.`projected_qty` AS `projected_qty`,`tabItem`.`item_name` AS `item_name`,`tabItem`.`item_group` AS `item_group`,`tabItem`.`image` AS `image`,`tabItem`.`description` AS `description`,`tabItem`.`brand` AS `brand`,`tabItem Price`.`price_list_rate` AS `price_list_rate`,tabItem.item_code ,`tabItem Price`.name AS id FROM ((`tabItem Price` JOIN `tabBin`  ON (`tabItem Price`.`item_code` = `tabBin`.`item_code`))  JOIN `tabItem` ON (`tabItem`.`item_code` = `tabItem Price`.`item_code`)) WHERE `tabItem`.`is_sales_item` = 1 and `tabBin`.`warehouse` = 'Stores - H'  and `tabBin`.`actual_qty` > 0 and `tabItem Price`.name = '" +
      id +
      "'",
      );
      return res.send(rows);
  } catch (er) { }
});

productRouter.get("/products/brand/:brand", async (req, res) => {
  const brand = req.params.brand;
  const category = req.query.category
  if (category == undefined) {
    try {
      const [rows, ...rest] = await db.query(
        "SELECT `tabItem Price`.`price_list` AS `price_list`,`tabBin`.`actual_qty` AS `actual_qty`, `tabBin`.`projected_qty` AS `projected_qty`,`tabItem`.`item_name` AS `item_name`,`tabItem`.`item_group` AS `item_group`,`tabItem`.`image` AS `image`,`tabItem`.`description` AS `description`,`tabItem`.`brand` AS `brand`,`tabItem Price`.`price_list_rate` AS `price_list_rate`,tabItem.item_code ,`tabItem Price`.name AS id FROM ((`tabItem Price` JOIN `tabBin`  ON (`tabItem Price`.`item_code` = `tabBin`.`item_code`))  JOIN `tabItem` ON (`tabItem`.`item_code` = `tabItem Price`.`item_code`)) WHERE `tabItem`.`is_sales_item` = 1 and `tabBin`.`warehouse` = 'Stores - H' and `tabBin`.`actual_qty` > 0 and `tabItem`.brand = '" + brand + "'",
      );
      return res.send(rows);
    } catch (er) {
      return res.send('er');
    }
  } else {
    try {
      const [rows, ...rest] = await db.query(
        "SELECT `tabItem Price`.`price_list` AS `price_list`,`tabBin`.`actual_qty` AS `actual_qty`, `tabBin`.`projected_qty` AS `projected_qty`,`tabItem`.`item_name` AS `item_name`,`tabItem`.`item_group` AS `item_group`,`tabItem`.`image` AS `image`,`tabItem`.`description` AS `description`,`tabItem`.`brand` AS `brand`,`tabItem Price`.`price_list_rate` AS `price_list_rate`,tabItem.item_code ,`tabItem Price`.name AS id FROM ((`tabItem Price` JOIN `tabBin`  ON (`tabItem Price`.`item_code` = `tabBin`.`item_code`))  JOIN `tabItem` ON (`tabItem`.`item_code` = `tabItem Price`.`item_code`)) WHERE `tabItem`.`is_sales_item` = 1 and `tabBin`.`warehouse` = 'Stores - H' and `tabBin`.`actual_qty` >0 and `tabItem`.brand = '" + brand + "' and `tabItem`.item_group ='" + category + "' ",
      );
      return res.send(rows);
    } catch (er) {
      return res.send('er');
    }
  }

});
  
productRouter.get("/searchProduct/:name", async (req, res) => {
  const name = req.params.name;
  try {

    const [rows, ...rest] = await db.query(
      "SELECT `tabItem Price`.`price_list` AS `price_list`,`tabBin`.`actual_qty` AS `actual_qty`, `tabBin`.`projected_qty` AS `projected_qty`,`tabItem`.`item_name` AS `item_name`,`tabItem`.`item_group` AS `item_group`,`tabItem`.`image` AS `image`,`tabItem`.`description` AS `description`,`tabItem`.`brand` AS `brand`,`tabItem Price`.`price_list_rate` AS `price_list_rate`,tabItem.item_code ,`tabItem Price`.name AS id FROM ((`tabItem Price` JOIN `tabBin`  ON (`tabItem Price`.`item_code` = `tabBin`.`item_code`))  JOIN `tabItem` ON (`tabItem`.`item_code` = `tabItem Price`.`item_code`)) WHERE  `tabItem`.`is_sales_item` = 1 and `tabBin`.`warehouse` = 'Stores - H' and `tabBin`.`actual_qty` > 0 and `tabItem`.`item_name` like '%" + name + "%' LIMIT 3"
    );
    return res.send(rows);
  } catch (er) { return res.send('false') }
});

productRouter.put("/products/changeQuantity", async (req, res) => {
  const items = req.body.items;
  try {
    items.map((item, i) => {
      const [rows, ...rest] =  db.query(
        "UPDATE `tabBin` SET `actual_qty` = `actual_qty` - " +
        item.quantity +
        ", `projected_qty` = `projected_qty` -" +
        item.quantity +
        " WHERE `item_code` = '" +
        item.item_code +
        "' and warehouse = 'Stores - H';"
      );
    });
    return res.send(true);
  } catch (er) { }
});

module.exports = productRouter;