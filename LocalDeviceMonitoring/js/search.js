// class DeviceSearch {
//     constructor() {
//         this.form = document.getElementById('searchForm');
//         this.resultsBody = document.getElementById('searchResultsBody');
//         this.initializeEvents();
//         this.initializeTooltips();
//     }

//     initializeEvents() {
//         this.form.addEventListener('submit', (e) => {
//             e.preventDefault();
//             this.performSearch();
//         });

//         this.form.addEventListener('reset', () => {
//             this.clearResults();
//         });
//     }

//     initializeTooltips() {
//         const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
//         tooltips.forEach(tooltip => {
//             new bootstrap.Tooltip(tooltip, {
//                 trigger: 'hover',
//                 placement: 'auto',
//                 delay: { show: 100, hide: 100 }
//             });
//         });
//     }

//     async performSearch() {
//         const name = document.getElementById('deviceName').value.toLowerCase();
//         const ip = document.getElementById('ipAddress').value;
//         const mac = document.getElementById('macAddress').value.toLowerCase();

//         try {
//             // Bu yerda backend API ga so'rov yuborish kerak
//             // Hozircha test ma'lumotlardan foydalanamiz
//             const results = this.searchDevices(name, ip, mac);
//             this.displayResults(results);
//         } catch (error) {
//             console.error('Qidiruv xatosi:', error);
//             this.showError('Qidiruv jarayonida xatolik yuz berdi');
//         }
//     }

//     searchDevices(name, ip, mac) {
//         // Test ma'lumotlar (aslida backend dan kelishi kerak)
//         const devices = [
//             {
//                 id: 1,
//                 name: "Asosiy Router",
//                 type: "Router",
//                 ipAddress: "192.168.1.1",
//                 macAddress: "00:11:22:33:44:55",
//                 status: "online",
//                 location: "Bosh Bino",
//                 floor: 1,
//                 room: "103"
//             },
//             {
//                 id: 2,
//                 name: "Printer HP LaserJet",
//                 type: "Printer",
//                 ipAddress: "192.168.1.100",
//                 macAddress: "AA:BB:CC:DD:EE:FF",
//                 status: "offline",
//                 location: "Marketing Bo'limi",
//                 floor: 2,
//                 room: "215"
//             }
//         ];

//         return devices.filter(device => {
//             const matchName = !name || device.name.toLowerCase().includes(name);
//             const matchIP = !ip || device.ipAddress.includes(ip);
//             const matchMAC = !mac || device.macAddress.toLowerCase().includes(mac);
//             return matchName && matchIP && matchMAC;
//         });
//     }

//     displayResults(devices) {
//         this.clearResults();

//         if (devices.length === 0) {
//             this.showNoResults();
//             return;
//         }

//         devices.forEach(device => {
//             const row = document.createElement('tr');
//             const statusClass = this.getStatusClass(device.status);
            
//             row.innerHTML = `
//                 <td>
//                     <div class="d-flex align-items-center">
//                         <i class="bi bi-router me-2"></i>
//                         <div>
//                             <div class="fw-bold">${device.name}</div>
//                             <small class="text-muted">${device.type}</small>
//                         </div>
//                     </div>
//                 </td>
//                 <td>${device.ipAddress}</td>
//                 <td><small>${device.macAddress}</small></td>
//                 <td>
//                     <div class="location-info">
//                         <i class="bi bi-geo-alt text-primary"></i>
//                         <span>${device.location}</span>
//                         <small>${device.floor}-qavat, ${device.room}-xona</small>
//                     </div>
//                 </td>
//                 <td>
//                     <span class="badge ${statusClass}">
//                         ${this.getStatusIcon(device.status)} ${device.status}
//                     </span>
//                 </td>
//                 <td>
//                     <div class="btn-group btn-group-sm">
//                         <button class="btn btn-outline-primary" 
//                                 onclick="deviceSearch.pingDevice(${device.id})"
//                                 data-bs-toggle="tooltip"
//                                 title="Qurilma bilan aloqani tekshirish">
//                             <i class="bi bi-arrow-repeat"></i>
//                         </button>
//                         <button class="btn btn-outline-secondary"
//                                 onclick="deviceSearch.showDetails(${device.id})"
//                                 data-bs-toggle="tooltip"
//                                 title="Qurilma haqida to'liq ma'lumot">
//                             <i class="bi bi-info-circle"></i>
//                         </button>
//                     </div>
//                 </td>
//             `;

//             this.resultsBody.appendChild(row);
//         });

//         this.initializeTooltips();
//     }

//     clearResults() {
//         this.resultsBody.innerHTML = '';
//     }

//     showNoResults() {
//         this.resultsBody.innerHTML = `
//             <tr>
//                 <td colspan="6" class="text-center py-4">
//                     <i class="bi bi-search text-muted fs-2"></i>
//                     <p class="text-muted mb-0">Qidiruv bo'yicha hech narsa topilmadi</p>
//                 </td>
//             </tr>
//         `;
//     }

//     showError(message) {
//         this.resultsBody.innerHTML = `
//             <tr>
//                 <td colspan="6" class="text-center py-4">
//                     <i class="bi bi-exclamation-circle text-danger fs-2"></i>
//                     <p class="text-danger mb-0">${message}</p>
//                 </td>
//             </tr>
//         `;
//     }

//     getStatusClass(status) {
//         const classes = {
//             'online': 'bg-success',
//             'offline': 'bg-danger',
//             'warning': 'bg-warning text-dark'
//         };
//         return classes[status] || 'bg-secondary';
//     }

//     getStatusIcon(status) {
//         const icons = {
//             'online': '<i class="bi bi-check-circle-fill"></i>',
//             'offline': '<i class="bi bi-x-circle-fill"></i>',
//             'warning': '<i class="bi bi-exclamation-circle-fill"></i>'
//         };
//         return icons[status] || '<i class="bi bi-question-circle-fill"></i>';
//     }

//     pingDevice(deviceId) {
//         console.log(`${deviceId}-qurilma ping qilinmoqda...`);
//     }

//     showDetails(deviceId) {
//         console.log(`${deviceId}-qurilma tafsilotlari...`);
//     }
// }

// // Qidiruv tizimini ishga tushirish
// const deviceSearch = new DeviceSearch();