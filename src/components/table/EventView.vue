<template>
    <TableWrapper>
<!--        <Toolbar type="events">-->
<!--            <template #counter>-->
<!--                <Counter :count="$store.getters.EVENTS_TOTAL"/>-->
<!--            </template>-->
<!--        </Toolbar>-->
        <EventsTable id="eventsTable"/>
    </TableWrapper>
</template>

<script>
    // import Toolbar from '../toolbarContent/Toolbar'
    import EventsTable from "./EventsTable";
    import TableWrapper from './TableWrapper'
    // import Counter from "../toolbarContent/Counter";

    export default {
        components: {
            EventsTable,
            TableWrapper
        }
    }
</script>

<style>
    #eventsTable{
        --events-table-row-height: 150px;
    }
</style>


