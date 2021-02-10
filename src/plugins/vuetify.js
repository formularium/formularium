import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";

Vue.use(Vuetify);

export default new Vuetify({
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