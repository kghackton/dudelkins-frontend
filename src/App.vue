<template>
  <v-app id="app">
    <notifications style="z-index: 1000"></notifications>
    <NavBar/>
    <v-main app>
      <FilterPanel style="z-index: 2"/>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
  import FilterPanel from "./components/FilterPanel/FilterPanel";
  import NavBar from "./components/NavBar";
  import InfoCard from "./components/InfoCard/InfoCard";
  export default {
    name: 'App',
    components: {InfoCard, NavBar, FilterPanel},
    data: () => ({
      //
    }),
  };
</script>

<style>
  html{
    --htmlbackground: rgb(18, 18, 22);
    background-color: var(--htmlbackground);
  }
  #app {
    background-color: inherit;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
  }

  #app p{
    -webkit-user-select: text;
    margin-bottom:0px;
    color: var(--font-color);
    opacity: .8;
  }

  #app [role='listbox']{
    background-color:var(--dropdown-color);
    color: white;
  }
  .hidden {
    visibility: hidden;
  }
</style>
