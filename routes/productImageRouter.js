import express from "express";
import util from "util";
import con from "../db.js";
import fs from "fs";
import { CLIENT_RENEG_LIMIT } from "tls";
import { isNull } from "util";
import e from "express";

const productImageRouter = express.Router();
const query = util.promisify(con.query).bind(con);

productImageRouter.post("/:prod_id/add", async (req, res) => {
  if (req.params.prod_id == ":prod_id") res.status(200).send({ err: "please enter product id" });
  else 
  {
    let prodsql = "SELECT * FROM products where prod_id='" + req.params.prod_id + "'";
    let prodresult = await query(prodsql);
    if (!prodresult.length) res.status(404).send({ err: "not found" });
    else {
      let files = req.files;
      for (let i = 0; i < files.length; i++) 
      {
        console.log(files[i].fieldname);
        let file_array = files[i].fieldname.split(".");
        console.log(file_array);
        let inpoptions = file_array.reduceRight((all, item) => ({ [item]: all }),{});
        if (prodresult.options) 
        {

        } 
        else 
        {
          let file_ext = files[i].originalname.split(".")[1];
          let name = files[i].fieldname;
          let data = files[i].buffer;
          console.log(file_ext);
          // var path ="D:OrtiganInternshipE-Shop-OptimisedprodImages " +req.files[0].fieldname;
          fs.writeFile(name + "." + file_ext, data, function (err) {
            if (err) throw err;
            console.log("Saved!");
          });

          let imagesql = "INSERT INTO images(prod_id,image_extension) VALUES('" +req.params.prod_id +"','" +file_ext +"')";
          let imageresult = await query(imagesql);

        }
      }
    }
  }

  // res.status(200).send("Success");
});

export default productImageRouter;
