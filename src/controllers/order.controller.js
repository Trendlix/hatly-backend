const db = require("../database");
const { customAlphabet } = require('nanoid');
const ServerError = require("../utils/ErrorInterface");
const sendSMS = require("../utils/sendSMS");
const Order = require("../models/orderModel");
const alphabet = '0123456789';
const nanoid = customAlphabet(alphabet, 12);

//INSERT INTO `_ce526a619e3f46ae`.`tabSales Order` (`name`, `creation`, `modified`, `modified_by`, `owner`, `docstatus`, `idx`, `title`, `naming_series`, `customer`, `customer_name`, `order_type`, `skip_delivery_note`, `company`, `transaction_date`, `customer_address`, `address_display`, `contact_display`, `contact_phone`, `contact_mobile`, `contact_email`, `shipping_address`, `customer_group`, `territory`, `currency`, `conversion_rate`, `selling_price_list`, `price_list_currency`, `plc_conversion_rate`, `ignore_pricing_rule`, `set_warehouse`, `total_qty`, `base_total`, `base_net_total`, `total`, `net_total`, `base_total_taxes_and_charges`, `total_taxes_and_charges`, `loyalty_points`, `loyalty_amount`, `apply_discount_on`, `base_discount_amount`, `additional_discount_percentage`, `discount_amount`, `base_grand_total`, `base_rounding_adjustment`, `base_rounded_total`, `grand_total`, `rounding_adjustment`, `rounded_total`, `advance_paid`, `payment_terms_template`, `party_account_currency`, `language`, `group_same_items`, `status`, `delivery_status`, `per_delivered`, `per_billed`, `billing_status`, `commission_rate`, `total_commission`, `_seen`, `disable_rounded_total`, `is_internal_customer`, `per_picked`, `amount_eligible_for_commission`) VALUES ('testac70a2', '2022-12-20 14:26:12.405428', '2022-12-20 14:26:12.405428', 'admin@hatlystore.com', 'admin@hatlystore.com', '1', '0', '{customer_name}', 'SAL-ORD-.YYYY.-', 'Hamed Osama_1670419225808', 'Hamed Osama', 'sales', '0', 'HatlyStore', '2022-12-29', '2b ahmed st, helwan, cairo', 'new Cairo<br>new Cairo<br>Cairo<br>', 'Hamed Osama', '01023626494', '01023626494', 'h.osama@trendlix.com', '<br><br>', 'All Customer Groups', 'All Territories', 'EGP', '1.000000000', 'Standard Selling', 'EGP', '1.000000000', '0', 'Stores - H', '1.000000000', '18500.000000000', '18500.000000000', '18500.000000000', '18500.000000000', '50.000000000', '50.000000000', '0', '0', 'Grand Total', '0', '0', '0', '18550.000000000', '0', '18550.000000000', '18550.000000000', '0', '0', '0', 'Cash', 'EGP', 'en', '0', 'To Deliver and Bill', 'Not Delivered', '0', '0', 'Not Billed', '0', '0', '[\"admin@hatlystore.com\"]', '0', '0', '0', '18550.000000000');

// INSERT INTO `_ce526a619e3f46ae`.`tabSales Order Item` (`name`, `modified_by`, `owner`, `docstatus`, `parent`, `parentfield`, `parenttype`, `idx`, `item_code`, `ensure_delivery_based_on_produced_serial_no`, `item_name`, `item_group`, `brand`, `image`, `qty`, `conversion_factor`, `stock_qty`, `price_list_rate`, `base_price_list_rate`, `rate`, `amount`, `base_rate`, `base_amount`, `net_rate`, `net_amount`, `base_net_rate`, `base_net_amount`) VALUES ('shsy6a6a', 'admin@hatlystore.com', 'admin@hatlystore.com', '1', 'test', 'items', 'Sales Order', '1', 'black shark 5 pro 16+512 black', '0', 'Black Shark 5 Pro  Black', 'Mobiles', 'Xiaomi', '/files/qa.jpg', '1', '1', '1', '18500', '18500', '18500', '18500', '18500', '18500', '18500', '18500', '18500', '18500');

