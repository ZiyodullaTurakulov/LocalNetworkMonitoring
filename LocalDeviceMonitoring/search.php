<?php
require_once 'config/database.php';
$database = new Database();
$db = $database->getConnection();

$search = isset($_GET['q']) ? $_GET['q'] : '';
$devices = array();

if (!empty($search)) {
    $query = "SELECT * FROM devices 
              WHERE name LIKE :search 
              OR ip_address LIKE :search 
              OR mac_address LIKE :search 
              OR location LIKE :search";
    
    $stmt = $db->prepare($query);
    $searchTerm = "%{$search}%";
    $stmt->bindParam(':search', $searchTerm);
    $stmt->execute();
    $devices = $stmt->fetchAll(PDO::FETCH_ASSOC);
}
?>

<!DOCTYPE html>
<html lang="uz">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Qurilmalarni Qidirish</title>
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
                <h5 class="mb-0"><i class="bi bi-search"></i> Qurilmalarni Qidirish</h5>
            </div>
            <div class="card-body">
                <form method="GET" action="" class="mb-4">
                    <div class="input-group">
                        <input type="text" name="q" class="form-control" 
                               placeholder="Qurilma nomi, IP manzil yoki joylashuv bo'yicha qidiring..." 
                               value="<?php echo htmlspecialchars($search); ?>">
                        <button type="submit" class="btn btn-primary">
                            <i class="bi bi-search"></i> Qidirish
                        </button>
                    </div>
                </form>

                <?php if (!empty($search)): ?>
                    <?php if (count($devices) > 0): ?>
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead class="table-light">
                                    <tr>
                                        <th>Qurilma Nomi</th>
                                        <th>IP Manzil</th>
                                        <th>MAC Manzil</th>
                                        <th>Joylashuvi</th>
                                        <th>Holati</th>
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
                                                <div class="btn-group btn-group-sm">
                                                    <a href="device-details.php?id=<?php echo $device['id']; ?>" 
                                                       class="btn btn-outline-secondary">
                                                        <i class="bi bi-info-circle"></i>
                                                    </a>
                                                </div>
                                            </td>
                                        </tr>
                                    <?php endforeach; ?>
                                </tbody>
                            </table>
                        </div>
                    <?php else: ?>
                        <div class="alert alert-info">
                            <i class="bi bi-info-circle"></i>
                            Hech qanday qurilma topilmadi.
                        </div>
                    <?php endif; ?>
                <?php endif; ?>
            </div>
        </div>
    </div>

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>