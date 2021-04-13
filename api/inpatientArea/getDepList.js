
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
    
    let department = res.req.body.args.department    || '';
    let area = res.req.body.args.area || '' ;
    let pageIndex = res.req.body.args.pageIndex || '' ;
    let pageSize = res.req.body.args.pageSize || '' ;

    //添加构建语句，Id属性为auto_increment
    let sql = 'SELECT * FROM '
    // var sql = "insert into users (userid,username) values (11,"+connection.escape(name)+")";
    // 执行语句
    connection.query(sql,function (err,rows,fields) {
        //返回数据
        const arr = fun.pagination(1,1,rows)
        console.log(arr)
        if (!err) {
            res.send({
                status:'200',
                data:{
                    obj: arr,
                    totalCount: rows.length
                },
                retCode: 1,
                msg:"success"
            });
        } else {
            res.send({
                retCode: -1,
                msg: err
            })
        }
    
        connection.end();
    })
})
module.exports = router;
