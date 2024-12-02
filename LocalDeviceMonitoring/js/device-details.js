// // // URL dan qurilma ID sini olish
// // const urlParams = new URLSearchParams(window.location.search);
// // const deviceId = urlParams.get('id');

// // // Ma'lumotlarni saqlash uchun global o'zgaruvchilar
// // let deviceData = null;
// // let portStatsChart = null;
// // let portSpeedChart = null;

// // // Sahifa yuklanganda
// // document.addEventListener('DOMContentLoaded', () => {
// //     loadDeviceData();
// //     // Har 30 sekundda yangilab turish
// //     setInterval(loadDeviceData, 30000);
// // });

// // // Qurilma ma'lumotlarini yuklash
// // async function loadDeviceData() {
// //     try {
// //         // Backend API dan ma'lumotlarni olish
// //         const response = await fetch(`/api/devices/${deviceId}`);
// //         deviceData = await response.json();
        
// //         updateDeviceInfo();
// //         updatePortsTable();
// //         updatePortsChart();
// //     } catch (error) {
// //         showError("Ma'lumotlarni yuklashda xatolik yuz berdi");
// //     }
// // }

// // // Qurilma umumiy ma'lumotlarini yangilash
// // function updateDeviceInfo() {
// //     document.getElementById('device-name').textContent = deviceData.name;
// //     document.getElementById('device-type').textContent = deviceData.type;
// //     document.getElementById('device-ip').textContent = deviceData.ip;
// //     document.getElementById('device-mac').textContent = deviceData.mac;
    
// //     const statusElement = document.getElementById('device-status');
// //     statusElement.textContent = deviceData.status;
// //     statusElement.className = `badge ${getStatusClass(deviceData.status)}`;
    
// //     document.getElementById('total-ports').textContent = deviceData.totalPorts;
// //     document.getElementById('used-ports').textContent = deviceData.usedPorts;
// //     document.getElementById('free-ports').textContent = deviceData.freePorts;
// // }

// // // Portlar jadvalini yangilash
// // function updatePortsTable() {
// //     const tbody = document.getElementById('ports-body');
// //     tbody.innerHTML = '';

// //     deviceData.ports.forEach(port => {
// //         const row = document.createElement('tr');
// //         row.innerHTML = `
// //             <td>${port.number}</td>
// //             <td>
// //                 <span class="badge ${getStatusClass(port.status)}">
// //                     ${port.status}
// //                 </span>
// //             </td>
// //             <td>${port.speed} Mbps</td>
// //             <td>${port.user || '-'}</td>
// //             <td>${port.cableType || '-'}</td>
// //             <td>${port.cableLength ? port.cableLength + 'm' : '-'}</td>
// //             <td>${port.vlan || '-'}</td>
// //             <td>${formatDateTime(port.lastActivity)}</td>
// //         `;
// //         tbody.appendChild(row);
// //     });
// // }

// // // Port statistikasi grafiklarini yangilash
// // function updatePortsChart() {
// //     // Donut chart uchun
// //     const ctxPie = document.getElementById('portStatsChart').getContext('2d');
    
// //     // Foizlarni hisoblash
// //     const usedPercent = Math.round((deviceData.usedPorts / deviceData.totalPorts) * 100);
// //     const freePercent = 100 - usedPercent;
    
// //     // Progress bar va foizlarni yangilash
// //     document.getElementById('used-ports-percent').textContent = `${usedPercent}%`;
// //     document.getElementById('free-ports-percent').textContent = `${freePercent}%`;
// //     document.getElementById('used-ports-progress').style.width = `${usedPercent}%`;
// //     document.getElementById('free-ports-progress').style.width = `${freePercent}%`;
    
// //     // Donut chart ma'lumotlari
// //     const pieData = {
// //         labels: ['Band', 'Bo\'sh'],
// //         datasets: [{
// //             data: [deviceData.usedPorts, deviceData.freePorts],
// //             backgroundColor: ['#198754', '#dc3545'],
// //             borderWidth: 0
// //         }]
// //     };

// //     // Eski grafikni o'chirish
// //     if (portStatsChart) {
// //         portStatsChart.destroy();
// //     }

// //     // Yangi donut chart yaratish
// //     portStatsChart = new Chart(ctxPie, {
// //         type: 'doughnut',
// //         data: pieData,
// //         options: {
// //             responsive: true,
// //             maintainAspectRatio: true,
// //             plugins: {
// //                 legend: {
// //                     display: false
// //                 }
// //             },
// //             cutout: '70%'
// //         }
// //     });

// //     // Port tezligi statistikasi
// //     const ctxSpeed = document.getElementById('portSpeedChart').getContext('2d');
    
// //     // Port tezliklarini hisoblash
// //     const speedStats = {
// //         '10 Mbps': 0,
// //         '100 Mbps': 0,
// //         '1000 Mbps': 0
// //     };
    
// //     deviceData.ports.forEach(port => {
// //         if (port.status === 'Active') {
// //             const speed = port.speed + ' Mbps';
// //             speedStats[speed]++;
// //         }
// //     });

// //     // Eski grafikni o'chirish
// //     if (portSpeedChart) {
// //         portSpeedChart.destroy();
// //     }

