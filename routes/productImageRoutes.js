import express from "express";
import util from "util";
import con from "../db.js";
import fs from "fs";
import { v2 as cloudinary } from 'cloudinary';

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

      for (let i = 0; i <= files.length; i++) 
      {
        var file_array = files[i].fieldname.split(".");
        var file_ext = files[i].originalname.split(".")[1];
        var name = files[i].fieldname;
        var data = files[i].buffer;
        var inpoptions = file_array.reduceRight((all, item) => ({ [item]: all }),{});

        var imagesql = "INSERT INTO images(prod_id,image_extension) VALUES('" +req.params.prod_id +"','" +file_ext +"')";
        // var path ="D:OrtiganInternshipE-Shop-OptimisedprodImages " +req.files[0].fieldname;          
          let imageresult = await query(imagesql);
          fs.writeFile(name + "." + file_ext, data, (err) => {
            if (err) throw err;
            console.log("Saved!");
            cloudinary.uploader.upload(name + "." + file_ext, {resource_type:"image",folder: "/Home/Ortigan_Assets",use_filename:true, unique_filename:true})
            .then((result) =>{
              console.log(result);
            })
            .catch((error)=>{
              console.log(error);
            })
          });
        if (prodresult[0].options != "undefined") 
        {
          var prodoptions = JSON.parse(prodresult[0].options);
          console.log(inpoptions);
        } 
        else 
        {
          console.log(inpoptions);
            

        }
      }
    }
  }

  // res.status(200).send("Success");
});

export default productImageRouter;
