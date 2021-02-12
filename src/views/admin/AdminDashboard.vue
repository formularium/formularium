<template>
  <div>
    <v-container>
      <v-sheet color="white" elevation="1" class="my-4 pa-6">
        <h1>Admin</h1>
        <p>
          Your favorite form is not available yet?<br />
          <v-btn color="primary" small @click.stop="showCreateForm = true"
            >Create Form</v-btn
          >
        </p>
      </v-sheet>
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
              <v-btn
                text
                color="primary"
                @click.stop="
                  editFormID = item.node.id;
                  showEditForm = true;
                "
              >
                Settings
              </v-btn>
              <v-btn text color="primary" :to="`/editor/${item.node.id}`">
                Editor
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <CreateForm v-model="showCreateForm" @createdForm="reload" />
      <EditForm
        v-model="showEditForm"
        @editedForm="reload"
        :formID="editFormID"
      />
    </v-container>
  </div>
</template>

<script>
import * as AUTH from "../../auth";
import CreateForm from "../../components/AdminDashboard/CreateForm";
import EditForm from "../../components/AdminDashboard/EditForm";
export default {
  name: "AdminDashboard",
  components: { CreateForm, EditForm },
  data() {
    return { showCreateForm: false, showEditForm: false, editFormID: null };
  },
  methods: {
    reload() {
      this.$apollo.queries.allInternalForms.refetch();
      this.editFormID = null;
    }
  },
  apollo: {
    me: {
      query() {
        return require("../../graphql/admin/me.gql");
      },
      skip() {
        return AUTH.isLoggedIn() === false;
      }
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
