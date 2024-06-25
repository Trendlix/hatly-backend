const productRouter = require("express").Router();
const Product = require("../models/productModel");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
let { PythonShell } = require("python-shell");

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




// productRouter.get("/products/erp", async (req, res) => {
//   const db = connectToDB();

//   try {
//     // Fetch items
//     const items = await db.getDocList("Item", {
//       filters: { has_variants: true },
//       fields: [
//         "name", "item_name", "item_code", "item_group", "description", "brand", "is_stock_item", "is_sales_item", "image", "has_variants", "variant_of",
//       ],
//       limit: "4000",
//     });

//     if (!items || items.length === 0) {
//       return res.status(400).send("No items found.");
//     }

//     // Update images
//     items.forEach(item => {
//       if (!item.image) {
//         item.image = item.brand ? item.brand.charAt(0) : '';
//       } else {
//         item.image = `${process.env.ERP_SERVER}/${item.image}`;
//       }
//     });
//     let readStock = new PythonShell("./python/readStock.py")
//     // Fetch item prices
//     const priceList = await db.getDocList("Item Price", {
//       fields: ["item_code", "price_list_rate"],
//       limit: "4000",
//     });

//     // Map prices to items
//     priceList.forEach(price => {
//       items.forEach(item => {
//         if (item.item_code === price.item_code) {
//           item.price = price.price_list_rate;
//         }
//       });
//     });
//     await new Promise(resolve=>{
//       setTimeout(() => resolve(), 3000)
//       readStock.send(JSON.stringify({...credintials, "code": items.map(_=>_.item_code) }))
//       readStock.on("message", function (message) {
//         const result = message.substring(1, message.length-1).split(',')
//         console.log('result', result)
//         items.forEach((list, index)=>{
//           console.log('message[index]', result[index])
//           list.stockQty = result[index]
//         })
//         resolve()
//         // editStock.send(
//         //   JSON.stringify({ ...credintials, newQty: parseInt(message) - 1 })
//         // );
//       });
//     })

//     // Process each item
//     for (const product of items) {
//       console.log('Processing product:', product);

//       const dbProduct = await Product.findOne({ item_code: product.item_code });
//       console.log('Existing product in DB:', dbProduct);

//       if (!dbProduct) {
//         const newProduct = new Product({
//           item_code: product.item_code,
//           name: product.item_name,
//           description: product.description,
//           brand: product.brand,
//           group: product.item_group,
//           inStock: product.is_stock_item === 1,
//           isForSale: product.is_sales_item === 1,
//           images: product.image,
//           has_variants: product.has_variants === 1,
//           price: product.price ? product.price : 0,
//           variant_of: product.variant_of ? product.variant_of : 'not-found',
//           stockQty: product.stockQty >0 ? product.stockQty : 0,
//         });

//         try {
//           await newProduct.save();
//           console.log(`Product saved: ${newProduct.name}`);
//         } catch (saveError) {
//           console.error(`Error saving product: ${newProduct.name}`, saveError);
//         }
//       }
//     }
//     const dbProducts = await Product.find();

//     res.status(200).json(items);
//   } catch (error) {
//     console.error('Error processing products:', error);
//     res.status(500).send(error.message);
//   }
// });

productRouter.get('/products', async (req, res) => {
  try {
    const db = connectToDB();

    // Fetch items
    const items = await db.getDocList("Item", {
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
      limit: "4000",
    });

    if (!items || items.length === 0) {
      return res.status(404).send("No items found");
    }

    // Fetch item prices
    const priceList = await db.getDocList("Item Price", {
      fields: ["item_code", "price_list_rate"],
      limit: "4000",
    });

    if (!priceList || priceList.length === 0) {
      console.log("No prices found");
    }else{
      console.log('priceList', priceList)
    }

    // Merge prices with items
    items.forEach(item => {
      const priceItem = priceList.find(price => price.item_code === item.item_code);
      item.price = priceItem ? priceItem.price_list_rate : 0;
    });

    // Process images
    let images = []
    items.forEach(item => {
      if (!item.image) {
        const firstChar = item.brand ? item.brand.charAt(0) : '';
        item.image = [...images, firstChar];
      } else {
        item.image = [...images, `${process.env.ERP_SERVER}/${item.image}`];
      }
    });

    // Send the response
    res.status(200).json(items);

  } catch (error) {
    console.log('Error:', error);
    res.status(500).send(error.message);
  }
});


// productRouter.get("/products", async (req, res) => {
//   try {
//     // const [rows, ...rest] = await db.query(
//     //   "SELECT `tabItem Price`.`price_list` AS `price_list`,`tabBin`.`actual_qty` AS `actual_qty`, `tabBin`.`projected_qty` AS `projected_qty`,`tabItem`.`item_name` AS `item_name`,`tabItem`.`item_group` AS `item_group`,`tabItem`.`image` AS `image`,`tabItem`.`description` AS `description`,`tabItem`.`brand` AS `brand`,`tabItem Price`.`price_list_rate` AS `price_list_rate`,tabItem.item_code ,`tabItem Price`.name AS id FROM ((`tabItem Price` JOIN `tabBin`  ON (`tabItem Price`.`item_code` = `tabBin`.`item_code`))  JOIN `tabItem` ON (`tabItem`.`item_code` = `tabItem Price`.`item_code`)) WHERE `tabItem`.`is_sales_item` = 1 and `tabBin`.`actual_qty` > 0 and `tabBin`.`warehouse` = 'Stores - H'",
//     //   );
//     await Product.find().then((allProducts)=>{
//       console.log('here all products')
//       res.status(200).send(allProducts);
//     }).catch(err => console.error(err));
//   } catch (er) {
//     res.status(500).send(er);
//   }
// })

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

