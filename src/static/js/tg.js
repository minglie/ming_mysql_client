const tg={
    "tableList": {
        "sys_dept": "部门表",
        "sys_menu": "菜单表",
        "sys_relation": "角色和菜单关联表",
        "sys_role": "无名",
        "sys_user": "管理员表"
    },
    "links": [
        {
            "source": "sys_relation",
            "target": "sys_menu",
            "relation": "sys_menu.id"
        },
        {
            "source": "sys_relation",
            "target": "sys_role",
            "relation": "sys_role.id"
        },
        {
            "source": "sys_user",
            "target": "sys_role",
            "relation": "sys_role.id"
        },
        {
            "source": "sys_user",
            "target": "sys_dept",
            "relation": "sys_dept.id"
        }
    ]
}