
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
    let  department_id = res.req.body.department_id || ''
    console.log('asdasd' + department_id)

    //添加构建语句，Id属性为auto_increment
    let sql = department_id === ''? 'SELECT * FROM department' : 'SELECT * FROM department WHERE department_id = ' + connection.escape(department_id)
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
    
        connection.end();
    })
})
module.exports = router;
