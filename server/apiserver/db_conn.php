<?php
	class DatabaseConnection {

		const DB_USER = 'root';
		const DB_PASSWORD = '';
		const DB_HOST = 'localhost:3306';
		const DB_NAME = 'myrsvpdb';

		private $dbc;

		function __construct() {
			$this->dbc = @mysqli_connect(
				self::DB_HOST,
				self::DB_USER,
				self::DB_PASSWORD,
				self::DB_NAME
			)
			OR die(
				'Could not connect to MySQLL: ' . mysqli_connect_error()
			);

			mysqli_set_charset($this->dbc, 'utf8');
		}

        function get_dbc() {
			return $this->dbc;
		}

		function prepare_string($string) {

            $data = filter_var($string, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
            $striped_string = strip_tags($data);
			$string_trimmed =  trim(htmlspecialchars($striped_string));
            $string_escaped = mysqli_real_escape_string($this->dbc, $string_trimmed);
            $string_sanitized = filter_var($string_escaped, FILTER_SANITIZE_SPECIAL_CHARS);
            return $string_sanitized;

		}

        function prepare_data($string) {
            $string_trimmed = trim($string);
            $string = htmlspecialchars(mysqli_real_escape_string($this->dbc, $string_trimmed));
            $string_sanitized = filter_var($string, FILTER_SANITIZE_SPECIAL_CHARS);
            return $string_sanitized;
        }

		
        function loginUser( $username, $password) {
            $user_name_clean = $this->prepare_string($username);
            $query = "SELECT * FROM users WHERE username = ?;";
            $stmt = mysqli_prepare($this->dbc, $query);
            mysqli_stmt_bind_param(
                $stmt,
                's',
                $username
            );
            
            mysqli_stmt_execute($stmt);
            $result = mysqli_stmt_get_result($stmt);
            if ($row = mysqli_fetch_assoc($result)) {
                // User exists, now compare passwords
                $stored_password = $row['password'];
        
                if ($password == $stored_password) {
                    return $row;
                } else {
                    return null;
                }
            } else {
                return null;
            }
        }



        function getAllEvents() {
            $query = "SELECT * FROM events ;";
            $stmt = mysqli_prepare($this->dbc, $query);
            
            mysqli_stmt_execute($stmt);
            $result = mysqli_stmt_get_result($stmt);
            
            $events = array();
            while ($row = mysqli_fetch_assoc($result)) {
                $events[] = $row;
            }
            
            return $events;
        }
        
        
        function countGuests( $eventid) {
            $query = "SELECT SUM(guests) as count FROM rsvps WHERE eventid = ?;";
            $stmt = mysqli_prepare($this->dbc, $query);
            mysqli_stmt_bind_param(
                $stmt,
                's',
                $eventid
            );
            
            mysqli_stmt_execute($stmt);
            $result = mysqli_stmt_get_result($stmt);
            if ($row = mysqli_fetch_assoc($result)) {
                
                return $row;
            } else {
                return null;
            }
        }



        function createEvent($eventname, $customname, $eventemail, $eventdate, $startdatetime, $enddatetime, $eventinvitation){
            
            $eventname_clean = $this->prepare_string($eventname);

            if($eventinvitation != null){
                $query = "INSERT INTO events(eventname, customname, eventemail, eventdate, startdatetime, enddatetime, eventinvitation) VALUES (?,?,?,?,?,?,?)";
        
                $stmt = mysqli_prepare($this->dbc, $query);
    
                mysqli_stmt_bind_param(
                    $stmt,
                    'sssssss',
                    $eventname_clean,
                    $customname,
                    $eventemail,
                    $eventdate,
                    $startdatetime,
                    $enddatetime,
                    $eventinvitation
                );
            }

            else{
                $query = "INSERT INTO events(eventname , customname, eventemail, eventdate, startdatetime, enddatetime) VALUES (?,?,?,?,?,?)";
        
                $stmt = mysqli_prepare($this->dbc, $query);

                mysqli_stmt_bind_param(
                    $stmt,
                    'ssssss',
                    $eventname_clean,
                    $customname,
                    $eventemail,
                    $eventdate,
                    $startdatetime,
                    $enddatetime
                );
            }

            
            $result = mysqli_stmt_execute($stmt);

            return $result;
        }


        function geteventbyid( $eventid) {
            $query = "SELECT * FROM events WHERE id = ?;";
            $stmt = mysqli_prepare($this->dbc, $query);
            mysqli_stmt_bind_param(
                $stmt,
                's',
                $eventid
            );
            
            mysqli_stmt_execute($stmt);
            $result = mysqli_stmt_get_result($stmt);
            if ($row = mysqli_fetch_assoc($result)) {
                
                return $row;
            } else {
                return null;
            }
        }



        function createRsvp($eventid, $firstname, $lastname, $email, $contactnumber, $guests, $adults, $children){
            
            $firstname_clean = $this->prepare_string($firstname);
            $lastname_clean = $this->prepare_string($lastname);
            $email_clean = $this->prepare_string($email);

            
                $query = "INSERT INTO rsvps(eventid, firstname, lastname, email, contactnumber, guests, adults, children) VALUES (?,?,?,?,?,?,?,?)";
        
                $stmt = mysqli_prepare($this->dbc, $query);

                mysqli_stmt_bind_param(
                    $stmt,
                    'ssssssss',
                    $eventid,
                    $firstname_clean,
                    $lastname_clean,
                    $email_clean,
                    $contactnumber,
                    $guests,
                    $adults,
                    $children
                );
            

            
            $result = mysqli_stmt_execute($stmt);

            return $result;
        }


        function deleteevent($eventid) {
            
            $eventid_clean = $this->prepare_string($eventid);
            $query = "DELETE FROM events WHERE id = ? ;";
            $stmt = mysqli_prepare($this->dbc, $query);
            mysqli_stmt_bind_param(
                $stmt,
                's',
                $eventid_clean
            );
            
            $result = mysqli_stmt_execute($stmt);

            return $result;
        }



        function inserturl($eventid, $eventstreamingurl){
            
            $eventid = $this->prepare_string($eventid);
            $eventstreamingurl = $this->prepare_string($eventstreamingurl);

            $query = "UPDATE events SET eventstreamingurl = ? WHERE  id = ?;";

            $stmt = mysqli_prepare($this->dbc, $query);

            mysqli_stmt_bind_param(
                $stmt,
                'ss',
                $eventstreamingurl,
                $eventid
            );

            $result = mysqli_stmt_execute($stmt);
            return $result;
        }



        function updateevent($eventid, $eventname, $customname, $eventemail, $eventdate, $startdatetime, $enddatetime, $eventstreamingurl, $eventinvitation){
            
            $eventid = $this->prepare_string($eventid);
            $eventstreamingurl = $this->prepare_string($eventstreamingurl);
            $eventname = $this->prepare_string($eventname);
            $customname = $this->prepare_string($customname);
            $eventemail = $this->prepare_string($eventemail);
            
            if($eventinvitation != null){
                $query = "UPDATE events SET eventname = ?, customname = ?, eventemail = ?, eventdate = ?, startdatetime = ?, enddatetime = ?,  eventstreamingurl = ?, eventinvitation = ?   WHERE  id = ?;";

            $stmt = mysqli_prepare($this->dbc, $query);

            mysqli_stmt_bind_param(
                $stmt,
                'sssssssss',
                $eventname,
                $customname,
                $eventemail,
                $eventdate,
                $startdatetime,
                $enddatetime,
                $eventstreamingurl,
                $eventinvitation,
                $eventid
            );
            }
            
            else{
                $query = "UPDATE events SET eventname = ?, customname = ?, eventemail = ?, eventdate = ?, startdatetime = ?, enddatetime = ?,  eventstreamingurl = ?   WHERE  id = ?;";

            $stmt = mysqli_prepare($this->dbc, $query);

            mysqli_stmt_bind_param(
                $stmt,
                'ssssssss',
                $eventname,
                $customname,
                $eventemail,
                $eventdate,
                $startdatetime,
                $enddatetime,
                $eventstreamingurl,
                $eventid
            );
            }

            

            $result = mysqli_stmt_execute($stmt);
            return $result;
        }


        function getrsvpbyeventid( $eventid) {
            $query = "SELECT firstname, lastname, email, contactnumber, guests as 'Total Guests', adults, children  FROM rsvps WHERE eventid = ?;";
            $stmt = mysqli_prepare($this->dbc, $query);
            mysqli_stmt_bind_param(
                $stmt,
                's',
                $eventid
            );
            
            mysqli_stmt_execute($stmt);
            $result = mysqli_stmt_get_result($stmt);
            
            $events = array();
            while ($row = mysqli_fetch_assoc($result)) {
                $events[] = $row;
            }
            
            return $events;
        }


        function validate_email_str($user_email) {
            if(filter_var($user_email, FILTER_VALIDATE_EMAIL)) {
                return true;
            } else {
                return false;
            }
        }

        function validate_phonuNumber($phoneNum) {
            if(preg_match("/\d{10}$/" ,$phoneNum)) {
                return true;
            } else { 
                return false;
            }
        }

	}
?>