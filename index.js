import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import addressRouter from "./routes/addressRoutes.js";
import adminAuthRouter from "./routes/adminAuthRoutes.js";
import userAuthRouter from "./routes/userAuthRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import adminProductRouter from "./routes/adminProductRoutes.js";
import productImageRouter from "./routes/productImageRoutes.js";
import userProductRouter from "./routes/userProductRoutes.js";
import userAuthentication from "./middlewares/userAuthentication.js";
import adminAuthentication from "./middlewares/adminAuthentication.js";
import openRouter from "./routes/openRoutes.js";
import multer from "multer";

dotenv.config();
const port = process.env.PORT || 8080;
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(multer().array());
app.use(multer().any());
app.use(cors());

app.use("/", openRouter);
app.use("/user", userAuthentication, userAuthRouter);
app.use("/admin", adminAuthentication, adminAuthRouter);
app.use("/user/address", userAuthentication, addressRouter);
app.use("/user/cart", userAuthentication, orderRouter);
app.use("/admin/products", adminAuthentication, adminProductRouter);
app.use("/user/products", userAuthentication, userProductRouter);
app.use("/admin/products/images", adminAuthentication, productImageRouter);


app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
