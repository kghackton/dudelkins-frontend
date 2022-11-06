<template>
    <v-checkbox
        dark
        v-model="proxy"
        dense="dense"
        :on-icon="mdiCheckboxMarkedOutline"
        :off-icon="mdiCheckboxBlankOutline"
        :hide-details="hideDetails"
        :label="label"
    >
    </v-checkbox>
</template>

<script>
    import {mdiCheckboxBlankOutline, mdiCheckboxMarkedOutline} from '@mdi/js'
    export default {
        name: "Checkbox",
        data:()=>({
            mdiCheckboxBlankOutline, mdiCheckboxMarkedOutline
        }),
        props: {
            value: {
                type: Boolean,
                default: false
            },
            label: {
                type: String,
                required: false
            },
            hideDetails:{
                type: Boolean,
                required: false
            },
            dense:{
                type: Boolean,
                required: false
            }
        },
        model:{
            prop: 'value',
            event: 'handler'
        },

        computed: {
            proxy: {
                get(){
                    return this.value
                },
                set(newval){
                    this.$emit('handler', newval)
                }
            }
        }
    }
</script>

<style scoped>

</style>