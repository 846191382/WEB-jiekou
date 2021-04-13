
const express = require('express');
const router = express.Router();
const connection = require('../mysql/dbConnection');
const config = require('../config/config');
const fun = require('../public/javascripts/common')

//post
router.post('/', function (req, res) {
    // console.log(res.req.query.name);
    // 连接数据库
    // 获取传进来的参数
    let  area_id = res.req.body.area_id || ''
    //添加构建语句，Id属性为auto_increment
    let sql = area_id === '' ? 'SELECT area_id, area_name FROM area' : 'SELECT * FROM area_id =' + connection.escape(area_id)
    // var sql = "insert into users (userid,username) values (11,"+connection.escape(name)+")";
    // 执行语句
    connection.query(sql,function (err,rows,fields) {
        //返回数据
        if (!err) {
            res.send({
                status:'200',
                data:{
                    obj: rows,
                    totalCount: rows.length
                },
                retCode: 1,
                msg:"success"
            });
        } else {
            res.send({
                retCode: -1,
                msg: err.sqlMessage
            })
        }

    })
})
module.exports = router;
