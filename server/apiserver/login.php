
<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['username']) && isset($data['password'])) {
        $username = $data['username'];
        $password = $data['password'];

        require('db_conn.php');
        
        $db = new DatabaseConnection();
        $user = $db->loginUser($username, $password);

        if ($user) {
            echo json_encode($user);
        } else {
            echo json_encode("false");
        }
    } else {
        echo json_encode("false");
    }
} else {
    echo json_encode("false");
}
    
?>