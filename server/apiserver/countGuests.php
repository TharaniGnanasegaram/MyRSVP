
<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['eventid']) ) {
        $eventid = $data['eventid'];

        require('db_conn.php');
        
        $db = new DatabaseConnection();
        $countis = $db->countGuests($eventid);

        if ($countis) {
            echo json_encode($countis);
        } else {
            echo json_encode("0");
        }
    } else {
        echo json_encode("0");
    }
} else {
    echo json_encode("0");
}
    
?>