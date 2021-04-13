
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

    let addForm = res.req.body.addForm    || '';

    //添加构建语句，Id属性为auto_increment
    let sql = `INSERT INTO patient (status, patient_name, bed_id, number, highTemperatureAlarmNum, department_id, area_id) VALUES ( 1,'${addForm.patient_name}','${addForm.bed_id}','${addForm.number}','${addForm.highTemperatureAlarmNum}','${addForm.department_id}','${addForm.area_id}'); UPDATE bed SET status = 1 WHERE bed_id = '${addForm.bed_id}';INSERT`
    console.log(sql);
    // 执行语句
    connection.query(sql,function (err,rows,fields) {
        //返回数据
        if (!err) {
            res.send({
                status:'200',
                data:{
                    obj: rows,
                },
                retCode: 1,
                msg:"添加成功"
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
