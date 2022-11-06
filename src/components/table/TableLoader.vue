<template>
   <TableLoaderLine :key="key" :type="type"/>
</template>

<script>
    import TableLoaderLine from "./TableLoaderLine";
    export default {
        name: "TableLoader",
        components: {TableLoaderLine},
        props:{
            type:{
                type: String,
                required: true,
            }
        },
        data:()=>({
            key:0
        }),
        mounted(){
            setTimeout(()=>{
                this.key = this.key+1 //нужно дождаться регистрации модуля-загрузчика. На это потребуется один проход по коду
            },0)
        },
    }
</script>

