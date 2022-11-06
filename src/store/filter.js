import dayjs from "dayjs";
export default {
    state: ()=>({
        starttime: new Date(dayjs(new Date()).format('YYYY-MM-DDT00:00:00'+'Z')),
        endtime: new Date(dayjs(new Date()).format('YYYY-MM-DDT23:59:59'+'Z')),
        anomalyClasses:[],
        categories:[],
        region: null,
    }),
    getters:{
        FILTERS: state => state,
        FILTER_STARTTIME: state=> state.starttime,
        FILTER_ENDTIME: state=> state.endtime,
        FILTER_ANOMALY_CLASSES: state => state.anomalyClasses,
        FILTER_CATEGORIES: state => state.categories,
        FILTER_REGION: state => state.region
    },
    mutations:{
        FILTER_CATEGORIES_ADD: (state, newCategories) => {
            const newLabels = [newCategories].flatMap(x=>x)
            state.categories = [...(new Set([...state.categories, ...newCategories]))]
        },
        FILTER_CATEGORIES_REMOVE: (state, category) => {
            const index = state.categories.indexOf(category);
            if (index !== -1) { state.categories.splice(index, 1) }
        },
        FILTER_ANOMALY_CLASSES_ADD: (state, newClasses) => {
            const newClasses_map = [newClasses].flatMap(x=>x)
            state.anomalyClasses = [...(new Set([...state.anomalyClasses, ...newClasses_map]))]
        },
        FILTER_ANOMALY_CLASSES_REMOVE: (state, classToRem) => {
            const index = state.anomalyClasses.indexOf(classToRem);
            if (index !== -1) { state.anomalyClasses.splice(index, 1) }
        },
        FILTER_REGION_SET:(state, region)=>{
            state.region = region
        },
        FILTER_CATEGORIES_SET:(state, categories)=>{
            state.categories = categories
        },
        FILTER_ANOMALY_SET:(state, anomalyClasses)=>{
            state.anomalyClasses = anomalyClasses
        },
        FILTER_STARTTIME_SET: (state, newval) => {
            state.starttime = newval
        },
        FILTER_ENDTIME_SET: (state, newval) => {
            state.endtime = newval
        },
    },
    actions:{
        FILTER_TIME_SET:({getters, commit, dispatch }, {start, end})=>{
            commit('FILTER_STARTTIME_SET', start)
            commit('FILTER_ENDTIME_SET', end)

        },


    }
}
