const SERVER_URL = "https://overgrown-penalize-lapel.ngrok-free.dev";

const videoUrl = document.getElementById("video-url");
const pasteBtn = document.getElementById("paste-btn");
const generateBtn = document.getElementById("generate-btn");
const emptyState = document.getElementById("empty-state");
const jobStatus = document.getElementById("job-status");
const connectBtn = document.getElementById("connect-btn");
const settingsBtn = document.getElementById("settings-btn");
const toast = document.getElementById("toast");

let clipDuration = 30;
let toastTimer;

function showToast(message) {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

document.querySelectorAll(".duration-option").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".duration-option").forEach((item) => {
      item.classList.remove("selected");
    });

    button.classList.add("selected");
    clipDuration = Number(button.dataset.duration);

    showToast(`${clipDuration} सेकंड का क्लिप चुना गया`);
  });
});

if (pasteBtn && videoUrl) {
  pasteBtn.addEventListener("click", async () => {
    try {
      const text = await navigator.clipboard.readText();

      if (text) {
        videoUrl.value = text.trim();
        showToast("वीडियो लिंक पेस्ट हो गया");
      } else {
        showToast("पहले वीडियो लिंक कॉपी करें");
      }
    } catch {
      videoUrl.focus();
      showToast("लिंक बॉक्स में दबाकर Paste चुनें");
    }
  });
}

function isValidYouTubeUrl(value) {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase().replace(/^www\./, "");

    return (
      ["youtube.com", "m.youtube.com", "youtu.be"].includes(host) &&
      (
        host === "youtu.be" ||
        url.pathname === "/watch" ||
        url.pathname.startsWith("/shorts/") ||
        url.pathname.startsWith("/embed/") ||
        url.pathname.startsWith("/live/")
      )
    );
  } catch {
    return false;
  }
}

if (generateBtn && videoUrl) {
  generateBtn.addEventListener("click", async () => {
    const link = videoUrl.value.trim();

    if (!link) {
      videoUrl.focus();
      showToast("पहले YouTube वीडियो का लिंक डालें");
      return;
    }

    if (!isValidYouTubeUrl(link)) {
      showToast("सही YouTube वीडियो लिंक डालें");
      return;
    }

    generateBtn.disabled = true;

    if (emptyState) emptyState.hidden = true;

    if (jobStatus) {
      jobStatus.hidden = false;
      jobStatus.textContent = "सर्वर से संपर्क किया जा रहा है…";
    }

    try {
      const response = await fetch(`${SERVER_URL}/health`, {
        method: "GET",
        mode: "cors",
        cache: "no-store"
      });

      if (!response.ok) {
        throw new Error("Server response error");
      }

      const data = await response.json();

      if (data.status !== "ok") {
        throw new Error("Server health check failed");
      }

      if (jobStatus) {
        jobStatus.textContent =
          `सर्वर कनेक्ट हो गया है! आपने ${clipDuration} सेकंड चुने हैं। ` +
          "अभी वीडियो क्लिप बनाने की सुविधा सर्वर में जोड़नी बाकी है।";
      }

      showToast("सर्वर कनेक्शन सफल!");
    } catch (error) {
      console.error("Server connection error:", error);

      if (jobStatus) {
        jobStatus.textContent =
          "सर्वर से संपर्क नहीं हो पाया। Colab और सर्वर लिंक जाँचें।";
      }

      showToast("Server connection error");
    } finally {
      generateBtn.disabled = false;
    }
  });
}

if (connectBtn) {
  connectBtn.addEventListener("click", () => {
    showToast("Facebook कनेक्शन अभी सेटअप होना बाकी है");
  });
}

if (settingsBtn) {
  settingsBtn.addEventListener("click", () => {
    showToast("सेटिंग्स जल्द जोड़ी जाएँगी");
  });
}

document.querySelectorAll('.nav-item[href="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
