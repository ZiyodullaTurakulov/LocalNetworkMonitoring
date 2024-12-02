// class NetworkMonitor {
//     constructor() {
//         this.updateInterval = 10000; // har 10 sekundda yangilanadi
//         this.deviceTable = document.getElementById('network-devices');
//         this.statsCounters = {
//             total: document.getElementById('total-devices'),
//             online: document.getElementById('online-devices'),
//             offline: document.getElementById('offline-devices'),
//             warning: document.getElementById('warning-devices')
//         };
//         this.init();
//     }

//     init() {
//         this.updateData();
//         setInterval(() => this.updateData(), this.updateInterval);
//         this.initializeEventListeners();
//     }

//     async updateData() {
//         try {
//             const response = await fetch('api/devices.php?action=status');
//             const data = await response.json();
            
//             this.updateStats(data.stats);
//             this.updateDevicesTable(data.devices);
//         } catch (error) {
//             console.error('Ma\'lumotlarni yangilashda xatolik:', error);
//         }
//     }

//     updateStats(stats) {
//         for (let key in this.statsCounters) {
//             if (stats.hasOwnProperty(key)) {
//                 this.statsCounters[key].textContent = stats[key];
//                 // Animatsiya effekti
//                 this.statsCounters[key].classList.add('updated');
//                 setTimeout(() => {
//                     this.statsCounters[key].classList.remove('updated');
//                 }, 1000);
//             }
//         }
//     }

//     updateDevicesTable(devices) {
//         const tbody = this.deviceTable.querySelector('tbody');
//         tbody.innerHTML = '';

//         devices.forEach(device => {
//             const row = this.createDeviceRow(device);
//             tbody.appendChild(row);
//         });
//     }

//     createDeviceRow(device) {
//         const row = document.createElement('tr');
//         const statusClass = this.getStatusClass(device.status);
//         const statusIcon = this.getStatusIcon(device.status);
        
//         row.innerHTML = `
//             <td>
//                 <div class="d-flex align-items-center">
//                     <i class="bi bi-router me-2"></i>
//                     <div>
//                         <div class="fw-bold">${device.name}</div>
//                         <small class="text-muted">${device.type}</small>
//                     </div>
//                 </div>
//             </td>
//             <td>${device.ip_address}</td>
//             <td><small>${device.mac_address}</small></td>
//             <td>
//                 <div class="location-info">
//                     <i class="bi bi-geo-alt text-primary"></i>
//                     <span>${device.location}</span>
//                     <small>${device.floor}-qavat</small>
//                     <small>${device.room}-xona</small>
//                 </div>
//             </td>
//             <td>
//                 <span class="badge ${statusClass}">
//                     <i class="bi ${statusIcon}"></i> ${device.status}
//                 </span>
//             </td>
//             <td>
//                 <div class="d-flex align-items-center">
//                     <div class="progress flex-grow-1" style="height: 6px;">
//                         <div class="progress-bar" style="width: ${device.speed / 10}%"></div>
//                     </div>
//                     <span class="ms-2">${device.speed} Mb/s</span>
//                 </div>
//             </td>
//             <td><small>${this.formatDate(device.last_active)}</small></td>
//             <td>
//                 <div class="btn-group btn-group-sm">
//                     <button class="btn btn-outline-primary" 
//                             onclick="networkMonitor.pingDevice(${device.id})"
//                             data-bs-toggle="tooltip" 
//                             title="Qurilma bilan aloqani tekshirish">
//                         <i class="bi bi-arrow-repeat"></i>
//                     </button>
//                     <a href="device-details.php?id=${device.id}" 
//                        class="btn btn-outline-secondary"
//                        data-bs-toggle="tooltip" 
//                        title="Qurilma haqida to'liq ma'lumot">
//                         <i class="bi bi-info-circle"></i>
//                     </a>
//                     <button class="btn btn-outline-success" 
//                             onclick="networkMonitor.showLocation(${device.id})"
//                             data-bs-toggle="tooltip" 
//                             title="Qurilmaning joylashuvini xaritada ko'rish">
//                         <i class="bi bi-geo-alt"></i>
//                     </button>
//                 </div>
//             </td>
//         `;
//         return row;
//     }

//     async pingDevice(deviceId) {
//         try {
//             const button = this.deviceTable.querySelector(`button[onclick*="${deviceId}"]`);
//             button.disabled = true;
//             button.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';

