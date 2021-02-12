<template>
  <div>
    <AppEditor
      :xml-code="this.code"
      :showSave="showSave"
      @saveForm="saveForm"
    ></AppEditor>
    <v-snackbar v-model="snackbar" :timeout="snackTimeout">
      {{ snackText }}
      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import AppEditor from "../components/AppEditor";
import * as AUTH from "../auth";

export default {
  name: "Editor",
  components: { AppEditor },

  data() {
    return {
      code: "",
      snackbar: false,
      snackText: null,
      snackTimeout: 2000,
      showSave: AUTH.isLoggedIn()
    };
  },
  watch: {
    form(form) {
      this.code = form.xmlCode;
    }
  },

  methods: {
    saveForm(data) {
      console.log(data);
      this.$apollo
        .mutate({
          // Query
          mutation: require("../graphql/admin/updateForm.gql"),
          // Parameters
          variables: {
            formId: this.$route.params.id,
            xmlCode: data.xml,
            jsCode: data.code
          }
        })
        .then(data => {
          console.log(data);
          this.snackText = "Form has been saved";
          this.snackbar = true;
        })
        .catch(error => {
          console.error(error);
          this.snackText = "An error occured while saving the form " + error;
          this.snackbar = true;
        });
    }
  },

  apollo: {
    form: {
      query() {
        if (AUTH.isLoggedIn() === true) {
          return require("../graphql/admin/internalForm.gql");
        } else {
          return require("../graphql/form.gql");
        }
      },
      update: data => data.form || data.internalForm,
      variables: function() {
        return {
          formID: this.$route.params.id
        };
      }
    }
  }
};
</script>

<style scoped></style>
