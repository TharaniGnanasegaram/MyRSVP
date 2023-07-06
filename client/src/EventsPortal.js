import React from 'react'
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Events from './Events';
import axios from "axios";
import { Link, BrowserRouter } from "react-router-dom";
import InsertUrlPopup from './InsertUrlPopupForm';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import UpdateEventPopupForm from './UpdateEventPopupForm';



function EventPortal() {

    const [errors, setErrors] = React.useState({});

    const [popupvalues, setPopupvalues] = React.useState({});

    const [popupEditvalues, setPopupEditvalues] = React.useState({});

    const [values, setValues] = React.useState({});

    const [selectedFile, setSelectedFile] = React.useState(null);

    const [showPopup, setShowPopup] = React.useState(false);

    const [showEditPopup, setShowEditPopup] = React.useState(false);

    const [reloadVar, setReloadVar] = React.useState(false);

    const [myevents, setMyevents] = React.useState([]);

    const [postImage, setPostImage] = React.useState({

    });

    const [selectedEventDateTime, setSelectedEventDateTime] = React.useState(null);

    const handleEventDateTimeChange = (date) => {
        setSelectedEventDateTime(date);
    };

    const [selectedStartDateTime, setSelectedStartDateTime] = React.useState(null);

    const handleStartDateTimeChange = (date) => {
        setSelectedStartDateTime(date);
    };

    const [selectedEndDateTime, setSelectedEndDateTime] = React.useState(null);

    const handleEndDateTimeChange = (date) => {
        setSelectedEndDateTime(date);
    };

    const userId = localStorage.getItem('rsvpuserId');
    const showLogoutLink = userId; // true if userId is not present, false otherwise

    const openPopup = (idparm, isOpenParm = false) => {

        let tempPopupValues = {};
        tempPopupValues.eventid = idparm;

        setPopupvalues({
            ...tempPopupValues,
        });

        setShowPopup(isOpenParm);

    };

    const closePopup = () => {
        setShowPopup(false);
        if(reloadVar){
            setReloadVar(false);
        }
        else{
            setReloadVar(true);
        }
        
    };


    const openEditPopup = (idparm, eventname, customname, eventemail, eventdate, startdatetime, enddatetime, eventstreamingurl, isOpenParm = false) => {

        let tempPopupEditValues = {};
        tempPopupEditValues.eventid = idparm;
        tempPopupEditValues.eventname = eventname;
        tempPopupEditValues.customname = customname;
        tempPopupEditValues.eventemail = eventemail;
        tempPopupEditValues.eventdate = eventdate;
        tempPopupEditValues.startdatetime = startdatetime;
        tempPopupEditValues.enddatetime = enddatetime;
        tempPopupEditValues.eventstreamingurl = eventstreamingurl;

        setPopupEditvalues({
            ...tempPopupEditValues,
        });

        setShowEditPopup(isOpenParm);

    };

    const closeEditPopup = () => {
        setShowEditPopup(false);
        if(reloadVar){
            setReloadVar(false);
        }
        else{
            setReloadVar(true);
        }
    };


    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };


    const handleFileChange = async (event) => {
        setSelectedFile(event.target.files[0]);

        const file = event.target.files[0];
        const base64 = await convertToBase64(file);
        setPostImage(base64);
    };



    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
            fontSize: 12,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));



    function fetchingAllEvents() {


        fetch('http://localhost:80/myrsvpapi/apiserver/getallevents.php', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(async (response) => {

            const responseData = await response.text();
            if (responseData.trim().length > 0) {
                let tempEvents = JSON.parse(responseData);
                // let tempEventsList = tempEvents.data.getAllEvents;
                setMyevents(tempEvents);
                fetchCounts(tempEvents);
            } else {
                console.log('Empty response received');
                // Handle the case when the response is empty
            }
        })

    }


    const fetchCounts = async (tempEventsList) => {
        const updatedEvents = await Promise.all(
            tempEventsList && tempEventsList.map(async (myEvt) => {
                const count = await countGuests(myEvt.id);
                return { ...myEvt, count };
            })
        );
        setMyevents(updatedEvents);
    };


    const countGuests = async (eventid) => {

        const response = await fetch('http://localhost:80/myrsvpapi/apiserver/countGuests.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                eventid
            }),
        });

        const num = await response.json();
        // const countguest = num.data.getRsvpCount;
        return num.count;
    };


    React.useEffect(function () {
        fetchingAllEvents()
    }, [reloadVar]);



    const addEvent = async (e) => {

        setErrors({});

        let isvalid = true;

        e.preventDefault();

        let formName = document.forms.addeventform;


        const newEvent = {
            eventname: formName.eventname.value,
            customname: formName.customname.value,
            eventemail: formName.eventemail.value,
            eventdate: formName.eventdate.value,
            startdatetime: formName.startdatetime.value,
            enddatetime: formName.enddatetime.value,
        }

        let tempValues = {};
        tempValues.eventname = newEvent.eventname;
        tempValues.customname = newEvent.customname;
        tempValues.eventemail = newEvent.eventemail;
        tempValues.eventdate = newEvent.eventdate;
        tempValues.startdatetime = newEvent.startdatetime;
        tempValues.enddatetime = newEvent.enddatetime;

        setValues({
            ...tempValues,
        });


        let temp = { ...errors };
        temp.eventname = "";
        temp.customname = "";
        temp.eventemail = "";
        temp.eventdate = "";
        temp.startdatetime = "";
        temp.enddatetime = "";


        if (newEvent.eventname === "") {
            isvalid = false;
            temp.eventname = 'This field is required.';
        }

        if (newEvent.customname === "") {
            isvalid = false;
            temp.customname = 'This field is required.';
        }

        if (newEvent.eventemail === "") {
            isvalid = false;
            temp.eventemail = 'This field is required.';
        }

        if (newEvent.eventdate === "") {
            isvalid = false;
            temp.eventdate = 'This field is required.';
        }
        if (newEvent.startdatetime === "") {
            isvalid = false;
            temp.startdatetime = 'This field is required.';
        }

        if (newEvent.enddatetime === "") {
            isvalid = false;
            temp.enddatetime = 'This field is required.';
        }

        if (newEvent.eventemail !== "" && !ValidateEmail(newEvent.eventemail)) {
            isvalid = false;
            temp.eventemail = 'Email address is invalid. Please enter a valid email address.';
        }

        if (newEvent.eventdate !== "" &&  newEvent.enddatetime !== "" && newEvent.enddatetime > newEvent.eventdate ) {
            isvalid = false;
            temp.enddatetime = 'Countdown start time and end time should be before event time.';
        }

        if (newEvent.eventdate !== "" &&  newEvent.startdatetime !== "" && newEvent.startdatetime > newEvent.eventdate ) {
            isvalid = false;
            temp.startdatetime = 'Countdown start time and end time should be before event time.';
        }

        if (newEvent.startdatetime !== "" &&  newEvent.enddatetime !== "" && newEvent.startdatetime > newEvent.enddatetime ) {
            isvalid = false;
            temp.startdatetime = 'Countdown start time should be before end time.';
        }


        if (isvalid) {
            await addEventfunc(e, newEvent);

        }

        else {

            setErrors({
                ...temp,
            });
        }
    }


    function ValidateEmail(mail) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
            return (true)
        }
        return (false)
    }

    const addEventfunc = async (e, newEvent) => {

        let eventname = newEvent.eventname;
        let customname = newEvent.customname;
        let eventemail = newEvent.eventemail;
        let eventdate = format(new Date(newEvent.eventdate), 'yyyy-MM-dd HH:mm:ss');
        let startdatetime = format(new Date(newEvent.startdatetime), 'yyyy-MM-dd HH:mm:ss');
        let enddatetime = format(new Date(newEvent.enddatetime), 'yyyy-MM-dd HH:mm:ss');
        let eventinvitation = postImage;


        const response = await fetch('http://localhost:80/myrsvpapi/apiserver/createEvent.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                eventname,
                customname,
                eventemail,
                eventdate,
                startdatetime,
                enddatetime,
                eventinvitation
            }),
        });

        const res = await response.text();

        if (res != "false") {
            alert("Event added successfully!");
            e.target.reset();
            setReloadVar(true);
            // window.location.reload(false);
        }
        else {
            alert("Error occured while creating new event!");
        }


    }



    return (


        <div>

            {showLogoutLink && (
                <nav class="nav">

                    <ul class="nav_ul">
                        <li> <Link to="/logout" class="nav_ul_link" >Logout</Link> </li>

                    </ul>

                </nav>
            )}

            <div id="homecontent">
                <hr id="linehr" />
            </div>

            <Box component="form" id="addeventform" name="addeventform" onSubmit={addEvent} sx={{ '& .MuiTextField-root': { m: 1, width: '35ch' }, }} noValidate autoComplete="off" >

                <div class="addeventformdiv">

                    <h4 id="formhead">Add Events</h4>
                    <div id="containerInsinde">


                        <TextField
                            style={{
                                width: '80%'
                            }}
                            required id="eventname" type="text" label="Event Name" name="eventname" helperText={errors.eventname} defaultValue={values.eventname} /> <br />

                        <TextField
                            style={{
                                width: '80%'
                            }}
                            required id="customname" type="text" label="Custom URL Name" name="customname" helperText={errors.customname} defaultValue={values.customname} /> <br />

                        <TextField
                            style={{
                                width: '80%'
                            }}
                            required id="eventemail" type="text" label="Event Email Address" name="eventemail" helperText={errors.eventemail} defaultValue={values.eventemail} /> <br />

                        {/* <TextField required id="eventdate" type="date" InputLabelProps={{ shrink: true, }} label="Event Date" name="eventdate" helperText={errors.eventdate} defaultValue={values.eventdate} /> <br /> */}

                        <div>
                            <TextField
                                id="datetimepicker"
                                label="Event Date Time"
                                value={selectedEventDateTime? (format(new Date(selectedEventDateTime), 'yyyy-MM-dd hh:mm:ss a')): ""}
                                style={{
                                    width: '80%'
                                }}
                                disabled={true}
                                InputLabelProps={{ shrink: true }}
                                helperText={errors.eventdate}
                                InputProps={{
                                    endAdornment: (
                                        <DatePicker
                                            name="eventdate"
                                            selected={selectedEventDateTime}
                                            onChange={handleEventDateTimeChange}
                                            showTimeSelect
                                            dateFormat="Pp"
                                            className="mydatetimepick"
                                            defaultValue={values.eventdate}
                                        />
                                    ),
                                }}
                            />

                        </div><br />



                        <TextField
                            id="datetimepicker"
                            label="Countdown Start Date Time"
                            helperText={errors.startdatetime}
                            style={{
                                width: '80%'
                            }}
                            disabled={true}
                            value={selectedStartDateTime? (format(new Date(selectedStartDateTime), 'yyyy-MM-dd hh:mm:ss a')): ""}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                                endAdornment: (
                                    <DatePicker
                                        name="startdatetime"
                                        selected={selectedStartDateTime}
                                        onChange={handleStartDateTimeChange}
                                        showTimeSelect
                                        dateFormat="Pp"
                                        className="mydatetimepick"
                                        defaultValue={values.startdatetime}
                                    />
                                ),
                            }}
                        /><br />
                        <br />


                        <TextField
                            id="datetimepicker"
                            label="Countdown End Date Time"
                            helperText={errors.enddatetime}
                            style={{
                                width: '80%'
                            }}
                            disabled={true}
                            value={selectedEndDateTime? (format(new Date(selectedEndDateTime), 'yyyy-MM-dd hh:mm:ss a')): ""}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                                endAdornment: (
                                    <DatePicker
                                        name="enddatetime"
                                        selected={selectedEndDateTime}
                                        onChange={handleEndDateTimeChange}
                                        showTimeSelect
                                        dateFormat="Pp"
                                        className="mydatetimepick"
                                        defaultValue={values.enddatetime}
                                    />
                                ),
                            }}
                        /> <br />
                        <p style={{ fontSize: 12, color: 'CaptionText' }} id="formhead">Please choose an invitation image</p>
                        <Input type="file" onChange={handleFileChange} name="eventinvitation" accept=".jpeg, .png, .jpg" label="Invitation Image" />

                        <br /> <br />

                        {/* <TextField required id="startdatetime" type="date" InputLabelProps={{ shrink: true, }} label="Countdown Start" name="startdatetime" helperText={errors.startdatetime} defaultValue={values.startdatetime} /> <br />

                    <TextField required id="enddatetime" type="date" InputLabelProps={{ shrink: true, }} label="Countdown End" name="enddatetime" helperText={errors.enddatetime} defaultValue={values.enddatetime} /> <br /> */}


                        {/* <p style={{fontSize: 12, color: 'CaptionText'}} id="formhead">Please choose an invitation image</p>
                        <Input type="file" onChange={handleFileChange} name="eventinvitation" accept=".jpeg, .png, .jpg" label="Invitation Image" /> */}
                        {/* <Button variant="contained" onClick={handleUpload}>  </Button> */}


                        <div>
                            <Button variant="contained" type="submit" class="registerbuttonstyle">Save Event</Button>
                        </div>

                    </div>
                </div>
            </Box>

            <h4 id="formhead">Event Details</h4>

            <div id="eventstable">

                <Paper>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 700 }} stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell align="center">EVENT NAME</StyledTableCell>
                                    <StyledTableCell align="center">EVENT DATE</StyledTableCell>
                                    <StyledTableCell align="center">CUSTOM NAME</StyledTableCell>
                                    <StyledTableCell align="center">EMAIL ID</StyledTableCell>
                                    <StyledTableCell align="center">NUMBER OF GUESTS</StyledTableCell>
                                    <StyledTableCell align="center">COUNTDOWN START TIME</StyledTableCell>
                                    <StyledTableCell align="center">COUNTDOWN END TIME</StyledTableCell>
                                    <StyledTableCell align="center">STREAMING URL</StyledTableCell>
                                    <StyledTableCell align="right"> </StyledTableCell>
                                    <StyledTableCell align="right"> </StyledTableCell>
                                    <StyledTableCell align="right"> </StyledTableCell>
                                    <StyledTableCell align="right"> </StyledTableCell>
                                    <StyledTableCell align="right"> </StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <Events StyledTableCell={StyledTableCell} openPopupUrlForm={openPopup} openEditPopupForm={openEditPopup} reloadVar = {reloadVar} />
                            </TableBody>
                        </Table>
                    </TableContainer>

                </Paper>

            </div>
            {showPopup && <InsertUrlPopup closePopup={closePopup} eventidvar={popupvalues.eventid} />}

            {showEditPopup && <UpdateEventPopupForm closeEditPopup={closeEditPopup} eventidvar={popupEditvalues.eventid} eventname={popupEditvalues.eventname} customname={popupEditvalues.customname} eventemail={popupEditvalues.eventemail} eventdate={popupEditvalues.eventdate} startdatetime={popupEditvalues.startdatetime} enddatetime={popupEditvalues.enddatetime} eventstreamingurl={popupEditvalues.eventstreamingurl} />}

        </div>

    )

}

export default EventPortal;