var M=require("ming_node");
M.log_file_enable=false; //不用打印日志到文件
var path=require('path');
var Db=require("./modules/ming_mysql");
var app=M.server();
app.listener(8889);
app.set("views",path.join(__dirname, "./static"));


var database=Db.myDbconfig.database;
var tableName=0;


app.get(`/`,async function (req,res) {
    app.redirect("/index.html",req,res);
})
app.get(`/t/:tableName`,async function (req,res) {
    tableName=req.param.tableName;
    app.redirect("/index.html",req,res);
})
app.get(`/doSql`,async function (req,res) {
    console.log(req.param.sql);
    var tableNameList= await Db.doSql(req.param.sql);
    res.send(M.result(tableNameList));
})
app.get(`listAlltableName`,async function (req,res) {
    var tableNameList= await Db.doSql("show tables");
    tableNameList=tableNameList.map(u=>Object.values(u)[0])
    res.send(M.result(tableNameList))
})
app.get(`/getTableInfo`,async function (req,res) {

    if(tableName==0){
        res.send(M.result("no table"))
    }else{
        let r=await Db.doSql(`SELECT column_name,column_type,column_comment FROM information_schema.COLUMNS WHERE TABLE_NAME='${tableName}' and TABLE_SCHEMA='${database}'`)
        res.send(M.result(r.map(u=>{
            result={};
        result.column_name=u.column_name;
        result.column_comment=u.column_comment;
        return result;
    })))
    }
})
//根据id删除
app.get(`/delete`,async function (req,res) {
    console.log(req.param["ids[]"])
    var r;
    if(Array.isArray(req.param["ids[]"])){
        r=await Db.doSql(`delete from ${tableName} where id in (${req.param["ids[]"].join(",")})`)
    }else {
        r=await Db.doSql(`delete from ${tableName} where id in (${req.param["ids[]"]})`)
    }
    if(r.affectedRows>0){
        res.send(M.result("删除成功"));
    }else{
        res.send(M.result("删除失败"));
    }
})
//分页查询
app.post(`/listByPage`,async function (req,res) {
    var limit=req.param.rows;
    var start=(req.param.page - 1) * limit;
    var rows=await Db.doSql(`
    select * from ${tableName} t1  limit  ${start},${limit}`);
    var total=await Db.doSql(`
    select count(1) ct from ${tableName} t1 `);
    total=total[0].ct;
    res.send(JSON.stringify({rows,total}));
})