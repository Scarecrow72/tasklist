import { injectStores } from "@mobx-devtools/tools"

import taskListStore from "./taskListStore"
import modalWindowStore from "./modalWindowStore"

injectStores({
    taskListStore,
    modalWindowStore
})

export { taskListStore, modalWindowStore }