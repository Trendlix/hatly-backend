const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const productRouter = require("./routes/product");
const categoryRouter = require("./routes/category");
const brandRouter = require("./routes/brands");
const mailRouter = require('./routes/mail')

const api = require('./routes/index');
const connectDatabase = require("./db/db");
const errorMiddleWare = require("./middleware/error.middleware");
const ServerError = require("./utils/ErrorInterface");

dotenv.config();

// connect to DB
connectDatabase()

const app = express();

// 
app.use(cors({credentials : true , origin : ['http://localhost:3000', 'http://localhost:3001', 'https://hatly-store.vercel.app' , 'https://hatlytest.trendlix.com' , 'https://hatlystore.trendlix.com']}));
// app.use(cors({credentials : true , origin :  'https://hatlytest.trendlix.com'}));
app.set('trust proxy', 1)
app.use(express.json());
app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/v1/", productRouter);
app.use("/api/v1/", categoryRouter);
app.use("/api/v1/", brandRouter);
app.use("/api/v1/", mailRouter);
app.use('/api/v1/' , api)

app.use((req, res, next) => {
  next(ServerError.badRequest(404, 'page not found'))
})

app.use(errorMiddleWare);


app.listen(process.env.PORT, () => {
  console.log("server start on " + process.env.PORT);
});