// //     // Yangi bar chart yaratish
// //     portSpeedChart = new Chart(ctxSpeed, {
// //         type: 'bar',
// //         data: {
// //             labels: Object.keys(speedStats),
// //             datasets: [{
// //                 label: 'Portlar soni',
// //                 data: Object.values(speedStats),
// //                 backgroundColor: '#0d6efd',
// //                 borderRadius: 5
// //             }]
// //         },
// //         options: {
// //             responsive: true,
// //             plugins: {
// //                 legend: {
// //                     display: false
// //                 }
// //             },
// //             scales: {
// //                 y: {
// //                     beginAtZero: true,
// //                     ticks: {
// //                         stepSize: 1
// //                     }
// //                 }
// //             }
// //         }
// //     });
// // }

// // // Yordamchi funksiyalar
// // function getStatusClass(status) {
// //     const statusClasses = {
// //         'Online': 'bg-success',
// //         'Offline': 'bg-danger',
// //         'Warning': 'bg-warning',
// //         'Active': 'bg-success',
// //         'Inactive': 'bg-secondary',
// //         'Error': 'bg-danger'
// //     };
// //     return statusClasses[status] || 'bg-secondary';
// // }

// // function formatDateTime(timestamp) {
// //     if (!timestamp) return '-';
// //     const date = new Date(timestamp);
// //     return date.toLocaleString('uz-UZ', {
// //         year: 'numeric',
// //         month: '2-digit',
// //         day: '2-digit',
// //         hour: '2-digit',
// //         minute: '2-digit'
// //     });
// // }

// // function showError(message) {
// //     alert(message);
// // }

// // // Test uchun namuna ma'lumotlar
// // const sampleData = {
// //     id: 1,
// //     name: "Switch-01",
// //     type: "Cisco Catalyst 2960",
// //     ip: "192.168.1.1",
// //     mac: "00:1B:44:11:3A:B7",
// //     status: "Online",
// //     totalPorts: 24,
// //     usedPorts: 18,
// //     freePorts: 6,
// //     ports: [
// //         {
// //             number: 1,
// //             status: "Active",
// //             speed: 1000,
// //             user: "Kompyuter-101",
// //             cableType: "Cat6",
// //             cableLength: 15,
// //             vlan: "VLAN10",
// //             lastActivity: new Date().toISOString()
// //         },
// //         {
// //             number: 2,
// //             status: "Active",
// //             speed: 100,
// //             user: "Printer-01",
// //             cableType: "Cat5e",
// //             cableLength: 8,
// //             vlan: "VLAN20",
// //             lastActivity: new Date().toISOString()
// //         }
// //     ]
// // };


// // // Test rejimida ishlatish uchun
// // if (!deviceId) {
// //     deviceData = sampleData;
// //     updateDeviceInfo();
// //     updatePortsTable();
// //     updatePortsChart();
// // }

// // Port ma'lumotlarini tahrirlash
// function editPort(port) {
//     document.getElementById('port_id').value = port.id;
//     const form = document.querySelector('#portModal form');
    
//     // Form elementlariga qiymatlarni o'rnatish
//     form.elements['status'].value = port.status;
//     form.elements['speed'].value = port.speed;
//     form.elements['user'].value = port.user || '';
//     form.elements['cable_type'].value = port.cable_type || '';
//     form.elements['cable_length'].value = port.cable_length || '';
//     form.elements['vlan'].value = port.vlan || '';
    
//     // Modal oynani ochish
//     new bootstrap.Modal(document.getElementById('portModal')).show();
// }

// // Port statistikasi grafigi
// document.addEventListener('DOMContentLoaded', function() {
//     const ctx = document.getElementById('portStatsChart').getContext('2d');
    
//     // Port holatlarini hisoblash
//     const ports = Array.from(document.querySelectorAll('tbody tr')).map(row => ({
//         status: row.querySelector('td:nth-child(2) .badge').textContent.trim(),
//         speed: parseInt(row.querySelector('td:nth-child(3)').textContent)
//     }));
    
//     const statusStats = {
//         'Active': ports.filter(p => p.status === 'Active').length,
//         'Inactive': ports.filter(p => p.status === 'Inactive').length,
//         'Error': ports.filter(p => p.status === 'Error').length
//     };
    
//     new Chart(ctx, {
//         type: 'doughnut',
//         data: {
//             labels: Object.keys(statusStats),
//             datasets: [{
//                 data: Object.values(statusStats),
//                 backgroundColor: [
//                     '#198754',  // Active - yashil
//                     '#6c757d',  // Inactive - kulrang
//                     '#dc3545'   // Error - qizil
//                 ],
//                 borderWidth: 0
//             }]
//         },
//         options: {
//             responsive: true,
//             maintainAspectRatio: true,
//             plugins: {
//                 legend: {
//                     position: 'bottom',
//                     labels: {
//                         usePointStyle: true,
//                         padding: 20
//                     }
//                 }
//             },
//             cutout: '70%'
//         }
//     });
// });

// // Qurilmani ping qilish
// async function pingDevice(deviceId) {
//     const button = document.querySelector('button[onclick^="pingDevice"]');
//     const originalContent = button.innerHTML;
    
