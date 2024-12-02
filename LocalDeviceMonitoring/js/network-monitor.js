class NetworkMonitor {
    constructor() {
        this.updateInterval = 300000; // 5 daqiqa (millisekundlarda)
        this.deviceTable = document.getElementById('devices-table');
        this.init();
    }

    init() {
        this.startSpeedMonitoring();
        this.initializeEventListeners();
    }

    startSpeedMonitoring() {
        this.updateSpeeds();
        setInterval(() => this.updateSpeeds(), this.updateInterval);
    }

    async updateSpeeds() {
        try {
            const response = await fetch('api/update-speed.php');
            const data = await response.json();
            
            if (data.success) {
                this.updateSpeedDisplay(data.data);
                this.checkSpeedWarnings(data.data);
            } else {
                throw new Error(data.error || 'Tezlikni yangilashda xatolik');
            }
        } catch (error) {
            console.error('Xatolik:', error);
            this.showToast('Tezlikni yangilashda xatolik yuz berdi', 'danger');
        }
    }

    updateSpeedDisplay(devices) {
        devices.forEach(device => {
            const row = this.deviceTable.querySelector(`tr[data-device-id="${device.id}"]`);
            if (row) {
                const speedCell = row.querySelector('.speed-cell');
                if (speedCell) {
                    speedCell.innerHTML = this.generateSpeedHTML(device.speeds);
                }
            }
        });
    }

    generateSpeedHTML(speeds) {
        return `
            <div class="speed-info">
                <div class="download-speed">
                    <i class="bi bi-download"></i>
                    <div class="progress" style="width: 100px;">
                        <div class="progress-bar bg-success" 
                             style="width: ${Math.min(speeds.download * 10, 100)}%">
                        </div>
                    </div>
                    <span>${speeds.download} Mb/s</span>
                </div>
                <div class="upload-speed">
                    <i class="bi bi-upload"></i>
                    <div class="progress" style="width: 100px;">
                        <div class="progress-bar bg-info" 
                             style="width: ${Math.min(speeds.upload * 10, 100)}%">
                        </div>
                    </div>
                    <span>${speeds.upload} Mb/s</span>
                </div>
                <div class="ping">
                    <small>Ping: ${speeds.ping} ms</small>
                </div>
            </div>
        `;
    }

    checkSpeedWarnings(devices) {
        devices.forEach(device => {
            const speeds = device.speeds;
            if (speeds.download < 1.0 || speeds.upload < 1.0) {
                this.showToast(
                    `Qurilma ${device.id}: Past tezlik aniqlandi`,
                    'warning'
                );
            }
        });
    }

    showToast(message, type = 'info') {
        const toastContainer = document.querySelector('.toast-container');
        const toast = document.createElement('div');
        toast.className = `toast align-items-center text-white bg-${type}`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');

        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" 
                        data-bs-dismiss="toast">
                </button>
            </div>
        `;

        toastContainer.appendChild(toast);
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();

        toast.addEventListener('hidden.bs.toast', () => {
            toast.remove();
        });
    }

    initializeEventListeners() {
        // Yangilash tugmasiga click event qo'shish
        const refreshBtn = document.querySelector('#refresh-speeds');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.updateSpeeds());
        }
    }
}

// Sahifa yuklanganda NetworkMonitor ni ishga tushirish
document.addEventListener('DOMContentLoaded', () => {
    window.networkMonitor = new NetworkMonitor();
});