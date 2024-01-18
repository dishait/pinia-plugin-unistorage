import { defineStore } from "pinia";

export const useStore = defineStore("main", {
  state() {
    return {
      counter: 0,
    };
  },
  actions: {
    inc() {
      this.counter++;
    },
  },
  unistorage: true,
});