//     button.disabled = true;
//     button.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Tekshirilmoqda...';
    
//     try {
//         const response = await fetch(`api/ping.php?id=${deviceId}`);
//         const data = await response.json();
        
//         if (data.success) {
//             // Status belgisini yangilash
//             const statusBadge = document.querySelector('.status-indicator');
//             statusBadge.className = `status-indicator status-${data.status}`;
            
//             // Toast xabar ko'rsatish
//             showToast(data.status === 'online' ? 'success' : 'danger', data.message);
//         } else {
//             showToast('danger', data.message);
//         }
//     } catch (error) {
//         showToast('danger', 'Xatolik yuz berdi');
//     } finally {
//         button.disabled = false;
//         button.innerHTML = originalContent;
//     }
// }

// // Toast xabarlarini ko'rsatish
// function showToast(type, message) {
//     const toast = document.createElement('div');
//     toast.className = `toast align-items-center text-white bg-${type} border-0`;
//     toast.setAttribute('role', 'alert');
//     toast.setAttribute('aria-live', 'assertive');
//     toast.setAttribute('aria-atomic', 'true');
    
//     toast.innerHTML = `
//         <div class="d-flex">
//             <div class="toast-body">${message}</div>
//             <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
//         </div>
//     `;
    
//     document.querySelector('.toast-container').appendChild(toast);
//     const bsToast = new bootstrap.Toast(toast);
//     bsToast.show();
    
//     toast.addEventListener('hidden.bs.toast', () => toast.remove());
// }

// Port ma'lumotlarini tahrirlash
// function editPort(port) {
//     document.getElementById('port_id').value = port.id;
//     const form = document.querySelector('#portModal form');
    
//     // Form elementlariga qiymatlarni o'rnatish
//     form.elements['ip_address'].value = port.ip_address || '';
//     form.elements['mac_address'].value = port.mac_address || '';
//     form.elements['status'].value = port.status;
//     form.elements['speed'].value = port.speed;
//     form.elements['user'].value = port.user || '';
//     form.elements['cable_type'].value = port.cable_type || '';
//     form.elements['cable_length'].value = port.cable_length || '';
//     form.elements['vlan'].value = port.vlan || '';
    
//     // Modal oynani ochish
//     new bootstrap.Modal(document.getElementById('portModal')).show();
// }

// // Qurilmani o'chirish funksiyasi
// function deleteDevice(deviceId) {
//     if (confirm('Haqiqatan ham bu qurilmani o\'chirmoqchimisiz?')) {
//         const form = document.createElement('form');
//         form.method = 'POST';
//         form.innerHTML = `<input type="hidden" name="action" value="delete_device">`;
//         document.body.appendChild(form);
//         form.submit();
//     }
// }

// // Port statistikasi grafiklarini yangilash
// function updatePortStats() {
//     const ports = Array.from(document.querySelectorAll('tbody tr'));
    
//     // Holat bo'yicha statistika
//     const statusStats = {
//         'Active': ports.filter(p => p.querySelector('td:nth-child(4) .badge').textContent.trim() === 'Active').length,
//         'Inactive': ports.filter(p => p.querySelector('td:nth-child(4) .badge').textContent.trim() === 'Inactive').length,
//         'Error': ports.filter(p => p.querySelector('td:nth-child(4) .badge').textContent.trim() === 'Error').length
//     };

//     // Tezlik bo'yicha statistika
//     const speedStats = ports.reduce((acc, port) => {
//         const speed = parseInt(port.querySelector('td:nth-child(5)').textContent);
//         acc[speed] = (acc[speed] || 0) + 1;
//         return acc;
//     }, {});

//     // Grafiklarni yangilash
//     updateCharts(statusStats, speedStats);
// }

// // Grafiklarni yangilash
// function updateCharts(statusStats, speedStats) {
//     const ctx = document.getElementById('portStatsChart').getContext('2d');
    
//     if (window.portChart) {
//         window.portChart.destroy();
//     }

//     window.portChart = new Chart(ctx, {
//         type: 'doughnut',
//         data: {
//             labels: Object.keys(statusStats),
//             datasets: [{
//                 data: Object.values(statusStats),
//                 backgroundColor: [
//                     '#198754',  // Active - yashil
//                     '#6c757d',  // Inactive - kulrang
//                     '#dc3545'   // Error - qizil
//                 ],
//                 borderWidth: 0
//             }]
//         },
//         options: {
//             responsive: true,
//             maintainAspectRatio: true,
//             plugins: {
//                 legend: {
//                     position: 'bottom',
//                     labels: {
//                         usePointStyle: true,
//                         padding: 20
//                     }
//                 }
//             },
//             cutout: '70%'
//         }
//     });

//     // Statistika ma'lumotlarini yangilash
//     document.querySelector('[data-stat="total"]').textContent = 
//         Object.values(statusStats).reduce((a, b) => a + b, 0);
//     document.querySelector('[data-stat="active"]').textContent = statusStats.Active || 0;
//     document.querySelector('[data-stat="inactive"]').textContent = statusStats.Inactive || 0;
//     document.querySelector('[data-stat="error"]').textContent = statusStats.Error || 0;
// }

