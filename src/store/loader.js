import typenames from "./typenames";
export default (type) => {
    const tl = typenames(type)
    return ({
        state: () => ({
            buffer: [],
            activeOptions: {},
            type,
            loading: false,
        }),
        namespaced: true,
        getters: {
            LOADER_BUFFER: state => state.buffer,
            LOADER_ACTIVEOPTIONS: state=>state.activeOptions,
            LOADER_LOADING: state=> state.loading,
        },
        mutations: {
            LOADER_STARTLOADING: state=>{state.loading = true},
            LOADER_STOPLOADING: state=>{state.loading = false},

            LOADER_SETBUFFER: (state, newBuffer) => {
                state.buffer = newBuffer
            },
            LOADER_CLEARBUFFER: (state) => {
                state.buffer = []
            },
            LOADER_ADDTOBUFFER: (state, newElems) => {
                state.buffer = [...state.buffer, ...(newElems || [])]
            },
            LOADER_SETACTIVEOPTIONS:(state, newOptions)=>{
                state.activeOptions = newOptions
            }
        },
        actions: {
            async LOADER_INITIAL(context) {
                tl.oninit()
                context.commit('LOADER_STARTLOADING')
                context.commit('LOADER_CLEARBUFFER')
                try {
                    const activeOptions = tl.activeoptions()
                    context.commit('LOADER_SETACTIVEOPTIONS', activeOptions)

                    const datatocontainer = tl.get({
                        offset: 0,
                        limit: tl.clientbulksize,
                        ...context.getters.LOADER_ACTIVEOPTIONS,
                    })

                    const datatobuffer = tl.get({
                        offset: tl.clientbulksize,
                        limit: tl.serverbulksize,
                        ...context.getters.LOADER_ACTIVEOPTIONS,
                    })

                    tl.rewrite(await datatocontainer)
                    const dtb = await tl.restolist(await datatobuffer)
                    context.commit('LOADER_ADDTOBUFFER', dtb)
                    context.commit(`LOADER_STOPLOADING`)
                }
                catch (err){
                    notify({text: `Ошибка при инициализации загрузки: ${err}`, theme: 'red'})
                    console.log(`Ошибка при инициализации загрузки: ${err}`)
                    context.commit(`LOADER_STOPLOADING`)
                    return
                }
            },
            async LOADER_GETADDITIONAL(context){
                if(tl.shouldload() && !context.getters.LOADER_LOADING){
                    context.commit('LOADER_STARTLOADING')
                    return tl.get({
                        offset: tl.activelist().length + context.getters.LOADER_BUFFER.length,
                        limit: tl.serverbulksize,
                        ...context.getters.LOADER_ACTIVEOPTIONS,
                    })
                        .then( dataToBuffer => {
                            return tl.restolist(dataToBuffer)})
                        .then( formatted => {
                            context.commit('LOADER_ADDTOBUFFER', formatted || [])
                            context.commit('LOADER_STOPLOADING')
                            return 0
                        })
                        .catch(err=>{
                            // notify({text: `Ошибка получения`, theme: 'red'})
                            console.log(`Ошибка получения: ${err}`)
                            context.commit('LOADER_STOPLOADING')
                            throw err
                        })
                }
                else{
                    return 0
                }
            },

            async LOADER_ASK(context) {
                const buf = context.getters.LOADER_BUFFER
                if (buf.length > 0) {
                    tl.add(buf.splice(0, tl.clientbulksize))
                    context.commit('LOADER_SETBUFFER', buf)
                }
                if(buf.length === 0) { //если буфер пустой
                    if(!tl.shouldload() ){
                        return
                    }
                    if (context.getters.LOADER_LOADING){
                        return
                    }
                    context.dispatch('LOADER_GETADDITIONAL')
                        .then(()=>{
                            context.dispatch('LOADER_ASK')
                        })

                }
            }
        }
    })
}
