<template>
    <div>
        <v-subheader>
            Дата и время:
        </v-subheader>
        <TimeFilter/>
        <v-subheader>
            Округ:
        </v-subheader>
        <v-select>
        </v-select>
        <v-subheader>
            Жилищник:
        </v-subheader>
        <v-subheader>
            Категории заявок:
        </v-subheader>
        <v-subheader>
            Классы аномальности:
        </v-subheader>
    </div>
</template>

<script>
    import TimeFilter from "./TimeFilter";
    export default {
        name: "Filters",
        components: {TimeFilter}
    }
</script>

<style scoped>

</style>