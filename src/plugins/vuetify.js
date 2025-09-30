import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    dark: false,
    themes: {
      light: {
        primary: "#1976D2",
        secondary: "#424242",
        accent: "#82B1FF",
      },
      dark: {
        primary: "#2196F3",
        secondary: "#FF5722",
        accent: "#FF4081",
      },
    },
  },
});
