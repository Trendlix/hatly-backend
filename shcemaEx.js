const schemaVariables = {
    code: ["string", "required", "unique"], //erpData => item_code
    name: ["string", "required", "unique"], //erpData => item_name
    group: ["string", "required", "enum: ['phones', 'charges', 'smart watches', 'headphones', 'accessories']"], //erpData => item_group
    description: ["string", "required"], //erpData => description
    brand: ["string", "required"], //erpData => brand
    inStock: ["boolean", "required", "default: true"], //erpData => is_stock_item
    isForSale: ["boolean", "required", "default: true"], //erpData => is_sales_item
    images: [["string"]], //erpData => image
    color: ["string", "required"], // return a demo value unless its get_one //erpData => attributes.attribute: attributes.attribute_value
    storage: ["number"], // return a demo value unless its get_one //erpData => attributes.attribute: attributes.attribute_value
    ram: ["number", "required"], // return a demo value unless its get_one //erpData => attributes.attribute: attributes.attribute_value
    price: ["number", "required", "default: 0"], // priceData => price_list_rate
    inStockQuantity: ["number", "required"], // return a demo value unless its get_one
    priceFrom: ["number", "required"], 
    priceTo: ["number"],
}

// Item
const erpData = {
    "name": "Xiaomi 14-Black-12-256GB-China Version",
    "item_code": "Xiaomi 14-Black-12-256GB-China Version",
    "item_name": "Xiaomi 14-Black-12-256GB-China Version",
    "item_group": "Mobiles",
    "is_stock_item": 1,
    "is_purchase_item": 1,
    "has_variants": 0,
    "variant_of": "Xiaomi 14",
    "description": "<div><table><tbody><tr><td>Technology</td><td>GSM / CDMA / HSPA / CDMA2000 / LTE / 5G</td><td><br></td></tr><tr><td>Announced</td><td>2023, October 26</td><td><br></td></tr><tr><td>Status</td><td>Available. Released 2023, November 01</td><td><br></td></tr><tr><td>Dimensions</td><td>152.8 x 71.5 x 8.2 mm or 8.3 mm</td><td><br></td></tr><tr><td>Weight</td><td>188 g or 193 g (6.63 oz)</td><td><br></td></tr><tr><td>Build</td><td>Glass front, glass back or silicone polymer back, aluminum frame</td><td><br></td></tr><tr><td>SIM</td><td>Nano-SIM and eSIM or Dual SIM (Nano-SIM, dual stand-by)</td><td><br></td></tr><tr><td>Type</td><td>IP68 dust/water resistant (up to 1.5m for 30 min)</td><td><br></td></tr><tr><td><br></td><td>LTPO OLED, 68B colors, 120Hz, Dolby Vision, HDR10+, 3000 nits (peak)</td><td><br></td></tr><tr><td>Size</td><td>6.36 inches, 97.6 cm2 (~89.3% screen-to-body ratio)</td><td><br></td></tr><tr><td>Resolution</td><td>1200 x 2670 pixels, 20:9 ratio (~460 ppi density)</td><td><br></td></tr><tr><td>OS</td><td>Android 14, HyperOS</td><td><br></td></tr><tr><td>Chipset</td><td>Qualcomm SM8650-AB Snapdragon 8 Gen 3 (4 nm)</td><td><br></td></tr><tr><td> CPU</td><td>Octa-core (1x3.3 GHz Cortex-X4 &amp; 5x3.2 GHz Cortex-A720 &amp; 2x2.3 GHz Cortex-A520)</td><td><br></td></tr><tr><td>GPU</td><td>Adreno 750</td><td><br></td></tr><tr><td>Card slot</td><td>No</td><td><br></td></tr><tr><td>Internal</td><td>256GB 8GB RAM, 256GB 12GB RAM, 512GB 16GB RAM, 1TB 16GB RAM</td><td><br></td></tr><tr><td><br></td><td>UFS 4.0</td><td><br></td></tr><tr><td>Triple</td><td>50 MP, f/1.6, 23mm (wide), 1/1.31\", 1.2µm, dual pixel PDAF, Laser AF, OIS</td><td><br></td></tr><tr><td><br></td><td>50 MP, f/2.0, 75mm (telephoto), PDAF (10cm - ∞), OIS, 3.2x optical zoom</td><td><br></td></tr><tr><td><br></td><td>50 MP, f/2.2, 14mm, 115˚ (ultrawide)</td><td><br></td></tr><tr><td>Features</td><td>Leica lens, Dual-LED dual-tone flash, HDR, panorama</td><td><br></td></tr><tr><td>Video</td><td>8K@24fps (HDR), 4K@24/30/60fps (HDR10+, 10-bit Dolby Vision HDR, 10-bit LOG), 1080p@30/60/120/240/960fps, 720p@1920fps, gyro-EIS</td><td><br></td></tr><tr><td>Single</td><td>32 MP, (wide)</td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td>Features</td><td>HDR, panorama</td><td><br></td></tr><tr><td>Video</td><td>4K@30/60fps, 1080p@30/60fps, gyro-EIS</td><td><br></td></tr><tr><td>Loudspeaker</td><td>Yes, with stereo speakers</td><td><br></td></tr><tr><td>3.5mm jack</td><td>No</td><td><br></td></tr><tr><td><br></td><td>24-bit/192kHz audio</td><td><br></td></tr><tr><td>WLAN</td><td>Wi-Fi 802.11 a/b/g/n/ac/6e/7, dual-band, Wi-Fi Direct</td><td><br></td></tr><tr><td>Bluetooth</td><td>5.4, A2DP, LE, aptX HD, aptX Adaptive</td><td><br></td></tr><tr><td> GPS</td><td>GPS (L1+L5), GLONASS (G1), BDS (B1I+B1c+B2a), GALILEO (E1+E5a), QZSS (L1+L5), NavIC (L5)</td><td><br></td></tr><tr><td>NFC</td><td>Yes</td><td><br></td></tr><tr><td> Radio</td><td> Yes</td><td><br></td></tr><tr><td>USB</td><td>USB Type-C 3.2, OTG</td><td><br></td></tr><tr><td> Sensors</td><td>Fingerprint (under display, optical), accelerometer, proximity, gyro, compass, barometer, color spectrum</td><td><br></td></tr><tr><td> Type</td><td>Li-Po 4610 mAh, non-removable</td><td><br></td></tr><tr><td>Charging</td><td>90W wired, PD3.0, QC4, 100% in 31 min (advertised)</td><td><br></td></tr><tr><td><br></td><td>50W wireless, 100% in 46 min (advertised)</td><td><br></td></tr><tr><td><br></td><td>10W reverse wireless</td><td><br></td></tr></tbody></table></div>",
    "brand": "Xiaomi",
    "country_of_origin": "Egypt",
    "stock_uom": "Unit",
    "allow_alternative_item": 1,
    "is_sales_item": 1,
    "attributes": [
        {
            "name": "8402d1df43",
            "variant_of": "Xiaomi 14",
            "attribute": "Colour",
            "attribute_value": "Black", //////////////////////////هون اللون والفارييشن
            "parent": "Xiaomi 14-Black-12-256GB-China Version",
        },
        {
            "name": "7bed002bde",
            "variant_of": "Xiaomi 14",
            "attribute": "Ram",
            "attribute_value": "12",
            "parent": "Xiaomi 14-Black-12-256GB-China Version",
        },
        {
            "name": "9316c1847f",
            "variant_of": "Xiaomi 14",
            "attribute": "Rom",
            "attribute_value": "256",
            "parent": "Xiaomi 14-Black-12-256GB-China Version",
        }
    ],
}

