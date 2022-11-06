<template>
    <ScrollWrapper type="events">
        <v-simple-table id="eventsTable"
                        class="table"
                        fixed-header
                        :height="`calc(100vh - 2*var(--table-padding-vertical) - var(--toolbar-height))`"
                        dark
                        style="border-radius: 0"
        >
            <template v-slot:default>
                <EventsHeader/>
                <tbody v-if="list.length>0">
                    <Event v-for="ev in list"
                           :key="ev.uuid"
                           :event="ev"
                    />
                </tbody>
                <tbody v-else>
                    <td :colspan="999">
                        <p> Нарушений по данным фильтрам не найдено </p>
                    </td>
                </tbody>
            </template>
        </v-simple-table>
    </ScrollWrapper>
</template>

<script>
    import Event from "./Event";
    import EventsHeader from "./EventsHeader";
    import ScrollWrapper from "./ScrollWrapper";
    export default {
        name: "EventsTable",
        props:{

        },
        computed: {
            list(){
                return this.$store.getters.EVENTS
            },
        },

        components: {
            ScrollWrapper,
            EventsHeader,
            Event,
        }
    }
</script>

<style>
    #eventsTable{
        cursor: default;
    }
    #eventsTable .dialogToExp {
        width: auto !important
    }
    #eventsTable tbody th,  #eventsTable tbody td{
        word-wrap: break-word;
    }
</style>