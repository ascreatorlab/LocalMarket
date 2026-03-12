/* ===== 🔐 FIREBASE CONFIG ===== */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// ✅ Your Firebase Config
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
  console.log("🔐 Firebase initialized successfully");
} catch (error) {
  console.error("❌ Firebase init error:", error.message);
}

// ✅ Global flag
window.firebaseReady = (app !== undefined);

// ✅ Safe DOM Update Helper
function safeDOMUpdate(callback) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback);
  } else {
    callback();
  }
}

// ✅ Global Login Function
window.googleLogin = function() {
  if (!auth) {
    alert("⚠️ Firebase not initialized. Please wait 2 seconds and try again.");
    return;  }
  
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      updateProfileUI(user);
      console.log("✅ Login successful:", user.displayName);
    })
    .catch((error) => {
      console.error("❌ Login error:", error.code, error.message);
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          break;
        case 'auth/unauthorized-domain':
          alert("❌ Domain not authorized. Add your domain to Firebase Console > Authorized Domains");
          break;
        case 'auth/network-request-failed':
          alert("⚠️ Network error. Please check your internet connection.");
          break;
        default:
          alert("Login failed: " + error.message);
      }
    });
};

// ✅ Global Logout Function
window.logout = function() {
  if (!auth) return;
  
  signOut(auth).then(() => {
    safeDOMUpdate(() => {
      const userName = document.getElementById("userName");
      const userEmail = document.getElementById("userEmail");
      const profileDetails = document.getElementById("profileDetails");
      const loginBtn = document.getElementById("googleLoginBtn");
      
      if (userName) userName.innerText = "";
      if (userEmail) userEmail.innerText = "";
      if (profileDetails) profileDetails.classList.add("hidden");
      if (loginBtn) loginBtn.style.display = "flex";
      
      console.log("✅ Logged out");
    });
  }).catch((error) => {
    console.error("❌ Logout error:", error.message);
  });
};

// ✅ Update Profile UI
function updateProfileUI(user) {  safeDOMUpdate(() => {
    const userName = document.getElementById("userName");
    const userEmail = document.getElementById("userEmail");
    const profileDetails = document.getElementById("profileDetails");
    const loginBtn = document.getElementById("googleLoginBtn");
    
    if (userName) userName.innerText = `Welcome, ${user.displayName} 🎉`;
    if (userEmail) userEmail.innerText = user.email;
    if (profileDetails) profileDetails.classList.remove("hidden");
    if (loginBtn) loginBtn.style.display = "none";
    
    console.log("👤 Profile updated for:", user.email);
  });
}

// ✅ Listen for auth state changes
if (auth) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      updateProfileUI(user);
      window.dispatchEvent(new CustomEvent('userLoggedIn', { detail: user }));
    } else {
      safeDOMUpdate(() => {
        const userName = document.getElementById("userName");
        const userEmail = document.getElementById("userEmail");
        const profileDetails = document.getElementById("profileDetails");
        const loginBtn = document.getElementById("googleLoginBtn");
        
        if (userName) userName.innerText = "";
        if (userEmail) userEmail.innerText = "";
        if (profileDetails) profileDetails.classList.add("hidden");
        if (loginBtn) loginBtn.style.display = "flex";
      });
    }
  });
}

// ✅ Expose auth object
window.knowMarketAuth = { auth, provider };

console.log("🔐 Firebase config loaded | Ready for login");
