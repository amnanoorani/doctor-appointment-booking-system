<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM doctors ORDER BY id DESC");
    $doctors = $stmt->fetchAll();
    echo json_encode(["status" => "success", "data" => $doctors]);
} 
elseif ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    if (isset($data->name) && isset($data->specialization) && isset($data->experience)) {
        $stmt = $pdo->prepare("INSERT INTO doctors (name, specialization, experience) VALUES (?, ?, ?)");
        if ($stmt->execute([$data->name, $data->specialization, $data->experience])) {
            $data->id = $pdo->lastInsertId();
            echo json_encode(["status" => "success", "message" => "Doctor added", "data" => $data]);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to add doctor"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Incomplete data"]);
    }
}
elseif ($method === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"));
    if (isset($data->id)) {
        $stmt = $pdo->prepare("DELETE FROM doctors WHERE id = ?");
        if ($stmt->execute([$data->id])) {
            echo json_encode(["status" => "success", "message" => "Doctor removed"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to remove doctor"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Doctor ID required"]);
    }
}
?>
