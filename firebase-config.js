// ==================== Firebase Configuration ====================
const firebaseConfig = {
    apiKey: "AIzaSyDcZL0hGy8W2eA1bS2gzggyeLDGCM_Vb0c",
    authDomain: "ala3eb.firebaseapp.com",
    databaseURL: "https://ala3eb-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "ala3eb",
    storageBucket: "ala3eb.firebasestorage.app",
    messagingSenderId: "561106669781",
    appId: "1:561106669781:web:7f1d40c8587e123aa2d25c"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

console.log('🔥 Firebase Connected - Royal Casino');