import express from "express";
import util from "util";
import con from "../db.js";
import fs from "fs";

const productImageRouter = express.Router();
const query = util.promisify(con.query).bind(con);

productImageRouter.post("/:prod_id/add", async (req, res) => {
  if (req.params.prod_id == ":prod_id") res.status(200).send({ err: "please enter product id" });
  else 
  {
    var prodsql = "SELECT * FROM products where prod_id='" + req.params.prod_id + "'";
    var prodresult = await query(prodsql);
    if (!prodresult.length) res.status(404).send({ err: "not found" });
    else {
      let files = req.files;
      for (let i = 0; i < files.length; i++) 
      {
        let file_array = files[i].fieldname.split(".");
        let file_ext = files[i].originalname.split(".")[1];
        let name = files[i].fieldname;
        let data = files[i].buffer;
        let inpoptions = file_array.reduceRight((all, item) => ({ [item]: all }),{});
        if (prodresult[0].options != "undefined") 
        {
          var prodoptions = JSON.parse(prodresult[0].options);
          console.log(inpoptions);
        } 
        else 
        {
          // var path ="D:OrtiganInternshipE-Shop-OptimisedprodImages " +req.files[0].fieldname;          
          let imagesql = "INSERT INTO images(prod_id,image_extension) VALUES('" +req.params.prod_id +"','" +file_ext +"')";
          let imageresult = await query(imagesql);
          fs.writeFile(name + "." + file_ext, data, function (err) {
            if (err) throw err;
            console.log("Saved!");
          });

        }
      }
    }
  }

  // res.status(200).send("Success");
});

export default productImageRouter;
