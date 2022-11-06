<template>
    <div id="tableWrapper">
       <slot/>
    </div>
</template>

<style scoped>
    #tableWrapper{
        height: 100vh;
        background-color: inherit;
        padding:var(--table-padding-vertical) var(--table-padding-horizontal);
        filter: drop-shadow(0px 0px 4px rgba(100,255,218,.2)) drop-shadow(0px 0px 24px rgba(255, 255, 255, 0.2));
    }
</style>
