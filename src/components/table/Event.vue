<template>
    <tr>
        <td class="px-8 py-2">

        </td>
        <td>

        </td>
        <td>

        </td>

        <td>

        </td>

        <td>

        </td>
    </tr>
</template>

<script>

    export default {
        name: "Event",
        props:{
            event:{
                type: Object,
                required: true
            },
        },

        methods: {
            routforward: function (id) {
                // this.$router.push(`/web/events/${id}`)
            },
        },
        components:{

        }
    }
</script>