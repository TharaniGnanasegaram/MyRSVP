
<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['eventid']) && isset($data['firstname']) && isset($data['lastname']) && isset($data['email']) && isset($data['contactnumber']) && isset($data['guests']) && isset($data['adults']) && isset($data['children']) && isset($data['recapval']) ) {
        $eventid = $data['eventid'];
        $firstname = $data['firstname'];
        $lastname = $data['lastname'];
        $email = $data['email'];
        $contactnumber = $data['contactnumber'];
        $guests = $data['guests'];
        $adults = $data['adults'];
        $children = $data['children'];
        $recaptchaResponse = $data['recapval'];


        $secretKey = "SECRET_KEY";
        $verificationUrl = "https://www.google.com/recaptcha/api/siteverify";

        $postData = http_build_query([
            'secret' => $secretKey,
            'response' => $recaptchaResponse
        ]);

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $verificationUrl);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $response = curl_exec($ch);
        curl_close($ch);
       
        $responseData = json_decode($response);
        $isVerified = $responseData->success;

        if ($isVerified) {
            require('db_conn.php');
        
            $db = new DatabaseConnection();
            $rsvp = $db->createRsvp($eventid, $firstname, $lastname, $email, $contactnumber, $guests, $adults, $children);
    
            if ($rsvp) {
                echo json_encode($rsvp);
            } else {
                echo json_encode("false");
            }
        } else {
            echo json_encode("ReCAPTCHA Verification Failed!");
        }

        
    } else {
        echo json_encode("false");
    }
} else {
    echo json_encode("false");
}
    
?>