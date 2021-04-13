
const express = require('express');
const router = express.Router();
const connection = require('../mysql/dbConnection');
const config = require('../config/config');
const fun = require('../public/javascripts/common')

//post
router.post('/', function (req, res) {
    // 获取传进来的参数
    // 连接数据库
    let department = res.req.body.args.department_id    || '';
    let area = res.req.body.args.area_id || '' ;
    let pageIndex = res.req.body.args.pageIndex || '' ;
    let pageSize = res.req.body.args.pageSize || '' ;

    //添加构建语句，Id属性为auto_increment
    let sql = ''
    if (area == 0 && department == 0) {
        sql = 'SELECT area_id, area_name, area.department_id, address, chargeName, telephone, roomNum, bedNum, department.department_name FROM area INNER JOIN department on area.department_id = department.department_id'
    } else if( area == 0) {
        sql = 'SELECT area_id, area_name, area.department_id, address, chargeName, telephone, roomNum, bedNum, department.department_name FROM area INNER JOIN department on area.department_id = department.department_id AND area.department_id =' + connection.escape(department)
    } else if( department == 0) {
        sql = 'SELECT area_id, area_name, area.department_id, address, chargeName, telephone, roomNum, bedNum, department.department_name FROM area INNER JOIN department on area.department_id = department.department_id AND area.area_id = ' + connection.escape(area)
    } else {
        sql = 'SELECT area_id, area_name, area.department_id, address, chargeName, telephone, roomNum, bedNum, department.department_name FROM area INNER JOIN department on area.department_id = department.department_id AND area.area_id = ' + connection.escape(area) + ' AND area.department_id =' + connection.escape(department)
    }
    // var sql = "insert into users (userid,username) values (11,"+connection.escape(name)+")";
    // 执行语句
    connection.query(sql,function (err,rows,fields) {
        //返回数据
            arr = fun.pagination(pageIndex, pageSize, rows)


        if (!err) {
            res.send({
                status:'200',
                data:{
                    obj: arr,
                    totalCount: rows === [] ?  0 : rows.length
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


    })
})
module.exports = router;
