
<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['eventname']) && isset($data['eventdate'])  && isset($data['startdatetime']) && isset($data['enddatetime']) && isset($data['customname']) && isset($data['eventemail']) ) {
        $eventname = $data['eventname'];
        $customname = $data['customname'];
        $eventemail = $data['eventemail'];
        $eventdate = $data['eventdate'];
        $startdatetime = $data['startdatetime'];
        $enddatetime = $data['enddatetime'];
        if(isset($data['eventinvitation'])){
            $eventinvitation = $data['eventinvitation'];
        }
        else{
            $eventinvitation = null;
        }
       

        require('db_conn.php');
        
        $db = new DatabaseConnection();
        $event = $db->createEvent($eventname, $customname, $eventemail,  $eventdate, $startdatetime, $enddatetime, $eventinvitation);

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