
const express = require('express');
const router = express.Router();
const connection = require('../mysql/dbConnection');
const config = require('../config/config');
const fun = require('../public/javascripts/common')

//post
router.post('/', function (req, res) {
    let department_id = res.req.body.args.department_id || '';
    let bed_id = res.req.body.args.bed_id || '';
    let keyWords = res.req.body.args.keyWords || '';
    let area_id = res.req.body.args.area_id || '';
    let temperature = res.req.body.args.temperature || '';
    let alarmStatus = res.req.body.args.alarmStatus || '';
    let electricity = res.req.body.args.electricity || '';
    let status = res.req.body.args.status || '';
    let pageIndex = res.req.body.args.pageIndex || '';
    let pageSize = res.req.body.args.pageSize || '';
    // // 获取传进来的参数
    //
    // //添加构建语句，Id属性为auto_increment
    let sql = `SELECT stick_id, temperaturestick.patient_id, temperaturestick.bed_id, temperaturestick.patient_name, temperaturestick.temperature, temperaturestick.updateTime, temperaturestick.status, temperaturestick.electricity, temperaturestick.number, patient.highTemperatureAlarmNum FROM temperaturestick INNER JOIN patient on patient.patient_id =  temperaturestick.patient_id `
    let sql2
    if (department_id || area_id || bed_id || keyWords || area_id || temperature || alarmStatus || electricity || status) {
        sql2 = sql
        if (department_id !== '') {
            sql += ` and patient.department_id = '${department_id}'`
        }
        if (status !== '') {
            sql += ` and temperaturestick.status = '${status}'`
        }
        if (bed_id !== '') {
            sql += ` and temperaturestick.bed_id = '${bed_id}'`
        }

        if( electricity !== '') {
            sql += electricity === 1 ? ` and temperaturestick.electricity >= 20 ` : ` and temperaturestick.electricity < 20`
        }
        if (area_id !== '') {
            sql += ` and patient.area_id = '${area_id}'`
        }

        if (temperature !== '') {
            sql += ` and temperaturestick.temperature < '${temperature}'`
        }
        if (alarmStatus !== '') {
            if(alarmStatus === 1) sql += ` and temperaturestick.temperature > patient.highTemperatureAlarmNum`
            else sql += ` and temperaturestick.temperature <= patient.highTemperatureAlarmNum`
        }
        sql2 = sql
        if (keyWords !== '') {
            sql2 = sql
            sql += ` and patient.patient_name = '${keyWords}'`
            sql2 += ` and patient.patient_id = '${keyWords}'`

        }

    }
    sql += ';'
    sql2 += ';'
    console.log(sql);

    // // 执行语句
    connection.query(sql, (err, rows, fields) => {
        //返回数据
        console.log(rows);
        if (err) {
            res.send({
                retCode: -1,
                msg: err.sqlMessage
            })
            connection.end();

        }
        else if (!rows.length) {
            // 使用sql2 再次查询数据库
            connection.query(sql2, (err, rowsDou, fields) => {
                console.log(err);
                if (!err) {
                    const arr = fun.pagination(pageIndex, pageSize, rowsDou)
                    res.send({
                        status: '200',
                        data: {
                            obj: arr,
                            totalCount: rowsDou.length
                        },
                        retCode: 1,
                        msg: "success"
                    });
                } else {
                    res.send({
                        retCode: -1,
                        msg: err
                    })
                }
                connection.end();

            })
        }
        else {
            const arr = fun.pagination(pageIndex, pageSize, rows)
            if (!err) {
                res.send({
                    status: '200',
                    data: {
                        obj: arr,
                        totalCount: rows === [] ? 0 : rows.length
                    },
                    retCode: 1,
                    msg: "success"
                });
            } else {
                res.send({
                    retCode: -1,
                    msg: err.sqlMessage
                })
            }
        }
    })

})

module.exports = router;
