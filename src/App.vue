<template>
  <div id="app">
    <v-app>
      <v-main>
        <v-toolbar>
          <v-toolbar-title v-html="pageTitle"></v-toolbar-title>
          <v-spacer></v-spacer>

        <v-toolbar-items  v-if="me">

            <v-btn to="/admin">
                Admin Panel
            </v-btn>
            <v-menu open-on-hover offset-y transition="slide-x-transition" bottom right>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn v-bind="attrs" v-on="on">
                        {{me.firstName}} {{me.lastName}}
                    </v-btn>
                </template>
                <v-list dense>
                    <v-list-item>
                       <v-list-item-action  @click="logout()">
                            <v-list-item-title>Logout</v-list-item-title>
                        </v-list-item-action>
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-toolbar-items>
        </v-toolbar>
        <router-view />
      </v-main>
    </v-app>
  </div>
</template>
<script>
      import * as AUTH from "./auth";

export default {
  name: "app",
  components: {},
  data() {
    return {
      pageTitle: process.env.VUE_APP_FORMULARIUM_TITLE
    };
  },
  methods: {
    logout() {
      AUTH.logout();
      this.$router.go("Home");
    }
  },
    apollo: {
      me: {
        query() {
          return require("./graphql/admin/me.gql");
        },
        skip() {
          return AUTH.isLoggedIn() === false;
        },
      },
    }
};
</script>

<style lang="scss"></style>
