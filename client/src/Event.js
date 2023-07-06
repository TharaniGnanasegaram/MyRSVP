import React from 'react'
import { useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import emailjs from '@emailjs/browser';
import VimeoPlayer from './VimeoPlayer';
import { Link, BrowserRouter } from "react-router-dom";
import { format } from 'date-fns';
import ReCAPTCHA from "react-google-recaptcha";



function RsvpEvent() {

    const [errors, setErrors] = React.useState({});

    const [values, setValues] = React.useState({});

    const { eventid } = useParams();

    const [event, setEvent] = React.useState([]);

    const [disabled, setDisabled] = React.useState(false);

    const [countdown, setCountdown] = React.useState(null);

    const userId = localStorage.getItem('rsvpuserId');
    const showLogoutLink = userId;

    const [recaptchaValue, setRecaptchaValue] = React.useState("");

    const handleRecapChange = (value) => {
        setRecaptchaValue(value);
    };

    function fetchingEventData() {

        fetch('http://localhost:80/myrsvpapi/apiserver/geteventbyid.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                eventid
            }),
        }).then(async (response) => {
            let tempEventDetail = await response.json();
            console.log("event data " + tempEventDetail)
            setEvent(tempEventDetail);
        })
    }


    React.useEffect(function () {
        fetchingEventData()
    }, []);




    const rsvpSubmit = async (e) => {

        setErrors({});

        let isvalid = true;

        e.preventDefault();


        if (!recaptchaValue) {
            alert("ReCAPTCHA not verified")
        } else {
            let formName = document.forms.rsvpform;

            const newRsvp = {
                firstname: formName.firstname.value,
                lastname: formName.lastname.value,
                email: formName.email.value,
                contactnumber: formName.contactnumber.value,
                adults: parseInt(formName.adults.value),
                children: parseInt(formName.children.value)
            }

            let tempValues = {};
            tempValues.firstname = newRsvp.firstname;
            tempValues.lastname = newRsvp.lastname;
            tempValues.email = newRsvp.email;
            tempValues.contactnumber = newRsvp.contactnumber;
            tempValues.adults = newRsvp.adults;
            tempValues.children = newRsvp.children;

            setValues({
                ...tempValues,
            });


            let temp = { ...errors };
            temp.firstname = "";
            temp.lastname = "";
            temp.email = "";
            temp.contactnumber = "";
            temp.adults = "";
            temp.children = "";


            if (newRsvp.firstname === "") {
                isvalid = false;
                temp.firstname = 'This field is required.';
            }

            if (newRsvp.lastname === "") {
                isvalid = false;
                temp.lastname = 'This field is required.';
            }

            if (newRsvp.email === "") {
                isvalid = false;
                temp.email = 'This field is required.';
            }

            if (newRsvp.contactnumber === "") {
                isvalid = false;
                temp.contactnumber = 'This field is required.';
            }

            if (newRsvp.adults === "") {
                isvalid = false;
                temp.adults = 'This field is required.';
            }

            if (newRsvp.children === "") {
                isvalid = false;
                temp.children = 'This field is required.';
            }

            if (isNaN(newRsvp.adults)) {
                isvalid = false;
                temp.adults = 'Please give a valid number.';
            }

            if (isNaN(newRsvp.children)) {
                isvalid = false;
                temp.children = 'Please give a valid number.';
            }

            if (newRsvp.contactnumber !== "" && ((newRsvp.contactnumber.length !== 10) || (isNaN(newRsvp.contactnumber)))) {
                isvalid = false;
                temp.contactnumber = 'Conatct number should be a number with 10 digits length.';
            }

            if (newRsvp.email !== "" && !ValidateEmail(newRsvp.email)) {
                isvalid = false;
                temp.email = 'Email address is invalid. Please enter a valid email address.';
            }

            if (isvalid) {
                await rsvpSaveFun(e, newRsvp);

            }

            else {

                setErrors({
                    ...temp,
                });
            }
        }


    }


    function ValidateEmail(mail) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
            return (true)
        }
        return (false)
    }

    const form = React.useRef();


    const rsvpSaveFun = async (e, newRsvp) => {

        let firstname = newRsvp.firstname;
        let lastname = newRsvp.lastname;
        let email = newRsvp.email;
        let contactnumber = newRsvp.contactnumber;
        let guests = (newRsvp.adults + newRsvp.children);
        let adults = newRsvp.adults;
        let children = newRsvp.children;
        let recapval = recaptchaValue;

        const response = await fetch('http://localhost:80/myrsvpapi/apiserver/createRsvp.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                eventid,
                firstname, lastname, email,
                contactnumber, guests, adults, children, recapval
            }),
        });


        response.json().then(response => {
            const parsedResponse = response;

            if (parsedResponse == "false") {
                alert("RSVP submission failed!");
            }
            else {
                emailjs.sendForm('service_r5b9pfy', 'template_d6ud58c', form.current, 'KEY')
                    .then((result) => {
                        // show the user a success message
                    }, (error) => {
                        // show the user an error
                    });
                alert("Successfully submitted!");
                e.target.reset();
                fetchingEventData();
            }

        });

    }


    function deductTwoDaysFromDate(days) {
        const currentDate = new Date(event.eventdate);
        const modifiedDate = new Date(currentDate.getTime() - days * 24 * 60 * 60 * 1000);
        return modifiedDate;
    }



    const startTime = deductTwoDaysFromDate(10);

    const endTime = deductTwoDaysFromDate(2);

    const startdateObj = new Date(startTime);
    const starttimestamp = startdateObj.getTime();

    const enddateObj = new Date(endTime);
    const endtimestamp = enddateObj.getTime();


    // count down

    React.useEffect(() => {
        // Calculate the target date and time (2 days from now)
        const targetDate = new Date(event.enddatetime);

        // Update the countdown every second
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate.getTime() - now;

            // Check if the countdown has reached zero or finished
            if (distance <= 0) {
                clearInterval(interval);
                setCountdown('Countdown Finished!');
            } else {
                // Calculate the remaining days, hours, minutes, and seconds
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                // Update the countdown state with the remaining time
                setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
            }
        }, 1000);

        // Clean up the interval when the component unmounts
        return () => clearInterval(interval);
    }, [event]);


    let datenow = format(Date.now(), 'yyyy-MM-dd HH:mm:ss');

    return (

        <div>


            {showLogoutLink && (
                <nav class="nav">

                    <ul class="nav_ul">
                        <li> <Link to="/events" class="nav_ul_link" >Events</Link> </li>

                    </ul>

                </nav>
            )}

            <div id="homecontent">
                <hr id="linehr" />
            </div>

            <h3 id="serproheading">Welcome to the Event - {event.eventname}</h3>

            <h4 id="serprohead">Event Date : <span class="eventtimespan"> {event.eventdate} </span>  </h4>


            <div class="twocolumnslogin">

                <div>
                    <img class="serprologinimg" src={event.eventinvitation} ></img>
                </div>
                <div style={{ margin: '0px' }}>
                    <Box component="form" id="rsvpform" ref={form} name="rsvpform" onSubmit={rsvpSubmit} sx={{ '& .MuiTextField-root': { m: 1, width: '90%' }, }} noValidate autoComplete="off" >

                        <div class="signupformdiv">

                            <h4 id="formhead">RSVP Confirmation</h4>

                            <h6 id="subhead"> You can confirm the RSVP for this event from <span class="timespan">{event.startdatetime}</span>  till <span class="timespan"> {event.enddatetime} </span> </h6>
                            <h6>Time now {format(Date.now(), 'yyyy-MM-dd HH:mm:ss')}</h6>

                            <p id="timerclass">
                                {((event.startdatetime < datenow) && (event.enddatetime > datenow)) ? "Remaining time to submit RSVP is " : ""}
                                {((event.startdatetime < datenow) && (event.enddatetime > datenow)) ? countdown : ""}

                            </p>

                            <TextField id="eventemail" name="eventemail" value={event.eventemail} style={{ display: 'none' }} /> <br />

                            <TextField required id="firstname" type="text" label="First Name" name="firstname" helperText={errors.firstname} defaultValue={values.firstname} /> <br />

                            <TextField required id="lastname" type="text" label="Last Name" name="lastname" helperText={errors.lastname} defaultValue={values.lastname} /> <br />

                            <TextField required id="email" type="email" label="Email address" name="email" helperText={errors.email} defaultValue={values.email} /> <br />

                            <TextField required id="contactnumber" type="text" label="Phone number" name="contactnumber" helperText={errors.contactnumber} defaultValue={values.contactnumber} /> <br />

                            <h5>Number of people attending</h5>

                            <TextField required id="adults" type="number" label="Adults" name="adults" InputProps={{ inputProps: { min: 0 } }} helperText={errors.adults} defaultValue={values.adults} />

                            <TextField required id="children" type="number" label="Children" name="children" InputProps={{ inputProps: { min: 0 } }} helperText={errors.children} defaultValue={values.children} />

                            <div>
                                <div className="recaptcha-container">
                                    <ReCAPTCHA onChange={handleRecapChange} sitekey="SITE_KEY" />
                                </div>
                                <Button variant="contained" disabled={((event.startdatetime > datenow) || (event.enddatetime < datenow)) ? true : false} type="submit" class="registerbuttonstyle">Submit</Button>
                            </div>

                            <p class="rsvpwarning">
                                {((event.startdatetime > datenow) || (event.enddatetime < datenow)) ? "RSVP confirmation is not available now. You can only submit RSVP with in the the given Date range!" : ""}

                            </p>


                        </div>
                    </Box>
                </div>
            </div>

            {event.eventstreamingurl ?
                <div>

                    <h4 id="streamhead">Live Streaming of the event</h4>
                    <VimeoPlayer videoUrl={event.eventstreamingurl} />


                </div>
                : ""}
        </div>

    )

}

export default RsvpEvent;