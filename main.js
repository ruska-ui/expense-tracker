import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import { getDatabase, ref, push, onValue, update, remove } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

// Твой Firebase конфиг
const firebaseConfig = {
    apiKey: "AIzaSyCPOTWHxajU2QIdhBJInfktNCj3R-6QCPM",
    authDomain: "expense-tracker-a8ffc.firebaseapp.com",
    projectId: "expense-tracker-a8ffc",
    storageBucket: "expense-tracker-a8ffc.firebasestorage.app",
    messagingSenderId: "769644687908",
    appId: "1:769644687908:web:1b576e2521c57d77495eb1",
    databaseURL: "https://expense-tracker-a8ffc-default-rtdb.firebaseio.com"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Переменные приложения
let currentUser = null;
let records = [];
let isLoggedIn = false;

// DOM элементы
const appDiv = document.getElementById('app');

// Функция для отрисовки экрана входа
function renderAuthScreen() {
    appDiv.innerHTML = `
        <div class="auth-container">
            <h2 id="auth-title">Вход в систему</h2>
            <div id="auth-message"></div>
            <div class="form">
                <div class="form-group-full">
                    <label>Email *</label>
                    <input type="email" id="auth-email" placeholder="your@email.com" required>
                </div>
                <div class="form-group-full">
                    <label>Пароль * (минимум 6 символов)</label>
                    <input type="password" id="auth-password" placeholder="••••••" required>
                </div>
                <div class="form-group-full button-group">
                    <button class="btn btn-primary" id="login-btn" style="width: 48%;">Вход</button>
                    <button class="btn btn-secondary" id="signup-btn" style="width: 48%;">Регистрация</button>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('login-btn').addEventListener('click', handleLogin);
    document.getElementById('signup-btn').addEventListener('click', handleSignup);
}

// Обработчик входа
async function handleLogin() {
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    
    if (!email || !password) {
        showMessage('Заполните оба поля', 'error');
        return;
    }
    
    try {
        await signInWithEmailAndPassword(auth, email, password);
        showMessage('Успешный вход!', 'success');
    } catch (error) {
        console.error('Ошибка входа:', error);
        showMessage(`Ошибка: ${error.message}`, 'error');
    }
}

// Обработчик регистрации
async function handleSignup() {
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    
    if (!email || !password) {
        showMessage('Заполните оба поля', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage('Пароль должен быть минимум 6 символов', 'error');
        return;
    }
    
    try {
        await createUserWithEmailAndPassword(auth, email, password);
        showMessage('Аккаунт создан! Добро пожаловать!', 'success');
    } catch (error) {
        console.error('Ошибка регистрации:', error