productRouter.get("/products/erp/:docName", async (req, res) => {
  try {
    const db = connectToDB();
    const docName = req.params.docName;
    if (!docName) return res.status(400).send("docName is required");

    // get the data
    const data = await db.getDocList("Item", {
      filters: { variant_of: docName },
      fields: [
        "name", "item_name", "item_code", "item_group", "description", "brand", "is_stock_item", "is_sales_item", "image", "has_variants", "variant_of",
      ],
      limit: "4000",
    });

    if (!data || data.length < 1) {
      return res.status(400).send("No data was found for this docName");
    }

    let readStock = new PythonShell("./python/readStock.py");
    const priceList = await db.getDocList("Item Price", {
      fields: ["item_code", "price_list_rate"],
      limit: "4000",
    });
    data.forEach(item => {
      const priceItem = priceList.find(price => price.item_code === item.item_code);
      item.price = priceItem ? priceItem.price_list_rate : 0;
    });

    // Process images
    let images = []
    data.forEach(item => {
      if (!item.image) {
        const firstChar = item.brand ? item.brand.charAt(0) : '';
        item.image = [...images, firstChar];
      } else {
        item.image = [...images, `${process.env.ERP_SERVER}/${item.image}`];
      }
    });

    let attributes = [];
    await Promise.all([
      ...data.map(_ => _.name).map(async i => {
        const doc = await db.getDoc("Item", i);
        if (doc.attributes && doc.attributes.length > 0) {
          attributes[i] = doc.attributes.map((_) => ({
            [_.attribute]: _.attribute_value
          }));
        }
      }),
      new Promise(resolve => {
        readStock.send(JSON.stringify({ ...credintials, "code": data.map(_ => _.item_code) }));
        readStock.on("message", function (message) {
          const result = message.substring(1, message.length - 1).split(',');
          data.forEach((list, index) => {
            console.log(result[index])
            list.stockQty = result[index]?.includes('None') ? 0 : Number(result[index])
          });
          resolve();
        });
      })
    ]);

    data.forEach((list, index) => {
      list.attributes = attributes[list.item_code];
    });

    console.log('sending data...');
    res.status(200).json(data);
  } catch (e) {
    console.error(e);
    res.status(500).send(e.message);
  }
});


// productRouter.get("/products/:id", async (req, res) => {
//   const id = req.params.id;
//   try {
//     // const [rows, ...rest] = await db.query(
//     //   "SELECT `tabItem Price`.`price_list` AS `price_list`,`tabBin`.`actual_qty` AS `actual_qty`, `tabBin`.`projected_qty` AS `projected_qty`,`tabItem`.`item_name` AS `item_name`,`tabItem`.`item_group` AS `item_group`,`tabItem`.`image` AS `image`,`tabItem`.`description` AS `description`,`tabItem`.`brand` AS `brand`,`tabItem Price`.`price_list_rate` AS `price_list_rate`,tabItem.item_code ,`tabItem Price`.name AS id FROM ((`tabItem Price` JOIN `tabBin`  ON (`tabItem Price`.`item_code` = `tabBin`.`item_code`))  JOIN `tabItem` ON (`tabItem`.`item_code` = `tabItem Price`.`item_code`)) WHERE `tabItem`.`is_sales_item` = 1 and `tabBin`.`warehouse` = 'Stores - H'  and `tabBin`.`actual_qty` > 0 and `tabItem Price`.name = '" +
//     //   id +
//     //   "'",
//     //   );
//     console.log(id, 'from find product by id')
//     await Product.findById(id).then((product)=>{
//       console.log('product found', product)
//       res.status(200).send(product);
//     }).catch((err)=>{
//       console.error('error finding product', err)
//     })
//   } catch (er) { 
//     res.status(500).send(er);
//   }
// })

