<template>
  <FormEditor :xml-code="this.code"></FormEditor>
</template>

<script>
import FormEditor from "../components/FormEditor";

export default {
  name: "Editor",
  components: { FormEditor },

  data() {
    return { code: "" };
  },
  watch: {
    form(form) {
      this.code = form.xmlCode;
    }
  },
  apollo: {
    form: {
      query() {
        return require("../graphql/form.gql");
      },
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
