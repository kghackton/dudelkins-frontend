<template>
    <thead>
    <tr>
<!--        <th class="text-center px-0" style="max-width: 100px; min-width: 100px;">-->
<!--            <Cell filter="status" small>-->
<!--                <p>Статус</p>-->
<!--            </Cell>-->
<!--        </th>-->
        <th class="text-center">
            <p>Аномальность</p>
        </th>
        <th class="text-center" style="max-width: 150px; min-width: 150px">
            <p>Дефект</p>
        </th>
        <th class="text-center">
            <p>Время открытия</p>
        </th>
        <th class="text-center">
            <p>Время закрытия</p>
        </th>
        <th class="text-center">
            <p>Адрес</p>
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
