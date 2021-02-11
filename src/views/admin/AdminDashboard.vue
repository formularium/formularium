<template>
  <div>
    <h1 v-if="me">Hello {{ me.firstName }}!</h1>
  </div>
</template>

<script>
export default {
  name: "AdminDashboard",
  apollo: {
    me: {
      query() {
        return require("../../graphql/me.gql");
      }
    }
  }
};
</script>

<style scoped></style>
