import express from "express";
import util from "util";
import con from "../db.js";
import fs from "fs";

const productImageRouter = express.Router();
const query = util.promisify(con.query).bind(con);
        
productImageRouter.post("/:prod_id/add", (req,res) => {
    if(!req.params.prod_id)
    {
        res.status(200).send({err:"please enter product id"});
    }
    else{
        console.log(req.files);
        let file_ext = req.files[0].originalname.split(".")[1];
        let name = req.files[0].fieldname;
        let data = req.files[0].buffer;
        console.log(file_ext);
        // var path = "D:\Ortigan\Internship\E-Shop-Optimised\prodImages\ " + req.files[0].fieldname;
        fs.writeFile(name + "." + file_ext , data, function(err)  {
            if (err) throw err;
            console.log('Saved!');
          }); 
        
    }


})

export default productImageRouter;
