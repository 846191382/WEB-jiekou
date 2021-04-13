
const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const config = require('../../config/config.json');
const fun = require('../../public/javascripts/common')

//post
router.post('/', function (req, res) {
    // 连接数据库
    const connection = mysql.createConnection(config);
    connection.connect();
    // 获取传进来的参数

    let editInfo = res.req.body.editInfo || '';
    // 判断当前department_name 是否存在, 若存在则添加新的
    // 如果 area_id 存在则为修改，不存在则为添加
    let sql = `SELECT * FROM area WHERE area_name = '${editInfo.area_name}';SELECT * FROM department WHERE department_name = '${editInfo.department_name}';`
    // 执行语句
    connection.query(sql, (err, rows, fields) => {
        // 若 area_id 存在 且 area_name 在数据库中也存在 则判断已经存在 无法创建
        if (editInfo.area_id === null && rows[0].length !== 0) {
            res.send({
                retCode: -1,
                msg: '该病区已存在'
            })
            connection.end();
        }
        if (err) {
            res.send({
                retCode: -1,
                msg: err.sqlMessage
            })
            connection.end();
        } else {

            //rows[0] 不为空则所属b病区所在 rows[1] 有数据则所属科室存在
            // editInfo.area_id 存在 则 update 不存在则修改
            let sqlIns = ''
            if (!rows[0].length && !editInfo.area_id) {
                // 不存在则插入
                sqlIns += `INSERT INTO area (area_name, chargeName, address, telephone) VALUES('${editInfo.area_name}','${editInfo.chargeName}','${editInfo.address}','${editInfo.telephone}');`
            }
            else if(!rows[0].length && editInfo.area_id) {
                sqlIns += `UPDATE area SET area_name = '${editInfo.area_name}', chargeName = '${editInfo.chargeName}', address = '${editInfo.address}', telephone = '${editInfo.telephone}' WHERE area_id = '${editInfo.area_id}';`
            }
            else {
                // 存在则更新
                sqlIns += `UPDATE area SET area_name = '${editInfo.area_name}', chargeName = '${editInfo.chargeName}', address = '${editInfo.address}', telephone = '${editInfo.telephone}'  WHERE area_id = '${rows[0][0].area_id}';`
            }
            if(rows[1].length) {
                // 存在则更新
                sqlIns += `UPDATE area SET department_id = '${rows[1][0].department_id}'`
                if (editInfo.area_id) sqlIns += ` WHERE area_id = '${editInfo.area_id}';`
                else sqlIns += ` WHERE area_name = '${editInfo.area_name}';`
            } else {
                //  如果为空 则先插入
                sqlIns += `INSERT INTO department ( department_name ) VALUES ('${editInfo.department_name}');`
            }
            // 完成update 和 insert 操作，在进行 select 操作 获取 新的depatment 的 id值
            sqlIns += `SELECT * FROM department WHERE department_name = '${editInfo.department_name}'; `
            console.log(sqlIns);

            connection.query(sqlIns, (errIns, rowsIns, fields) => {
                /*
                    1.到此处 所属病区 部分已完成， 只剩下所属科室
                    2. 此处不管是更新还是插入 均可再一次 update 结果相同
                    3. rows[3] 为上面 插入或更新后的 department_id
                 */
                if(errIns) {
                    res.send({
                        retCode: -1,
                        msg: errIns.sqlMessage
                    })
                    connection.end();
                } else {
                    let sqlInsDou = `UPDATE area SET department_id = '${rowsIns[2][0].department_id}'`
                    if (editInfo.area_id) sqlInsDou += ` WHERE area_id = '${editInfo.area_id}'`
                    else sqlInsDou += ` WHERE area_name = '${editInfo.area_name}'`
                    console.log(sqlInsDou);
                    connection.query(sqlInsDou, (errDou, rowsDou, fields) => {
                        if (errDou) {
                            res.send({
                                retCode: -1,
                                msg: errIns.sqlMessage
                            })
                        } else {
                            res.send({
                                status:'200',
                                data:{
                                    obj: rowsDou,
                                },
                                retCode: 1,
                                msg: editInfo.area_id ? "更新成功" : "添加成功"
                            });
                        }
                        connection.end();

                    })
                }
            })
        }
    })
})
module.exports = router;
