<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$action = isset($_GET['action']) ? $_GET['action'] : '';
$id = isset($_GET['id']) ? $_GET['id'] : '';

switch($action) {
    case 'list':
        $query = "SELECT * FROM devices ORDER BY id DESC";
        $stmt = $db->prepare($query);
        $stmt->execute();
        
        $devices = array();
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $device_item = array(
                "id" => $row['id'],
                "name" => $row['name'],
                "type" => $row['type'],
                "ipAddress" => $row['ip_address'],
                "macAddress" => $row['mac_address'],
                "status" => $row['status'],
                "speed" => $row['speed'],
                "location" => $row['location'],
                "floor" => $row['floor'],
                "room" => $row['room'],
                "lastActive" => $row['last_active']
            );
            array_push($devices, $device_item);
        }
        
        echo json_encode($devices);
        break;

    case 'details':
        if(!empty($id)) {
            // Qurilma asosiy ma'lumotlari
            $query = "SELECT * FROM devices WHERE id = ?";
            $stmt = $db->prepare($query);
            $stmt->bindParam(1, $id);
            $stmt->execute();
            
            $device = $stmt->fetch(PDO::FETCH_ASSOC);
            
            // Qurilma portlari
            $query = "SELECT * FROM ports WHERE device_id = ?";
            $stmt = $db->prepare($query);
            $stmt->bindParam(1, $id);
            $stmt->execute();
            
            $ports = array();
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $port_item = array(
                    "number" => $row['port_number'],
                    "status" => $row['status'],
                    "speed" => $row['speed'],
                    "user" => $row['user'],
                    "cableType" => $row['cable_type'],
                    "cableLength" => $row['cable_length'],
                    "vlan" => $row['vlan'],
                    "lastActivity" => $row['last_activity']
                );
                array_push($ports, $port_item);
            }
            
            $result = array(
                "id" => $device['id'],
                "name" => $device['name'],
                "type" => $device['type'],
                "ip" => $device['ip_address'],
                "mac" => $device['mac_address'],
                "status" => $device['status'],
                "totalPorts" => $device['total_ports'],
                "usedPorts" => $device['used_ports'],
                "freePorts" => $device['free_ports'],
                "ports" => $ports
            );
            
            echo json_encode($result);
        }
        break;
}
?>