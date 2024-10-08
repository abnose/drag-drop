import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import "primeicons/primeicons.css";
import Tooltip from 'primevue/tooltip';
import Vue3PersianDatetimePicker from "vue3-persian-datetime-picker";
import ToastService from "primevue/toastservice";

const pinia = createPinia();
const app = createApp(App);
app
  .use(pinia)
  .use(PrimeVue, {
    theme: {
      preset: Aura,
    },
  })
  .directive('tooltip', Tooltip)
  .use(Vue3PersianDatetimePicker, {
    name: "CustomDatePicker",
    props: {
      format: "YYYY-MM-DD",
      displayFormat: "jYYYY/jMM/jDD",
      editable: false,
      inputClass: "form-control",
      placeholder: "لطفا تاریخ را وارد کنید",
      altFormat: "YYYY-MM-DD",
      color: "#10B981",
      autoSubmit: true,
    },
  })
  .use(ToastService)
  .mount("#app");
