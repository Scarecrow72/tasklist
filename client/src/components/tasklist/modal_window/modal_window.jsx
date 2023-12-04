import React from "react";
import "./modal.css";
import { observer } from "mobx-react";
import { modalWindowStore } from "../../store";
import dayjs from "dayjs";

const Modal = ({ active, setActive, socket, users, task }) => {
  const handleTaskRenew = () => {
    const id = task.id;
    const status = modalWindowStore.status;
    socket.emit("dataUpdate", { id, status });
    setActive(false);
  };

  const handleTaskUpload = () => {
    modalWindowStore.setCreatorId(localStorage.getItem("id"));
    console.log(modalWindowStore);
    socket.emit("dataInput", modalWindowStore);
    setActive(false);
  };
  return (
    <div className={active ? "modal modal_active" : "modal"}>
      <div className={active ? "modal_content active" : "modal_content"}>
        <div className="header">
          <div>
            <label htmlFor="title">Заголовок: </label>
            {!!task.title ? (
              <span>{task.title}</span>
            ) : (
              <input
                type="text"
                id="title"
                onChange={({ target }) =>
                  modalWindowStore.setTitle(target.value)
                }
              />
            )}
          </div>

          <div>
            <label htmlFor="priority">Приоритет: </label>
            {!!task.priority ? (
              <span>{task.priority}</span>
            ) : (
              <select
                name="priority"
                id="priority"
                onChange={({ target }) =>
                  modalWindowStore.setPriority(target.value)
                }
              >
                <option></option>
                <option value="Высокий">Высокий</option>
                <option value="Средний">Средний</option>
                <option value="Низкий">Низкий</option>
              </select>
            )}
          </div>

          <div>
            <label htmlFor="status">Статус:</label>
            <select
              name="status"
              id="status"
              value={
                modalWindowStore.status.length === 0
                  ? task.status
                  : modalWindowStore.status
              }
              onChange={({ target }) =>
                modalWindowStore.setStatus(target.value)
              }
            >
              <option></option>
              <option value="на выполнение">на выполнение</option>
              <option value="выполняется">выполняется</option>
              <option value="выполнена">выполнена</option>
              <option value="отменена">отменена</option>
            </select>
          </div>

          <div>
            <label htmlFor="date">Дата окончания: </label>
            {!!task.finish_date ? (
              dayjs(task.finish_date).format("YYYY-MM-DD")
            ) : (
              <input
                type="date"
                id="date"
                onChange={({ target }) =>
                  modalWindowStore.setFinishDate(target.value)
                }
              />
            )}
          </div>

          <div>
            <label htmlFor="e">Ответственный: </label>
            {!!task.last_name ? (
              <span>
                {task.last_name} {task.first_name} {task.middle_name}
              </span>
            ) : (
              <select
                id="e"
                onChange={({ target }) =>
                  modalWindowStore.setEmployee(target.value)
                }
              >
                <option></option>
                {users.map((element) => {
                  return (
                    <option key={element.id} value={element.id}>
                      {element.first_name} {element.middle_name}{" "}
                      {element.last_name}
                    </option>
                  );
                })}
              </select>
            )}
          </div>
        </div>
        <main>
          <label htmlFor="description">Описание</label>
          <br></br>
          {!!task.description ? (
            <span>{task.description}</span>
          ) : (
            <textarea
              className="description"
              id="description"
              onChange={({ target }) =>
                modalWindowStore.setDescription(target.value)
              }
              cols="78"
              rows="10"
            ></textarea>
          )}
        </main>
        <div className="footer">
          <button
            onClick={(e) => {
              !!task.id ? handleTaskRenew() : handleTaskUpload();
            }}
          >
            {!!task.id ? "Обновить" : "Создать"}
          </button>
          <button onClick={(e) => setActive(false)}>Отмена</button>
        </div>
      </div>
    </div>
  );
};

export default observer(Modal);
