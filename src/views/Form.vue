<template>
  <div class="grey lighten-5 background">
    <FormRenderer :code="code" :formID="id" :debuggerMode="false"></FormRenderer>
  </div>
</template>

<script>
import FormRenderer from "./../components/FormRenderer";

export default {
  name: "Form",
  components: {
    FormRenderer
  },
  data() {
    return { code: null, id: null };
  },
  watch: {
    form(form) {
      this.code = form.jsCode;
      this.id = form.id
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

<style scoped>
.background {
  min-height: 100%;
}
</style>
