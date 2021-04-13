
const express = require('express');
const router = express.Router();
const connection = require('../mysql/dbConnection');
const config = require('../config/config');
const fun = require('../public/javascripts/common')

//post
router.post('/', function (req, res) {
    // 获取传进来的参数
    const connection = mysql.createConnection(config);
    connection.connect();
    // console.log(res.req.query.name);
    let info = res.req.body.args || ''
    // 判断是否存在
    console.log(info);
    let sql = `SELECT * FROM temperaturestick WHERE patient_id = '${info.patient_id}';SELECT * FROM temperaturestick WHERE number = '${info.number}' ;`
    // var sql = "insert into users (userid,username) values (11,"+connection.escape(name)+")";
    // 执行语句
    console.log(sql);
    connection.query(sql,function (err,rows,fields) {
        //返回数据
        if (!err) {
            // 若存在则更新 不存在则插入
            let sqlIns = ''
            if (!rows[1].length && !rows[0].length) {
                // 不存在
                sqlIns = `INSERT INTO temperaturestick (patient_id, bed_id, patient_name, updateTime, status, number) VALUES('${info.patient_id}','${info.bed_id}','${info.patient_name}','${info.updateTime}', '1' ,'${info.number}'); UPDATE patient SET custodyStatus = 1, number = '${info.number}' WHERE patient_id = '${info.patient_id}';`
            } else if (rows[1].length) {
                // 存在number 报错
                res.send({
                    retCode: -1,
                    msg: '该体温计已存在'
                })
            } else if (rows[0].length) {
                // 存在patient_id 直接更新
                sqlIns = `UPDATE temperaturestick SET number = '${info.number}' WHERE patient_id = '${info.patient_id}';UPDATE patient SET number = '${info.number}' WHERE patient_id = '${info.patient_id}'`
            }
            console.log(sqlIns);
            connection.query(sqlIns, (errDou, rowsDou, fields) => {
                if(!err) {
                    res.send({
                        status:'200',
                        data:{
                            obj: rowsDou,
                        },
                        retCode: 1,
                        msg:"更新成功"
                    });
                } else {
                    res.send({
                        retCode: -1,
                        msg: errDou.sqlMessage
                    })
                }
            })


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
