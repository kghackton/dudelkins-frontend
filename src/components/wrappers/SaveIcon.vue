<template>
    <ClipboardWrapper :val="saveValue" :msg="msg || undefined" :class="{left}">
        <div @mouseover="hoverOn" @mouseleave="hoverOff" style="width: 24px; height: 24px" class="d-flex align-center justify-center">
            <slot v-if="!hover">
                <v-icon class="inactive" color="white">
                    mdi-identifier
                </v-icon>
            </slot>
            <v-icon v-else small color="white">
                mdi-content-copy
            </v-icon>
        </div>
    </ClipboardWrapper>
</template>

<script>
    import ClipboardWrapper from "./ClipboardWrapper";
    export default {
        name: "SaveIcon",
        components: {ClipboardWrapper},
        props: {
            saveValue: {
                required: true
            },
            msg:{
                type: String,
                required: false
            },
            left:{
                type: Boolean,
                required: false
            }
        },
        data:()=>({
            hover: false,
        }),
        methods:{
            hoverOn(){
                this.hover = true
            },
            hoverOff(){
                this.hover = false
            },
        }
    }
</script>
