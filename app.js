const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors=require('cors')




const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
// const loginRouter = require('./api/login')

const app = express();
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// 解决跨域问题

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const myLogger = (res, req, next) => {
  if(req.req.body.token === 'E120_END') next()
  else {
    req.end({
      data:{
        retCode: -2,
        msg: '请先登录'
      }
    })
  }
}

app.use(myLogger)
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/adminLogin', require('./routes/login'))

app.use('/api/departmentGet', require('./routes/getDepartment')) // 获得所有病区
app.use('/api/areaGet', require('./routes/getArea')) // 获得所有区域
app.use('/api/inpatientGet', require('./routes/get')) // 病区管理 得到List
app.use('/api/inpatientGetDetail', require('./routes/getDetail'))
app.use('/api/getRoom', require('./routes/getRoom')) // 获得房间信息
app.use('/api/addRoom', require('./routes/addRoom')) // 添加房间
app.use('/api/deleteRoom', require('./routes/deleteRoom')) // 删除房间
app.use('/api/addBed', require('./routes/addBed')) // 添加房间
app.use('/api/deleteBed', require('./routes/deleteBed')) //删除床
app.use('/api/addArea', require('./routes/addArea'))  // 添加病区
app.use('/api/deleteArea', require('./routes/deleteArea')) // 删除病区

app.use('/api/getPatient', require('./routes/getPatient')) // 得到病人信息
app.use('/api/patientLeave', require('./routes/patientLeave')) // 单个病人离开医院
app.use('/api/batchPatientLeave', require('./routes/batchPatientLeave')) // 批量离开医院
app.use('/api/updateAlarmPredetermined', require('./routes/updateAlarmPredetermined'))
// 更新报警温度 预置
app.use('/api/getFreeBed', require('./routes/getFreeBed')) // 获得空闲的床
app.use('/api/addNewPatient', require('./routes/addNewPatient')) // 单个添加病人
app.use('/api/updatePatientAlarm', require('./routes/updatePatientAlarm')) //修改病人温度

app.use('/api/getMonitoringBoard', require('./routes/getmoni')) // 得到体温计内的所有信息
app.use('/api/updateCustody', require('./routes/updateCustody')) // 修改监护状态
app.use('/api/setTemperatureStick', require('./routes/setTemperatureStick')) // 设置体温贴


app.use('/api/getRecord', require('./routes/get')) // 获得体温记录信息
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const port =9999
const server =app.listen(port,() => {
  console.log('启动成功,路径：'+'127.0.0.1:'+port)
})
server.on('request',function(err,data){
  console.log('running')
})

module.exports = app;
