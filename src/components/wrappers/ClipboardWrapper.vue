<template>
        <div :data-tooltip="msg || 'Сохранено'" class="controlled" :class="{constant: show}">
            <div
                class="ClipboardContent"
                @click="handler">
                <slot>
                    <p class="ClipboardContent" style="font-size: inherit" :style="color ? `color: ${color};` : '' + 'text-overflow: ellipsis;'">{{val}}</p>
                </slot>
            </div>
        </div>
</template>

<script>
	export default {
        data:()=>({
            show: false
        }),
        props:['val', 'color', 'msg'],
        methods:{
            handler(){
                    const textArea = document.createElement("textarea");
                    textArea.value = this.val;
                    this.$el.appendChild(textArea);
                    textArea.focus();
                    textArea.select();
                    this.show = true
                    setTimeout(()=>{this.show=false},1500)
                    return new Promise((res, rej) => {
                        document.execCommand('copy') ? res() : rej();
                        textArea.remove();
                    });
            },
            // stopPropagation: function (event){
            //     event.stopPropagation()
            // }
        }
    }
</script>

<style>
    .ClipboardContent{
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        cursor: pointer;
    }

    .ClipboardContent p{
        color:var(--clipboard-color);
    }
</style>