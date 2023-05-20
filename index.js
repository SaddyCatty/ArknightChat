const socket = io();

// 发送历史消息
socket.on("history messages", (data) => {
  for (const message of data) {
    const li = document.createElement("li");
    li.innerText = `${message.name}: ${message.message}`;
    const timeSpan = document.createElement("span");
    timeSpan.classList.add("time");
    timeSpan.innerText = message.time;

    li.appendChild(timeSpan);
    document.querySelector("#messages").appendChild(li);
  }
});

// 处理发送消息事件
function sendMessage() {
  const input = document.querySelector("#message-input");
  const message = input.value.trim();

  if (message !== "") {
    const li = document.createElement("li");
    li.innerText = `${getName()}: ${message}`;
    li.classList.add("sent");

    const timeSpan = document.createElement("span");
    timeSpan.classList.add("time");
    timeSpan.innerText = getCurrentTime();

    li.appendChild(timeSpan);
    document.querySelector("#messages").appendChild(li);

    socket.emit("chat message", {
      name: getName(),
      message: message,
      time: getCurrentTime(),
    });
  }

  input.value = "";
}

// 处理递交姓名表单事件
function submitName(event) {
  event.preventDefault();
  const nameInput = document.querySelector("#name-input");
  const name = nameInput.value.trim();

  if (name !== "") {
    localStorage.setItem("name", name);
    document.querySelector(".modal").style.display = "none";
  }
}

// 获取当前时间
function getCurrentTime() {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, "0")}:${now
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
}

// 获取用户名称，默认为'访客'
function getName() {
  const name = localStorage.getItem("name");
  return name === null ? "访客" : name;
}

// 显示弹窗
document.querySelector(".modal").style.display = "block";

// 处理关闭弹窗事件
document.querySelector(".close").addEventListener("click", () => {
  document.querySelector(".modal").style.display = "none";
});

// 监听递交姓名表单事件
document.querySelector("#name-form").addEventListener("submit", submitName);

// 监听发送消息事件
document.querySelector("#message-form").addEventListener("submit", (event) => {
  event.preventDefault();
  sendMessage();
});

// 监听服务器返回的消息事件
socket.on("chat message", (data) => {
  const li = document.createElement("li");
  li.innerText = `${data.name}: ${data.message}`;
  const timeSpan = document.createElement("span");
  timeSpan.classList.add("time");
  timeSpan.innerText = data.time;

  li.appendChild(timeSpan);
  document.querySelector("#messages").appendChild(li);
});