// INSERT INTO `_ce526a619e3f46ae`.`tabPayment Schedule` (`name`, `modified_by`, `owner`, `docstatus`, `parent`, `parentfield`, `parenttype`, `idx`, `payment_term`, `invoice_portion`, `payment_amount`, `outstanding`, `base_payment_amount`) VALUES ('testing1', 'admin@hatlystore.com', 'admin@hatlystore.com', '1', 'test', 'payment_schedule', 'Sales Order', '1', 'Valu', '100', '18500.000000000', '18500.000000000', '18500.000000000');
// const addOrder = async (req, res, next) => {
//   try {
//     const user = req.user;
//     // const query = `SELECT * From tabCustomer WHERE tabCustomer.id = "${user.id}";`
//     // const query = "SELECT * From `_ce526a619e3f46ae`.`tabCustomer` WHERE `tabCustomer`.`id` = '6390931943187d5d22a1e63e';"
//     // console.log(query)
//     // get user from db
//     const [erpUser, ...rest] = await db.query(
//       "SELECT * From `tabCustomer` Where `idx` = ?;",
//       [user.id]
//     )
//     // get user username
//     const username = erpUser[0]?.name;
//     // get data from request body
//     const { userData, orderedItems, totalPrice, delivery, subTotal, paymentMethod, TransactionId } = req.body
//     // generate orderId
//     const orderId = nanoid();
//     // get current Date
//     const date = new Date();
//     // add order
//     const [[order], ...orderRest] = await db.query(
//       "INSERT INTO `tabSales Order` (`name`, `creation`, `modified`, `modified_by`, `owner`, `docstatus`, `idx`, `title`, `naming_series`, `customer`, `customer_name`, `order_type`, `skip_delivery_note`, `company`, `transaction_date`, `customer_address`, `address_display`, `contact_display`, `contact_phone`, `contact_mobile`, `contact_email`, `shipping_address`, `customer_group`, `territory`, `currency`, `conversion_rate`, `selling_price_list`, `price_list_currency`, `plc_conversion_rate`, `ignore_pricing_rule`, `set_warehouse`, `total_qty`, `base_total`, `base_net_total`, `total`, `net_total`, `base_total_taxes_and_charges`, `total_taxes_and_charges`, `loyalty_points`, `loyalty_amount`, `apply_discount_on`, `base_discount_amount`, `additional_discount_percentage`, `discount_amount`, `base_grand_total`, `base_rounding_adjustment`, `base_rounded_total`, `grand_total`, `rounding_adjustment`, `rounded_total`, `advance_paid`, `payment_terms_template`, `party_account_currency`, `language`, `group_same_items`, `status`, `delivery_status`, `per_delivered`, `per_billed`, `billing_status`, `commission_rate`, `total_commission`, `_seen`, `disable_rounded_total`, `is_internal_customer`, `per_picked`, `amount_eligible_for_commission`, `state`,`city`,`street`,`building`,`floor`,`apartment`,`extraDescription`,`paymentMethod`) VALUES ( ?, ?, ?, 'admin@hatlystore.com', 'admin@hatlystore.com', '1', '0', '{customer_name}', 'SAL-ORD-.YYYY.-', ?, ?, 'sales', '0', 'HatlyStore', ?, ?, ?, ?, ?, ?, ?, ?, 'All Customer Groups', 'All Territories', 'EGP', '1.000000000', 'Standard Selling', 'EGP', '1.000000000', '0', 'Stores - H', '1.000000000', ?, ?, ?, ?, ?, ?, '0', '0', 'Grand Total', '0', '0', '0', ?, '0', ?, ?, '0', '0', '0', ?, 'EGP', 'en', '0', 'To Deliver and Bill', 'Not Delivered', '0', '0', 'Not Billed', '0', '0', '[\"admin@hatlystore.com\"]', '0', '0', '0', ? ,? ,? ,? ,? ,? ,? ,?,?) RETURNING * ;",
//       [
//         orderId,
//         date,
//         date,
//         username,
//         `${userData.firstName} ${userData.lastName}`,
//         date,
//         `${userData.building} ${userData.street} st. ${userData.city} ,${userData.state}`,
//         `State: ${user.state} 
//         <br>
//         City: ${user.city}
//         <br>
//         Street: ${user.street}
//         <br>
//         Building: ${user.building}
//         <br>
//         Floor: ${user.floor}
//         <br>
//         Apartment: ${user.apartment}
//         <br>
//         Extra Data: ${user.extraDescription || ''}
//         <br>
//         Mobile Number: ${user.phone}
//         <br>
//         Email: ${user.email}
//         <br>
//         Customer Name: ${user.firstName} ${user.lastName}
//         <br>
//         ${TransactionId && `TransactionId : ${TransactionId}`}
//         `,
//         `${userData.firstName} ${userData.lastName}`,
//         userData.phone,
//         userData.phone,
//         userData.email,
//         `State: ${userData.state} 
//         <br>
//         City: ${userData.city}
//         <br>
//         Street: ${userData.street}
//         <br>
//         Building: ${userData.building}
//         <br>
//         Floor: ${userData.floor}
//         <br>
//         Apartment: ${userData.apartment}
//         <br>
//         Extra Data: ${userData.extraDescription || ''}
//         <br>
//         Mobile Number: ${userData.phone}
//         <br>
//         Email: ${userData.email}
//         <br>
//         Customer Name: ${userData.firstName} ${userData.lastName}
//         <br>
//         ${TransactionId && `TransactionId : ${TransactionId}`}
//         `,
//         totalPrice,
//         totalPrice,
//         totalPrice,
//         totalPrice,
//         delivery,
//         delivery,
//         subTotal,
//         subTotal,
//         subTotal,
//         paymentMethod,
//         subTotal,
//         userData.state,
//         userData.city,
//         userData.street,
//         userData.building,
//         userData.floor,
//         userData.apartment,
//         userData.extraDescription,
//         paymentMethod === 'Cash' ? 'Cash on Delivery' : 'Online Payment'
//       ]
//     )
//     // generate orderPaymentId
//     const orderPaymentId = nanoid();
//     // add order payment
//     const [orderPayment, ...orderPaymentRest] = await db.query(
//       "INSERT INTO `tabPayment Schedule` (`name`, `modified_by`, `owner`, `docstatus`, `parent`, `parentfield`, `parenttype`, `idx`, `payment_term`, `invoice_portion`, `payment_amount`, `outstanding`, `base_payment_amount`) VALUES (?, 'admin@hatlystore.com', 'admin@hatlystore.com', '1', ? , 'payment_schedule', 'Sales Order', '1', ?, '100', ?, ?, ?) RETURNING *;"
//       ,
//       [
//         orderPaymentId,
//         orderId,
//         order.payment_terms_template,
//         order.base_grand_total,
//         order.base_grand_total,
//         order.base_grand_total,
//       ]
//     )
//     const ERPOrderedItems = []

