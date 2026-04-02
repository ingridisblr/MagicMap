// Variáveis globais para as coordenadas
let currentParkLat = 0;
let currentParkLng = 0;

// Função para iniciar o app (Botão Iniciar)
function Iniciar() {
    document.getElementById('splash-screen').classList.remove('active');
    document.getElementById('home-screen').classList.add('active');
}

// Retornar para a tela de abertura
function goSplash() {
    document.getElementById('home-screen').classList.remove('active');
    document.getElementById('splash-screen').classList.add('active');
}

// Abrir tela do parque selecionado
function openPark(name, imageSrc, lat, lng) {
    document.getElementById('home-screen').classList.remove('active');
    document.getElementById('park-screen').classList.add('active');

    document.getElementById('park-title').innerText = name;
    
    const imgElement = document.getElementById('park-image');
    imgElement.src = imageSrc;
    imgElement.onerror = function() {
        this.src = 'https://via.placeholder.com/400x250.png?text=Imagem+do+Parque';
    };

    currentParkLat = lat;
    currentParkLng = lng;
    document.getElementById('status-msg').innerText = "Pronto para traçar a rota!";
}

// Voltar para a lista de parques
function goHome() {
    document.getElementById('park-screen').classList.remove('active');
    document.getElementById('home-screen').classList.add('active');
}

// Lógica de Geolocalização e Google Maps
document.getElementById('route-btn').addEventListener('click', () => {
    const status = document.getElementById('status-msg');
    
    if (!navigator.geolocation) {
        status.innerText = "GPS não suportado.";
        window.open(`https://www.google.com/maps?q=${currentParkLat},${currentParkLng}`, '_blank');
        return;
    }

    status.innerText = "Buscando sua localização...";

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;
            status.innerText = "Abrindo o mapa...";
            
            const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${currentParkLat},${currentParkLng}&travelmode=driving`;
            window.open(googleMapsUrl, '_blank');
        },
        () => {
            status.innerText = "Erro no GPS. Abrindo apenas o destino...";
            window.open(`https://www.google.com/maps?q=${currentParkLat},${currentParkLng}`, '_blank');
        }
    );
});

// PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('SW ativo'))
            .catch(err => console.log('Erro no SW', err));
    });
}