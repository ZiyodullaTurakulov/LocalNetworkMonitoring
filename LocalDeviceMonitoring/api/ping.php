<?php
header('Content-Type: application/json');
require_once '../config/database.php';

function pingDevice($ip) {
    if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
        exec("ping -n 1 -w 1 " . escapeshellarg($ip), $output, $status);
    } else {
        exec("ping -c 1 -W 1 " . escapeshellarg($ip), $output, $status);
    }
    return $status === 0;
}

if (isset($_GET['id'])) {
    $database = new Database();
    $db = $database->getConnection();
    
    try {
        // Qurilma ma'lumotlarini olish
        $query = "SELECT ip_address, status FROM devices WHERE id = ?";
        $stmt = $db->prepare($query);
        $stmt->execute([$_GET['id']]);
        $device = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($device) {
            $isOnline = pingDevice($device['ip_address']);
            $newStatus = $isOnline ? 'online' : 'offline';
            
            // Agar status o'zgargan bo'lsa
            if ($newStatus !== $device['status']) {
                // Status va oxirgi faollik vaqtini yangilash
                $query = "UPDATE devices SET status = ?, last_active = ? WHERE id = ?";
                $stmt = $db->prepare($query);
                $stmt->execute([
                    $newStatus,
                    $isOnline ? date('Y-m-d H:i:s') : null,
                    $_GET['id']
                ]);
            }
            
            echo json_encode([
                'success' => true,
                'status' => $newStatus,
                'message' => $isOnline ? 'Qurilma onlayn' : 'Qurilma javob bermayapti'
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Qurilma topilmadi'
            ]);
        }
    } catch (PDOException $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Xatolik yuz berdi: ' . $e->getMessage()
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Qurilma ID si ko\'rsatilmagan'
    ]);
}