// // Qurilmani ping qilish
// async function pingDevice(deviceId) {
//     const button = document.querySelector('button[onclick^="pingDevice"]');
//     const originalContent = button.innerHTML;
    
//     button.disabled = true;
//     button.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Tekshirilmoqda...';
    
//     try {
//         const response = await fetch(`api/ping.php?id=${deviceId}`);
//         const data = await response.json();
        
//         if (data.success) {
//             // Status belgisini yangilash
//             const statusBadge = document.querySelector('.badge');
//             statusBadge.className = `badge ${data.status === 'online' ? 'bg-success' : 'bg-danger'}`;
//             statusBadge.innerHTML = `
//                 <i class="bi ${data.status === 'online' ? 'bi-check-circle' : 'bi-x-circle'}"></i>
//                 ${data.status}
//             `;
            
//             showToast(data.status === 'online' ? 'success' : 'danger', data.message);
//         } else {
//             showToast('danger', data.message);
//         }
//     } catch (error) {
//         showToast('danger', 'Xatolik yuz berdi');
//     } finally {
//         button.disabled = false;
//         button.innerHTML = originalContent;
//     }
// }

// // Toast xabarlarini ko'rsatish
// function showToast(type, message) {
//     const toast = document.createElement('div');
//     toast.className = `toast align-items-center text-white bg-${type} border-0`;
//     toast.setAttribute('role', 'alert');
//     toast.setAttribute('aria-live', 'assertive');
//     toast.setAttribute('aria-atomic', 'true');
    
//     toast.innerHTML = `
//         <div class="d-flex">
//             <div class="toast-body">${message}</div>
//             <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
//         </div>
//     `;
    
//     document.querySelector('.toast-container').appendChild(toast);
//     const bsToast = new bootstrap.Toast(toast);
//     bsToast.show();
    
//     toast.addEventListener('hidden.bs.toast', () => toast.remove());
// }

// // Sahifa yuklanganda statistikani yangilash
// document.addEventListener('DOMContentLoaded', function() {
//     updatePortStats();
//     // Har 30 sekundda statistikani yangilash
//     setInterval(updatePortStats, 30000);
// });

// Port ma'lumotlarini tahrirlash
// function editPort(port) {
//     document.getElementById('port_id').value = port.id;
//     const form = document.querySelector('#portModal form');
    
//     // Form elementlariga qiymatlarni o'rnatish
//     form.elements['ip_address'].value = port.ip_address || '';
//     form.elements['mac_address'].value = port.mac_address || '';
//     form.elements['status'].value = port.status;
//     form.elements['speed'].value = port.speed;
//     form.elements['user'].value = port.user || '';
//     form.elements['cable_type'].value = port.cable_type || '';
//     form.elements['cable_length'].value = port.cable_length || '';
//     form.elements['vlan'].value = port.vlan || '';
    
//     // Modal oynani ochish
//     new bootstrap.Modal(document.getElementById('portModal')).show();
// }

// // IP manzil orqali MAC ni aniqlash
// async function detectMacAddress() {
//     const ipInput = document.querySelector('input[name="ip_address"]');
//     const macInput = document.querySelector('input[name="mac_address"]');
//     const macStatus = document.getElementById('macDetectionStatus');
//     const detectBtn = document.getElementById('detectMacBtn');
    
//     const ip = ipInput.value.trim();
//     if (!ip) {
//         showToast('warning', 'IP manzilni kiriting!');
//         return;
//     }

//     detectBtn.disabled = true;
//     detectBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Aniqlanmoqda...';
    
//     try {
//         const response = await fetch('api/network.php', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 action: 'detect_mac',
//                 ip: ip
//             })
//         });

//         const data = await response.json();
        
//         if (data.success && data.mac) {
//             macInput.value = data.mac;
//             showToast('success', 'MAC manzil aniqlandi');
//         } else {
//             showToast('danger', data.message || 'MAC manzilni aniqlab bo\'lmadi');
//         }
//     } catch (error) {
//         showToast('danger', 'Xatolik yuz berdi');
//     } finally {
//         detectBtn.disabled = false;
//         detectBtn.innerHTML = '<i class="bi bi-search"></i> MAC ni aniqlash';
//     }
// }

// // IP manzilni aniqlash
// async function detectIpAddress() {
//     const ipInput = document.querySelector('input[name="ip_address"]');
//     const macInput = document.querySelector('input[name="mac_address"]');
//     const ipStatus = document.getElementById('ipDetectionStatus');
//     const detectBtn = document.getElementById('detectIpBtn');
    
//     const mac = macInput.value.trim();
//     if (!mac) {
//         showToast('warning', 'MAC manzilni kiriting!');
//         return;
//     }

//     detectBtn.disabled = true;
//     detectBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Aniqlanmoqda...';
    
//     try {
//         const response = await fetch('api/network.php', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 action: 'detect_ip',
//                 mac: mac
//             })
//         });

//         const data = await response.json();
        
