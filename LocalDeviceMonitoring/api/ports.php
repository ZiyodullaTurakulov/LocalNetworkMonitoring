<?php
header('Content-Type: application/json');
require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$action = isset($_GET['action']) ? $_GET['action'] : '';

switch($action) {
    case 'update':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $data = json_decode(file_get_contents('php://input'));
            
            // Port holatini yangilash
            $query = "UPDATE ports SET 
                     status = :status,
                     speed = :speed,
                     user = :user,
                     last_activity = CURRENT_TIMESTAMP
                     WHERE id = :id";
            
            $stmt = $db->prepare($query);
            $stmt->bindParam(':status', $data->status);
            $stmt->bindParam(':speed', $data->speed);
            $stmt->bindParam(':user', $data->user);
            $stmt->bindParam(':id', $data->id);
            
            if ($stmt->execute()) {
                // Port tarixini saqlash
                $query = "INSERT INTO port_history 
                         (port_id, status, speed, user) 
                         VALUES (:port_id, :status, :speed, :user)";
                
                $stmt = $db->prepare($query);
                $stmt->bindParam(':port_id', $data->id);
                $stmt->bindParam(':status', $data->status);
                $stmt->bindParam(':speed', $data->speed);
                $stmt->bindParam(':user', $data->user);
                $stmt->execute();
                
                echo json_encode(['success' => true]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Xatolik yuz berdi']);
            }
        }
        break;

    case 'history':
        if (isset($_GET['port_id'])) {
            $query = "SELECT * FROM port_history 
                     WHERE port_id = ? 
                     ORDER BY changed_at DESC 
                     LIMIT 10";
            
            $stmt = $db->prepare($query);
            $stmt->bindParam(1, $_GET['port_id']);
            $stmt->execute();
            $history = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode([
                'success' => true,
                'history' => $history
            ]);
        }
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'Noto\'g\'ri so\'rov']);
}
?>