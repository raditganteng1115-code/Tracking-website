// Konfigurasi Firebase
// Ganti dengan konfigurasi project Firebase Anda
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Fungsi untuk menyimpan lokasi ke database
function saveLocationToDatabase(phoneNumber, userName, latitude, longitude, accuracy, address) {
    const timestamp = new Date().toISOString();
    const locationData = {
        phoneNumber: phoneNumber,
        userName: userName,
        latitude: latitude,
        longitude: longitude,
        accuracy: accuracy,
        address: address,
        timestamp: timestamp
    };

    // Simpan ke Firebase Realtime Database
    const trackingId = phoneNumber.replace(/\D/g, '');
    database.ref(`tracking/${trackingId}/locations`).push(locationData)
        .then(() => {
            console.log('Lokasi berhasil disimpan');
        })
        .catch((error) => {
            console.error('Error menyimpan lokasi:', error);
        });

    // Update lokasi terbaru
    database.ref(`tracking/${trackingId}/current`).set(locationData)
        .catch((error) => {
            console.error('Error update lokasi terbaru:', error);
        });
}

// Fungsi untuk mengambil riwayat lokasi
function getLocationHistory(phoneNumber, callback) {
    const trackingId = phoneNumber.replace(/\D/g, '');
    database.ref(`tracking/${trackingId}/locations`)
        .orderByChild('timestamp')
        .limitToLast(10)
        .on('value', (snapshot) => {
            const locations = [];
            snapshot.forEach((childSnapshot) => {
                locations.unshift(childSnapshot.val());
            });
            callback(locations);
        }, (error) => {
            console.error('Error mengambil riwayat:', error);
        });
}