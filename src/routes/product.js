const productRouter = require("express").Router();
const db = require("../database");
const { authUser } = require("../middleware/userAuth");
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
      isForSale,
      price
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
      isForSale,
      price
    })
    await newProduct.save().then((product)=>{
      console.log('product saved')
      return res.status(200).send("Product is saved successfully");
    }).catch((err)=>{
      console.error('error saving product', err)
      return res.status(400).send("error adding product: " + err.message);
    })
  } catch (er) {
    res.status(500).send(er);
  }
});

productRouter.get("/products/:id", async (req, res) => {
  const id = req.params.id;
  try {
    // const [rows, ...rest] = await db.query(
    //   "SELECT `tabItem Price`.`price_list` AS `price_list`,`tabBin`.`actual_qty` AS `actual_qty`, `tabBin`.`projected_qty` AS `projected_qty`,`tabItem`.`item_name` AS `item_name`,`tabItem`.`item_group` AS `item_group`,`tabItem`.`image` AS `image`,`tabItem`.`description` AS `description`,`tabItem`.`brand` AS `brand`,`tabItem Price`.`price_list_rate` AS `price_list_rate`,tabItem.item_code ,`tabItem Price`.name AS id FROM ((`tabItem Price` JOIN `tabBin`  ON (`tabItem Price`.`item_code` = `tabBin`.`item_code`))  JOIN `tabItem` ON (`tabItem`.`item_code` = `tabItem Price`.`item_code`)) WHERE `tabItem`.`is_sales_item` = 1 and `tabBin`.`warehouse` = 'Stores - H'  and `tabBin`.`actual_qty` > 0 and `tabItem Price`.name = '" +
    //   id +
    //   "'",
    //   );
    await Product.findById(id).then((product)=>{
      console.log('product found')
      return res.status(200).send(product);
    }).catch((err)=>{
      console.error('error finding product', err)
    })
  } catch (er) { 
    res.status(500).send(er);
  }
});

productRouter.get("/products/brand/:brand", async (req, res) => {
  const brand = req.params.brand;
  const category = req.query.category
  if (category === undefined || category === 'all') {
    try {
      // const [rows, ...rest] = await db.query(
      //   "SELECT `tabItem Price`.`price_list` AS `price_list`,`tabBin`.`actual_qty` AS `actual_qty`, `tabBin`.`projected_qty` AS `projected_qty`,`tabItem`.`item_name` AS `item_name`,`tabItem`.`item_group` AS `item_group`,`tabItem`.`image` AS `image`,`tabItem`.`description` AS `description`,`tabItem`.`brand` AS `brand`,`tabItem Price`.`price_list_rate` AS `price_list_rate`,tabItem.item_code ,`tabItem Price`.name AS id FROM ((`tabItem Price` JOIN `tabBin`  ON (`tabItem Price`.`item_code` = `tabBin`.`item_code`))  JOIN `tabItem` ON (`tabItem`.`item_code` = `tabItem Price`.`item_code`)) WHERE `tabItem`.`is_sales_item` = 1 and `tabBin`.`warehouse` = 'Stores - H' and `tabBin`.`actual_qty` > 0 and `tabItem`.brand = '" + brand + "'",
      // );

      await Product.find({
        brand,
        isForSale: true,
        inStock: true,
      }).then((data)=>{
        console.log('products found with brand name filer')
        return res.status(200).send(data);
      }).catch((err)=>{
        console.error('error finding products with brand filtering', err)
        return res.status(400).send("error finding products with brand filtering: " + err.message);
      })
    } catch (er) {
        res.send('er');
    }
  } else {
    try {
      // const [rows, ...rest] = await db.query(
      //   "SELECT `tabItem Price`.`price_list` AS `price_list`,`tabBin`.`actual_qty` AS `actual_qty`, `tabBin`.`projected_qty` AS `projected_qty`,`tabItem`.`item_name` AS `item_name`,`tabItem`.`item_group` AS `item_group`,`tabItem`.`image` AS `image`,`tabItem`.`description` AS `description`,`tabItem`.`brand` AS `brand`,`tabItem Price`.`price_list_rate` AS `price_list_rate`,tabItem.item_code ,`tabItem Price`.name AS id FROM ((`tabItem Price` JOIN `tabBin`  ON (`tabItem Price`.`item_code` = `tabBin`.`item_code`))  JOIN `tabItem` ON (`tabItem`.`item_code` = `tabItem Price`.`item_code`)) WHERE `tabItem`.`is_sales_item` = 1 and `tabBin`.`warehouse` = 'Stores - H' and `tabBin`.`actual_qty` >0 and `tabItem`.brand = '" + brand + "' and `tabItem`.item_group ='" + category + "' ",
      // );
      await Product.find({
        brand,
        group: category,
        isForSale: true,
        inStock: true,
      }).then((data)=>{
          console.log('products found with group and brand name filter')
          return res.status(200).send(data);
      }).catch((err)=>{
        console.error('error finding products group and brand name filter', err)
        return res.status(400).send("error finding products with brand and category filtering: " + err.message);
      })
    } catch (er) {
        res.send('er');
    }
  }

});
  
productRouter.get("/searchProduct", async (req, res) => {
  const name = req.query.name;
  try {

    // const [rows, ...rest] = await db.query(
    //   "SELECT `tabItem Price`.`price_list` AS `price_list`,`tabBin`.`actual_qty` AS `actual_qty`, `tabBin`.`projected_qty` AS `projected_qty`,`tabItem`.`item_name` AS `item_name`,`tabItem`.`item_group` AS `item_group`,`tabItem`.`image` AS `image`,`tabItem`.`description` AS `description`,`tabItem`.`brand` AS `brand`,`tabItem Price`.`price_list_rate` AS `price_list_rate`,tabItem.item_code ,`tabItem Price`.name AS id FROM ((`tabItem Price` JOIN `tabBin`  ON (`tabItem Price`.`item_code` = `tabBin`.`item_code`))  JOIN `tabItem` ON (`tabItem`.`item_code` = `tabItem Price`.`item_code`)) WHERE  `tabItem`.`is_sales_item` = 1 and `tabBin`.`warehouse` = 'Stores - H' and `tabBin`.`actual_qty` > 0 and `tabItem`.`item_name` like '%" + name + "%' LIMIT 3"
    // );
    if(name){
      await Product.findOne({name, isForSale: true, inStock: true}).then((product)=>{
        console.log('your searched product found')
        return res.status(200).send(product);
      }).catch((err)=>{
        console.error('error finding product', err)
        return res.status(400).send("error finding product: " + err.message);
      })
    }else{
      return res.status(400).send("you should provide a product name")
    }
  } catch (er) { return res.send('false') }
});

productRouter.put("/products/changeQuantity", async (req, res) => {
  const items = req.body.items;
  try {
    for (const item of items) {
      await Product.updateOne(
        { code: item.code },
        { $set: { inStockQuantity: item.inStockQuantity } }
      );
    }
    console.log('All product quantities updated');
    return res.send(true);
  } catch (err) {
    console.error('Error updating product quantities', err);
    return res.status(500).send('Internal server error');
  }
});


module.exports = productRouter;