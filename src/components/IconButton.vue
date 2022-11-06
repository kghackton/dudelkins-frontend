<template>
    <v-btn
            fab
            text
            color="inherit"
            small
            @click="onclick"
            @mouseover="hoverchange(true)"
            @mouseleave="hoverchange(false)"
    >
        <v-icon dark :style="style">
            <slot/>
        </v-icon>
    </v-btn>
</template>

<script>
    import '@/css/toolbarStyle.css'
    export default {
        name: 'IconButton',
        data:()=>({
            hover: false
        }),
        props:{
            colorshadow:{required: false, default: 'var(--toolbarButtonsShadowHover)' },
            colormain:{required: false, default: 'var(--toolbarButtons)' },
            colorhover:{required: false, default: 'var(--toolbarButtonsHover)'},
        },
        methods:{
            onclick(){
                this.$emit('onclick')
            },
            hoverchange(val){
                this.hover = val
            }
        },
        computed:{
            style(){
                if (this.hover === true){
                    return `color:${ this.colorhover} !important; filter: drop-shadow( 0 0 4px ${this.colorshadow})`
                }
                else {
                    return `color:${this.colormain}`
                }
            }
        }
    }
</script>
