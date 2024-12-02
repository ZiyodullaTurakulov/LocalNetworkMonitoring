<?php
require_once 'config/database.php';
$database = new Database();
$db = $database->getConnection();

$id = isset($_GET['id']) ? $_GET['id'] : 0;

// Qurilma ma'lumotlarini olish
$query = "SELECT * FROM devices WHERE id = ?";
$stmt = $db->prepare($query);
$stmt->bindParam(1, $id);
$stmt->execute();
$device = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$device) {
    header("Location: index.php");
    exit;
}

// Qurilmani o'chirish
if (isset($_POST['action']) && $_POST['action'] === 'delete_device') {
    try {
        $db->beginTransaction();
        
        // Port tarixini o'chirish
        $query = "DELETE FROM port_history WHERE port_id IN (SELECT id FROM ports WHERE device_id = ?)";
        $stmt = $db->prepare($query);
        $stmt->execute([$id]);
        
        // Portlarni o'chirish
        $query = "DELETE FROM ports WHERE device_id = ?";
        $stmt = $db->prepare($query);
        $stmt->execute([$id]);
        
        // Qurilmani o'chirish
        $query = "DELETE FROM devices WHERE id = ?";
        $stmt = $db->prepare($query);
        $stmt->execute([$id]);
        
        $db->commit();
        header("Location: index.php?message=device_deleted");
        exit;
    } catch(PDOException $e) {
        $db->rollBack();
        $error = "Xatolik yuz berdi: " . $e->getMessage();
    }
}

// Port ma'lumotlarini tahrirlash
if (isset($_POST['action']) && $_POST['action'] === 'edit_port') {
    try {
        $query = "UPDATE ports SET 
            ip_address = ?,
            mac_address = ?,
            status = ?,
            speed = ?,
            user = ?,
            cable_type = ?,
            cable_length = ?,
            vlan = ?
            WHERE id = ? AND device_id = ?";
            
        $stmt = $db->prepare($query);
        $stmt->execute([
            $_POST['ip_address'] ?: null,
            $_POST['mac_address'] ?: null,
            $_POST['status'],
            $_POST['speed'],
            $_POST['user'] ?: null,
            $_POST['cable_type'] ?: null,
            $_POST['cable_length'] ?: null,
            $_POST['vlan'] ?: null,
            $_POST['port_id'],
            $id
        ]);
        
        // Port statistikasini yangilash
        $activePortsCount = $db->query("SELECT COUNT(*) FROM ports WHERE device_id = $id AND status = 'Active'")->fetchColumn();
        $query = "UPDATE devices SET used_ports = ?, free_ports = ? WHERE id = ?";
        $stmt = $db->prepare($query);
        $stmt->execute([$activePortsCount, $device['total_ports'] - $activePortsCount, $id]);
        
        header("Location: device-details.php?id=$id&message=port_updated");
        exit;
    } catch(PDOException $e) {
        $error = "Xatolik yuz berdi: " . $e->getMessage();
    }
}

// Portlar ro'yxatini olish
$query = "SELECT * FROM ports WHERE device_id = ? ORDER BY port_number";
$stmt = $db->prepare($query);
$stmt->bindParam(1, $id);
$stmt->execute();
$ports = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>


