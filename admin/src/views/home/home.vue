<!--
 * @Description: 
 * @Author: yfye
 * @Date: 2020-05-21 23:16:38
 * @LastEditTime: 2021-01-24 18:50:31
 * @LastEditors: yfye
-->

<template>
<div>
  <!--   <p style="font-size: 22px;margin-top: 20px;margin-bottom: 20px;">请选择您要跳转的平台:</p> -->
    <div style="display: flex;justify-content: flex-start;margin-top:30px">
    <div v-for="(item,index) in tableData" :key="index">
        <Button type="primary" style="margin-right:20px"  @click="goToatlData(item.id,item.title,item.uuid)">{{item.title}}</Button>
    </div>
    </div>
</div>
 </template>

 <script>
 import {
     homeList,clickNumTotal
} from '@/service/getData';
 export default {
     data () {
         return {
             tableData: []
         }
         ;
     },
     methods: {
         getData (obj) {
             homeList(obj).then(res => {
                 this.tableData = res.data;
             });
         },
         goToatlData(id,title,uuid){
              let obj={};
              obj.id=id;
              obj.title=title;
              clickNumTotal(obj).then(res => {
                this.$router.push({path:`/lookTV?uuid=${uuid}`})
              });
         }
     },
     created () {
         this.getData({ pageNo: 1, pageSize: 10 });
     }};
 </script>