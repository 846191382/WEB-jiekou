
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

    let alarmInfo = res.req.body.alarmInfo
    //添加构建语句，Id属性为auto_increment
    let sql = `UPDATE patient SET highTemperatureAlarmNum = '${alarmInfo.num}' WHERE  patient_id = '${alarmInfo.patient_id}';`
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
                msg:"更新成功"
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