//         if (data.success && data.ip) {
//             ipInput.value = data.ip;
//             showToast('success', 'IP manzil aniqlandi');
//         } else {
//             showToast('danger', data.message || 'IP manzilni aniqlab bo\'lmadi');
//         }
//     } catch (error) {
//         showToast('danger', 'Xatolik yuz berdi');
//     } finally {
//         detectBtn.disabled = false;
//         detectBtn.innerHTML = '<i class="bi bi-search"></i> IP ni aniqlash';
//     }
// }

// // Port tahrirlash modali HTML qismini yangilash
// function updatePortModalHTML() {
//     const modalBody = document.querySelector('#portModal .modal-body');
//     modalBody.innerHTML = `
//         <input type="hidden" name="port_id" id="port_id">
        
//         <div class="mb-3">
//             <label class="form-label">IP manzil</label>
//             <div class="input-group">
//                 <input type="text" name="ip_address" class="form-control" 
//                        pattern="\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}"
//                        placeholder="192.168.1.100">
//                 <button type="button" class="btn btn-outline-primary" id="detectMacBtn"
//                         onclick="detectMacAddress()">
//                     <i class="bi bi-search"></i> MAC ni aniqlash
//                 </button>
//             </div>
//             <div id="macDetectionStatus" class="form-text"></div>
//         </div>
        
//         <div class="mb-3">
//             <label class="form-label">MAC manzil</label>
//             <div class="input-group">
//                 <input type="text" name="mac_address" class="form-control" 
//                        pattern="([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})"
//                        placeholder="00:11:22:33:44:55">
//                 <button type="button" class="btn btn-outline-primary" id="detectIpBtn"
//                         onclick="detectIpAddress()">
//                     <i class="bi bi-search"></i> IP ni aniqlash
//                 </button>
//             </div>
//             <div id="ipDetectionStatus" class="form-text"></div>
//         </div>

//         <div class="mb-3">
//             <label class="form-label">Holat</label>
//             <select name="status" class="form-select" required>
//                 <option value="Active">Active</option>
//                 <option value="Inactive">Inactive</option>
//                 <option value="Error">Error</option>
//             </select>
//         </div>
        
//         <div class="mb-3">
//             <label class="form-label">Tezlik (Mb/s)</label>
//             <select name="speed" class="form-select" required>
//                 <option value="10">10 Mb/s</option>
//                 <option value="100">100 Mb/s</option>
//                 <option value="1000">1000 Mb/s</option>
//             </select>
//         </div>
        
//         <div class="mb-3">
//             <label class="form-label">Foydalanuvchi</label>
//             <input type="text" name="user" class="form-control">
//         </div>
        
//         <div class="mb-3">
//             <label class="form-label">Kabel turi</label>
//             <select name="cable_type" class="form-select">
//                 <option value="">Tanlang...</option>
//                 <option value="UTP">UTP</option>
//                 <option value="STP">STP</option>
//                 <option value="Fiber">Fiber</option>
//             </select>
//         </div>
        
//         <div class="mb-3">
//             <label class="form-label">Kabel uzunligi (metr)</label>
//             <input type="number" name="cable_length" class="form-control" min="1">
//         </div>
        
//         <div class="mb-3">
//             <label class="form-label">VLAN</label>
//             <input type="text" name="vlan" class="form-control">
//         </div>
//     `;
// }

// // Sahifa yuklanganda modal HTML ni yangilash
// document.addEventListener('DOMContentLoaded', function() {
//     updatePortModalHTML();
//     updatePortStats();
//     // Har 30 sekundda statistikani yangilash
//     setInterval(updatePortStats, 30000);
// });

// ... (qolgan funksiyalar o'zgarishsiz qoladi) ...





// Port ma'lumotlarini tahrirlash
// function editPort(port) {
//     const modalBody = document.querySelector('#portModal .modal-body');
//     modalBody.innerHTML = `
//         <input type="hidden" name="port_id" value="${port.id}">
//         <input type="hidden" name="action" value="edit_port">
        
//         <div class="mb-3">
//             <label class="form-label">IP manzil</label>
//             <div class="input-group">
//                 <input type="text" name="ip_address" class="form-control" 
//                        pattern="\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}"
//                        value="${port.ip_address || ''}"
//                        placeholder="192.168.1.100">
//                 <button type="button" class="btn btn-outline-primary" id="detectMacBtn"
//                         onclick="detectMacAddress()">
//                     <i class="bi bi-search"></i> MAC ni aniqlash
//                 </button>
//             </div>
//         </div>
        
//         <div class="mb-3">
//             <label class="form-label">MAC manzil</label>
//             <div class="input-group">
//                 <input type="text" name="mac_address" class="form-control" 
//                        pattern="([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})"
//                        value="${port.mac_address || ''}"
//                        placeholder="00:11:22:33:44:55">
//                 <button type="button" class="btn btn-outline-primary" id="detectIpBtn"
//                         onclick="detectIpAddress()">
//                     <i class="bi bi-search"></i> IP ni aniqlash
//                 </button>
//             </div>
//         </div>
        
//         <div class="mb-3">
//             <label class="form-label">Holat</label>
//             <select name="status" class="form-select" required>
//                 <option value="Active" ${port.status === 'Active' ? 'selected' : ''}>Active</option>
//                 <option value="Inactive" ${port.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
//                 <option value="Error" ${port.status === 'Error' ? 'selected' : ''}>Error</option>
//             </select>
//         </div>
        
