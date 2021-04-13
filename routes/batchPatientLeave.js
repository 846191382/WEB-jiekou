
const express = require('express');
const router = express.Router();
const connection = require('../mysql/dbConnection');
const config = require('../config/config');
const fun = require('../public/javascripts/common')

//post
router.post('/', function (req, res) {
    // console.log(res.req.query.name);
    // 获取传进来的参数
    let bacthPatient = res.req.body.bacthPatient
    console.log(res.req.body.bacthPatient)
    let sql = ''
    console.log(bacthPatient);
    if (bacthPatient.length > 1) {
        bacthPatient.forEach(i => {
            sql +=  `UPDATE patient SET status = -1 WHERE  patient_id = '${i.patient_id}'; UPDATE bed SET status = -1 WHERE bed_id = '${i.bed_id}';`
        })
    } else {
        sql = `UPDATE patient SET status = -1 WHERE  patient_id = '${bacthPatient[0].patient_id}'; UPDATE bed SET status = -1 WHERE bed_id = '${bacthPatient[0].bed_id}'`
    }
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
    })
})
module.exports = router;
