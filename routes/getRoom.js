
const express = require('express');
const router = express.Router();
const connection = require('../mysql/dbConnection');
const config = require('../config/config');

//post
router.post('/', function (req, res) {
    // 获取传进来的参数
    let areaId = res.req.body.area_id    || '';
    //添加构建语句，Id属性为auto_increment
    let sql = 'SELECT * FROM room WHERE area_id = ' + connection.escape(areaId)
    // var sql = "insert into users (userid,username) values (11,"+connection.escape(name)+")";
    // 执行语句
    connection.query(sql, (err,rows,fields) => {
        //返回数据
        let sqlGetRoom = ''
        if (rows !== []) {
            rows.forEach(i => {
                if (i.room_id !== null && i.room_id !== undefined && i.room_id !== '') {
                    sqlGetRoom += 'SELECT * FROM bed WHERE room_id = ' +connection.escape(i.room_id) + ';'
                }
            })
            connection.query(sqlGetRoom, (err, rowsIns, fields) => {
                if (!err) {
                    res.send({
                        status:'200',
                        data:{
                            obj: rows,
                            objBedInfo: rowsIns,
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

            })
        }
    })
})
module.exports = router;
