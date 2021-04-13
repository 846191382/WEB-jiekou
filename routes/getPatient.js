
const express = require('express');
const router = express.Router();
const connection = require('../mysql/dbConnection');
const config = require('../config/config');
const fun = require('../public/javascripts/common')

//post
router.post('/', function (req, res) {
    // 连接数据库
    let department_id = res.req.body.args.department_id || '';
    let bed_id = res.req.body.args.bed_id || '';
    let keyWords = res.req.body.args.keyWords || '';
    let area_id = res.req.body.args.area_id || '';
    let temperaturePasteNum = res.req.body.args.temperaturePasteNum || '';
    let pageIndex = res.req.body.args.pageIndex || '';
    let pageSize = res.req.body.args.pageSize || '';
    // 获取传进来的参数
    //添加构建语句，Id属性为auto_increment
    let sql = 'SELECT * FROM patient WHERE status = 1'
    let sql2 = sql

    if (department_id || area_id || bed_id || keyWords || area_id || temperaturePasteNum) {
        // let flag = false // 判断是否为首位 不为首位则sql加一句and
        if (department_id !== '') sql += ` and department_id = '${department_id}'`
        if (bed_id !== '') sql += ` and bed_id = '${bed_id}'`

        if (area_id !== '') sql += ` and area_id = '${area_id}'`

        if (temperaturePasteNum !== '') sql += ` and highTemperatureAlarmNum < '${temperaturePasteNum}'`
        sql2 = sql
        if (keyWords !== '') {

            sql2 = sql
            sql += ` and patient_name = '${keyWords}'`
            sql2 += ` and patient_id = '${keyWords}'`

        }

    }
    sql += ';'
    sql2 += ';'
    console.log(sql);

        // 执行语句
    connection.query(sql, (err, rows, fields) => {
            //返回数据
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
