# ming_mysql_client
用easyUi实现的简易mysql Client

```js
//已分类表与未分类表 a是已分类,未打印是未分类
a=[];
Object.keys(M_databaseJson).forEach(function(key){if(M_databaseJson[key])a.push(...M_databaseJson[key])});
M.doSql("SELECT TABLE_NAME,TABLE_COMMENT FROM information_schema.TABLES WHERE table_schema='guns';",
  (d)=>{
      e=d.data.filter((u)=> a.indexOf(u.TABLE_NAME)<0)
      console.log(e)
  })
```

# dag注释格式
字段 sys_relation.ROLE_ID 注释->     角色id来自sys_role.id或table_2.filed

来自后面是关联关系描述,一定放在最后，来源多个表用或连接



