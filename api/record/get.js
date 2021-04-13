
const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const config = require('../../config/config.json');
const fun = require('../../public/javascripts/common')

//post
router.post('/', function (req, res) {
    // 连接数据库
    const connection = mysql.createConnection(config);
    let info = res.req.body.info || '';

    connection.connect();
    // 获取传进来的参数

    //添加构建语句，Id属性为auto_increment
    let sql = `SELECT patient.patient_id, patient_name, highTemperatureAlarmNum, record.record_id, record.bed_id, record.temperature, record.updateTime FROM patient INNER JOIN record on patient.patient_id = record.patient_id and patient.patient_id = ${info.patient_id}`

    // 执行语句
    connection.query(sql, (err, rows, fields) => {
        //返回数据
        const arr = fun.pagination(info.pageIndex, info.pageSize, rows)
        if (err && !rows.length) {
            res.send({
                retCode: -1,
                msg: err.sqlMessage
            })
            connection.end();

        } else {
            res.send({
                status:'200',
                data:{
                    obj: arr,
                    totalCount: rows === [] ?  0 : rows.length
                },
                retCode: 1,
                msg:"success"
            });
        }
    })

})

module.exports = router;
