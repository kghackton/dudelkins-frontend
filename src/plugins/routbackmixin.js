export default (defaultPath)=>{
    return {
        data: () => ({
            prevPath: defaultPath
        }),
        beforeRouteEnter(to, from, next) {
            next(vm => {
                    vm.prevPath = (from.matched.length > 0) ? from.fullPath : defaultPath
                }
            )
        },
        // created() {
        //     this.listener = (ev) => {
        //         switch (ev.key) {
        //             case 'Escape':
        //                 this.routerBack()
        //                 break;
        //         }
        //     }
        //     document.addEventListener('keyup', this.listener);
        // },
        // destroyed() {
        //     document.removeEventListener('keyup', this.listener)
        // },
        methods: {
            routerBack() {
                this.$router.push(this.prevPath)
            }
        }
    }
}