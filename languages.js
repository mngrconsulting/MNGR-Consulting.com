// translations.js (Создай этот файл и добавь в проект)
const translations = {
    "AZ": {
        "welcome": "Xoş gəlmisiniz!",
        "about": "Haqqımızda",
        "contact": "Bizimlə əlaqə",
        "services": "Xidmətlər"
    },
    "EN": {
        "welcome": "Welcome!",
        "about": "About Us",
        "contact": "Contact Us",
        "services": "Services"
    },
    "RU": {
        "welcome": "Добро пожаловать!",
        "about": "О нас",
        "contact": "Свяжитесь с нами",
        "services": "Услуги"
    }
};

// Функция для переключения языка и сохранения выбора
function changeLanguage(lang) {
    localStorage.setItem("selectedLanguage", lang);
    applyLanguage(lang);
}

// Функция для применения перевода на страницу
function applyLanguage(lang) {
    document.querySelectorAll("[data-translate]").forEach(element => {
        const key = element.getAttribute("data-translate");
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
}

// Проверяем сохраненный язык и применяем его
document.addEventListener("DOMContentLoaded", () => {
    const savedLang = localStorage.getItem("selectedLanguage") || "AZ";
    applyLanguage(savedLang);
});