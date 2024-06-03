from frappeclient import FrappeClient
import json
value = json.loads(input())

conn = FrappeClient(value["url"], value["usr"],  value["pwd"])
print('connecteddd')
stock_qty = []

for idx, x in enumerate(value["code"]):
    args = { "item_code": value["code"][idx] }
    print(args)
    stock_qty.append(conn.get_api("erpnext.stock.utils.get_latest_stock_qty", args))

print(stock_qty)
