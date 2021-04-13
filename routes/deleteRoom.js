
const express = require('express');
const router = express.Router();
const connection = require('../mysql/dbConnection');
const config = require('../config/config');
const fun = require('../public/javascripts/common')

//post
router.post('/', function (req, res) {
    // console.log(res.req.query.name);
    // 获取传进来的参数
    let room_id = res.req.body.args.room_id    || '';
    let area_id = res.req.body.args.area_id    || '';

    //添加构建语句，Id属性为auto_increment
    let sql = 'DELETE FROM room WHERE room_id =' + connection.escape(room_id) + ';UPDATE area SET roomNum = roomNum - 1 WHERE area_id  = ' + connection.escape(area_id)
      // var sql = "insert into users (userid,username) values (11,"+connection.escape(name)+")";
    // 执行语句
    connection.query(sql, (err,rows,fields) => {
        //返回数据
        if (!err) {
            res.send({
                status:'200',
                data:{
                    obj: rows,
                },
                retCode: 1,
                msg:"删除成功"
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