<!DOCTYPE html>
<html lang="uz">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($device['name']); ?> - Qurilma ma'lumotlari</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
    <style>
        .status-indicator {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            display: inline-block;
            margin-right: 5px;
        }
        .status-online { background-color: #198754; }
        .status-offline { background-color: #dc3545; }
        .status-warning { background-color: #ffc107; }
    </style>
</head>
<body class="bg-light">
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary sticky-top">
        <div class="container-fluid">
            <a class="navbar-brand" href="index.php">
                <i class="bi bi-hdd-network me-2"></i>
                Tarmoq Monitoring
            </a>
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
        <!-- Qurilma ma'lumotlari -->
        <div class="row mb-4">
            <div class="col-md-8">
                <div class="card shadow-sm">
                    <div class="card-header bg-white d-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center">
                            <h5 class="mb-0 me-3">Qurilma ma'lumotlari</h5>
                            <span class="badge <?php echo $device['status'] === 'online' ? 'bg-success' : 'bg-danger'; ?>">
                                <i class="bi <?php echo $device['status'] === 'online' ? 'bi-check-circle' : 'bi-x-circle'; ?>"></i>
                                <?php echo $device['status']; ?>
                            </span>
                        </div>
                        <div>
                            <button class="btn btn-sm btn-primary me-2" onclick="pingDevice(<?php echo $id; ?>)">
                                <i class="bi bi-arrow-repeat"></i> Ping
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="confirmDelete(<?php echo $id; ?>)">
                                <i class="bi bi-trash"></i> O'chirish
                            </button>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6">
                                <table class="table">
                                    <tr>
                                        <th>Nomi:</th>
                                        <td><?php echo htmlspecialchars($device['name']); ?></td>
                                    </tr>
                                    <tr>
                                        <th>Turi:</th>
                                        <td><?php echo htmlspecialchars($device['type']); ?></td>
                                    </tr>
                                    <tr>
                                        <th>IP manzil:</th>
                                        <td><?php echo htmlspecialchars($device['ip_address']); ?></td>
                                    </tr>
                                    <tr>
                                        <th>MAC manzil:</th>
                                        <td><?php echo htmlspecialchars($device['mac_address']); ?></td>
                                    </tr>
                                </table>
                            </div>
                            <div class="col-md-6">
                                <table class="table">
                                    <tr>
                                        <th>Joylashuv:</th>
                                        <td><?php echo htmlspecialchars($device['location']); ?></td>
                                    </tr>
                                    <tr>
                                        <th>Qavat:</th>
                                        <td><?php echo $device['floor']; ?></td>
                                    </tr>
                                    <tr>
                                        <th>Xona:</th>
                                        <td><?php echo htmlspecialchars($device['room']); ?></td>
                                    </tr>
                                    <tr>
                                        <th>So'nggi faollik:</th>
                                        <td><?php echo date('d.m.Y H:i', strtotime($device['last_active'])); ?></td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card shadow-sm">
                    <div class="card-header bg-white">
                        <h5 class="mb-0">Port statistikasi</h5>
                    </div>
                    <div class="card-body">
                        <canvas id="portStatsChart"></canvas>
                        <div class="mt-3">
                            <div class="d-flex justify-content-between mb-2">
                                <small>Jami portlar:</small>
                                <small data-stat="total"><?php echo $device['total_ports']; ?></small>
                            </div>
                            <div class="d-flex justify-content-between mb-2">
                                <small>Faol portlar:</small>
                                <small data-stat="active"><?php echo $device['used_ports']; ?></small>
                            </div>
                            <div class="d-flex justify-content-between">
                                <small>Bo'sh portlar:</small>
                                <small data-stat="inactive"><?php echo $device['free_ports']; ?></small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Portlar jadvali -->
        <div class="card shadow-sm">
            <div class="card-header bg-white">
                <h5 class="mb-0">Portlar</h5>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>Port</th>
                                <th>IP manzil</th>
                                <th>MAC manzil</th>
                                <th>Holat</th>
                                <th>Tezlik</th>
                                <th>Foydalanuvchi</th>
                                <th>Kabel</th>
                                <th>VLAN</th>
                                <th>Amallar</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($ports as $port): ?>
                                <tr>
                                    <td><?php echo $port['port_number']; ?></td>
                                    <td>
                                        <?php if ($port['ip_address']): ?>
                                            <?php echo $port['ip_address']; ?>
                                        <?php else: ?>
                                            <small class="text-muted">Kiritilmagan</small>
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <?php if ($port['mac_address']): ?>
                                            <small><?php echo $port['mac_address']; ?></small>
                                        <?php else: ?>
                                            <small class="text-muted">Kiritilmagan</small>
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <span class="badge <?php 
                                            echo $port['status'] == 'Active' ? 'bg-success' : 
                                                ($port['status'] == 'Error' ? 'bg-danger' : 'bg-secondary'); 
                                        ?>">
                                            <?php echo $port['status']; ?>
                                        </span>
                                    </td>
                                    <td><?php echo $port['speed']; ?> Mb/s</td>
                                    <td><?php echo $port['user']; ?></td>
                                    <td>
                                        <?php if ($port['cable_type']): ?>
                                            <?php echo $port['cable_type']; ?>
                                            <small class="text-muted">(<?php echo $port['cable_length']; ?>m)</small>
                                        <?php endif; ?>
                                    </td>
                                    <td><?php echo $port['vlan']; ?></td>
                                    <td>
                                        <button type="button" class="btn btn-sm btn-outline-primary"
                                                onclick="editPort(<?php echo htmlspecialchars(json_encode($port)); ?>)">
                                            <i class="bi bi-pencil"></i>
                                        </button>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- Port tahrirlash modali -->
    <div class="modal fade" id="portModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Port ma'lumotlarini tahrirlash</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <form method="POST">
                    <div class="modal-body">
                        <!-- Modal body dinamik ravishda JavaScript orqali to'ldiriladi -->
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Bekor qilish</button>
                        <button type="submit" class="btn btn-primary">Saqlash</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Toast Container -->
    <div class="toast-container position-fixed bottom-0 end-0 p-3"></div>

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="js/device-details.js"></script>
</body>
</html>