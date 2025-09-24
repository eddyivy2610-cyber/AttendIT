<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *"); // Allow frontend requests
require_once '../config.php';

try {
    $query = "SELECT * FROM _student information";
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    
    $students = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        "success" => true,
        "data" => $students
    ]);
} catch(PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
?>