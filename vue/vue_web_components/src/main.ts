import "./assets/base.css";
import { defineCustomElement } from "vue";
import App from './App.vue';
import PersonaPlayer from './components/PersonaPlayer.vue'


function registerCustomElement(name: string, component: any) {
  const componentWithStyle = Object.assign({}, component, {
    styles: (component.styles ? component.styles : []),
  });
  window.customElements.define(name, defineCustomElement(componentWithStyle));
}


registerCustomElement("vue-app", App);
registerCustomElement("persona-player", PersonaPlayer)
