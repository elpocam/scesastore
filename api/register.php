<?php
/* ══════════════════════════════
   scesa store — register.php
   Registro seguro con MySQL
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

// Sanitizar y validar campos requeridos
$nombre   = trim($data['nombre']   ?? '');
$apellido = trim($data['apellido'] ?? '');
$email    = strtolower(trim($data['email'] ?? ''));
$telefono = trim($data['tel']      ?? '');
$pass     = $data['pass']          ?? '';
$promo    = !empty($data['wantsPromo']) ? 1 : 0;
$discount = 15; // descuento fijo para usuarios registrados

// Validaciones
if (empty($nombre) || strlen($nombre) < 2) {
    echo json_encode(["success" => false, "message" => "Nombre inválido (mínimo 2 caracteres)"]);
    $conn->close();
    exit;
}

if (empty($apellido) || strlen($apellido) < 2) {
    echo json_encode(["success" => false, "message" => "Apellido inválido (mínimo 2 caracteres)"]);
    $conn->close();
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["success" => false, "message" => "Correo electrónico inválido"]);
    $conn->close();
    exit;
}

if (strlen($pass) < 6) {
    echo json_encode(["success" => false, "message" => "La contraseña debe tener al menos 6 caracteres"]);
    $conn->close();
    exit;
}

// Hash seguro de la contraseña
$passwordHash = password_hash($pass, PASSWORD_DEFAULT);

/* ── Verificar si el email ya existe ── */
$check = $conn->prepare("SELECT id FROM usuarios WHERE email = ?");
$check->bind_param("s", $email);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Este correo ya está registrado"]);
    $check->close();
    $conn->close();
    exit;
}
$check->close();

/* ── Insertar nuevo usuario ── */
$stmt = $conn->prepare(
    "INSERT INTO usuarios (nombre, apellido, email, telefono, password, wants_promo, discount)
     VALUES (?, ?, ?, ?, ?, ?, ?)"
);
$stmt->bind_param("sssssii", $nombre, $apellido, $email, $telefono, $passwordHash, $promo, $discount);

if ($stmt->execute()) {
    $newId = $conn->insert_id;
    echo json_encode([
        "success" => true,
        "message" => "Registro exitoso",
        "user"    => [
            "id"       => $newId,
            "nombre"   => $nombre,
            "apellido" => $apellido,
            "email"    => $email,
            "telefono" => $telefono,
            "discount" => $discount
        ]
    ]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error al crear la cuenta. Inténtalo de nuevo."]);
}

$stmt->close();
$conn->close();
?>