//         <div class="mb-3">
//             <label class="form-label">Tezlik (Mb/s)</label>
//             <select name="speed" class="form-select" required>
//                 <option value="10" ${port.speed === '10' ? 'selected' : ''}>10 Mb/s</option>
//                 <option value="100" ${port.speed === '100' ? 'selected' : ''}>100 Mb/s</option>
//                 <option value="1000" ${port.speed === '1000' ? 'selected' : ''}>1000 Mb/s</option>
//             </select>
//         </div>
        
//         <div class="mb-3">
//             <label class="form-label">Foydalanuvchi</label>
//             <input type="text" name="user" class="form-control" value="${port.user || ''}">
//         </div>
        
//         <div class="mb-3">
//             <label class="form-label">Kabel turi</label>
//             <select name="cable_type" class="form-select">
//                 <option value="">Tanlang...</option>
//                 <option value="UTP" ${port.cable_type === 'UTP' ? 'selected' : ''}>UTP</option>
//                 <option value="STP" ${port.cable_type === 'STP' ? 'selected' : ''}>STP</option>
//                 <option value="Fiber" ${port.cable_type === 'Fiber' ? 'selected' : ''}>Fiber</option>
//             </select>
//         </div>
        
//         <div class="mb-3">
//             <label class="form-label">Kabel uzunligi (metr)</label>
//             <input type="number" name="cable_length" class="form-control" 
//                    min="1" value="${port.cable_length || ''}">
//         </div>
        
//         <div class="mb-3">
//             <label class="form-label">VLAN</label>
//             <input type="text" name="vlan" class="form-control" value="${port.vlan || ''}">
//         </div>
//     `;
    
//     new bootstrap.Modal(document.getElementById('portModal')).show();
// }

// // IP manzil orqali MAC ni aniqlash
// async function detectMacAddress() {
//     const ipInput = document.querySelector('input[name="ip_address"]');
//     const macInput = document.querySelector('input[name="mac_address"]');
//     const detectBtn = document.getElementById('detectMacBtn');
    
//     const ip = ipInput.value.trim();
//     if (!ip) {
//         showToast('warning', 'IP manzilni kiriting!');
//         return;
//     }

//     detectBtn.disabled = true;
//     detectBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Aniqlanmoqda...';
    
//     try {
//         const response = await fetch('api/network.php', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 action: 'detect_mac',
//                 ip: ip
//             })
//         });

//         const data = await response.json();
        
//         if (data.success && data.mac) {
//             macInput.value = data.mac;
//             showToast('success', 'MAC manzil aniqlandi');
//         } else {
//             showToast('danger', data.message || 'MAC manzilni aniqlab bo\'lmadi');
//         }
//     } catch (error) {
//         showToast('danger', 'Xatolik yuz berdi');
//     } finally {
//         detectBtn.disabled = false;
//         detectBtn.innerHTML = '<i class="bi bi-search"></i> MAC ni aniqlash';
//     }
// }

// // MAC manzil orqali IP ni aniqlash
// async function detectIpAddress() {
//     const ipInput = document.querySelector('input[name="ip_address"]');
//     const macInput = document.querySelector('input[name="mac_address"]');
//     const detectBtn = document.getElementById('detectIpBtn');
    
//     const mac = macInput.value.trim();
//     if (!mac) {
//         showToast('warning', 'MAC manzilni kiriting!');
//         return;
//     }

//     detectBtn.disabled = true;
//     detectBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Aniqlanmoqda...';
    
//     try {
//         const response = await fetch('api/network.php', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 action: 'detect_ip',
//                 mac: mac
//             })
//         });

//         const data = await response.json();
        
//         if (data.success && data.ip) {
//             ipInput.value = data.ip;
//             showToast('success', 'IP manzil aniqlandi');
//         } else {
//             showToast('danger', data.message || 'IP manzilni aniqlab bo\'lmadi');
//         }
//     } catch (error) {
//         showToast('danger', 'Xatolik yuz berdi');
//     } finally {
//         detectBtn.disabled = false;
//         detectBtn.innerHTML = '<i class="bi bi-search"></i> IP ni aniqlash';
//     }
// }

// // Qurilmani ping qilish
// async function pingDevice(deviceId) {
//     const button = document.querySelector('button[onclick^="pingDevice"]');
//     const originalContent = button.innerHTML;
    
//     try {
//         button.disabled = true;
//         button.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Tekshirilmoqda...';
        
//         const response = await fetch(`api/ping.php?id=${deviceId}`);
//         const data = await response.json();
        
//         if (data.success) {
//             const statusBadge = document.querySelector('.badge');
//             statusBadge.className = `badge ${data.status === 'online' ? 'bg-success' : 'bg-danger'}`;
//             statusBadge.innerHTML = `
//                 <i class="bi ${data.status === 'online' ? 'bi-check-circle' : 'bi-x-circle'}"></i>
//                 ${data.status}
//             `;
            
//             showToast(data.status === 'online' ? 'success' : 'danger', data.message);
            
