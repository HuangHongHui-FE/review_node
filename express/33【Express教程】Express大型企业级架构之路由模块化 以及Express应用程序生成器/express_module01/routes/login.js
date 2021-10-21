const express = require("express");

var router = express.Router()

router.get("/",(req,res)=>{
    // req.query 获取get传值
    res.render("login",{})
 })
 
router.post("/doLogin",(req,res)=>{
    // req.body 获取post传值
    var body = req.body;
    console.log(body)
    res.send("执行提交"+body.username)
 })

 module.exports = router