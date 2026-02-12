// Variabel global
let map;
let currentMarker;
let isTracking = false;
let watchId;
let currentPhoneNumber;
let currentUserName;
const updateInterval = 5000; // Update setiap 5 detik

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    initializeMap();
    attachEventListeners();
    checkGPSSupport();
});

// Inisialisasi Google Map
function initializeMap() {
    const mapElement = document.getElementById('map');
    const defaultLocation = { lat: -6.2088, lng: 106.8456 }; // Jakarta

    map = new google.maps.Map(mapElement, {
        zoom: 15,
        center: defaultLocation,
        mapTypeControl: true,
        fullscreenControl: true,
        zoomControl: true,
        streetViewControl: true
    });
}

// Attach event listeners ke tombol
function attachEventListeners() {
    document.getElementById('startTracking').addEventListener('click', startTracking);
    document.getElementById('stopTracking').addEventListener('click', stopTracking);
}

// Cek dukungan GPS
function checkGPSSupport() {
    if (!navigator.geolocation) {
        alert('Browser Anda tidak mendukung Geolocation API');
    }
}

// Mulai tracking lokasi
function startTracking() {
    const phoneNumber = document.getElementById('phoneNumber').value.trim();
    const userName = document.getElementById('userName').value.trim();

    if (!phoneNumber || !userName) {
        alert('Silakan isi nomor HP dan nama pengguna');
        return;
    }

    if (!isValidPhoneNumber(phoneNumber)) {
        alert('Format nomor HP tidak valid. Gunakan format: +62812345678 atau 0812345678');
        return;
    }

    currentPhoneNumber = phoneNumber;
    currentUserName = userName;
    isTracking = true;

    // Update UI
    document.getElementById('startTracking').disabled = true;
    document.getElementById('stopTracking').disabled = false;
    document.getElementById('status').textContent = '✅ Aktif - Tracking Berjalan';
    document.getElementById('status').style.color = '#4CAF50';

    // Mulai watch position
    watchId = navigator.geolocation.watchPosition(
        (position) => onLocationSuccess(position, phoneNumber, userName),
        (error) => onLocationError(error),
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        }
    );

    console.log('Tracking dimulai untuk:', phoneNumber);
}

// Handler ketika lokasi berhasil diambil
function onLocationSuccess(position, phoneNumber, userName) {
    const { latitude, longitude, accuracy } = position.coords;

    // Update UI dengan koordinat
    document.getElementById('latitude').textContent = latitude.toFixed(6);
    document.getElementById('longitude').textContent = longitude.toFixed(6);
    document.getElementById('accuracy').textContent = accuracy.toFixed(2);

    // Update peta
    updateMap(latitude, longitude);

    // Dapatkan alamat dari koordinat
    getAddressFromCoordinates(latitude, longitude, (address) => {
        document.getElementById('address').textContent = address;

        // Simpan ke database
        saveLocationToDatabase(phoneNumber, userName, latitude, longitude, accuracy, address);
    });

    // Tampilkan riwayat lokasi
    getLocationHistory(phoneNumber, displayLocationHistory);
}

// Handler ketika lokasi gagal diambil
function onLocationError(error) {
    console.error('Error GPS:', error);
    document.getElementById('status').textContent = '❌ Error GPS';
    document.getElementById('status').style.color = '#f44336';

    let errorMessage = '';
    switch(error.code) {
        case error.PERMISSION_DENIED:
            errorMessage = 'Izin lokasi ditolak. Silakan aktifkan lokasi di pengaturan browser.';
            break;
        case error.POSITION_UNAVAILABLE:
            errorMessage = 'Informasi lokasi tidak tersedia';
            break;
        case error.TIMEOUT:
            errorMessage = 'Request lokasi timeout';
            break;
        default:
            errorMessage = 'Error tidak diketahui';
    }
    
    alert(errorMessage);
}

// Update peta dengan lokasi baru
function updateMap(latitude, longitude) {
    const location = { lat: latitude, lng: longitude };
    
    // Center map
    map.setCenter(location);
    
    // Hapus marker lama
    if (currentMarker) {
        currentMarker.setMap(null);
    }
    
    // Tambah marker baru
    currentMarker = new google.maps.Marker({
        position: location,
        map: map,
        title: 'Lokasi Saat Ini',
        icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
        animation: google.maps.Animation.DROP
    });
}

// Dapatkan alamat dari koordinat menggunakan Reverse Geocoding
function getAddressFromCoordinates(lat, lng, callback) {
    const geocoder = new google.maps.Geocoder();
    const location = { lat: lat, lng: lng };

    geocoder.geocode({ location: location }, (results, status) => {
        if (status === 'OK' && results[0]) {
            callback(results[0].formatted_address);
        } else {
            callback('Alamat tidak ditemukan');
        }
    });
}

// Tampilkan riwayat lokasi
function displayLocationHistory(locations) {
    const historyList = document.getElementById('historyList');
    
    if (locations.length === 0) {
        historyList.innerHTML = '<p class="empty-message">Tidak ada riwayat</p>';
        return;
    }

    historyList.innerHTML = '';
    locations.forEach((location, index) => {
        const time = new Date(location.timestamp).toLocaleTimeString('id-ID');
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div class="history-time">${time}</div>
            <div class="history-coords">
                ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}
            </div>
            <div class="history-accuracy">
                Akurasi: ${location.accuracy.toFixed(0)}m
            </div>
        `;
        historyList.appendChild(historyItem);
    });
}

// Hentikan tracking
function stopTracking() {
    if (watchId) {
        navigator.geolocation.clearWatch(watchId);
    }
    
    isTracking = false;
    
    // Update UI
    document.getElementById('startTracking').disabled = false;
    document.getElementById('stopTracking').disabled = true;
    document.getElementById('status').textContent = '⏹ Tidak Aktif';
    document.getElementById('status').style.color = '#ff9800';
    
    console.log('Tracking dihentikan');
}

// Validasi nomor HP
function isValidPhoneNumber(phoneNumber) {
    // Format: +62812345678 atau 0812345678 atau 62812345678
    const phoneRegex = /^(\+62|62|0)8\d{8,11}$/;
    return phoneRegex.test(phoneNumber.replace(/\s/g, ''));
}