//     for (const item of orderedItems) {
//       // generate orderedItemId
//       const orderedItemId = nanoid();
//       const [[orderedItem], ...orderedItemRest] = await db.query(
//         "INSERT INTO `tabSales Order Item` (`name`, `modified_by`, `owner`,`docstatus`,`parent`,`parentfield`, `parenttype`, `idx`,`item_code`, `ensure_delivery_based_on_produced_serial_no`, `item_name`, `item_group`, `brand`, `image`, `description`, `qty`, `conversion_factor`, `stock_qty`, `price_list_rate`, `base_price_list_rate`, `rate`, `amount`, `base_rate`, `base_amount`, `net_rate`, `net_amount`, `base_net_rate`, `base_net_amount`) VALUES (?, 'admin@hatlystore.com', 'admin@hatlystore.com', '1', ?, 'items', 'Sales Order', '1', ?, '0', ?, ?, ?, ?, ?, ?, '1', ?, ? ,?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *;"
//         ,
//         [
//           orderedItemId,
//           orderId,
//           item.item_code,
//           item.item_name,
//           item.item_group,
//           item.brand,
//           item.image,
//           item.description,
//           item.quantity,
//           item.projected_qty,
//           item.price_list_rate,
//           item.price_list_rate,
//           item.price_list_rate,
//           item.price_list_rate * item.quantity,
//           item.price_list_rate,
//           item.price_list_rate * item.quantity,
//           item.price_list_rate,
//           item.price_list_rate * item.quantity,
//           item.price_list_rate,
//           item.price_list_rate * item.quantity,

