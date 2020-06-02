M.disPlayTable=M_databaseJson["全部"];
M.host = "";
M.tableInfo = [];
M.currentTableName = "";

M.totalTableNums=0;

M.doSql("show tables",(d)=>{
    M.totalTableNums=d.data.length;
})



M.fetchGet("/getDataBaseName",(d)=>{ M.setAttribute("databaseName",d.data)})
app.post("/listByPageMeta", function (req, res) {
    if (!M.currentTableName) {
        res.send([]);
        return;
    }
    const sql = `
SELECT COLUMN_NAME,COLUMN_TYPE,column_comment FROM INFORMATION_SCHEMA.Columns WHERE table_name='${M.currentTableName}' AND table_schema='${M.getAttribute("databaseName")}';
`;
    M.doSql(sql, (d) => {
        rows = d.data;
        res.send({rows});
    })
});

app.post("/listByPageData", function (req, res) {
    if (!M.currentTableName) {
        res.send([]);
        return;
    }
    const sql1 = `
select * from ${M.currentTableName} limit ${(req.params.page - 1) * req.params.rows},${req.params.rows};
`;
    const sql2 = ` select count(1) c from ${M.currentTableName};`;
    M.doSql(sql1, (d) => {
        let rows = d.data;
        M.doSql(sql2, (d) => {
            let total = d.data[0].c;
            res.send({rows, total});
        });
    })
});
app.post("/listAllTableName", function (req, res) {
    const sql = `SELECT TABLE_NAME,TABLE_COMMENT FROM information_schema.TABLES WHERE table_schema='${M.getAttribute("databaseName")}';`;
    M.doSql(sql, (d) => {
        rows = d.data.map(u => {
            let o = {};
            o.TABLE_NAME = u["TABLE_NAME"];
            o.TABLE_COMMENT=u["TABLE_COMMENT"];
            return o;
        });
        if(M.disPlayTable){
            rows=rows.filter(o=>{return M.disPlayTable.indexOf(o.TABLE_NAME)>-1})
            rows=rows.sort((a,b)=>M.disPlayTable.indexOf(a.TABLE_NAME)-M.disPlayTable.indexOf(b.TABLE_NAME)) 
        }
        document.title=rows.length+"张表"
        res.send({rows});
    })
});
function TABLE_NAME_Click(row){
    M.currentTableName=row.type;
    M.doSql(`SELECT column_name,column_type,column_comment FROM information_schema.COLUMNS WHERE TABLE_NAME='${M.currentTableName}' and TABLE_SCHEMA='${M.getAttribute("databaseName")}';`,(d)=>{
        M.tableInfo=d.data;
        M.is_resourceDataGridData=true
        resourceDataGridInit();
    })
}

function TABLE_COMMENT_Click(row){
    M.currentTableName=row.type;
    M.is_resourceDataGridData=false
    resourceDataGridInit();
}

function rightClickInit(){
    document.oncontextmenu = function() {
        return false;
    }

    $("body").mousedown(function(e) {

        // console.log(e.which);
    })

    $(document).bind('contextmenu',function(e){
        e.preventDefault();
        $('#mm').menu('show', {
            left: e.pageX,
            top: e.pageY
        });
    });
}

function groupConfigInit(){
    text_input.value=JSON.stringify(M_databaseJson ,null, 2);
}



function groupClick(e){

    M.disPlayTable=M_databaseJson[e];

    M.setAttribute("disPlayTable",M.disPlayTable);
    
    init();
}
function showMenu(e){
    M.exportGroupName=e;
}

async function menuHandler(item){
  // alert(M.exportGroupName)
    let jsonData= await getDowCsvContentByGroupName()
    downCsv(jsonData,M.exportGroupName+".csv")
}

function headresourceDataGridInit(){
    let liList=`<ul id="test">`;
    let keyList=Object.keys(M_databaseJson)
    for(let i=0;i<keyList.length;i++){
        let key= keyList[i]
        let len=0;
        if(key=="全部"){
            len=M.totalTableNums;
        }else{
            len=M_databaseJson[key]==undefined?0:M_databaseJson[key].length;
        }
        liList+=`<li class="test"><a href="javascript:groupClick('${key}');" oncontextmenu = showMenu('${key}')>${key+" "+len}</a></li>`;
    }
    liList+=`</ul>`;
    $("#headList").html(liList)
}
function resourceDataGridInit(){
    if(M.is_resourceDataGridData){
        var myColumns=[];
        myColumns[0]=M.tableInfo.map(function (u) {
            let obj={};
            obj.field=u.column_name;
            obj.title=u.column_name+"("+u.column_comment+")";
            return obj;
        });
        myColumns[0]=[{checkbox:true},... myColumns[0]];
        $('#resourceDataGrid').datagrid({
            url:"/listByPageData",
            width:10000,
            rownumbers:true,//使能行号列
            pagination:true,//显示分页工具栏
            pageSize:20,//在设置分页属性的时候初始化页面大小。
            pageList:[20,30,40,50,500,5000,50000],//在设置分页属性的时候 初始化页面大小选择列表。
            rowStyler:function(rowIndex,rowData){
                if(rowData.id%2==0){
                    return "background-color:pink";
                }
            },
            columns:myColumns
        });
    }else{
        $('#resourceDataGrid').datagrid({
            url:"/listByPageMeta",
            width:10000,
            rownumbers:true,
            columns:[[
                {checkbox:true},
                {field:'COLUMN_NAME',title:'列名'},
                {field:'COLUMN_TYPE',title:'类型'},
                {field:'column_comment',title:'说明'}
            ]]
        });

    }
}

function leftMeauInit(){
    $('#leftMeau').datagrid({
        url:"/listAllTableName",
        checkOnSelect: false,
        selectOnCheck: true,
        columns:[[
            {checkbox:false},
            {field:'TABLE_NAME',title:'表名',width:280,
                formatter: function(value,row,index){
                    var str = `<a href='javascript:void(0)' type='${row.TABLE_NAME}' onclick='TABLE_NAME_Click(this)'>${row.TABLE_NAME}</a>`;
                    return str;
                }
            },
            {field:'TABLE_COMMENT',title:'说明',width:420,
                formatter: function(value,row,index){
                    if(!row.TABLE_COMMENT){
                        row.TABLE_COMMENT="无名"
                    }
                    var str = `<a href='javascript:void(0)' type='${row.TABLE_NAME}' onclick='TABLE_COMMENT_Click(this)'>${row.TABLE_COMMENT}</a>`;
                    return str;
                }
            }
        ]]
    });
}

async function getDowCsvContentByGroupName() {
     let rowList=[];
     let blankLine={r1:'', r2:'', r3:''}
     let d= await MIO.listAllTableName();
    let rows=d.rows;
    for (let i=0;i<rows.length;i++){
        rowList.push(blankLine,blankLine,blankLine,blankLine)
        rowList.push({r1:rows[i].TABLE_NAME,r2:rows[i].TABLE_COMMENT,r3:""})
        M.currentTableName=rows[i].TABLE_NAME;
        let d1=await MIO.listByPageMeta();
         let rows1=d1.rows;
         for (let j=0;j<rows1.length;j++){
             rowList.push({r1:rows1[j].COLUMN_NAME,r2:rows1[j].COLUMN_TYPE,r3:rows1[j].column_comment})
         }
    }
    return rowList;
}





function init(){
    groupConfigInit();
    //rightClickInit();
    headresourceDataGridInit();
    resourceDataGridInit();//初始化DataGrid
    leftMeauInit();
}



$(function(){
    init();
})

