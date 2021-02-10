<template>
  <div id="app">
    <v-app>
      <v-main>
        <v-toolbar>
          <v-toolbar-title v-html="pageTitle"></v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <router-view />
      </v-main>
    </v-app>
  </div>
</template>
<script>
export default {
  name: "app",
  components: {},
  data(){
    return {
      pageTitle: process.env.VUE_APP_FORMULARIUM_TITLE
    };
  }
};
</script>

<style lang="scss"></style>
