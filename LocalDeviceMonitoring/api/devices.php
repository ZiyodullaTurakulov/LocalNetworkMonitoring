<?php
header('Content-Type: application/json');
require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$action = isset($_GET['action']) ? $_GET['action'] : '';

switch($action) {
    case 'status':
        // Statistika va qurilmalar ro'yxatini olish
        $stats_query = "SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN status = 'online' THEN 1 ELSE 0 END) as online,
            SUM(CASE WHEN status = 'offline' THEN 1 ELSE 0 END) as offline,
            SUM(CASE WHEN status = 'warning' THEN 1 ELSE 0 END) as warning
            FROM devices";
        
        $stmt = $db->prepare($stats_query);
        $stmt->execute();
        $stats = $stmt->fetch(PDO::FETCH_ASSOC);

        // Qurilmalar ro'yxati
        $devices_query = "SELECT * FROM devices ORDER BY last_active DESC";
        $stmt = $db->prepare($devices_query);
        $stmt->execute();
        $devices = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            'success' => true,
            'stats' => $stats,
            'devices' => $devices
        ]);
        break;

    case 'update':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $data = json_decode(file_get_contents('php://input'));
            
            $query = "UPDATE devices SET 
                     status = :status,
                     speed = :speed,
                     last_active = CURRENT_TIMESTAMP
                     WHERE id = :id";
            
            $stmt = $db->prepare($query);
            $stmt->bindParam(':status', $data->status);
            $stmt->bindParam(':speed', $data->speed);
            $stmt->bindParam(':id', $data->id);
            
            if ($stmt->execute()) {
                echo json_encode(['success' => true]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Xatolik yuz berdi']);
            }
        }
        break;

    case 'delete':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $id = isset($_POST['id']) ? $_POST['id'] : 0;
            
            // Avval portlarni o'chirish
            $query = "DELETE FROM ports WHERE device_id = :id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            
            // Qurilmani o'chirish
            $query = "DELETE FROM devices WHERE id = :id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':id', $id);
            
            if ($stmt->execute()) {
                echo json_encode(['success' => true]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Xatolik yuz berdi']);
            }
        }
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'Noto\'g\'ri so\'rov']);
}
?>