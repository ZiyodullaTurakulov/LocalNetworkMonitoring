<?php
require_once '../config/database.php';

class SpeedTest {
    private $device_ip;
    private $test_file_size = 1000000; // 1MB
    private $test_file_url;
    
    public function __construct($ip) {
        $this->device_ip = $ip;
        $this->test_file_url = "http://" . $ip . "/speedtest.txt";
    }
    
    public function measureDownloadSpeed() {
        $starttime = microtime(true);
        @file_get_contents($this->test_file_url);
        $endtime = microtime(true);
        
        $duration = ($endtime - $starttime);
        if ($duration > 0) {
            // Convert to Mbps (Megabits per second)
            return round(($this->test_file_size * 8 / 1000000) / $duration, 2);
        }
        return 0;
    }
    
    public function measureUploadSpeed() {
        $data = str_repeat('X', $this->test_file_size);
        $starttime = microtime(true);
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $this->test_file_url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        curl_exec($ch);
        curl_close($ch);
        
        $endtime = microtime(true);
        $duration = ($endtime - $starttime);
        
        if ($duration > 0) {
            return round(($this->test_file_size * 8 / 1000000) / $duration, 2);
        }
        return 0;
    }
    
    public function measurePing() {
        $starttime = microtime(true);
        $ping = exec("ping -c 1 " . $this->device_ip);
        $endtime = microtime(true);
        
        return round(($endtime - $starttime) * 1000, 2); // Convert to milliseconds
    }
    
    public function runTest() {
        return [
            'download' => $this->measureDownloadSpeed(),
            'upload' => $this->measureUploadSpeed(),
            'ping' => $this->measurePing()
        ];
    }
}

// Ma'lumotlar bazasi ulanishini yaratish
$database = new Database();
$db = $database->getConnection();

try {
    // Online qurilmalarni olish
    $query = "SELECT id, ip_address FROM devices WHERE status = 'online'";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $devices = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $results = [];
    foreach ($devices as $device) {
        // Har bir qurilma uchun tezlikni o'lchash
        $speedTest = new SpeedTest($device['ip_address']);
        $speed_data = $speedTest->runTest();
        
        // Ma'lumotlar bazasini yangilash
        $update_query = "UPDATE devices SET 
                        download_speed = :download,
                        upload_speed = :upload,
                        ping = :ping,
                        last_speed_check = NOW() 
                        WHERE id = :id";
                        
        $update_stmt = $db->prepare($update_query);
        $update_stmt->bindParam(":download", $speed_data['download']);
        $update_stmt->bindParam(":upload", $speed_data['upload']);
        $update_stmt->bindParam(":ping", $speed_data['ping']);
        $update_stmt->bindParam(":id", $device['id']);
        $update_stmt->execute();
        
        $results[] = [
            'id' => $device['id'],
            'speeds' => $speed_data
        ];
        
        // Xatoliklarni tekshirish va ogohlantirishlar yaratish
        if ($speed_data['download'] < 1.0 || $speed_data['upload'] < 1.0) {
            $warning_query = "INSERT INTO warnings (device_id, type, message, created_at) 
                            VALUES (:device_id, 'speed', 'Past tezlik aniqlandi', NOW())";
            $warning_stmt = $db->prepare($warning_query);
            $warning_stmt->bindParam(":device_id", $device['id']);
            $warning_stmt->execute();
        }
    }
    
    echo json_encode([
        'success' => true,
        'data' => $results
    ]);
    
} catch (PDOException $e) {
    // Xatolikni log faylga yozish
    error_log(date('Y-m-d H:i:s') . " - Speed Test Error: " . $e->getMessage() . "\n", 
              3, 
              "../logs/speedtest_errors.log");
              
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>