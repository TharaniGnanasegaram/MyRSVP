import React from 'react'
import { useEffect, useContext } from "react";
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import XLSX from 'xlsx';


function Events({ StyledTableCell, openPopupUrlForm, openEditPopupForm, reloadVar }) {

    const [myEvents, setMyevents] = React.useState([]);


    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        '&:last-child td, &:last-child th': {
            border: 0,
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



    useEffect(function () {
        fetchingAllEvents()
    }, [reloadVar]);




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



    const deleteService = async (deleteEventId) => {

        fetch('http://localhost:80/myrsvpapi/apiserver/deleteevent.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                deleteEventId
            }),

        }).then(async (response) => {
            alert("Event deleted successfully!")
            fetchingAllEvents();
        })


    }



    async function fetchAllRsvpsByEventId(eventid) {

        const response = await fetch('http://localhost:80/myrsvpapi/apiserver/getrsvpbyeventid.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                eventid
            }),
        });

        const rsvps = await response.json();
        return rsvps;
    }



    async function convertToExcel(eventid) {
        const data = await fetchAllRsvpsByEventId(eventid);

        // Define the Excel columns
        // Create an array of arrays representing the Excel data
        const excelData = data && data.map(item => Object.values(item));

        // Add the column headers as the first row
        const headers = Object.keys(data[0]);
        excelData.unshift(headers);

        return excelData;
    }



    function downloadExcelFile(data) {
        const worksheet = XLSX.utils.aoa_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');

        // Generate a binary Excel file
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

        // Create a blob from the Excel buffer
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        // Generate a download link
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = 'rsvp_details.xlsx';
        downloadLink.click();
    }



    const handleDownload = async (eventid, count) => {
        if (count > 0) {
            const data = await convertToExcel(eventid);
            downloadExcelFile(data);
        }
        else {
            alert("No Rsvps found to download!")
        }

    };


    const handleInserturl = async (id, isOpenVal) => {
        openPopupUrlForm(id, isOpenVal);
    };


    const handleEditPopup = async (id, eventname, customname, eventemail, eventdate, startdatetime, enddatetime, eventstreamingurl, isOpenVal) => {
        openEditPopupForm(id, eventname, customname, eventemail, eventdate, startdatetime, enddatetime, eventstreamingurl, isOpenVal);
    };

    if ( myEvents.length === 0) {
        // return <div>No events found.</div>;
    } else {
        return (
            myEvents && myEvents.map((myEvt) => (
                <StyledTableRow key={myEvt.id}>

                    <StyledTableCell align="center"> {myEvt.eventname} </StyledTableCell>
                    <StyledTableCell align="center">{new Date(myEvt.eventdate).toLocaleDateString()}</StyledTableCell>
                    <StyledTableCell align="center"> {myEvt.customname} </StyledTableCell>
                    <StyledTableCell align="center"> {myEvt.eventemail} </StyledTableCell>
                    <StyledTableCell align="center">{myEvt.count ? myEvt.count : 0}</StyledTableCell>
                    <StyledTableCell align="center">{myEvt.startdatetime}</StyledTableCell>
                    <StyledTableCell align="center">{myEvt.enddatetime}</StyledTableCell>
                    <StyledTableCell align="center">{myEvt.eventstreamingurl ? myEvt.eventstreamingurl : '-'}</StyledTableCell>

                    <StyledTableCell align="right"> <Link to={`/events/${myEvt.id}/${myEvt.customname}`}>  <img class="imgicons" style={{width: 20, height: 20}} src="view.png" title="View Event" alt="View Event" /> </Link> </StyledTableCell>
                    <StyledTableCell align="right"> <img class="imgicons" style={{width: 20, height: 20}} src="edit.png" title="Edit Event" alt="Edit Event" onClick={() => handleEditPopup(myEvt.id, myEvt.eventname, myEvt.customname, myEvt.eventemail, myEvt.eventdate, myEvt.startdatetime, myEvt.enddatetime, myEvt.eventstreamingurl, true)} />  </StyledTableCell>
                    <StyledTableCell align="right"> <img class="imgicons" src="delete.png" style={{width: 20, height: 20}} onClick={() => deleteService(myEvt.id)} title="Delete Event" alt="Delete Event" /> </StyledTableCell>
                    <StyledTableCell align="right"> <Button variant="contained" type="button" class="tablebuttonstyle" onClick={() => handleDownload(myEvt.id, myEvt.count)} >Download RSVP details</Button> </StyledTableCell>
                    <StyledTableCell align="right"> <Button variant="contained" type="button" class="tablebuttonstyle" onClick={() => handleInserturl(myEvt.id, true)} >Insert Streaming URL</Button> </StyledTableCell>

                </StyledTableRow>
            ))
        );
    }



}

export default Events;