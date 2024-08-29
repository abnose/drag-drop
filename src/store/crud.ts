import { defineStore } from "pinia";
import { TaskGroup } from "../App.vue";
type taskList = TaskGroup[];
const dataStore = defineStore({
  id: "data",
  state: () => ({
    storedData: JSON.parse(localStorage.getItem("data")!) || [],
  }),
  getters: {},
  actions: {
    saveData(data: taskList) {
      localStorage.setItem("data", JSON.stringify(data));
      this.storedData = data;
      console.log("Data saved:", data);
    },
    loadData() {
      const data = JSON.parse(localStorage.getItem("data")!);
      if (data) {
        console.log("Data loaded:", data);
      } else {
        console.log("No data found in local storage.");
      }
    },
  },
});

export default dataStore;
