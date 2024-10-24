// Получаем элементы
const receiveBtn = document.getElementById('receiveBtn');
const sendBtn = document.getElementById('sendBtn');
const qrcodeDiv = document.getElementById('qrcode');
const fileInput = document.getElementById('fileInput');
const video = document.getElementById('video');

// Обработчик нажатия на "Получить"
receiveBtn.addEventListener('click', () => {
  // Генерируем уникальную строку для QR-кода
  const transferCode = generateTransferCode();
  const qr = new QRCode(qrcodeDiv, {
    text: transferCode,
    width: 256,
    height: 256
  });

  // Ожидаем файл с другого устройства
  const webSocket = new WebSocket(`wss://your-server.com/transfer?code=${transferCode}`);
  
  webSocket.onmessage = function (event) {
    const fileBlob = new Blob([event.data], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(fileBlob);
    link.download = 'transferred-file';
    link.click();
  };
});

// Обработчик нажатия на "Отправить"
sendBtn.addEventListener('click', () => {
  fileInput.click();
});

fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    startScanning(file);
  }
});

// Функция для начала сканирования QR-кода
function startScanning(file) {
  const scanner = new QrScanner(video, result => {
    const transferCode = result;
    QrScanner.stop();
    sendFile(transferCode, file);
  });

  video.style.display = 'block';
  scanner.start();
}

// Отправка файла на сервер через WebSocket
function sendFile(transferCode, file) {
  const webSocket = new WebSocket(`wss://your-server.com/transfer?code=${transferCode}`);
  
  webSocket.onopen = function () {
    webSocket.send(file);
  };
}

// Генерация уникального кода для передачи
function generateTransferCode() {
  return 'transfer-' + Math.random().toString(36).substring(7);
}
