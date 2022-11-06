<template>
    <div>
        <ScrollupButton v-if="scrolled" v-on:scrollup="scrollup" :scrolled="scrolled"/>
        <slot></slot>
    </div>
</template>

<script>
    import ScrollupButton from "./ScrollupButton";
    import Loader from "@/store/loader";
    export default {
        data:()=>({
            scrolled: false,
        }),
        props:['type'],
        name: "ScrollWrapper",
        mounted() {
            try {
                this.registerStore()
                this.$store.dispatch(`${this.type}/LOADER_INITIAL`)
            }
            catch {
                console.log('network error')
            }
            this.scroll()
        },
        methods:{
            registerStore(){
                if(this.$store._modules.root._children[`${this.type}`]===undefined){
                    this.$store.registerModule(`${this.type}`, Loader(this.type))
                }
            },
            scroll() {
                const parent = this.$el.getElementsByClassName("table")[0]
                const element = parent.getElementsByClassName("v-data-table__wrapper")[0]
                element.onscroll=()=>{
                    if (!this.scrolled && element.scrollTop>10) {
                        this.scrolled = true
                    }
                    if (this.scrolled && element.scrollTop<10){
                        this.scrolled = false
                    }

                    const bottomOfElement = element.scrollHeight - element.scrollTop - element.clientHeight - 5 <= 0

                    // console.log(element.scrollHeight - element.scrollTop - element.clientHeight - 1)
                    if(bottomOfElement){
                        this.$store.dispatch(`${this.type}/LOADER_ASK`, this.type)
                    }
                }
            },
            scrollup(){
                const parent = this.$el.getElementsByClassName("table")[0]
                const element = parent.getElementsByClassName("v-data-table__wrapper")[0]
                element.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        },
        components: {
            ScrollupButton
        }
    }
</script>

<style scoped>

</style>
