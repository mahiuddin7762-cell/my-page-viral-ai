const videoUrl = document.getElementById("video-url");
const pasteBtn = document.getElementById("paste-btn");
const generateBtn = document.getElementById("generate-btn");
const urlHint = document.getElementById("url-hint");
const emptyState = document.getElementById("empty-state");
const jobStatus = document.getElementById("job-status");
const connectBtn = document.getElementById("connect-btn");
const settingsBtn = document.getElementById("settings-btn");
const toast = document.getElementById("toast");

let clipDuration = 30;
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// Select 30-second or 40-second clip
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

// Paste video link
pasteBtn.addEventListener("click", async () => {
  try {
    const text = await navigator.clipboard.readText();

    if (text) {
      videoUrl.value = text.trim();
      showToast("वीडियो लिंक पेस्ट हो गया");
    } else {
      showToast("पहले वीडियो लिंक कॉपी करें");
    }
  } catch (error) {
    videoUrl.focus();
    showToast("लिंक बॉक्स में दबाकर Paste चुनें");
  }
});

// Check the YouTube link
function isValidYouTubeUrl(value) {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase().replace(/^www\./, "");

    return (
      ["youtube.com", "m.youtube.com", "youtu.be"].includes(host) &&
      (host === "youtu.be" ||
        url.pathname === "/watch" ||
        url.pathname.startsWith("/shorts/") ||
        url.pathname.startsWith("/embed/") ||
        url.pathname.startsWith("/live/"))
    );
  } catch {
    return false;
  }
}

// Prepare clip button
generateBtn.addEventListener("click", () => {
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

  emptyState.hidden = true;
  jobStatus.hidden = false;

  jobStatus.textContent =
    `आपने ${clipDuration} सेकंड का क्लिप चुना है। ` +
    "लिंक जाँच लिया गया है, लेकिन AI वीडियो प्रोसेसिंग सर्वर अभी कनेक्ट नहीं है।";

  showToast("लिंक सही है! अगला कदम सर्वर कनेक्ट करना है।");
});

// Facebook connection
connectBtn.addEventListener("click", () => {
  showToast("Facebook कनेक्शन अभी सेटअप होना बाकी है");
});

// Settings button
settingsBtn.addEventListener("click", () => {
  showToast("सेटिंग्स जल्द जोड़ी जाएँगी");
});

// Navigation links
document.querySelectorAll('.nav-item[href="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    if (link.classList.contains("brand")) return;

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
});
