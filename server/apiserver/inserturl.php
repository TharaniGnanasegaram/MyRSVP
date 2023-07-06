
<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['eventidvar']) && isset($data['eventstreamingurl'])) {
        $eventid = $data['eventidvar'];
        $eventstreamingurl = $data['eventstreamingurl'];

        require('db_conn.php');
        
        $db = new DatabaseConnection();
        $event = $db->inserturl($eventid, $eventstreamingurl);

        if ($event) {
            echo json_encode($event);
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