<template>
  <div>
      <v-container>

      <v-row dense v-if="allInternalForms">
        <v-col
          v-for="item in allInternalForms.edges"
          v-bind:key="item.node.id"
          :xl="4"
          :md="4"
          :sm="6"
          :xs="12"
          :cols="12"
        >
          <v-card elevation="2">
            <v-card-title>{{ item.node.name }}</v-card-title>
            <v-card-text>
              {{ item.node.description }}
            </v-card-text>
            <v-card-actions>
              <v-btn text color="primary" :to="`/form/${item.node.id}`">
                Settings
              </v-btn>
              <v-btn
                text
                color="primary"
                :to="`/editor/${item.node.id}`"
              >
                Editor
              </v-btn>
            </v-card-actions>
          </v-card>

        </v-col>
      </v-row
      >

      </v-container>
  </div>

</template>

<script>
    import * as AUTH from "../../auth";
export default {
  name: "AdminDashboard",
  apollo: {
    me: {
      query() {
        return require("../../graphql/admin/me.gql");
      },
      skip () {
          return AUTH.isLoggedIn() === false;
        },
    },

      allInternalForms: {
          query() {
            return require("../../graphql/admin/allInternalForms.gql");
          }
      }
  }
};
</script>

<style scoped></style>
