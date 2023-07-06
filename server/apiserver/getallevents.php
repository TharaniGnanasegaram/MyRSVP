
<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $data = json_decode(file_get_contents('php://input'), true);

        require('db_conn.php');
        
        $db = new DatabaseConnection();
        $events = $db->getAllEvents();

        if ($events) {
            $jsonData = json_encode($events);

        if ($jsonData === false) {
            $errorMessage = 'JSON encoding error: ' . json_last_error_msg();
            echo $errorMessage;
        } else {
            echo $jsonData;
        }
        } else {
            echo null;
        }
} else {
    echo null;
}
    
?>