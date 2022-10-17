import express from "express";
const userProductRouter = express.Router();
import con from "../db.js"

userProductRouter.get("/all", (req, res) => {
    con.query("SELECT * FROM products", function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    });
  });

  userProductRouter.get("/:prod_id", (req,res)=>{
    if(!req.params)
    {
      res.status(200).send("Enter product id");
    }
    else
    {
      let sql = "SELECT * FROM products where prod_id ='" + req.params.prod_id + "'";
      con.query(sql,function(err,result){
        if (err) throw err;
        res.status(200).send(result);
      })
    }
  })

export default userProductRouter;