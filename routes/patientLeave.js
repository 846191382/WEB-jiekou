
const express = require('express');
const router = express.Router();
const connection = require('../mysql/dbConnection');
const config = require('../config/config');
const fun = require('../public/javascripts/common')

//post
router.post('/', function (req, res) {
    // console.log(res.req.query.name);
    let patient_id = res.req.body.args.patient_id
    let bed_id = res.req.body.args.bed_id
    console.log(res.req.body)
    //添加构建语句，Id属性为auto_increment
    let sql = `UPDATE patient SET status = -1, custodyStatus = 3 WHERE  patient_id = '${patient_id}';UPDATE bed SET status = -1 WHERE bed_id = '${bed_id}';UPDATE temperaturestick SET status = 3 WHERE patient_id = '${patient_id}';`
    // var sql = "insert into users (userid,username) values (11,"+connection.escape(name)+")";
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
                msg:"出院成功"
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
