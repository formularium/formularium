import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";

Vue.use(Vuetify);
import en from "vuetify/es5/locale/en";
export default new Vuetify({
  framework: {
    lang: { locales: { en }, current: "en" }
  },
  lang: { locales: { en }, current: "en" },
  theme: {
    themes: {
      light: {
        primary: process.env.VUE_APP_COLOR_PRIMARY,
        secondary: process.env.VUE_APP_COLOR_SECONDARY,
        accent: process.env.VUE_APP_COLOR_ACCENT,
        error: process.env.VUE_APP_COLOR_ERROR,
        info: process.env.VUE_APP_COLOR_INFO,
        success: process.env.VUE_APP_COLOR_SUCCESS,
        warning: process.env.VUE_APP_COLOR_WARNING
      }
    }
  }
});
