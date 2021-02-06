<template>
  <div>
    <v-jsf :schema="this.schema" v-model="this.formData" />
  </div>
</template>

<script>
export default {
  name: "FormElement",
  props: ["schema", "formData"]
};
</script>

<style scoped>
.form-item {
  padding-top: 5px;
  padding-bottom: 5px;
  border-bottom: 2px solid #e3e3e3;
  background-color: #fff;
}
</style>
