import React, { useState } from "react";
import styles from "./styles.module.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Modal from "./modal_window/modal_window";
import { taskListStore } from "../store";
import { observer } from "mobx-react";
import dayjs from "dayjs";

const headers = [
  "Заголовок",
  "Приоритет",
  "Дата окончания",
  "Ответственный",
  "Статус",
];
const Tasklist = ({ socket }) => {
  useEffect(() => {
    let data = localStorage.getItem("id");
    socket.emit("usersList", data);
    taskListStore.loadUserList(socket);
    console.log(taskListStore.userList.length);
    if (taskListStore.userList.length === 0) {
      socket.emit("tasks", data);
      taskListStore.loadTaskList(socket);
    } else {
      console.log(1);
      socket.emit("tasklist", data);
      taskListStore.loadTaskList(socket);
    }
  }, []);

  const [currentTask, setCurrentTask] = useState(null);
  const [modalActive, setModalActive] = useState(false);
  const date = new Date();
  const navigate = useNavigate();
  const handleLeave = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className={styles.tasklist}>
      <div className={styles.header}>
        <p className={styles.user}>
          <strong>Пользователь: </strong>
          {localStorage.getItem("lastName")} {localStorage.getItem("firstName")}{" "}
          {localStorage.getItem("middleName") !== "null"
            ? localStorage.getItem("middleName")
            : ""}
        </p>
        <p>
          <strong>Дата: </strong>
          {date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}.
          {date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1}
          .{date.getFullYear().toString()}
        </p>
        <button onClick={handleLeave} className={styles.btn}>
          Выйти
        </button>
      </div>
      <table>
        <thead>
          <tr>
            {headers.map((element, idx) => {
              return <th key={idx}>{element}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {taskListStore.taskList.map((element) => {
            return (
              <tr
                key={element.id}
                onClick={() => {
                  setModalActive(true);
                  setCurrentTask(element);
                }}
              >
                <td
                  className={
                    element.status === "выполнена"
                      ? styles.green
                      : element.finish_date <= date.toString
                      ? styles.red
                      : null
                  }
                >
                  {element.title}
                </td>
                <td>{element.priority}</td>
                <td>{dayjs(element.finish_date).format("DD.MM.YYYY")}</td>
                <td>
                  {element.last_name} {element.first_name} {element.middle_name}
                </td>
                <td>{element.status}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {taskListStore.userList.length !== 0 ? (
        <div className={styles.footer}>
          <button
            className={styles.btn}
            onClick={() => {
              setModalActive(true);
              setCurrentTask(null);
            }}
          >
            Создать задачу
          </button>
        </div>
      ) : (
        ""
      )}
      <Modal
        active={modalActive}
        setActive={setModalActive}
        socket={socket}
        users={taskListStore.userList}
        task={currentTask || {}}
      />
    </div>
  );
};

export default observer(Tasklist);
