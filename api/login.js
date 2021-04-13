
const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const config = require('../config/config.json');
 
//post
router.post('/', function (req, res) {
    // console.log(res.req.query.name);    
    // 连接数据库
    const connection = mysql.createConnection(config);
    connection.connect();
 
    // 获取传进来的参数
    let account = res.req.body.args.username || '';
    let pwd = res.req.body.args.password || '' ;
    console.log(res.req.body)
    //添加构建语句，Id属性为auto_increment
    let sql = "SELECT * FROM admin WHERE account ="+connection.escape(account)+"and pwd = "+connection.escape(pwd);
    // var sql = "insert into users (userid,username) values (11,"+connection.escape(name)+")";
    // 执行语句

    connection.query(sql,function (err,rows,fields) {
        console.log(rows)
        //返回数据
        if (!err && rows.length > 0) {
            res.send({
                status:'200',
                data:{
                    obj: rows,
                    token: 'E120_END'
                },
                retCode: 1,
                msg:"登录成功"
            });
        } 
        else {
            res.send({
                status:'200',
                retCode: -1,
                msg:"账号或密码错误"
            });
        }
        connection.end();
    })
})
module.exports = router;
