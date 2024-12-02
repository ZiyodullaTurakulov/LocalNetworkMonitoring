// IP manzil orqali MAC ni aniqlash
document.getElementById('getMacBtn').addEventListener('click', async function() {
    const ipAddress = document.getElementById('ip_address').value;
    const macInput = document.getElementById('mac_address');
    const macStatus = document.getElementById('macStatus');
    const getMacBtn = this;
    
    if (!ipAddress) {
        macStatus.textContent = 'IP manzilni kiriting!';
        macStatus.className = 'form-text text-danger';
        return;
    }

    getMacBtn.disabled = true;
    getMacBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Aniqlanmoqda...';
    macStatus.textContent = 'MAC manzil aniqlanmoqda...';
    macStatus.className = 'form-text text-info';

    try {
        const response = await fetch('device-add.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `action=get_mac&ip=${encodeURIComponent(ipAddress)}`
        });

        const data = await response.json();

        if (data.success) {
            macInput.value = data.mac;
            macStatus.textContent = 'MAC manzil muvaffaqiyatli aniqlandi';
            macStatus.className = 'form-text text-success';
        } else {
            macStatus.textContent = data.message;
            macStatus.className = 'form-text text-danger';
        }
    } catch (error) {
        macStatus.textContent = 'Xatolik yuz berdi';
        macStatus.className = 'form-text text-danger';
    } finally {
        getMacBtn.disabled = false;
        getMacBtn.innerHTML = '<i class="bi bi-arrow-repeat"></i> MAC ni aniqlash';
    }
});

// MAC manzil orqali IP ni aniqlash
document.getElementById('getIpBtn').addEventListener('click', async function() {
    const macAddress = document.getElementById('mac_address').value;
    const ipInput = document.getElementById('ip_address');
    const ipStatus = document.getElementById('ipStatus');
    const getIpBtn = this;
    
    if (!macAddress) {
        ipStatus.textContent = 'MAC manzilni kiriting!';
        ipStatus.className = 'form-text text-danger';
        return;
    }

    getIpBtn.disabled = true;
    getIpBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Aniqlanmoqda...';
    ipStatus.textContent = 'IP manzil aniqlanmoqda...';
    ipStatus.className = 'form-text text-info';

    try {
        const response = await fetch('device-add.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `action=get_ip&mac=${encodeURIComponent(macAddress)}`
        });

        const data = await response.json();

        if (data.success) {
            ipInput.value = data.ip;
            ipStatus.textContent = 'IP manzil muvaffaqiyatli aniqlandi';
            ipStatus.className = 'form-text text-success';
        } else {
            ipStatus.textContent = data.message;
            ipStatus.className = 'form-text text-danger';
        }
    } catch (error) {
        ipStatus.textContent = 'Xatolik yuz berdi';
        ipStatus.className = 'form-text text-danger';
    } finally {
        getIpBtn.disabled = false;
        getIpBtn.innerHTML = '<i class="bi bi-arrow-repeat"></i> IP ni aniqlash';
    }
});