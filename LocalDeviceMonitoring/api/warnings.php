<?php
header('Content-Type: application/json');
require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

// GET so'rovlari uchun
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['action']) && $_GET['action'] === 'list') {
        try {
            // Ogohlantirishlarni olish
            $query = "SELECT 
                w.id,
                w.device_id,
                w.reason,
                w.created_at,
                w.is_read,
                w.is_resolved,
                d.name as device_name,
                d.type as device_type,
                d.location,
                d.floor,
                d.room
            FROM warning_history w
            JOIN devices d ON w.device_id = d.id
            WHERE w.is_resolved = 0
            ORDER BY w.created_at DESC
            LIMIT 10";
            
            $stmt = $db->prepare($query);
            $stmt->execute();
            $warnings = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // O'qilmagan ogohlantirishlar sonini olish
            $query = "SELECT COUNT(*) FROM warning_history WHERE is_read = 0 AND is_resolved = 0";
            $stmt = $db->prepare($query);
            $stmt->execute();
            $unread_count = $stmt->fetchColumn();
            
            // Sana formatini o'zgartirish
            foreach ($warnings as &$warning) {
                $warning['created_at'] = date('d.m.Y H:i', strtotime($warning['created_at']));
            }
            
            echo json_encode([
                'success' => true,
                'warnings' => $warnings,
                'unread_count' => $unread_count
            ]);
        } catch (PDOException $e) {
            echo json_encode([
                'success' => false,
                'message' => 'Xatolik yuz berdi: ' . $e->getMessage()
            ]);
        }
    }
}

// POST so'rovlari uchun
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (isset($data['action'])) {
        try {
            switch ($data['action']) {
                case 'resolve':
                    if (!isset($data['warning_id'])) {
                        throw new Exception('Ogohlantirish ID si ko\'rsatilmagan');
                    }
                    
                    $db->beginTransaction();
                    
                    // Ogohlantirishni hal qilindi deb belgilash
                    $query = "UPDATE warning_history 
                             SET is_resolved = 1, 
                                 resolved_at = NOW(),
                                 resolved_by = ? 
                             WHERE id = ?";
                    $stmt = $db->prepare($query);
                    $stmt->execute([$_SESSION['user_name'] ?? 'System', $data['warning_id']]);
                    
                    // Qurilma statusini tekshirish va yangilash
                    $query = "SELECT device_id FROM warning_history WHERE id = ?";
                    $stmt = $db->prepare($query);
                    $stmt->execute([$data['warning_id']]);
                    $device_id = $stmt->fetchColumn();
                    
                    if ($device_id) {
                        // Agar boshqa hal qilinmagan ogohlantirishlar bo'lmasa
                        $query = "SELECT COUNT(*) FROM warning_history 
                                 WHERE device_id = ? AND is_resolved = 0";
                        $stmt = $db->prepare($query);
                        $stmt->execute([$device_id]);
                        
                        if ($stmt->fetchColumn() == 0) {
                            // Qurilma statusini yangilash
                            $query = "UPDATE devices 
                                     SET status = 'online',
                                         warning_count = warning_count - 1 
                                     WHERE id = ?";
                            $stmt = $db->prepare($query);
                            $stmt->execute([$device_id]);
                        }
                    }
                    
                    $db->commit();
                    echo json_encode(['success' => true]);
                    break;
                    
                case 'mark_read':
                    if (!isset($data['warning_id'])) {
                        throw new Exception('Ogohlantirish ID si ko\'rsatilmagan');
                    }
                    
                    $query = "UPDATE warning_history SET is_read = 1 WHERE id = ?";
                    $stmt = $db->prepare($query);
                    $stmt->execute([$data['warning_id']]);
                    
                    echo json_encode(['success' => true]);
                    break;
                    
                case 'mark_all_read':
                    $query = "UPDATE warning_history SET is_read = 1 WHERE is_resolved = 0";
                    $stmt = $db->prepare($query);
                    $stmt->execute();
                    
                    echo json_encode(['success' => true]);
                    break;
                    
                case 'add':
                    if (!isset($data['device_id']) || !isset($data['reason'])) {
                        throw new Exception('Kerakli ma\'lumotlar to\'liq emas');
                    }
                    
                    $db->beginTransaction();
                    
                    // Yangi ogohlantirish qo'shish
                    $query = "INSERT INTO warning_history (device_id, reason, created_at) 
                             VALUES (?, ?, NOW())";
                    $stmt = $db->prepare($query);
                    $stmt->execute([$data['device_id'], $data['reason']]);
                    
                    // Qurilma statusini yangilash
                    $query = "UPDATE devices 
                             SET status = 'warning',
                                 last_warning_at = NOW(),
                                 warning_count = warning_count + 1 
                             WHERE id = ?";
                    $stmt = $db->prepare($query);
                    $stmt->execute([$data['device_id']]);
                    
                    $db->commit();
                    echo json_encode(['success' => true]);
                    break;
                    
                default:
                    throw new Exception('Noto\'g\'ri so\'rov');
            }
        } catch (Exception $e) {
            if ($db->inTransaction()) {
                $db->rollBack();
            }
            echo json_encode([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        }
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'So\'rov parametrlari topilmadi'
        ]);
    }
}