const express = require("express");
const app = express();
const PORT = 3000;
const SHA256 = require("crypto-js/sha256");
const db = require("./database/db");
const http = require("http").Server(app);
const cors = require("cors");
const socketIo = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:5173",
  },
});

const users = [
  {
    first_name: "Мария",
    last_name: "Вертунова",
    login: "maria_v",
    password: "123456qwerty",
    manager: null,
  },
  {
    first_name: "Евгений",
    middle_name: "Сергеевич",
    last_name: "Истомин",
    login: "ScaryCrow",
    password: "cbcntvfnbrf",
    manager: 1,
  },
  {
    first_name: "Марина",
    middle_name: "Павловна",
    last_name: "Истомина",
    login: "Scary",
    password: "cbcntvfnbrf",
    manager: 1,
  },
];

users.map(async (element) => {
  await db("users")
    .insert({
      first_name: element.first_name,
      middle_name: element.middle_name,
      last_name: element.last_name,
      login: element.login,
      password: SHA256(element.password).toString(),
      manager: element.manager,
    })
    .onConflict("login")
    .ignore();
});

socketIo.on("connection", (socket) => {
  socket.on("user", async (data) => {
    let correctPassword;
    let userName;
    let authorised_user;
    await db("users")
      .select()
      .where("login", data.name)
      .first()
      .then((user) => {
        authorised_user = new Object(user);
      })
      .catch((err) => {
        console.log(err);
      });
    if (
      data.name === authorised_user.login &&
      authorised_user.password === SHA256(data.password).toString()
    ) {
      correctPassword = true;
      userName = true;
    } else if (data.name !== authorised_user.login) {
      userName = false;
      correctPassword = false;
    } else {
      userName = true;
      correctPassword = false;
    }
    const id = authorised_user.id;
    const firstName = authorised_user.first_name;
    const middleName = authorised_user.middle_name;
    const lastName = authorised_user.last_name;
    socket.emit("answer", {
      userName,
      correctPassword,
      id,
      firstName,
      middleName,
      lastName,
    });
  });

  socket.on("usersList", async (data) => {
    await db("users")
      .select("id", "first_name", "middle_name", "last_name")
      .where("manager", data)
      .then((users) => {
        socket.emit("resUList", JSON.stringify(users));
      });
  });

  socket.on("dataInput", async (data) => {
    let date = new Date();
    console.log(data);
    await db("tasks")
      .insert({
        title: data.title,
        description: data.description,
        create_date: date,
        finish_date: data.finishDate,
        priority: data.priority,
        status: data.status,
        creator: data.creatorId,
        responsible: data.employeeId,
      })
      .then();
  });

  socket.on("tasks", async (data) => {
    await db("tasks")
      .where("responsible", data)
      .leftJoin("users", "users.id", "tasks.responsible")
      .select(
        "tasks.id",
        "title",
        "description",
        "create_date",
        "finish_date",
        "renew_date",
        "priority",
        "status",
        "first_name",
        "middle_name",
        "last_name"
      )
      .then((tasks) => {
        socket.emit("dataOutput", JSON.stringify(tasks));
      });
  });

  socket.on("tasklist", async (data) => {
    await db("tasks")
      .where("creator", data)
      .leftJoin("users", "users.id", "tasks.responsible")
      .select(
        "tasks.id",
        "title",
        "description",
        "create_date",
        "finish_date",
        "renew_date",
        "priority",
        "status",
        "first_name",
        "middle_name",
        "last_name"
      )
      .then((tasks) => {
        socket.emit("dataOutput", JSON.stringify(tasks));
      });
  });

  socket.on("dataUpdate", async (data) => {
    let date = new Date();
    await db("tasks").where("id", data.id).update({
      renew_date: date,
      status: data.status,
    });
  });
});

http.listen(PORT, () => {
  console.log("Server working");
});
