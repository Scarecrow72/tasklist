import { observable, runInAction } from 'mobx'

const taskListStore = observable({
    taskList: [],
    userList: [],

    loadUserList(socket) {
        socket.on('resUList', (data) => {
            runInAction(() => {
                this.userList = JSON.parse(data);
            })
        })
    },

    loadTaskList(socket) {
        socket.on('dataOutput', (data) => {
            runInAction(() => {
                this.taskList = JSON.parse(data);
            })
        })
    }

})

export default taskListStore