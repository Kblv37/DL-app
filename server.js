const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

// Указываем папку, в которой будут находиться статические файлы (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Обрабатываем запрос на корневой маршрут и отправляем файл index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
