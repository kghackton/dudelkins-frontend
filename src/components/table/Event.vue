<template>
    <tr>
        <td>
            <v-chip v-for="label in labelsList" :key="label" :color="labelsDict[label].color" class="mt-2">
                {{labelsDict[label].text}}
                <v-icon right :title="labelsDict[label].description || null">
                    mdi-information-outline
                </v-icon>
            </v-chip>
        </td>
        <td>
            <p>{{defect}}</p>
        </td>
        <td>
            <p>{{createdAt}}</p>
        </td>

        <td>
            <p>{{closedAt}}</p>
        </td>
        <td>
            <p>{{event.address}}</p>
        </td>
    </tr>
</template>

<script>
    import labels from "@/plugins/labels.json"
    import defects from "@/assets/defects.json"
    import dayjs from "dayjs";
    import 'dayjs/locale/ru'
    export default {
        name: "Event",
        props:{
            event:{
                type: Object,
                required: true
            },
        },
        computed:{
            labelsDict(){
                return labels
            },
            labelsList(){
                return Object.keys(this.event?.anomalyClasses || {}).map(anCl=>{
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
            defect(){
                if (this.event?.defectId in defects){
                    return defects[this.event.defectId]
                } else
                    return null
            },
            createdAt(){
                return dayjs(new Date(this.event.createdAt)).locale('ru').format('D MMM HH:mm')
            },
            closedAt(){
                return dayjs(new Date(this.event.closedAt)).locale('ru').format('D MMM HH:mm')
            },
        },

        methods: {
        },
        components:{

        }
    }
</script>