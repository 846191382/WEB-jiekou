
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

    let areaId = res.req.body.areaId    || '';
    console.log(res.req.body)
    //添加构建语句，Id属性为auto_increment
    let sql = 'SELECT area_id, area_name, area.department_id, address, chargeName, telephone, roomNum, bedNum, department.department_name FROM area INNER JOIN department on area.department_id = department.department_id AND area.area_id = ' + connection.escape(areaId)
    // var sql = "insert into users (userid,username) values (11,"+connection.escape(name)+")";
    // 执行语句
    connection.query(sql,function (err,rows,fields) {
        //返回数据
        if (!err) {
            res.send({
                status:'200',
                data:{
                    obj: rows,
                    totalCount: rows === [] ? 0 : rows.length
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

        connection.end();
    })
})
module.exports = router;
