<template>
  <AppEditor :xml-code="this.code"></AppEditor>
</template>

<script>
import AppEditor from "../components/AppEditor";

export default {
  name: "Editor",
  components: { AppEditor },

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