//             const response = await fetch(`api/ping.php?id=${deviceId}`);
//             const data = await response.json();

//             if (data.success) {
//                 this.showToast('success', 'Qurilma bilan aloqa o\'rnatildi');
//                 this.updateData(); // Ma'lumotlarni yangilash
//             } else {
//                 this.showToast('danger', 'Qurilma bilan aloqa yo\'q');
//             }
//         } catch (error) {
//             this.showToast('danger', 'Xatolik yuz berdi');
//         } finally {
//             const button = this.deviceTable.querySelector(`button[onclick*="${deviceId}"]`);
//             button.disabled = false;
//             button.innerHTML = '<i class="bi bi-arrow-repeat"></i>';
//         }
//     }

//     showLocation(deviceId) {
//         // Xarita funksiyasi
//     }

//     getStatusClass(status) {
//         const classes = {
//             'online': 'bg-success',
//             'offline': 'bg-danger',
//             'warning': 'bg-warning'
//         };
//         return classes[status] || 'bg-secondary';
//     }

//     getStatusIcon(status) {
//         const icons = {
//             'online': 'bi-check-circle',
//             'offline': 'bi-x-circle',
//             'warning': 'bi-exclamation-triangle'
//         };
//         return icons[status] || 'bi-question-circle';
//     }

//     formatDate(dateString) {
//         const date = new Date(dateString);
//         return date.toLocaleString('uz-UZ', {
//             day: '2-digit',
//             month: '2-digit',
//             year: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit'
//         });
//     }

//     showToast(type, message) {
//         const toast = document.createElement('div');
//         toast.className = `toast align-items-center text-white bg-${type} border-0`;
//         toast.setAttribute('role', 'alert');
//         toast.setAttribute('aria-live', 'assertive');
//         toast.setAttribute('aria-atomic', 'true');
        
//         toast.innerHTML = `
//             <div class="d-flex">
//                 <div class="toast-body">${message}</div>
//                 <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
//             </div>
//         `;
        
//         document.querySelector('.toast-container').appendChild(toast);
//         const bsToast = new bootstrap.Toast(toast);
//         bsToast.show();
        
//         toast.addEventListener('hidden.bs.toast', () => toast.remove());
//     }

//     initializeEventListeners() {
//         // Tooltip va boshqa Bootstrap komponentlarini ishga tushirish
//         const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
//         tooltips.forEach(tooltip => new bootstrap.Tooltip(tooltip));
//     }
// }

// // Sahifa yuklanganda ishga tushirish
// document.addEventListener('DOMContentLoaded', () => {
//     window.networkMonitor = new NetworkMonitor();
// });

class NetworkMonitor {
    constructor() {
        this.updateInterval = 10000; // har 10 sekundda yangilanadi
        this.deviceTable = document.getElementById('devices-table');
        this.statsCounters = {
            total: document.getElementById('total-devices'),
            online: document.getElementById('online-devices'),
            offline: document.getElementById('offline-devices'),
            warning: document.getElementById('warning-devices')
        };
        this.init();
    }

    init() {
        this.updateData();
        setInterval(() => this.updateData(), this.updateInterval);
        this.initializeEventListeners();
    }

    async updateData() {
        try {
            const response = await fetch('api/devices.php?action=status');
            const data = await response.json();
            
            if (data.success) {
                this.updateStats(data.stats);
                this.updateDevicesTable(data.devices);
            }
        } catch (error) {
            console.error('Ma\'lumotlarni yangilashda xatolik:', error);
        }
    }

    updateStats(stats) {
        for (let key in this.statsCounters) {
            if (this.statsCounters[key]) {
                const newValue = stats[key];
                const element = this.statsCounters[key];
                
                if (element.textContent !== newValue.toString()) {
                    element.textContent = newValue;
                    element.classList.add('updated');
                    setTimeout(() => element.classList.remove('updated'), 1000);
                }
            }
        }
    }

    updateDevicesTable(devices) {
        const tbody = this.deviceTable.querySelector('tbody');
        const rows = tbody.getElementsByTagName('tr');
        
        devices.forEach((device, index) => {
            let row = rows[index];
            
            if (!row) {
                row = this.createDeviceRow(device);
                tbody.appendChild(row);
            } else {
                this.updateDeviceRow(row, device);
            }
        });
        
        // Ortiqcha qatorlarni o'chirish
        while (rows.length > devices.length) {
            tbody.removeChild(rows[rows.length - 1]);
        }
    }

