import React, { useState } from 'react';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

function UpdateEventPopup({ closeEditPopup, eventidvar, eventname, customname, eventemail, eventdate, startdatetime, enddatetime, eventstreamingurl }) {

    const [formData, setFormData] = useState({

    });

    const [values, setValues] = React.useState({});

    const [errors, setErrors] = React.useState({});

    const [selectedFile, setSelectedFile] = React.useState(null);

    const [postImage, setPostImage] = React.useState({

    });

    const [selectedEventDateTime, setSelectedEventDateTime] = React.useState(new Date(eventdate));

    const handleEventDateTimeChange = (date) => {
        setSelectedEventDateTime(date);
    };

    const [selectedStartDateTime, setSelectedStartDateTime] = React.useState(new Date(startdatetime));

    const handleStartDateTimeChange = (date) => {
        setSelectedStartDateTime(date);
    };

    const [selectedEndDateTime, setSelectedEndDateTime] = React.useState(new Date(enddatetime));

    const handleEndDateTimeChange = (date) => {
        setSelectedEndDateTime(date);
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

    const updateeventSubmit = (e) => {
        setErrors({});

        let isvalid = true;

        e.preventDefault();

        let formName = document.forms.updateeventform;

        const updateEvent = {
            eventname: formName.eventname.value,
            customname: formName.customname.value,
            eventemail: formName.eventemail.value,
            eventdate: formName.eventdate.value,
            startdatetime: formName.startdatetime.value,
            enddatetime: formName.enddatetime.value,
            eventstreamingurl: formName.eventstreamingurl.value
        }

        let tempValues = {};
        tempValues.eventname = updateEvent.eventname;
        tempValues.customname = updateEvent.customname;
        tempValues.eventemail = updateEvent.eventemail;
        tempValues.eventdate = updateEvent.eventdate;
        tempValues.startdatetime = updateEvent.startdatetime;
        tempValues.enddatetime = updateEvent.enddatetime;
        tempValues.eventstreamingurl = updateEvent.eventstreamingurl;

        setValues({
            ...tempValues,
        });


        let temp = { ...errors };
        tempValues.eventname = "";
        tempValues.customname = "";
        tempValues.eventemail = "";
        tempValues.eventdate = "";
        tempValues.startdatetime = "";
        tempValues.enddatetime = "";
        tempValues.eventstreamingurl = "";


        // if (updateEvent.eventstreamingurl === "") {
        //     isvalid = false;
        //     temp.eventstreamingurl = 'This field is required.';
        // }

        if (updateEvent.eventname === "") {
            isvalid = false;
            temp.eventname = 'This field is required.';
        }

        if (updateEvent.customname === "") {
            isvalid = false;
            temp.customname = 'This field is required.';
        }

        if (updateEvent.eventemail === "") {
            isvalid = false;
            temp.eventemail = 'This field is required.';
        }

        if (updateEvent.eventdate === "") {
            isvalid = false;
            temp.eventdate = 'This field is required.';
        }
        if (updateEvent.startdatetime === "") {
            isvalid = false;
            temp.startdatetime = 'This field is required.';
        }

        if (updateEvent.enddatetime === "") {
            isvalid = false;
            temp.enddatetime = 'This field is required.';
        }

        if (updateEvent.eventemail !== "" && !ValidateEmail(updateEvent.eventemail)) {
            isvalid = false;
            temp.eventemail = 'Email address is invalid. Please enter a valid email address.';
        }

        if (updateEvent.eventdate !== "" &&  updateEvent.enddatetime !== "" && updateEvent.enddatetime > updateEvent.eventdate ) {
            isvalid = false;
            temp.enddatetime = 'Countdown start time and end time should be before event time.';
        }

        if (updateEvent.eventdate !== "" &&  updateEvent.startdatetime !== "" && updateEvent.startdatetime > updateEvent.eventdate ) {
            isvalid = false;
            temp.startdatetime = 'Countdown start time and end time should be before event time.';
        }

        if (updateEvent.startdatetime !== "" &&  updateEvent.enddatetime !== "" && updateEvent.startdatetime > updateEvent.enddatetime ) {
            isvalid = false;
            temp.startdatetime = 'Countdown start time should be before end time.';
        }

        if (isvalid) {
            updateeventSubmitFun(e, updateEvent);

        }

        else {

            setErrors({
                ...temp,
            });
        }
    };


    function ValidateEmail(mail) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
            return (true)
        }
        return (false)
    }


    const updateeventSubmitFun = async (e, updateEvent) => {

        let eventstreamingurl = updateEvent.eventstreamingurl;
        let eventname = updateEvent.eventname;
        let customname = updateEvent.customname;
        let eventemail = updateEvent.eventemail;
        let eventdate = format(new Date(updateEvent.eventdate), 'yyyy-MM-dd HH:mm:ss');
        let startdatetime = format(new Date(updateEvent.startdatetime), 'yyyy-MM-dd HH:mm:ss');
        let enddatetime = format(new Date(updateEvent.enddatetime), 'yyyy-MM-dd HH:mm:ss');
        let eventinvitation = postImage;

        const response = await fetch('http://localhost:80/myrsvpapi/apiserver/updateevent.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                eventidvar,
                eventname,
                customname,
                eventemail,
                eventdate,
                startdatetime,
                enddatetime,
                eventstreamingurl,
                eventinvitation
            }),
        });

        const res = await response.text();

        if (res != "false") {
            alert("Event Updated successfully!");
            e.target.reset();
            closeEditPopup();
        }
        else {
            alert("Error occured while updating!");
        }

    }



    return (

        <Box style={{ backgroundColor: 'rgb(0, 0, 0, 0.7)' }} component="form" id="updateeventform" name="updateeventform" onSubmit={updateeventSubmit} sx={{ '& .MuiTextField-root': { m: 1, width: '35ch' }, }} noValidate autoComplete="off" >

            <div class="editpopup" style={{ width: '60%', height: '90%', overflowY: 'scroll' }}>

                <h6 id="editformhead">Update Event</h6>

                <TextField required id="eventname" style={{
                    width: '90%'
                }} type="text" label="Event Name" name="eventname" helperText={errors.eventname} defaultValue={eventname} /> <br />

                <TextField required id="customname" style={{
                    width: '90%'
                }} type="text" label="Custom URL Name" name="customname" helperText={errors.customname} defaultValue={customname} /> <br />

                <TextField required id="eventemail" style={{
                    width: '90%'
                }} type="text" label="Event Email Address" name="eventemail" helperText={errors.eventemail} defaultValue={eventemail} /> <br />

                {/* <TextField required id="eventdate" type="date" InputLabelProps={{ shrink: true, }} label="Event Date" name="eventdate" helperText={errors.eventdate} defaultValue={values.eventdate} /> <br /> */}

                <div>
                    <TextField
                        id="datetimepicker"
                        label="Event Date Time"
                        value={selectedEventDateTime ? (format(new Date(selectedEventDateTime), 'yyyy-MM-dd hh:mm:ss a')) : ""}
                        style={{
                            width: '90%'
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
                                />
                            ),
                        }}
                    />

                </div><br />



                <TextField
                    id="datetimepicker"
                    label="Countdown Start Date Time"
                    helperText={errors.startdatetime}
                    value={selectedStartDateTime ? (format(new Date(selectedStartDateTime), 'yyyy-MM-dd hh:mm:ss a')) : ""}
                    style={{
                        width: '90%'
                    }}
                    disabled={true}
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
                            />
                        ),
                    }}
                /><br />
                <br />


                <TextField
                    id="datetimepicker"
                    label="Countdown End Date Time"
                    helperText={errors.enddatetime}
                    value={selectedEndDateTime ? (format(new Date(selectedEndDateTime), 'yyyy-MM-dd hh:mm:ss a')) : ""}
                    InputLabelProps={{ shrink: true }}
                    style={{
                        width: '90%'
                    }}
                    disabled={true}
                    InputProps={{
                        endAdornment: (
                            <DatePicker
                                name="enddatetime"
                                selected={selectedEndDateTime}
                                onChange={handleEndDateTimeChange}
                                showTimeSelect
                                dateFormat="Pp"
                                className="mydatetimepick"
                            />
                        ),
                    }}
                /> <br />

                <TextField required id="eventstreamingurl" style={{
                    width: '90%'
                }} type="text" label="Streaming URL" name="eventstreamingurl" helperText={errors.eventstreamingurl} defaultValue={eventstreamingurl} /> <br />

                <p style={{ fontSize: 12, color: 'CaptionText' }} id="formhead">Please choose an invitation image</p>
                <Input type="file" onChange={handleFileChange} name="eventinvitation" accept=".jpeg, .png, .jpg" label="Invitation Image" />


                <br /> <br />
                <div>
                    <Button variant="contained" type="submit" class="updateServiceButton" style={{ width: 100 }}>Update</Button>
                    <Button variant="contained" type="cancel" class="cancelupdateServiceButton" style={{ width: 100 }} onClick={closeEditPopup} >Cancel</Button>
                </div>

            </div>

        </Box>

    );
};


export default UpdateEventPopup;