//             if (data.status !== statusBadge.textContent.toLowerCase()) {
//                 setTimeout(() => location.reload(), 1500);
//             }
//         } else {
//             showToast('danger', data.message);
//         }
//     } catch (error) {
//         showToast('danger', 'Xatolik yuz berdi');
//     } finally {
//         button.disabled = false;
//         button.innerHTML = originalContent;
//     }
// }

// // Qurilmani o'chirish tasdig'i
// function confirmDelete(deviceId) {
//     if (confirm('Haqiqatdan ham bu qurilmani o\'chirmoqchimisiz?\nBarcha port ma\'lumotlari ham o\'chiriladi.')) {
//         const form = document.createElement('form');
//         form.method = 'POST';
//         form.innerHTML = `<input type="hidden" name="action" value="delete_device">`;
//         document.body.appendChild(form);
//         form.submit();
//     }
// }

// // Toast xabarlarini ko'rsatish
// function showToast(type, message) {
//     const toast = document.createElement('div');
//     toast.className = `toast align-items-center text-white bg-${type} border-0`;
//     toast.setAttribute('role', 'alert');
//     toast.setAttribute('aria-live', 'assertive');
//     toast.setAttribute('aria-atomic', 'true');
    
//     toast.innerHTML = `
//         <div class="d-flex">
//             <div class="toast-body">${message}</div>
//             <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
//         </div>
//     `;
    
//     document.querySelector('.toast-container').appendChild(toast);
//     const bsToast = new bootstrap.Toast(toast);
//     bsToast.show();
    
//     toast.addEventListener('hidden.bs.toast', () => toast.remove());
// }

// // Sahifa yuklanganda
// document.addEventListener('DOMContentLoaded', function() {
//     // URL parametrlarini tekshirish
//     const urlParams = new URLSearchParams(window.location.search);
//     const message = urlParams.get('message');
    
//     // Xabar ko'rsatish
//     if (message === 'device_deleted') {
//         showToast('success', 'Qurilma muvaffaqiyatli o\'chirildi');
//     }
    
//     // Port statistikasini yangilash
//     updatePortStats();
//     // Har 30 sekundda yangilab turish
//     setInterval(updatePortStats, 30000);
// });



// Port ma'lumotlarini tahrirlash
function editPort(port) {
    document.querySelector('#portModal .modal-body').innerHTML = `
        <input type="hidden" name="port_id" value="${port.id}">
        <input type="hidden" name="action" value="edit_port">
        
        <div class="mb-3">
            <label class="form-label">IP manzil</label>
            <div class="input-group">
                <input type="text" name="ip_address" class="form-control" 
                       pattern="^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
                       value="${port.ip_address || ''}"
                       placeholder="192.168.1.100">
                <button type="button" class="btn btn-outline-primary" id="detectMacBtn"
                        onclick="detectMacAddress()">
                    <i class="bi bi-search"></i> MAC ni aniqlash
                </button>
            </div>
            <div class="form-text">Misol: 192.168.1.100</div>
        </div>
        
        <div class="mb-3">
            <label class="form-label">MAC manzil</label>
            <div class="input-group">
                <input type="text" name="mac_address" class="form-control" 
                       pattern="^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$"
                       value="${port.mac_address || ''}"
                       placeholder="00:11:22:33:44:55">
                <button type="button" class="btn btn-outline-primary" id="detectIpBtn"
                        onclick="detectIpAddress()">
                    <i class="bi bi-search"></i> IP ni aniqlash
                </button>
            </div>
            <div class="form-text">Misol: 00:11:22:33:44:55</div>
        </div>
        
        <div class="mb-3">
            <label class="form-label">Holat</label>
            <select name="status" class="form-select" required>
                <option value="Active" ${port.status === 'Active' ? 'selected' : ''}>Active</option>
                <option value="Inactive" ${port.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
                <option value="Error" ${port.status === 'Error' ? 'selected' : ''}>Error</option>
            </select>
        </div>
        
        <div class="mb-3">
            <label class="form-label">Tezlik (Mb/s)</label>
            <select name="speed" class="form-select" required>
                <option value="10" ${port.speed == 10 ? 'selected' : ''}>10 Mb/s</option>
                <option value="100" ${port.speed == 100 ? 'selected' : ''}>100 Mb/s</option>
                <option value="1000" ${port.speed == 1000 ? 'selected' : ''}>1000 Mb/s</option>
            </select>
        </div>
        
        <div class="mb-3">
            <label class="form-label">Foydalanuvchi</label>
            <input type="text" name="user" class="form-control" value="${port.user || ''}">
        </div>
        
        <div class="mb-3">
            <label class="form-label">Kabel turi</label>
            <select name="cable_type" class="form-select">
                <option value="">Tanlang...</option>
                <option value="UTP" ${port.cable_type === 'UTP' ? 'selected' : ''}>UTP</option>
                <option value="STP" ${port.cable_type === 'STP' ? 'selected' : ''}>STP</option>
                <option value="Fiber" ${port.cable_type === 'Fiber' ? 'selected' : ''}>Fiber</option>
            </select>
        </div>
        
        <div class="mb-3">
            <label class="form-label">Kabel uzunligi (metr)</label>
            <input type="number" name="cable_length" class="form-control" 
                   min="1" max="100" value="${port.cable_length || ''}">
            <div class="form-text">1 dan 100 metrgacha</div>
        </div>
        
        <div class="mb-3">
            <label class="form-label">VLAN</label>
            <input type="text" name="vlan" class="form-control" 
                   pattern="^[0-9]{1,4}$" value="${port.vlan || ''}"
                   placeholder="1">
            <div class="form-text">1 dan 4094 gacha</div>
        </div>
    `;
    
    new bootstrap.Modal(document.getElementById('portModal')).show();
}