    createDeviceRow(device) {
        const row = document.createElement('tr');
        row.dataset.id = device.id;
        row.innerHTML = this.getDeviceRowHTML(device);
        return row;
    }

    updateDeviceRow(row, device) {
        const currentStatus = row.querySelector('.badge').textContent.trim();
        
        if (currentStatus !== device.status) {
            row.classList.add('updated');
            setTimeout(() => row.classList.remove('updated'), 1000);
        }
        
        row.innerHTML = this.getDeviceRowHTML(device);
    }

    getDeviceRowHTML(device) {
        const statusClass = this.getStatusClass(device.status);
        const lastActive = new Date(device.last_active).toLocaleString('uz-UZ');
        
        return `
            <td>
                <div class="d-flex align-items-center">
                    <i class="bi bi-router me-2"></i>
                    <div>
                        <div class="fw-bold">${device.name}</div>
                        <small class="text-muted">${device.type}</small>
                    </div>
                </div>
            </td>
            <td>${device.ip_address}</td>
            <td><small>${device.mac_address}</small></td>
            <td>
                <div class="location-info">
                    <i class="bi bi-geo-alt text-primary"></i>
                    <span>${device.location}</span>
                    <small>${device.floor}-qavat</small>
                    <small>${device.room}-xona</small>
                </div>
            </td>
            <td>
                <span class="badge ${statusClass}">
                    <i class="bi ${this.getStatusIcon(device.status)}"></i>
                    ${device.status}
                </span>
            </td>
            <td>
                <div class="d-flex align-items-center">
                    <div class="progress flex-grow-1" style="width: 100px;">
                        <div class="progress-bar" style="width: ${(device.speed / 10)}%"></div>
                    </div>
                    <span class="ms-2">${device.speed} Mb/s</span>
                </div>
            </td>
            <td><small>${lastActive}</small></td>
            <td>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" onclick="pingDevice(${device.id})" title="Qurilma bilan aloqani tekshirish">
                        <i class="bi bi-arrow-repeat"></i>
                    </button>
                    <a href="device-details.php?id=${device.id}" class="btn btn-outline-secondary" title="Qurilma haqida to'liq ma'lumot">
                        <i class="bi bi-info-circle"></i>
                    </a>
                </div>
            </td>
        `;
    }

    getStatusClass(status) {
        switch(status) {
            case 'online': return 'bg-success';
            case 'offline': return 'bg-danger';
            case 'warning': return 'bg-warning';
            default: return 'bg-secondary';
        }
    }

    getStatusIcon(status) {
        switch(status) {
            case 'online': return 'bi-check-circle';
            case 'offline': return 'bi-x-circle';
            case 'warning': return 'bi-exclamation-triangle';
            default: return 'bi-question-circle';
        }
    }

    initializeEventListeners() {
        // Tooltip va boshqa Bootstrap komponentlarini ishga tushirish
        const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltips.forEach(tooltip => new bootstrap.Tooltip(tooltip));
    }
}

// Sahifa yuklanganda ishga tushirish
document.addEventListener('DOMContentLoaded', () => {
    window.networkMonitor = new NetworkMonitor();
});

// Qurilmani ping qilish
async function pingDevice(deviceId) {
    const button = document.querySelector(`button[onclick="pingDevice(${deviceId})"]`);
    const originalContent = button.innerHTML;
    
    button.disabled = true;
    button.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';
    
    try {
        const response = await fetch(`api/ping.php?id=${deviceId}`);
        const data = await response.json();
        
        if (data.success) {
            showToast(data.status === 'online' ? 'success' : 'danger', data.message);
            // Ma'lumotlarni yangilash
            window.networkMonitor.updateData();
        } else {
            showToast('danger', data.message);
        }
    } catch (error) {
        showToast('danger', 'Xatolik yuz berdi');
    } finally {
        button.disabled = false;
        button.innerHTML = originalContent;
    }
}

// Toast xabarlarini ko'rsatish
function showToast(type, message) {
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    document.querySelector('.toast-container').appendChild(toast);
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    toast.addEventListener('hidden.bs.toast', () => toast.remove());
}


