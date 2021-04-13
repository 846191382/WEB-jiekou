
const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const config = require('../../config/config.json');
const fun = require('../../public/javascripts/common')

//post
router.post('/', function (req, res) {
    // console.log(res.req.query.name);
    // 连接数据库
    const connection = mysql.createConnection(config);
    connection.connect();
    // 获取传进来的参数

    let sql = ''
    let total = 0
    let hour = 0


    // while(hour<24) {
        while (total<60) {
            sql += `update temperature `
            total ++
        }
    //     hour++
    // }

    // 执行语句
    console.log(sql);
    connection.query(sql,function (err,rows,fields) {
        //返回数据
        if (!err) {
            res.send({
                status:'200',
                data:{
                    obj: rows,
                },
                retCode: 1,
                msg:"批量出院成功"
            });
        } else {
            res.send({
                retCode: -1,
                msg: err.sqlMessage
            })
        }

        connection.end();
    })
})
module.exports = router;
