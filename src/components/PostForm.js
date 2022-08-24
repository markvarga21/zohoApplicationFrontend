import React, { useEffect, useReducer, useState } from "react";
import Axios from 'axios';
import './Form.css'
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { createTheme } from '@mui/material/styles';

// Time picker
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';


function PostForm(props) {
    // Styling
    const [alignment, setAlignment] = React.useState('web');

    const url = "https://a722-2a02-2f08-ec10-d900-818c-a190-a350-535.eu.ngrok.io/add";

    const [clients, setClients] = useState();
    const [jobs, setJobs] = useState();
    const [projects, setProjects] = useState();
    const [fromTime, setFromTime] = useState(null);

    const [data, setData] = useState({
        clientName: "",
        projectName: "",
        jobName: "",
        workItem: "",
        description: "",
        workDate: "",
        fromTime: "",
        toTime: "",
        billable: ""
    })
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

    useEffect(() => {
        getClients()
    }, []);

    useEffect(() => {
        getJobs()
    }, [data.clientName]);

    useEffect(() => {
        getProjects()
    }, [data.clientName]);

    function getClients() {
        Axios.get("https://a722-2a02-2f08-ec10-d900-818c-a190-a350-535.eu.ngrok.io/clientlist")
            .then(response => {
                return response.data;
            }).then(
                response => {
                    console.log(response)
                    setClients(response)
                }
            )
    }

    function getJobs() {
        Axios.get("https://a722-2a02-2f08-ec10-d900-818c-a190-a350-535.eu.ngrok.io/joblist", {
            params: {
                'clientName': data.clientName
            }
        })
            .then(response => {
                console.log('Client name in getJobs(): ' + data.clientName)
                return response.data;
            }).then(
                response => {
                    console.log(response)
                    setJobs(response)
                }
            )
    }

    function getProjects() {
        Axios.get("https://a722-2a02-2f08-ec10-d900-818c-a190-a350-535.eu.ngrok.io/projectlist", {
            params: {
                'clientName': data.clientName
            }
        })
            .then(response => {
                console.log('Client name in getProjects(): ' + data.clientName)
                return response.data;
            }).then(
                response => {
                    console.log(response)
                    setProjects(response)
                }
            )
    }

    function handle(e) {
        const newData = { ...data }
        newData[e.target.id] = e.target.value
        setData(newData)
        console.log(newData)
        forceUpdate();
    }


    function submit(e) {
        Axios.post(url,
            {
                clientName: data.clientName,
                projectName: data.projectName,
                jobName: data.jobName,
                workItem: data.workItem,
                description: data.description,
                workDate: data.workDate,
                fromTime: data.fromTime,
                toTime: data.toTime,
                billable: data.billable
            }).then(res => {
                console.log(res.data)
            })
    }

    if (typeof (clients) === 'undefined') return <div></div>
    if (typeof (jobs) === 'undefined') return <div></div>
    if (typeof (projects) === 'undefined') return <div></div>

    return (
        <div align="center">
            <form onSubmit={(e) => submit(e)}>
                <label className="propertyLabel">Client name:</label>
                <br></br>
                <ToggleButtonGroup color="primary" size="small">
                    {
                        clients.map(item => {
                            return (
                                <div className="clientDiv">
                                    <ToggleButton value={item} name="clientName" onChange={(e) => handle(e)} placeholder="clientName" id="clientName">{item}</ToggleButton>
                                </div>
                            );
                        })
                    }
                </ToggleButtonGroup>
                <br></br>

                <label className="propertyLabel">Job name:</label>
                <br></br>
                <ToggleButtonGroup color="primary" value={alignment} exclusive>
                    {
                        jobs.map(item => {
                            return (
                                <div className="jobDiv">
                                    <ToggleButton value={item} name="jobName" onChange={(e) => handle(e)} placeholder="jobName" id="jobName">{item}</ToggleButton>
                                </div>
                            );
                        })
                    }
                </ToggleButtonGroup>
                <br></br>
                <label className="propertyLabel">Project name:</label>
                <br></br>
                <ToggleButtonGroup color="primary" value={alignment} exclusive>
                    {
                        projects.map(item => {
                            return (
                                <div className="projectDiv">
                                    <ToggleButton value={item} name="projectName" onChange={(e) => handle(e)} placeholder="projectName" id="projectName">{item}</ToggleButton>
                                </div>
                            );
                        })
                    }
                </ToggleButtonGroup>
                <br></br>
                <br></br>
                <label className="propertyLabel">Work item name: </label>
                <br></br>
                <input onChange={(e) => handle(e)} id="workItem" value={data.workItem} placeholder="workItem"
                    type="text"></input>
                <br></br>
                <label className="propertyLabel">Description: </label>
                <br></br>
                <input onChange={(e) => handle(e)} id="description" value={data.description} placeholder="description"
                    type="text"></input>
                <br></br>
                <label className="propertyLabel">Work date: </label>
                <br></br>
                <input onChange={(e) => handle(e)} placeholder="date" id="workDate" value={data.workDate}
                    type="workDate"></input>
                <br></br>


                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <TimePicker
                        placeholder="fromTime"
                        label="Basic example"
                        value={fromTime}
                        onChange={(newValue) => {
                            setFromTime(newValue)
                          }}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>


                <br></br>
                <label className="propertyLabel">To time: </label>
                <br></br>
                <input onChange={(e) => handle(e)} id="toTime" value={data.toTime} placeholder="toTime"
                    type="text"></input>
                <br></br>
                <label className="propertyLabel">Billable name: </label>
                <br></br>
                <input onChange={(e) => handle(e)} id="billable" value={data.billable} placeholder="billable"
                    type="text"></input>
                <br></br>
                <button>Submit</button>
            </form>
        </div>
    );
}

export default PostForm;