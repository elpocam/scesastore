<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$host = "localhost";
$user = "root";
$pass = "";
$db   = "securezone";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Error de conexión"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$nombre   = $data['nombre'];
$apellido = $data['apellido'];
$email    = $data['email'];
$telefono = $data['tel'] ?? '';
$password = password_hash($data['pass'], PASSWORD_DEFAULT);
$promo    = $data['wantsPromo'] ? 1 : 0;

// Verificar si el email ya existe
$check = $conn->prepare("SELECT id FROM usuarios WHERE email = ?");
$check->bind_param("s", $email);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "El correo ya está registrado"]);
    $check->close();
    $conn->close();
    exit;
}
$check->close();

// Insertar nuevo usuario
$stmt = $conn->prepare("INSERT INTO usuarios (nombre, apellido, email, telefono, password, wants_promo) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sssssi", $nombre, $apellido, $email, $telefono, $password, $promo);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true, 
        "message" => "Registro exitoso",
        "user" => [
            "nombre" => $nombre,
            "apellido" => $apellido,
            "email" => $email,
            "discount" => 15
        ]
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Error al registrar: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>