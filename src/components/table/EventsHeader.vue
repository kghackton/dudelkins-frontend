<template>
    <thead>
    <tr>
<!--        <th class="text-center px-0" style="max-width: 100px; min-width: 100px;">-->
<!--            <Cell filter="status" small>-->
<!--                <p>Статус</p>-->
<!--            </Cell>-->
<!--        </th>-->
        <th class="text-center">
            <p>Скриншот</p>
        </th>
        <th class="text-center" style="max-width: 150px; min-width: 150px">
        </th>
        <th class="text-center">
        </th>
        <th>

        </th>
        <th class="text-center">

        </th>
    </tr>
    <TableLoader type="events"/>
    </thead>
</template>

<script>
    import TableLoader from "./TableLoader";
    export default {
        name: "EventsHeader",
        components:{ TableLoader},
        methods:{
            refresh: function () {
                this.$store.dispatch('events/LOADER_INITIAL')
            },
        }
    }
</script>
