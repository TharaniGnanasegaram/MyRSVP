import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

function InsertUrlPopup({ closePopup, eventidvar }) {

    const [formData, setFormData] = useState({
        
    });

    const [values, setValues] = React.useState({});

    const [errors, setErrors] = React.useState({});

    const insertUrlSubmit = (e) => {
        setErrors({});

        let isvalid = true;

        e.preventDefault();

        let formName = document.forms.insertUrlform;

        const newRsvpUrl = {
            eventstreamingurl: formName.eventstreamingurl.value
        }

        let tempValues = {};
        tempValues.eventstreamingurl = newRsvpUrl.eventstreamingurl;

        setValues({
            ...tempValues,
        });


        let temp = { ...errors };
        temp.eventstreamingurl = "";


        if (newRsvpUrl.eventstreamingurl === "") {
            isvalid = false;
            temp.eventstreamingurl = 'This field is required.';
        }


        if (isvalid) {
             updateInsertUrlfunc(e, newRsvpUrl);

        }

        else {

            setErrors({
                ...temp,
            });
        }
    };


    const updateInsertUrlfunc = async (e, newRsvpUrl) => {

      let  eventstreamingurl = newRsvpUrl.eventstreamingurl ;

        const response = await fetch('http://localhost:80/myrsvpapi/apiserver/inserturl.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                eventidvar,
                eventstreamingurl
            }),
        });

        const res = await response.text();

        if(res != "false"){
            alert("Streaming URL Inserted successfully!");
                e.target.reset();
                closePopup();
        }
        else{
            alert("Error occured while inserting!");
        }

    }


    return (

        <Box style={{backgroundColor: 'rgb(0, 0, 0, 0.7)'}} component="form" id="insertUrlform" name="insertUrlform" onSubmit={insertUrlSubmit} sx={{ '& .MuiTextField-root': { m: 1, width: '35ch' }, }} noValidate autoComplete="off" >

            <div class="popup" style={{width: '60%'}}>

                <h6 style={{marginBottom: 30}} id="editformhead">Insert Streaming Vimeo URL</h6>

                <TextField style={{width: '80%',marginBottom: 30}} required id="eventstreamingurl" type="text" name="eventstreamingurl" label="Event Streaming URL" helperText={errors.eventstreamingurl} > </TextField>

                <div>
                    <Button style={{height: 50}} variant="contained" type="submit" class="updateServiceButton">Save</Button>
                    <Button style={{height: 50}}  variant="contained" type="cancel" class="cancelupdateServiceButton" onClick={closePopup} >Cancel</Button>
                </div>

            </div>

        </Box>

    );
};


export default InsertUrlPopup;