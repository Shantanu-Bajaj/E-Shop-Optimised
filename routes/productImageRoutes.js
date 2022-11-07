import express from "express";
import util from "util";
import con from "../db.js";
import { promises as fs } from "fs";
import { v2 as cloudinary } from "cloudinary";

const productImageRouter = express.Router();
const query = util.promisify(con.query).bind(con);
const fs_writeFile = util.promisify(fs.writeFile);

async function updateOptions(req,options){
  var prodsql ="UPDATE products SET options='" +JSON.stringify(options) +"' WHERE prod_id='" +req.params.prod_id +"'";
  let productresult = await query(prodsql);
  return productresult;
}

productImageRouter.post("/:prod_id/add", async (req, res) => {
  if (req.params.prod_id == ":prod_id") res.status(200).send({ err: "please enter product id" });
  else 
  {
    var prodsql ="SELECT * FROM products where prod_id='" + req.params.prod_id + "'";
    var prodresult = await query(prodsql);
    if (!prodresult.length) res.status(404).send({ err: "not found" });
    else 
    {
      let files = req.files;
      var tempoptions;
      for (let ind = 0; ind < files.length; ind++) 
      {
        var file_array = files[ind].fieldname.split(".");
        var file_ext = files[ind].originalname.split(".")[1];
        var name = files[ind].fieldname;
        var data = files[ind].buffer;
        var inpoptions = file_array.reduceRight((all, item) => ({ [item]: all }),{});

        if (prodresult[0].options != "undefined") 
        {
          var options = JSON.parse(prodresult[0].options);  
          console.log(inpoptions);
          await fs.writeFile(name + "." + file_ext, data)
            .then(async (resultss) => {
              console.log("Saved!");
               await cloudinary.uploader.upload(name + "." + file_ext, {resource_type: "image",folder: "/Ortigan_Assets",use_filename: true,unique_filename: true,})
                .then(async (result) => {
                  let url = result.secure_url;
                  var imagesql ="INSERT INTO images(prod_id,image_url) VALUES('" +req.params.prod_id +"','" + url +"')";
                  let imageresult = await query(imagesql);
                  // console.log(imageresult);
                  var id = imageresult.insertId;                  
                  let tempobj = {}
                  tempobj[id] = url;
                  console.log(tempobj);                 
                  
                  // tempoptions = options;
                  Object.assign(options[Object.keys(inpoptions)[0]][Object.keys(Object.values(inpoptions)[0])[0]][Object.keys(Object.values(Object.values(inpoptions)[0])[0])[0]][Object.keys(Object.values(Object.values(Object.values(inpoptions)[0])[0])[0])[0]]["images"],tempobj);
                  console.log(options[Object.keys(inpoptions)[0]][Object.keys(Object.values(inpoptions)[0])[0]][Object.keys(Object.values(Object.values(inpoptions)[0])[0])[0]]);
                  let productresult = await updateOptions(req,options);

                })
                .catch((error) => {
                  console.log(error);
                });
            })
            .catch((err) => {
              console.log(err);
            });
        } 
        else 
        {
          await fs.writeFile(name + "." + file_ext, data)
            .then(async (res) => {
              console.log("Saved!");
              await cloudinary.uploader.upload(name + "." + file_ext, {resource_type: "image",folder: "/Ortigan_Assets",use_filename: true,unique_filename: true,})
                .then(async (result) => {
                  console.log(result.secure_url);
                  var imagesql ="INSERT INTO images(prod_id,image_url) VALUES('" +req.params.prod_id +"','" +result.secure_url +"')";
                  let imageresult = await query(imagesql);
                })
                .catch((error) => {
                  console.log(error);
                });
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    }
  }

  // res.status(200).send("Success");
});

export default productImageRouter;
