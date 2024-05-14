const categoryRouter = require("express").Router();
const db = require("../database");

categoryRouter.get("/category", async(req, res) => {
  try {
    const [rows , ...rest] = await db.query(
      "SELECT `tabItem`.`item_group` AS `item_group` FROM (`tabItem` JOIN `tabItem Price` ON (`tabItem`.`item_code` = `tabItem Price`.`item_code`)) GROUP BY `tabItem`.`item_group`"
    );
    res.send(rows)
  } catch (er) { }
});

categoryRouter.get("/category/:category",async (req, res) => {
  const category = req.params.category;
  try {
    const [rows , ...rest]  = await db.query("SELECT `tabItem Price`.`price_list` AS `price_list`,`tabBin`.`actual_qty` AS `actual_qty`, `tabBin`.`projected_qty` AS `projected_qty`,`tabItem`.`item_name` AS `item_name`,`tabItem`.`item_group` AS `item_group`,`tabItem`.`image` AS `image`,`tabItem`.`description` AS `description`,`tabItem`.`brand` AS `brand`,`tabItem Price`.`price_list_rate` AS `price_list_rate`,tabItem.item_code ,`tabItem Price`.name AS id FROM ((`tabItem Price` JOIN `tabBin`  ON (`tabItem Price`.`item_code` = `tabBin`.`item_code`))  JOIN `tabItem` ON (`tabItem`.`item_code` = `tabItem Price`.`item_code`)) WHERE `tabItem`.`is_sales_item` = 1 and `tabBin`.`warehouse` = 'Stores - H' and `tabBin`.`actual_qty` > 0 and `tabItem`.item_group = '" + category + "'",
      );
      return res.send(rows);
  } catch (er) { }
});

module.exports = categoryRouter;
