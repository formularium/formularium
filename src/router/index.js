import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Form from "../views/Form";
import Editor from "../views/Editor";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/form/:id",
    name: "Form",
    component: Form
  },
  {
    path: "/editor/:id",
    name: "Editor",
    component: Editor
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
