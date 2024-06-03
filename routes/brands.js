const brandRouter = require("express").Router();
const Product = require("../models/productModel");

brandRouter.get("/brand", async(req, res) => {
  try {
    // const [rows , ...rest]  = await db.query(
    //   "SELECT `tabItem`.`brand` AS `brand` FROM ((`tabItem Price` JOIN `tabBin` ON (`tabItem Price`.`item_code` = `tabBin`.`item_code`)) JOIN `tabItem` ON (`tabItem`.`item_code` = `tabItem Price`.`item_code`)) WHERE `tabItem`.`is_sales_item` = 1 and `tabBin`.`warehouse` = 'Stores - H' and `tabBin`.`actual_qty` <> 0 GROUP BY `tabItem`.`brand`",
    //   );
    const uniqueBrands = await Product.distinct("brand",{
      isForSale: true,
      inStock: true,
    })
    // const brands = products.map((product) => product.brand)
    return res.send(uniqueBrands);
  } catch (er) { }
});

brandRouter.get("/brand/:category", async(req, res) => {
  const category = req.params.category;
  try {
    // const [rows , ...rest]  = await db.query(
    //   "SELECT `tabItem`.`brand` AS `brand`,`tabItem`.`item_group` AS `item_group` FROM ((`tabItem Price` JOIN `tabBin` ON (`tabItem Price`.`item_code` = `tabBin`.`item_code`)) JOIN `tabItem` ON (`tabItem`.`item_code` = `tabItem Price`.`item_code`)) WHERE `tabItem`.`is_sales_item` = 1 and `tabBin`.`warehouse` = 'Stores - H' and `tabBin`.`actual_qty` <> 0 and `tabItem`.item_group = '" + category + "' GROUP BY `tabItem`.`brand`",
    //   );
    const uniqueCategoryBrands = await Product.distinct('brand',{
      isForSale: true,
      inStock: true,
      group: category,
    })
    return res.send(uniqueCategoryBrands);
  } catch (er) { }
});

module.exports = brandRouter;