// Item Price
const priceData = {
    "name": "77d609c13a",
    "item_code": "Xiaomi 14-Black-12-256GB-China Version",
    "item_name": "Xiaomi 14-Black-12-256GB-China Version",
    "brand": "Xiaomi",
    "currency": "EGP",
    "price_list_rate": 35000.0,
}

// Website Item
const websiteData = {
    "name": "WEB-ITM-0001",
    "website_image": "/files/xiaomi-civi-4-pro-1.jpg",
    "thumbnail": "/files/xiaomi-civi-4-pro-1_small.jpg",
}

// Item Attribute
const attributeData = {
    "name": "Colour",
    "attribute_name": "Colour",
    "doctype": "Item Attribute",
    "item_attribute_values": [
        {
            "name": "29275c56ca",
            "owner": "admin@hatlystore.com",
            "creation": "2023-10-10 15:49:54.806933",
            "modified": "2024-04-09 14:38:53.618578",
            "modified_by": "admin@hatlystore.com",
            "docstatus": 0,
            "idx": 23,
            "attribute_value": "SnowFull",
            "abbr": "SnowFull",
            "parent": "Colour",
            "parentfield": "item_attribute_values",
            "parenttype": "Item Attribute",
            "doctype": "Item Attribute Value"
        }
    ]
}