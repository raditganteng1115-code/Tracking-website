# 📍 Location Tracker - GPS Real-time Tracking System

Aplikasi web untuk melacak lokasi real-time menggunakan GPS, Google Maps, dan Firebase Realtime Database.

## 🚀 Fitur Utama

- ✅ **Real-time GPS Tracking** - Pelacakan lokasi secara real-time
- 📍 **Google Maps Integration** - Tampilan peta interaktif
- 📊 **Location History** - Riwayat lokasi tersimpan
- 💾 **Firebase Database** - Penyimpanan data cloud
- 📱 **Responsive Design** - Kompatibel dengan semua perangkat
- 🔄 **Auto Update** - Update lokasi setiap 5 detik
- 🗺️ **Reverse Geocoding** - Konversi koordinat ke alamat

## 📋 Syarat Teknis

- Browser modern dengan dukungan Geolocation API
- Koneksi internet stabil
- Izin akses lokasi GPS

## ⚙️ Setup & Instalasi

### 1. Setup Firebase Project

1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Buat project baru
3. Aktifkan Realtime Database
4. Copy konfigurasi Firebase Anda
5. Edit `firebase-config.js` dan ganti dengan kredensial Anda:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

### 2. Setup Google Maps API

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Buat project baru
3. Aktifkan Maps JavaScript API dan Geocoding API
4. Buat API Key
5. Edit `index.html` ganti `YOUR_GOOGLE_MAPS_API_KEY`:

```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY"></script>
```

### 3. Jalankan Aplikasi

```bash
# Option 1: Gunakan Live Server (VSCode)
- Install extension "Live Server"
- Klik kanan pada index.html → "Open with Live Server"

# Option 2: Gunakan Python
python -m http.server 8000

# Option 3: Gunakan Node.js http-server
npx http-server
```

Buka browser: `http://localhost:8000`

## 📖 Cara Penggunaan

1. **Masukkan Nomor HP**
   - Format: +62812345678 atau 0812345678

2. **Masukkan Nama Pengguna**
   - Nama untuk identifikasi tracker

3. **Klik "Mulai Tracking"**
   - Izinkan akses GPS pada browser

4. **Lihat Hasil**
   - Lokasi real-time di peta
   - Koordinat dan akurasi
   - Alamat hasil reverse geocoding
   - Riwayat lokasi terakhir

5. **Hentikan Tracking**
   - Klik "Hentikan Tracking" kapan saja

## 📁 Struktur File

```
location-tracker/
├── index.html              # File HTML utama
├── firebase-config.js      # Konfigurasi Firebase
├── location-tracker.js     # Logic tracking utama
├── styles.css              # Styling & responsive design
├── README.md               # Dokumentasi
└── .gitignore             # Git ignore file
```

## 🔐 Firebase Rules (Security)

Setup security rules di Firebase Console:

```json
{
  "rules": {
    "tracking": {
      "$phoneNumber": {
        ".read": "auth != null",
        ".write": "auth != null",
        "locations": {
          ".indexOn": ["timestamp"]
        }
      }
    }
  }
}
```

## 🛡️ Catatan Keamanan & Privasi

⚠️ **PENTING:**
- Hanya gunakan untuk keperluan yang sah dan dengan persetujuan
- Jangan bagikan API key dan database credentials
- Pastikan patuhi regulasi privasi data lokal
- Gunakan HTTPS di production
- Implementasikan authentication yang kuat

## 📊 Data yang Disimpan

Setiap lokasi yang dicatat berisi:
- Nomor HP (identifier)
- Nama Pengguna
- Latitude & Longitude
- Akurasi (meter)
- Alamat (dari reverse geocoding)
- Timestamp

## 🐛 Troubleshooting

### GPS tidak bekerja
- Pastikan browser meminta izin lokasi
- Aktifkan lokasi di pengaturan perangkat
- Gunakan HTTPS (tidak bisa dengan HTTP di beberapa browser)
- Clear cache browser

### Google Maps tidak menampilkan
- Cek API key sudah benar
- Pastikan Maps JavaScript API aktif di Google Cloud
- Clear cache browser

### Firebase tidak menyimpan data
- Cek konfigurasi Firebase sudah benar
- Pastikan Realtime Database sudah dibuat
- Check Firebase security rules

## 📝 License

MIT License - Feel free to use this project for any purpose

## 👨‍💻 Author

Created by raditganteng1115-code

## 📧 Dukungan

Jika ada pertanyaan atau issue, silakan buat GitHub Issue atau hubungi melalui email.

---

**Made with ❤️ using Vanilla JavaScript, Google Maps, and Firebase**