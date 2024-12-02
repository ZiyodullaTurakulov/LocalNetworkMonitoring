<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->id)) {
    $query = "UPDATE devices SET 
              name = ?, type = ?, ip_address = ?, mac_address = ?,
              location = ?, floor = ?, room = ?
              WHERE id = ?";
              
    $stmt = $db->prepare($query);
    $stmt->bindParam(1, $data->name);
    $stmt->bindParam(2, $data->type);
    $stmt->bindParam(3, $data->ipAddress);
    $stmt->bindParam(4, $data->macAddress);
    $stmt->bindParam(5, $data->location);
    $stmt->bindParam(6, $data->floor);
    $stmt->bindParam(7, $data->room);
    $stmt->bindParam(8, $data->id);
    
    if($stmt->execute()) {
        echo json_encode(array("message" => "Ma'lumotlar yangilandi"));
    } else {
        echo json_encode(array("message" => "Xatolik yuz berdi"));
    }
}
?>