// Ogohlantirishlarni yangilash
async function refreshWarnings() {
    try {
        const response = await fetch('api/warnings.php?action=list');
        const data = await response.json();
        
        if (data.success) {
            const warningsList = document.getElementById('warningsList');
            
            if (data.warnings.length === 0) {
                warningsList.innerHTML = `
                    <div class="list-group-item text-center text-muted py-4">
                        <i class="bi bi-check-circle display-4"></i>
                        <p class="mb-0 mt-2">Hozircha ogohlantirishlar yo'q</p>
                    </div>
                `;
                return;
            }
            
            warningsList.innerHTML = data.warnings.map(warning => `
                <div class="list-group-item list-group-item-warning ${warning.is_read ? 'bg-light' : ''}" 
                     data-warning-id="${warning.id}">
                    <div class="d-flex justify-content-between align-items-center">
                        <h6 class="mb-1">
                            <a href="device-details.php?id=${warning.device_id}" class="text-dark">
                                ${warning.device_name}
                            </a>
                            <small class="text-muted">(${warning.device_type})</small>
                        </h6>
                        <small class="text-muted">${warning.created_at}</small>
                    </div>
                    <p class="mb-1">${warning.reason}</p>
                    <small class="text-muted">
                        <i class="bi bi-geo-alt"></i>
                        ${warning.location}, ${warning.floor}-qavat, ${warning.room}-xona
                    </small>
                    <div class="mt-2">
                        <button class="btn btn-sm btn-success" onclick="resolveWarning(${warning.id})">
                            <i class="bi bi-check-circle"></i> Hal qilindi
                        </button>
                        ${!warning.is_read ? `
                            <button class="btn btn-sm btn-outline-secondary" onclick="markAsRead(${warning.id})">
                                <i class="bi bi-check"></i> O'qildi
                            </button>
                        ` : ''}
                    </div>
                </div>
            `).join('');
            
            // O'qilmagan ogohlantirishlar sonini yangilash
            updateUnreadCount(data.unread_count);
        } else {
            showToast('danger', data.message || 'Ogohlantirishlarni yuklashda xatolik');
        }
    } catch (error) {
        showToast('danger', 'Serverga ulanishda xatolik');
    }
}

// Ogohlantirishni hal qilindi deb belgilash
async function resolveWarning(warningId) {
    try {
        const response = await fetch('api/warnings.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'resolve',
                warning_id: warningId
            })
        });

        const data = await response.json();
        
        if (data.success) {
            showToast('success', 'Ogohlantirish hal qilindi');
            refreshWarnings();
            updateStats();
        } else {
            showToast('danger', data.message || 'Xatolik yuz berdi');
        }
    } catch (error) {
        showToast('danger', 'Serverga ulanishda xatolik');
    }
}

// Ogohlantirishni o'qilgan deb belgilash
async function markAsRead(warningId) {
    try {
        const response = await fetch('api/warnings.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'mark_read',
                warning_id: warningId
            })
        });

        const data = await response.json();
        
        if (data.success) {
            showToast('success', 'Ogohlantirish o\'qilgan deb belgilandi');
            refreshWarnings();
        } else {
            showToast('danger', data.message || 'Xatolik yuz berdi');
        }
    } catch (error) {
        showToast('danger', 'Serverga ulanishda xatolik');
    }
}

// Barcha ogohlantirishlarni o'qilgan deb belgilash
async function markAllAsRead() {
    if (!confirm('Barcha ogohlantirishlarni o\'qilgan deb belgilamoqchimisiz?')) return;
    
    try {
        const response = await fetch('api/warnings.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'mark_all_read'
            })
        });

        const data = await response.json();
        
        if (data.success) {
            showToast('success', 'Barcha ogohlantirishlar o\'qilgan deb belgilandi');
            refreshWarnings();
        } else {
            showToast('danger', data.message || 'Xatolik yuz berdi');
        }
    } catch (error) {
        showToast('danger', 'Serverga ulanishda xatolik');
    }
}

// O'qilmagan ogohlantirishlar sonini yangilash
function updateUnreadCount(count) {
    const badge = document.querySelector('.card-header .badge');
    if (count > 0) {
        if (badge) {
            badge.textContent = count;
        } else {
            const title = document.querySelector('.card-header h5');
            const newBadge = document.createElement('span');
            newBadge.className = 'badge bg-danger ms-2';
            newBadge.textContent = count;
            title.appendChild(newBadge);
        }
    } else if (badge) {
        badge.remove();
    }
}

// Sahifa yuklanganda
document.addEventListener('DOMContentLoaded', function() {
    // Ogohlantirishlarni yuklash
    refreshWarnings();
    
    // Har 30 sekundda yangilab turish
    setInterval(refreshWarnings, 30000);
});