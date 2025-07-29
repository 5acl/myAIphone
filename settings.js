// settings.js
// 存储 & 读取用户设置（API地址、密钥、模型名）

// 弹窗输入设置
function loadSettings() {
  let apiUrl = localStorage.getItem("apiUrl");
  let apiKey = localStorage.getItem("apiKey");
  let modelName = localStorage.getItem("modelName");

  if (!apiUrl || !apiKey || !modelName) {
    apiUrl = prompt("请输入 API 地址（例如：https://xxx.com/v1/chat/completions）", apiUrl || "");
    apiKey = prompt("请输入 API 密钥", apiKey || "");
    modelName = prompt("请输入模型名称（例如：[X]Gemini-2.5-pro【4.5】）", modelName || "");

    localStorage.setItem("apiUrl", apiUrl);
    localStorage.setItem("apiKey", apiKey);
    localStorage.setItem("modelName", modelName);
  }

  return { apiUrl, apiKey, modelName };
}

const SETTINGS = loadSettings();
