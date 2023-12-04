import { observable } from "mobx";

const modalWindowStore = observable({
  title: "",
  description: "",
  finishDate: {},
  priority: "",
  status: "",
  creatorId: 0,
  employeeId: 0,

  setTitle(value) {
    this.title = value;
  },

  setDescription(value) {
    this.description = value;
  },

  setFinishDate(value) {
    this.finishDate = value;
  },

  setPriority(value) {
    this.priority = value;
  },

  setStatus(value) {
    this.status = value;
  },

  setCreatorId(value) {
    this.creatorId = value;
  },

  setEmployee(value) {
    this.employeeId = value;
  },
});

export default modalWindowStore;
