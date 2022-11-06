import * as API from "@/api";
export default {
    state: ()=>({
        anomalyClasses: {},
        anomalyClassesHour: {},
        normalAbnormal: {},
    }),
    getters:{
        STAT: state => state,
        STAT_ANOMALY_CLASSES: state=> state.anomalyClasses,
        STAT_ANOMALY_CLASSES_HOUR: state=> state.anomalyClassesHour,
        STAT_NORMAL_ABNORMAL: state => state.normalAbnormal,
    },
    mutations:{
        STAT_ANOMALY_CLASSES_SET: (state, newStat) => {
            state.anomalyClasses = newStat
        },
        STAT_ANOMALY_CLASSES_HOUR_SET: (state, newStat) => {
            state.anomalyClassesHour = newStat
        },
        STAT_NORMAL_ABNORMAL_SET: (state, newStat) => {
            state.normalAbnormal = newStat
        },
    },
    actions:{
        STAT_ANOMALY_CLASSES_GET: ({getters, commit, dispatch })=>{
          return API.getAnomalyClassesStat(getters.FILTERS).then(res => {
            commit('STAT_ANOMALY_CLASSES_SET', res)
          })
        },

        STAT_ANOMALY_CLASSES_HOUR_GET: ({getters, commit, dispatch })=>{
          return API.getAnomalyClassesHourStat(getters.FILTERS).then(res => {
            commit('STAT_ANOMALY_CLASSES_HOUR_SET', res)
          })
        },

        STAT_NORMAL_ABNORMAL_GET: ({getters, commit, dispatch })=>{
          return API.getNormalAbnormalStat(getters.FILTERS).then(res => {
            commit('STAT_NORMAL_ABNORMAL_SET', res)
          })
        }
    }
}
