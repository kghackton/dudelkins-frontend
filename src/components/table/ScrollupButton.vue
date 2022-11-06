<template>
    <v-btn
        id="scrollup"
        :class="{hide:!scrolled}"
        color="var(--dropdown-color)"
        fab
        dark
        fixed
        bottom
        right
        @click="scrollup"
        :scrolled="scrolled"
        large>
        <v-icon dark>
            {{mdiChevronUp}}
        </v-icon>
    </v-btn>
</template>

<script>
    import {mdiChevronUp} from '@mdi/js'
export default {
    data:()=>({
        mdiChevronUp
    }),
    props:{
        scrolled:{
            type: Boolean,
            required: true
        }
    },
    methods:{
        scrollup(){
            this.$emit('scrollup')
        }
    }
}
</script>

<style>
#scrollup{
    transition: all .1s linear;
}
#scrollup.hide{transform: scale(0)}
</style>