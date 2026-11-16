<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    if (isset($_GET['patient_id'])) {
        $stmt = $pdo->prepare("SELECT * FROM appointments WHERE patient_id = ? ORDER BY id DESC");
        $stmt->execute([$_GET['patient_id']]);
    } else {
        $stmt = $pdo->query("SELECT * FROM appointments ORDER BY id DESC");
    }
    $appointments = $stmt->fetchAll();
    echo json_encode(["status" => "success", "data" => $appointments]);
} 
elseif ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    if (isset($data->patient_id) && isset($data->patient_name) && isset($data->doctor_name) && isset($data->reason) && isset($data->appointment_date)) {
        $stmt = $pdo->prepare("INSERT INTO appointments (patient_id, patient_name, doctor_name, reason, appointment_date) VALUES (?, ?, ?, ?, ?)");
        if ($stmt->execute([$data->patient_id, $data->patient_name, $data->doctor_name, $data->reason, $data->appointment_date])) {
            echo json_encode(["status" => "success", "message" => "Appointment booked successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to book appointment"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Incomplete data"]);
    }
}
elseif ($method === 'PUT') {
    $data = json_decode(file_get_contents("php://input"));
    if (isset($data->id) && isset($data->status)) {
        $stmt = $pdo->prepare("UPDATE appointments SET status = ? WHERE id = ?");
        if ($stmt->execute([$data->status, $data->id])) {
            echo json_encode(["status" => "success", "message" => "Appointment updated"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to update appointment"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Incomplete data"]);
    }
}
?>
