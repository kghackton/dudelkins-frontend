<template>
    <div class="pl-1 pt-1">
            <DatePicker
                    class="mx-2"
                    type="datetime"
                    format="D MMM YYYY HH:mm"
                    :editable="false"
                    :clearable="false"
                    :disabled-date="disabledAfterToday"
                    prefix-class="xmx"
                    v-model="start"
            />
        <p class="text--black"> - </p>
            <DatePicker
                    class="ml-2"
                    type="datetime"
                    format="D MMM YYYY HH:mm"
                    :editable="false"
                    :clearable="false"
                    :disabled-date="disabledAfterToday"
                    prefix-class="xmx"
                    v-model="end"
            />
    </div>
</template>

<script>
    import DatePicker from 'vue2-datepicker';
    import 'vue2-datepicker/index.css';
    import 'vue2-datepicker/locale/ru';
    import '@/css/datepicker2.scss'
    export default {
        name: "TimeFilter",
        computed:{
            start:{
                get(){
                    return this.$store.getters.FILTER_STARTTIME
                },
                set(val){
                    const startval = new Date(val)
                    let endval = this.end

                    if(startval>endval){
                        endval = new Date(val.setHours(23,59,59))
                    }
                    this.$store.dispatch('FILTER_TIME_SET', {start: startval, end: endval})
                }
            },
            end:{
                get(){
                    return this.$store.getters.FILTER_ENDTIME
                },
                set(val){
                    const endval = new Date(val)
                    let startval = this.start
                    if(endval<startval){
                        startval = new Date(val.setHours(0,0,0))
                    }
                    this.$store.dispatch('FILTER_TIME_SET', {start: startval, end: endval})
                }
            }
        },
        methods:{
            disabledAfterToday(date){
                return date > new Date(new Date().setHours(23, 59, 59))
            }
        },
        components:{
            DatePicker
        }
    }
</script>

<style scoped>

</style>