<?php
require_once 'config/database.php';
$database = new Database();
$db = $database->getConnection();

// MAC manzilni aniqlash funksiyasi
function getMacAddress($ip) {
    if (strtoupper(substr(PHP_OS, 0, 3)) !== 'WIN') {
        exec("ping -c 1 " . escapeshellarg($ip), $ping_output, $ping_result);
        if ($ping_result == 0) {
            exec("arp -n " . escapeshellarg($ip), $arp_output);
            foreach ($arp_output as $line) {
                if (strpos($line, $ip) !== false) {
                    preg_match('/([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})/', $line, $matches);
                    if (isset($matches[0])) {
                        return strtoupper($matches[0]);
                    }
                }
            }
        }
    } else {
        exec("ping -n 1 " . escapeshellarg($ip), $ping_output, $ping_result);
        if ($ping_result == 0) {
            exec("arp -a " . escapeshellarg($ip), $arp_output);
            foreach ($arp_output as $line) {
                if (strpos($line, $ip) !== false) {
                    preg_match('/([0-9A-Fa-f]{2}-){5}([0-9A-Fa-f]{2})/', $line, $matches);
                    if (isset($matches[0])) {
                        return str_replace('-', ':', strtoupper($matches[0]));
                    }
                }
            }
        }
    }
    return false;
}

// IP manzilni aniqlash funksiyasi
function getIpAddress($mac) {
    if (strtoupper(substr(PHP_OS, 0, 3)) !== 'WIN') {
        exec("arp -an", $arp_output);
        foreach ($arp_output as $line) {
            if (stripos($line, $mac) !== false) {
                preg_match('/\(([\d\.]+)\)/', $line, $matches);
                if (isset($matches[1])) {
                    return $matches[1];
                }
            }
        }
    } else {
        exec("arp -a", $arp_output);
        foreach ($arp_output as $line) {
            if (stripos($line, str_replace(':', '-', $mac)) !== false) {
                preg_match('/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/', $line, $matches);
                if (isset($matches[1])) {
                    return $matches[1];
                }
            }
        }
    }
    return false;
}

// AJAX so'rovlarini qayta ishlash
if (isset($_POST['action'])) {
    header('Content-Type: application/json');
    
    switch($_POST['action']) {
        case 'get_mac':
            $ip = $_POST['ip'];
            $mac = getMacAddress($ip);
            
            if ($mac) {
                echo json_encode(['success' => true, 'mac' => $mac]);
            } else {
                echo json_encode(['success' => false, 'message' => 'MAC manzilni aniqlab bo\'lmadi']);
            }
            exit;
            
        case 'get_ip':
            $mac = $_POST['mac'];
            $ip = getIpAddress($mac);
            
            if ($ip) {
                echo json_encode(['success' => true, 'ip' => $ip]);
            } else {
                echo json_encode(['success' => false, 'message' => 'IP manzilni aniqlab bo\'lmadi']);
            }
            exit;
    }
}

// Yangi qurilma qo'shish
if ($_SERVER['REQUEST_METHOD'] === 'POST' && !isset($_POST['action'])) {
    try {
        $query = "INSERT INTO devices (
            name, type, ip_address, mac_address, 
            location, floor, room, total_ports
        ) VALUES (
            :name, :type, :ip_address, :mac_address,
            :location, :floor, :room, :total_ports
        )";
        
        $stmt = $db->prepare($query);
        
        $stmt->bindParam(':name', $_POST['name']);
        $stmt->bindParam(':type', $_POST['type']);
        $stmt->bindParam(':ip_address', $_POST['ip_address']);
        $stmt->bindParam(':mac_address', $_POST['mac_address']);
        $stmt->bindParam(':location', $_POST['location']);
        $stmt->bindParam(':floor', $_POST['floor']);
        $stmt->bindParam(':room', $_POST['room']);
        $stmt->bindParam(':total_ports', $_POST['total_ports']);
        
        if ($stmt->execute()) {
            $device_id = $db->lastInsertId();
            
            // Portlarni yaratish
            $ports_query = "INSERT INTO ports (device_id, port_number) VALUES (:device_id, :port_number)";
            $ports_stmt = $db->prepare($ports_query);
            
            for ($i = 1; $i <= $_POST['total_ports']; $i++) {
                $ports_stmt->bindParam(':device_id', $device_id);
                $ports_stmt->bindParam(':port_number', $i);
                $ports_stmt->execute();
            }
            
            header("Location: device-details.php?id=" . $device_id);
            exit;
        }
    } catch(PDOException $e) {
        $error = "Xatolik yuz berdi: " . $e->getMessage();
    }
}
?>

<!DOCTYPE html>
<html lang="uz">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Yangi qurilma qo'shish</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
    <link rel="stylesheet" href="css/style.css">
</head>
<body class="bg-light">
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary sticky-top">
        <div class="container-fluid">
            <a class="navbar-brand" href="index.php">
                <i class="bi bi-hdd-network me-2"></i>
                Tarmoq Monitoring
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="index.php">
                            <i class="bi bi-house"></i> Bosh sahifa
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Asosiy kontent -->
    <div class="container py-4">
        <div class="card shadow-sm">
            <div class="card-header bg-white">
                <h5 class="mb-0">Yangi qurilma qo'shish</h5>
            </div>
            <div class="card-body">
                <?php if (isset($error)): ?>
                    <div class="alert alert-danger">
                        <?php echo $error; ?>
                    </div>
                <?php endif; ?>

                <form method="POST" action="">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Qurilma nomi</label>
                            <input type="text" name="name" class="form-control" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Qurilma turi</label>
                            <input type="text" name="type" class="form-control" required>
                            </input>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label">IP manzil</label>
                            <div class="input-group">
                                <input type="text" name="ip_address" id="ip_address" class="form-control" 
                                       pattern="\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}" 
                                       placeholder="192.168.1.1" required>
                                <button type="button" class="btn btn-outline-primary" id="getMacBtn">
                                    <i class="bi bi-arrow-repeat"></i> MAC ni aniqlash
                                </button>
                            </div>
                            <div id="ipStatus" class="form-text"></div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">MAC manzil</label>
                            <div class="input-group">
                                <input type="text" name="mac_address" id="mac_address" class="form-control" 
                                       pattern="([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})"
                                       placeholder="00:11:22:33:44:55" required>
                                <button type="button" class="btn btn-outline-primary" id="getIpBtn">
                                    <i class="bi bi-arrow-repeat"></i> IP ni aniqlash
                                </button>
                            </div>
                            <div id="macStatus" class="form-text"></div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-4 mb-3">
                            <label class="form-label">Joylashuv</label>
                            <input type="text" name="location" class="form-control" required>
                        </div>
                        <div class="col-md-4 mb-3">
                            <label class="form-label">Qavat</label>
                            <input type="number" name="floor" class="form-control" min="1" required>
                        </div>
                        <div class="col-md-4 mb-3">
                            <label class="form-label">Xona</label>
                            <input type="text" name="room" class="form-control" required>
                        </div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Portlar soni</label>
                        <input type="number" name="total_ports" class="form-control" min="1" required>
                    </div>

                    <div class="d-flex justify-content-end">
                        <a href="index.php" class="btn btn-secondary me-2">Bekor qilish</a>
                        <button type="submit" class="btn btn-primary">Saqlash</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="js/device-add.js"></script>
</body>
</html>