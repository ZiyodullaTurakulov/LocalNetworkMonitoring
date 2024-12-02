<?php
require_once 'config/database.php';
$database = new Database();
$db = $database->getConnection();

// Statistika ma'lumotlarini olish
$stats_query = "SELECT 
    COUNT(*) as total,
    SUM(CASE WHEN status = 'online' THEN 1 ELSE 0 END) as online,
    SUM(CASE WHEN status = 'offline' THEN 1 ELSE 0 END) as offline,
    SUM(CASE WHEN status = 'warning' THEN 1 ELSE 0 END) as warning
    FROM devices";
$stmt = $db->prepare($stats_query);
$stmt->execute();
$stats = $stmt->fetch(PDO::FETCH_ASSOC);

// Qurilmalar ro'yxatini olish
$devices_query = "SELECT * FROM devices ORDER BY last_active DESC";
$stmt = $db->prepare($devices_query);
$stmt->execute();
$devices = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="uz">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tarmoq Monitoring Tizimi</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
    <link rel="stylesheet" href="css/style.css">
</head>
<body class="bg-light">
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary sticky-top">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">
                <i class="bi bi-hdd-network me-2"></i>
                Tarmoq Monitoring
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link active" href="#">
                            <i class="bi bi-house"></i> Bosh sahifa
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="device-add.php">
                            <i class="bi bi-plus-circle"></i> Qurilma qo'shish
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="search.php">
                            <i class="bi bi-search"></i> Qidirish
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Asosiy kontent -->
    <div class="container py-4">
        <!-- Statistika kartochkalari -->
        <div class="row mb-4">
            <div class="col-md-3">
                <div class="card">
                    <div class="card-body">
                        <h6 class="card-subtitle mb-2 text-muted">Jami qurilmalar</h6>
                        <h2 class="card-title mb-0" id="total-devices"><?php echo $stats['total']; ?></h2>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card">
                    <div class="card-body">
                        <h6 class="card-subtitle mb-2 text-muted">Online</h6>
                        <h2 class="card-title mb-0 text-success" id="online-devices">
                            <?php echo $stats['online']; ?>
                        </h2>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card">
                    <div class="card-body">
                        <h6 class="card-subtitle mb-2 text-muted">Offline</h6>
                        <h2 class="card-title mb-0 text-danger" id="offline-devices">
                            <?php echo $stats['offline']; ?>
                        </h2>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card">
                    <div class="card-body">
                        <h6 class="card-subtitle mb-2 text-muted">Ogohlantirish</h6>
                        <h2 class="card-title mb-0 text-warning" id="warning-devices">
                            <?php echo $stats['warning']; ?>
                        </h2>
                    </div>
                </div>
            </div>
        </div>




        <!-- Statistika kartochkalaridan keyin -->
<div class="row mb-4">
    <div class="col-12">
        <div class="card shadow-sm">
            <div class="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 class="mb-0">
                    <i class="bi bi-bell text-warning me-2"></i>
                    Ogohlantirishlar
                    <?php if ($unread_count > 0): ?>
                        <span class="badge bg-danger"><?php echo $unread_count; ?></span>
                    <?php endif; ?>
                </h5>
                <div>
                    <button class="btn btn-sm btn-outline-secondary me-2" onclick="refreshWarnings()">
                        <i class="bi bi-arrow-clockwise"></i> Yangilash
                    </button>
                    <button class="btn btn-sm btn-outline-secondary" onclick="markAllAsRead()">
                        <i class="bi bi-check-all"></i> Barchasini o'qilgan deb belgilash
                    </button>
                </div>
            </div>
            <div class="card-body p-0">
                <div class="list-group list-group-flush" id="warningsList">
                    <!-- Bu yerga JavaScript orqali ogohlantirishlar yuklanadi -->
                </div>
            </div>
        </div>
    </div>
</div>





        <!-- Qurilmalar jadvali -->
        <div class="card shadow-sm">
            <div class="card-header bg-white">
                <h5 class="mb-0">Qurilmalar ro'yxati</h5>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-hover" id="devices-table">
                        <thead>
                            <tr>
                                <th>Qurilma</th>
                                <th>IP manzil</th>
                                <th>MAC manzil</th>
                                <th>Joylashuv</th>
                                <th>Holati</th>
                                <th>Tezlik</th>
                                <th>So'nggi faollik</th>
                                <th>Amallar</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($devices as $device): ?>
                                <tr>
                                    <td>
                                        <div class="d-flex align-items-center">
                                            <i class="bi bi-router me-2"></i>
                                            <div>
                                                <div class="fw-bold"><?php echo $device['name']; ?></div>
                                                <small class="text-muted"><?php echo $device['type']; ?></small>
                                            </div>
                                        </div>
                                    </td>
                                    <td><?php echo $device['ip_address']; ?></td>
                                    <td><small><?php echo $device['mac_address']; ?></small></td>
                                    <td>
                                        <div class="location-info">
                                            <i class="bi bi-geo-alt text-primary"></i>
                                            <span><?php echo $device['location']; ?></span>
                                            <small><?php echo $device['floor']; ?>-qavat</small>
                                            <small><?php echo $device['room']; ?>-xona</small>
                                        </div>
                                    </td>
                                    <td>
                                        <?php
                                        $statusClass = '';
                                        $statusIcon = '';
                                        switch($device['status']) {
                                            case 'online':
                                                $statusClass = 'bg-success';
                                                $statusIcon = 'bi-check-circle';
                                                break;
                                            case 'offline':
                                                $statusClass = 'bg-danger';
                                                $statusIcon = 'bi-x-circle';
                                                break;
                                            case 'warning':
                                                $statusClass = 'bg-warning';
                                                $statusIcon = 'bi-exclamation-triangle';
                                                break;
                                        }
                                        ?>
                                        <span class="badge <?php echo $statusClass; ?>">
                                            <i class="bi <?php echo $statusIcon; ?>"></i>
                                            <?php echo $device['status']; ?>
                                        </span>
                                    </td>
                                    <td>
                                        <div class="d-flex align-items-center">
                                            <div class="progress flex-grow-1" style="width: 100px;">
                                                <div class="progress-bar" style="width: <?php echo ($device['speed'] / 10); ?>%"></div>
                                            </div>
                                            <span class="ms-2"><?php echo $device['speed']; ?> Mb/s</span>
                                        </div>
                                    </td>
                                    <td>
                                        <small><?php echo date('d.m.Y H:i', strtotime($device['last_active'])); ?></small>
                                    </td>
                                    <td>
                                        <div class="btn-group btn-group-sm">
                                            <button class="btn btn-outline-primary" 
                                                    onclick="pingDevice(<?php echo $device['id']; ?>)"
                                                    title="Qurilma bilan aloqani tekshirish">
                                                <i class="bi bi-arrow-repeat"></i>
                                            </button>
                                            <a href="device-details.php?id=<?php echo $device['id']; ?>" 
                                               class="btn btn-outline-secondary"
                                               title="Qurilma haqida to'liq ma'lumot">
                                                <i class="bi bi-info-circle"></i>
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- Toast Container -->
    <div class="toast-container position-fixed bottom-0 end-0 p-3"></div>

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="js/main.js"></script>
    <script src="js/network-monitor.js"></script>
</body>
</html>