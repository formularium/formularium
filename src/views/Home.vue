<template>
  <div class="home">
    <v-container>
      <v-sheet color="white" elevation="1" class="my-4 pa-6" v-if="showAboutFormularium === 'show'">
        <h1>About</h1>
        <p>
          Formularium is a FOSS, privacy-first, and user-friendly toolkit for
          small to medium-sized municipalities (1-150k inhabitants) to support
          them in making their public services available online.
        </p>
        <p>
          <b>Why?</b>: We feel that municipalities are a backbone to democracy
          but often are left behind when extending the democratic government to
          the digital world. We think that neither existing vendors nor the
          federal government provides the software components and the concepts
          needed to digitize municipalities’ processes.
        </p>
        <p>
          Learn more on
          <a href="https://github.com/LilithWittmann/formularium">Github</a>.
        </p>
      </v-sheet>
      <v-row dense v-if="allForms">
        <v-col
          v-for="item in allForms.edges"
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
                Form
              </v-btn>
              <v-btn v-if="showPublicEditBtn === 'show'" text color="primary" :to="`/editor/${item.node.id}`">
                Editor
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col></v-row
      ></v-container
    >
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Home",
  components: {},
  data() {
    return {
      showAboutFormularium: process.env.VUE_APP_SHOW_ABOUT_FORMULARIUM_PUBLIC,
      showPublicEditBtn: process.env.VUE_APP_SHOW_FORM_EDITOR_BTN_PUBLIC,
    };
  },
  apollo: {
    allForms: {
      query() {
        return require("../graphql/allForms.gql");
      }
    }
  }
};
</script>