productRouter.get("/products/brand/:brands", async (req, res) => {
  const brands = req.params.brands;
  const category = req.query.category
  const db = connectToDB();
  console.log('brand', brands);
  if (category === undefined || category === 'all') {
    // get the data
    await db
      .getDocList("Item", {
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
        limit: "4000",
      }).then(async (data) => {
        await db.getDocList("Item Price", {
            fields: ["item_code", "price_list_rate"],
            limit: "4000",
          }).then((priceList) => {
            priceList.forEach((_) => {
              data.forEach((i) => {
                if (i.item_code == _.item_code) {
                  i.price = _.price_list_rate;
                }
              });
            });
            let images = []
            const filteredData = data
              .map((item) => {
                if (item.image === null || item.image === "") {
                  const firstChar = item.brand ? item.brand.charAt(0) : "";
                  item.image = [...images, firstChar]
                } else {
                  item.image = [...images, `${process.env.ERP_SERVER}/${item.image}`];
                }
                return item;
              })
              .filter(item => item.is_stock_item && item.is_sales_item && brands.includes(item.brand));
            return res.status(200).json(filteredData);
          }).catch((e) => {
            console.log(e);
            res.status(500).send(e.message);
          });
      }).catch((e) => {
        return res.status(500).send(e.message);
      });
  } else {
    // try {
    //   // const [rows, ...rest] = await db.query(
    //   //   "SELECT `tabItem Price`.`price_list` AS `price_list`,`tabBin`.`actual_qty` AS `actual_qty`, `tabBin`.`projected_qty` AS `projected_qty`,`tabItem`.`item_name` AS `item_name`,`tabItem`.`item_group` AS `item_group`,`tabItem`.`image` AS `image`,`tabItem`.`description` AS `description`,`tabItem`.`brand` AS `brand`,`tabItem Price`.`price_list_rate` AS `price_list_rate`,tabItem.item_code ,`tabItem Price`.name AS id FROM ((`tabItem Price` JOIN `tabBin`  ON (`tabItem Price`.`item_code` = `tabBin`.`item_code`))  JOIN `tabItem` ON (`tabItem`.`item_code` = `tabItem Price`.`item_code`)) WHERE `tabItem`.`is_sales_item` = 1 and `tabBin`.`warehouse` = 'Stores - H' and `tabBin`.`actual_qty` >0 and `tabItem`.brand = '" + brand + "' and `tabItem`.item_group ='" + category + "' ",
    //   // );
    //   await Product.find({
    //     brand,
    //     group: category,
    //     isForSale: true,
    //     inStock: true,
    //   }).then((data)=>{
    //       console.log('products found with group and brand name filter')
    //       return res.status(200).send(data);
    //   }).catch((err)=>{
    //     console.error('error finding products group and brand name filter', err)
    //     return res.status(400).send("error finding products with brand and category filtering: " + err.message);
    //   })
    // } catch (er) {
    //     res.send('er');
    // }
    await db
      .getDocList("Item", {
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
        limit: "4000",
      }).then(async (data) => {
        await db.getDocList("Item Price", {
            fields: ["item_code", "price_list_rate"],
            limit: "4000",
          }).then((priceList) => {
            priceList.forEach((_) => {
              data.forEach((i) => {
                if (i.item_code == _.item_code) {
                  i.price = _.price_list_rate;
                }
              });
            });
            let images = []
            const filteredData = data
              .map((item) => {
                if (item.image === null || item.image === "") {
                  const firstChar = item.brand ? item.brand.charAt(0) : "";
                  item.image = [...images, firstChar]
                } else {
                  item.image = [...images, `${process.env.ERP_SERVER}/${item.image}`];
                }
                return item;
              })
              .filter(item => item.is_stock_item && item.is_sales_item && item.item_group===category && brands.includes(item.brand));
            return res.status(200).json(filteredData);
          }).catch((e) => {
            console.log(e);
            res.status(500).send(e.message);
          });
      }).catch((e) => {
        return res.status(500).send(e.message);
      });
  }

});
  
productRouter.get("/searchProduct", async (req, res) => {
  const name = req.query.name;
  if (!name) {
    return res.status(400).send("You should provide a product name");
  }

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
          item.image = [...images, firstChar]
        } else {
          item.image = [...images, `${process.env.ERP_SERVER}/${item.image}`];
        }
        return item;
      })
      .filter((item) => item.name.toLowerCase().includes(name.toLowerCase()) && item.is_stock_item && item.is_sales_item);

    res.status(200).json(filteredData);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

// productRouter.put("/products/changeQuantity", async (req, res) => {
//   const items = req.body.items;
//   try {
//     for (const item of items) {
//       await Product.updateOne(
//         { code: item.code },
//         { $set: { inStockQuantity: item.inStockQuantity } }
//       );
//     }
//     console.log('All product quantities updated');
//     return res.send(true);
//   } catch (err) {
//     console.error('Error updating product quantities', err);
//     return res.status(500).send('Internal server error');
//   }
// });

productRouter.put("/products/erp/:docName", async (req, res) => {
  try {
      const docName = req.params.docName;
      if (!docName) return res.status(400).send("docName is required");
      const newQty = req.body.newQty;
      if (!newQty) return res.status(400).send("New Quantity is required");

      // get stock quantity
      let editStock = new PythonShell("./python/editStock.py");

      await new Promise((resolve, reject) => {
          editStock.send(
              JSON.stringify({ ...credintials, newQty, code: docName })
          );

          editStock.on("message", function (message) {
              console.log(message);
              resolve();
          });

          editStock.on("error", function (error) {
              console.log('Error:', error);
              reject(error);
          });

          editStock.on("close", function () {
              console.log('Python script finished');
              resolve();
          });
      });

      res.status(200).send("updated");
  } catch (e) {
      console.log('Error:', e);
      res.status(500).send('internal server error');
  }
});



module.exports = productRouter;