<?php
/* ══════════════════════════════
   scesa store — login.php
   Login seguro con MySQL
══════════════════════════════ */

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Manejar preflight CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Solo aceptar POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Método no permitido"]);
    exit;
}

/* ── Conexión ── */
$conn = new mysqli("localhost", "root", "", "scesa_store");
$conn->set_charset("utf8mb4");

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error de conexión al servidor"]);
    exit;
}

/* ── Leer y validar body ── */
$raw  = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "Datos inválidos"]);
    $conn->close();
    exit;
}

$email    = strtolower(trim($data['email']    ?? ''));
$password = $data['password'] ?? '';

// Validaciones básicas
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["success" => false, "message" => "Correo electrónico inválido"]);
    $conn->close();
    exit;
}

if (empty($password)) {
    echo json_encode(["success" => false, "message" => "La contraseña es requerida"]);
    $conn->close();
    exit;
}

/* ── Buscar usuario ── */
$stmt = $conn->prepare(
    "SELECT id, nombre, apellido, email, telefono, password, discount
     FROM usuarios
     WHERE email = ?
     LIMIT 1"
);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    // Mensaje genérico para no revelar si el email existe
    echo json_encode(["success" => false, "message" => "Correo o contraseña incorrectos"]);
    $stmt->close();
    $conn->close();
    exit;
}

$user = $result->fetch_assoc();

if (password_verify($password, $user['password'])) {
    unset($user['password']); // Nunca enviar el hash al cliente
    // Asegurar que discount sea entero
    $user['discount'] = (int)($user['discount'] ?? 15);

    echo json_encode([
        "success" => true,
        "message" => "Login exitoso",
        "user"    => $user
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Correo o contraseña incorrectos"]);
}

$stmt->close();
$conn->close();
?>