// IP manzil orqali MAC ni aniqlash
async function detectMacAddress() {
    const ipInput = document.querySelector('input[name="ip_address"]');
    const macInput = document.querySelector('input[name="mac_address"]');
    const detectBtn = document.getElementById('detectMacBtn');
    
    const ip = ipInput.value.trim();
    if (!ip) {
        showToast('warning', 'IP manzilni kiriting!');
        return;
    }

    try {
        detectBtn.disabled = true;
        detectBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Aniqlanmoqda...';
        
        const response = await fetch('api/network.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'detect_mac',
                ip: ip
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            macInput.value = data.mac;
            showToast('success', 'MAC manzil aniqlandi');
        } else {
            showToast('danger', data.message || 'MAC manzilni aniqlab bo\'lmadi');
        }
    } catch (error) {
        showToast('danger', 'Xatolik yuz berdi');
    } finally {
        detectBtn.disabled = false;
        detectBtn.innerHTML = '<i class="bi bi-search"></i> MAC ni aniqlash';
    }
}

// MAC manzil orqali IP ni aniqlash
async function detectIpAddress() {
    const ipInput = document.querySelector('input[name="ip_address"]');
    const macInput = document.querySelector('input[name="mac_address"]');
    const detectBtn = document.getElementById('detectIpBtn');
    
    const mac = macInput.value.trim();
    if (!mac) {
        showToast('warning', 'MAC manzilni kiriting!');
        return;
    }

    try {
        detectBtn.disabled = true;
        detectBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Aniqlanmoqda...';
        
        const response = await fetch('api/network.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'detect_ip',
                mac: mac
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            ipInput.value = data.ip;
            showToast('success', 'IP manzil aniqlandi');
        } else {
            showToast('danger', data.message || 'IP manzilni aniqlab bo\'lmadi');
        }
    } catch (error) {
        showToast('danger', 'Xatolik yuz berdi');
    } finally {
        detectBtn.disabled = false;
        detectBtn.innerHTML = '<i class="bi bi-search"></i> IP ni aniqlash';
    }
}

// Qurilmani ping qilish
async function pingDevice(deviceId) {
    const button = document.querySelector('button[onclick^="pingDevice"]');
    const originalContent = button.innerHTML;
    
    try {
        button.disabled = true;
        button.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Tekshirilmoqda...';
        
        const response = await fetch(`api/ping.php?id=${deviceId}`);
        const data = await response.json();
        
        if (data.success) {
            const statusBadge = document.querySelector('.badge');
            statusBadge.className = `badge ${data.status === 'online' ? 'bg-success' : 'bg-danger'}`;
            statusBadge.innerHTML = `
                <i class="bi ${data.status === 'online' ? 'bi-check-circle' : 'bi-x-circle'}"></i>
                ${data.status}
            `;
            
            showToast(data.status === 'online' ? 'success' : 'danger', data.message);
            
            if (data.status !== statusBadge.textContent.toLowerCase()) {
                setTimeout(() => location.reload(), 1500);
            }
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

// Qurilmani o'chirish tasdig'i
function confirmDelete(deviceId) {
    if (confirm('Haqiqatdan ham bu qurilmani o\'chirmoqchimisiz?\nBarcha port ma\'lumotlari ham o\'chiriladi.')) {
        const form = document.createElement('form');
        form.method = 'POST';
        form.innerHTML = `<input type="hidden" name="action" value="delete_device">`;
        document.body.appendChild(form);
        form.submit();
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

// Port statistikasi grafigini yangilash
function updatePortStats() {
    const ctx = document.getElementById('portStatsChart').getContext('2d');
    const totalPorts = parseInt(document.querySelector('[data-stat="total"]').textContent);
    const activePorts = parseInt(document.querySelector('[data-stat="active"]').textContent);
    const inactivePorts = parseInt(document.querySelector('[data-stat="inactive"]').textContent);
    
    if (window.portStatsChart) {
        window.portStatsChart.destroy();
    }
    
    window.portStatsChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Faol portlar', 'Bo\'sh portlar'],
            datasets: [{
                data: [activePorts, inactivePorts],
                backgroundColor: ['#198754', '#6c757d'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            cutout: '70%'
        }
    });
}

// Sahifa yuklanganda
document.addEventListener('DOMContentLoaded', function() {
    // URL parametrlarini tekshirish
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get('message');
    
    // Xabar ko'rsatish
    if (message === 'device_deleted') {
        showToast('success', 'Qurilma muvaffaqiyatli o\'chirildi');
    } else if (message === 'port_updated') {
        showToast('success', 'Port ma\'lumotlari yangilandi');
    }
    
    // Port statistikasini yangilash
    updatePortStats();
});