//         ]
//       )
//       ERPOrderedItems.push(orderedItem);
//     }
//     console.log(orderPayment);
//     console.log(ERPOrderedItems);
//     //INSERT INTO `_ce526a619e3f46ae`.`tabSales Order` (`name`, `creation`, `modified`, `modified_by`, `owner`, `docstatus`, `idx`, `title`, `naming_series`, `customer`, `customer_name`, `order_type`, `skip_delivery_note`, `company`, `transaction_date`, `customer_address`, `address_display`, `contact_display`, `contact_phone`, `contact_mobile`, `contact_email`, `shipping_address`, `customer_group`, `territory`, `currency`, `conversion_rate`, `selling_price_list`, `price_list_currency`, `plc_conversion_rate`, `ignore_pricing_rule`, `set_warehouse`, `total_qty`, `base_total`, `base_net_total`, `total`, `net_total`, `base_total_taxes_and_charges`, `total_taxes_and_charges`, `loyalty_points`, `loyalty_amount`, `apply_discount_on`, `base_discount_amount`, `additional_discount_percentage`, `discount_amount`, `base_grand_total`, `base_rounding_adjustment`, `base_rounded_total`, `grand_total`, `rounding_adjustment`, `rounded_total`, `advance_paid`, `payment_terms_template`, `party_account_currency`, `language`, `group_same_items`, `status`, `delivery_status`, `per_delivered`, `per_billed`, `billing_status`, `commission_rate`, `total_commission`, `_seen`, `disable_rounded_total`, `is_internal_customer`, `per_picked`, `amount_eligible_for_commission`) VALUES ('testac70a2', '2022-12-20 14:26:12.405428', '2022-12-20 14:26:12.405428', 'admin@hatlystore.com', 'admin@hatlystore.com', '1', '0', '{customer_name}', 'SAL-ORD-.YYYY.-', 'Hamed Osama_1670419225808', 'Hamed Osama', 'sales', '0', 'HatlyStore', '2022-12-29', '2b ahmed st, helwan, cairo', 'new Cairo<br>new Cairo<br>Cairo<br>', 'Hamed Osama', '01023626494', '01023626494', 'h.osama@trendlix.com', '<br><br>', 'All Customer Groups', 'All Territories', 'EGP', '1.000000000', 'Standard Selling', 'EGP', '1.000000000', '0', 'Stores - H', '1.000000000', '18500.000000000', '18500.000000000', '18500.000000000', '18500.000000000', '50.000000000', '50.000000000', '0', '0', 'Grand Total', '0', '0', '0', '18550.000000000', '0', '18550.000000000', '18550.000000000', '0', '0', '0', 'Cash', 'EGP', 'en', '0', 'To Deliver and Bill', 'Not Delivered', '0', '0', 'Not Billed', '0', '0', '[\"admin@hatlystore.com\"]', '0', '0', '0', '18550.000000000');
//     await sendSMS(user.phone, `Your order ${orderId} has been confirmed check it from here https://hatlystore.trendlix.com/orders/${orderId}`);
//     res.status(201).json({
//       ok: true,
//       code: 200,
//       message: 'succeeded',
//       body: order
//     })
//   } catch (e) {
//     next(e)
//   }
// }

const getUserOrders = async (req, res, next) => {
  try {
    // const { page, limit } = req.query;
    // const currentPage = +page || 1;
    // const currentLimit = +limit || 4;
    // const skip = (currentPage - 1) * currentLimit;
    const user = req.user;
    // get user from db
    // const [[erpUser], ...rest] = await db.query(
    //   "SELECT * From `tabCustomer` Where `idx` = ?;",
    //   [user.id]
    // )
    // get user username
    // const username = erpUser?.name;
    // const [[totalLength]] = await db.query(
    //   "SELECT COUNT(*) as `orders` from `tabSales Order`  WHERE `customer` = ?",
    //   [username]
    // )
    // console.log(totalLength.orders)
    // const [orders, ...ordersRest] = await db.query(
    //   "select * from `tabSales Order` WHERE `customer` = ? ORDER BY creation DESC LIMIT ? OFFSET ?;",
    //   [
    //     username,
    //     currentLimit,
    //     skip
    //   ]
    // )
    // for (const order of orders) {
    //   const [orderItems, ...orderItemsRest] = await db.query(
    //     "select * from `tabSales Order Item` WHERE `parent` = ?",
    //     [order?.name]
    //   )
    //   order.ordersItems = orderItems;
    // }
    
    const userOrders = await Order.find({userId: user._id})
    if(userOrders.length < 1) {
      return res.status(200).json({
        ok: true,
        status: 200,
        message:'You haven\'t placed any orders yet',
        data: [],
        totalLength: 0
      })
    }    
    res.status(200).json({
      ok: true,
      status: 200,
      message: 'succeeded',
      data: userOrders,
      totalLength: userOrders.length
    })
  } catch (e) {
    next(e);
  }
}

const getOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const user = req.user
    if (!orderId)
      return next(ServerError.badRequest(400, 'order id is required'));
    // get user from db
    // const [erpUser, ...rest] = await db.query(
    //   "SELECT * From `tabCustomer` Where `idx` = ?;",
    //   [user.id]
    // )
    // // get user username
    // const username = erpUser[0]?.name;
    // const [[order], ...orderRest] = await db.query(
    //   "select * from `tabSales Order` WHERE `name` = ?;",
    //   [
    //     orderId,
    //   ]
    // )

    const order = await Order.findById(orderId).populate('products.productId')
    if (!order.userId.equals(user._id))
      return next(ServerError.badRequest(400, 'order not found'));
    // const [orderItems, ...orderItemsRest] = await db.query(
    //   "select * from `tabSales Order Item` WHERE `parent` = ?",
    //   [order?.name]
    // )
    // order.ordersItems = orderItems;
    res.status(200).json({
      ok: true,
      status: 200,
      message: 'succeeded',
      data: order.products,
    })
  } catch (e) {
    next(e)
  }
}

module.exports = { getUserOrders, getOrder }