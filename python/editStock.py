from frappeclient import FrappeClient
import json
value = json.loads(input())

conn = FrappeClient(value["url"], value["usr"],  value["pwd"])
args = {"item_code": value["code"]}
# print('connecteddd', value["code"], value["newQty"])
doc = { 
    "doctype": "Stock Reconciliation",
	"purpose": "Stock Reconciliation",
	"items": [{
	 "item_code": value["code"], "qty": value["newQty"], "valuation_rate": 10,  "warehouse": "Stores - H", 
	}] 
}
stock_qty = conn.get_api("erpnext.stock.utils.get_latest_stock_qty", args)
# print("old stock is", stock_qty)
# print(doc)
insertedDoc = conn.insert(doc)
# print('inserted', insertedDoc["name"])
insertedDoc["docstatus"] = 1
conn.update(insertedDoc)
# print("updated successfully")

stock_qty = conn.get_api("erpnext.stock.utils.get_latest_stock_qty", args)

print("new stock is", stock_qty)