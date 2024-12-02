<?php
require_once '../config/database.php';

header('Content-Type: application/json');

$database = new Database();
$db = $database->getConnection();

try {
    $query = "SELECT 
                id, 
                name,
                ip_address,
                mac_address,
                type,
                location,
                status,
                speed,
                last_active,
                last_speed_check
              FROM devices 
              ORDER BY last_active DESC";
              
    $stmt = $db->prepare($query);
    $stmt->execute();
    $devices = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Har bir qurilma uchun qo'shimcha ma'lumotlarni formatlash
    foreach ($devices as &$device) {
        $device['last_active_formatted'] = date('d.m.Y H:i', strtotime($device['last_active']));
        $device['speed_formatted'] = number_format($device['speed'], 1) . ' Mb/s';
    }
    
    echo json_encode([
        'success' => true,
        'data' => $devices
    ]);
    
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>