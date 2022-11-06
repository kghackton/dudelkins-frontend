<template>
    <div>
        <div class="d-flex justify-center align-center pa-2 mr-10">
            <div class="text-left">
                <v-chip v-for="label in labelsList" :key="label" :color="labelsDict[label].color" class="mt-2">
                    {{labelsDict[label].text}}
                    <v-icon right :title="labelsDict[label].description || null">
                        mdi-information-outline
                    </v-icon>
                </v-chip>
            </div>
            <SaveIcon class="ml-auto" :save-value="info ? info.rootId : ''"/>
    <!--        <v-icon class="ml-auto">mdi-identifier</v-icon>-->
        </div>
        <v-subheader>
            Дата и время открытия:

        </v-subheader>
        <p>
            {{createdAt}}
        </p>
        <v-subheader>
            Дата и время закрытия:
        </v-subheader>
        <p>
            {{createdAt}}
        </p>

        <v-subheader>
            Округ:
        </v-subheader>
        <p v-if="info">{{info.region}}</p>
        <v-subheader>
            Жилищник:
        </v-subheader>
        <p v-if="info">{{info.managementCompanyTitle}}</p>

        <v-subheader>
            Адрес:
        </v-subheader>
        <p v-if="info">{{info.address}}</p>

        <v-subheader>
            Дефект:
        </v-subheader>

        <p v-if="defect">{{defect}}</p>
        <p v-else class="undef"> Некоррктный код дефекта</p>


        <v-subheader>
            Классы аномальности:
        </v-subheader>
                <p>{{info}}</p>
    </div>
</template>

<script>
    import {getOne} from "../../api";
    import labels from "@/plugins/labels.json"
    import defects from "@/assets/defects.json"
    import dayjs from "dayjs";
    import 'dayjs/locale/ru'
    import SaveIcon from "../wrappers/SaveIcon";
    export default {
        name: "InfoPanel",
        components: {SaveIcon},
        data:()=>({
            info: null
        }),
        mounted(){
            this.getInfo()
        },
        computed:{
            id(){
                return this.$route.params.id;
            },
            labelsDict(){
                return labels
            },
            labelsList(){
                return Object.keys(this.info?.anomalyClasses || {}).map(anCl=>{
                    switch (anCl){
                        case 'closed for less than 10 minutes with no returnings':
                            return 'closedForLessThan10MinutesWithNoReturnings'
                        case 'closed too fast':
                            return 'closedTooFast'
                        case 'closed with completion but without returnings for same applicant':
                            return 'closedWithCompletionButWithoutReturningsForSameApplicant'
                        case 'closed without completion for same applicant':
                            return 'closedWithoutCompletionForSameApplicant'
                        case 'deviation':
                            return 'deviation'
                        case 'with returnings':
                            return 'withReturnings'
                        case 'bad review':
                            return 'badReview'
                        case 'DudelkINS':
                            return 'DudelkINS'
                        default:
                            console.error(`UNKNOWN LABEL ${anCl}`)
                            return null
                    }
                })
            },
            createdAt(){
                return this.info ? dayjs(new Date(this.info.createdAt)).locale('ru').format('D MMM HH:mm') : null
            },
            closedAt(){
                return this.info ? dayjs(new Date(this.info.closedAt)).locale('ru').format('D MMM HH:mm') :null
            },
            defect(){
                if (this.info?.defectId in defects){
                    return defects[this.info.defectId]
                } else
                    return null
            }
        },
        methods:{
            getInfo(){
                getOne(this.id).then(info=>this.info = info)
            }
        },
        watch:{
            id(newval, oldval){
                this.info = null
                this.getInfo()
            }
        }
    }
</script>

<style scoped>
    .v-subheader{
        color: rgb(166, 189, 191)
    }
</style>