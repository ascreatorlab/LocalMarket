/* ===== 🔐 ZENVI - FIREBASE CONFIG ===== */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// ✅ Zenvi Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyA-WhbKSkuAx9S9sDcOZ-zWW84Pew29Z5E",
  authDomain: "knowmarket-bfdf7.firebaseapp.com",
  projectId: "knowmarket-bfdf7",
  storageBucket: "knowmarket-bfdf7.firebasestorage.app",
  messagingSenderId: "68118658961",
  appId: "1:68118658961:web:ea785bdaf3b0caa84da430"
};

// ✅ Initialize Firebase
let app, auth, provider;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  provider = new GoogleAuthProvider();
  console.log("🔐 Firebase initialized ✅");
} catch (error) {
  console.error("❌ Firebase init error:", error.message);
}

window.firebaseReady = (app !== undefined);
window.zenviAuth = { auth, provider };

// ✅ Safe DOM helper
function safeDOMUpdate(callback) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback);
  } else {
    callback();
  }
}

// ✅ Update Profile UI
function updateProfileUI(user) {
  safeDOMUpdate(() => {
    // Hero section updates
    const nameEl = document.getElementById("profileDisplayName");
    const emailTop = document.getElementById("profileEmailTop");
    const avatarIcon = document.getElementById("profileAvatarIcon");
    const avatarImg = document.getElementById("profileAvatarImg");
    const onlineDot = document.getElementById("profileOnlineDot");

    if (nameEl) nameEl.textContent = user.displayName || "User";
    if (emailTop) emailTop.textContent = user.email;
    if (onlineDot) onlineDot.style.display = "block";

    // Show Google profile photo
    if (user.photoURL && avatarImg && avatarIcon) {
      avatarImg.src = user.photoURL;
      avatarImg.style.display = "block";
      avatarIcon.style.display = "none";
    }

    // Show profile details, hide login card
    const loginCard = document.getElementById("loginCard");
    const profileDetails = document.getElementById("profileDetails");
    const userEmail = document.getElementById("userEmail");
    const joinDate = document.getElementById("joinDate");

    if (loginCard) loginCard.style.display = "none";
    if (profileDetails) profileDetails.classList.remove("hidden");
    if (userEmail) userEmail.textContent = user.email;
    if (joinDate) {
      const d = user.metadata?.creationTime
        ? new Date(user.metadata.creationTime).toLocaleDateString('hi-IN', {year:'numeric',month:'long'})
        : "Recently joined";
      joinDate.textContent = `Joined: ${d}`;
    }
  });
}

// ✅ Reset Profile UI
function resetProfileUI() {
  safeDOMUpdate(() => {
    const nameEl = document.getElementById("profileDisplayName");
    const emailTop = document.getElementById("profileEmailTop");
    const avatarIcon = document.getElementById("profileAvatarIcon");
    const avatarImg = document.getElementById("profileAvatarImg");
    const onlineDot = document.getElementById("profileOnlineDot");
    const loginCard = document.getElementById("loginCard");
    const profileDetails = document.getElementById("profileDetails");

    if (nameEl) nameEl.textContent = "Guest User";
    if (emailTop) emailTop.textContent = "Login karein apna account access karne ke liye";
    if (onlineDot) onlineDot.style.display = "none";
    if (avatarImg) { avatarImg.style.display = "none"; avatarImg.src = ""; }
    if (avatarIcon) avatarIcon.style.display = "block";
    if (loginCard) loginCard.style.display = "block";
    if (profileDetails) profileDetails.classList.add("hidden");
  });
}

// ✅ Google Login
window.googleLogin = function() {
  if (!auth) { alert("⚠️ Firebase not ready. 2 second baad try karein."); return; }
  signInWithPopup(auth, provider)
    .then(result => updateProfileUI(result.user))
    .catch(error => {
      if (error.code === 'auth/popup-closed-by-user') return;
      if (error.code === 'auth/unauthorized-domain') {
        alert("❌ Domain authorized nahi hai.\nFirebase Console → Authentication → Authorized domains mein add karein.");
      } else if (error.code === 'auth/popup-blocked') {
        alert("⚠️ Popup blocked. Browser mein popups allow karein.");
      } else {
        alert("Login failed: " + error.message);
      }
    });
};

// ✅ Logout
window.logout = function() {
  if (!auth) return;
  signOut(auth).then(() => resetProfileUI()).catch(console.error);
};

// ✅ Auth State Listener
if (auth) {
  onAuthStateChanged(auth, user => {
    if (user) updateProfileUI(user);
    else resetProfileUI();
  });
}

// ✅ Wire up buttons after DOM ready
document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("googleLoginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  if (loginBtn) loginBtn.addEventListener("click", window.googleLogin);
  if (logoutBtn) logoutBtn.addEventListener("click", window.logout);
});

console.log("🔐 Firebase config loaded ✅");
