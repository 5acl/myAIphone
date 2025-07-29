// script.js
let messageHistory = JSON.parse(localStorage.getItem("chatMemory")) || [];
let userBuffer = []; // 临时存放用户追加输入的内容

const messagesContainer = document.getElementById("messages");
const inputField = document.getElementById("user-input");
const addLineBtn = document.getElementById("add-line");
const sendAllBtn = document.getElementById("send-all");

function renderMessages() {
  messagesContainer.innerHTML = "";
  messageHistory.forEach(msg => {
    const div = document.createElement("div");
    div.className = "message " + (msg.role === "user" ? "user" : "ai");
    div.textContent = msg.content;
    messagesContainer.appendChild(div);
  });
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function addUserLine() {
  const text = inputField.value.trim();
  if (!text) return;
  userBuffer.push(text);
  inputField.value = "";
  // 在聊天窗口显示用户刚输入的这一句（不发AI）
  messageHistory.push({ role: "user", content: text });
  saveMemory();
  renderMessages();
}

async function sendAllToAI() {
  if (userBuffer.length === 0) return;
  const userMessage = userBuffer.join("\n");
  userBuffer = [];

  // 调用API
  try {
    const res = await fetch(SETTINGS.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SETTINGS.apiKey}`
      },
      body: JSON.stringify({
        model: SETTINGS.modelName,
        messages: [...messageHistory, { role: "user", content: userMessage }],
        temperature: 0.9
      })
    });

    const data = await res.json();
    console.log(data);

    // 兼容不同API返回格式
    let reply = "";
    if (data.choices && data.choices[0].message) {
      reply = data.choices[0].message.content;
    } else if (data.candidates && data.candidates[0].content.parts) {
      // Gemini风格
      reply = data.candidates[0].content.parts.map(p => p.text).join("\n");
    } else {
      reply = JSON.stringify(data);
    }

    // 拆分回复为多行
    reply.split(/\n+/).forEach(line => {
      if (line.trim()) {
        messageHistory.push({ role: "ai", content: line.trim() });
      }
    });

    saveMemory();
    renderMessages();

  } catch (err) {
    console.error(err);
    alert("调用API失败，请检查设置。");
  }
}

function saveMemory() {
  localStorage.setItem("chatMemory", JSON.stringify(messageHistory));
}

// 绑定事件
addLineBtn.addEventListener("click", addUserLine);
sendAllBtn.addEventListener("click", sendAllToAI);

// 初次渲染
renderMessages();
