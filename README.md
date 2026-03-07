# HukukAI Frontend

React + Vite — Türk hukuku yapay zeka asistanı.

## Kurulum
```bash
npm install
npm run dev
```

## Backend bağlantısı

`src/config.js` dosyasında API adresi tanımlı:
```javascript
const API_BASE = "http://127.0.0.1:8000"; // dev
// const API_BASE = "https://hukukai.onrender.com"; // prod
```

## Sayfalar

- `/asistan` — RAG destekli hukuk asistanı
- `/karar-arama` — Mevzuat ve içtihat arama
- `/editor` — Hukuki belge oluşturucu
- `/projeler` — Proje yönetimi
- `/sablonlar` — Belge şablonları
- `/takvim` — Duruşma takvimi