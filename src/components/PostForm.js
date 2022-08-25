import React, { useEffect, useReducer, useState } from "react";
import Axios from 'axios';
import './Form.css'
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import DatePicker from "react-multi-date-picker"
import transition from "react-element-popper/animations/transition"
import opacity from "react-element-popper/animations/opacity"
import Button from '@mui/material/Button';
import { createTheme } from '@mui/material/styles';

// Time picker
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';


function PostForm(props) {
    // Styling
    const [alignment, setAlignment] = React.useState('web');

    const url = "https://0da0-2a02-2f08-ec10-d900-78b3-1ee9-4274-796d.eu.ngrok.io/add";

    const [clients, setClients] = useState();
    const [jobs, setJobs] = useState();
    const [projects, setProjects] = useState();
    const [fromTime, setFromTime] = React.useState(null);
    const [toTime, setToTime] = React.useState(null);
    const [workItem, setWorkItem] = useState();

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
        Axios.get("https://0da0-2a02-2f08-ec10-d900-78b3-1ee9-4274-796d.eu.ngrok.io/clientlist")
            .then(response => {
                return response.data;
            }).then(
                response => {
                    setClients(response)
                }
            )
    }

    function getJobs() {
        Axios.get("https://0da0-2a02-2f08-ec10-d900-78b3-1ee9-4274-796d.eu.ngrok.io/joblist", {
            params: {
                'clientName': data.clientName
            }
        })
            .then(response => {
                return response.data;
            }).then(
                response => {
                    setJobs(response)
                }
            )
    }

    function getProjects() {
        Axios.get("https://0da0-2a02-2f08-ec10-d900-78b3-1ee9-4274-796d.eu.ngrok.io/projectlist", {
            params: {
                'clientName': data.clientName
            }
        })
            .then(response => {
                return response.data;
            }).then(
                response => {
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
                                    <ToggleButton value={item} name="projectName" onChange={(e) => handle(e)} placeholder="projectName" id="projectName" color="primary">{item}</ToggleButton>
                                </div>
                            );
                        })
                    }
                </ToggleButtonGroup>
                <br></br>

                <br></br>
                <TextField id="outlined-basic" label="Work item" variant="outlined" onChange={(e) => {
                    data.workItem = e.target.value
                }}/>
                <br></br>

                <br></br>
                <TextField id="outlined-basic" label="Description" variant="outlined" onChange={(e) => {
                    data.description = e.target.value
                }}/>
                <br></br>

                <DatePicker 
                    multiple 
                    value="Work date"
                    format="YYYY-MM-DD"
                    maxDate={new Date()}
                    animations={[
                        opacity(), 
                        transition({ from: 35, duration: 800 })
                      ]} 
                    weekStartDayIndex={1}
                    placeholder="Work date"
                    shadow={true}
                />
                <br></br>

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <TimePicker
                        minTime={new Date(0, 0, 0, 8, 0)}
                        maxTime={new Date(0, 0, 0, 23, 0)}
                        label="From time"
                        value={fromTime}
                        onChange={(newValue) => {
                            setFromTime(newValue)
                            let time = newValue.toLocaleString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit', 
                                    hour12: true 
                                });
                            data.fromTime = time;
                          }}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>


                <br></br>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <TimePicker
                        minTime={new Date(0, 0, 0, 8, 0)}
                        maxTime={new Date(0, 0, 0, 23, 0)}
                        label="To time"
                        value={toTime}
                        onChange={(newValue) => {
                            setToTime(newValue)
                            let time = newValue.toLocaleString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit', 
                                    hour12: true 
                                });
                            data.toTime = time;
                          }}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
                <br></br>
                <ToggleButtonGroup color="primary" value={alignment} exclusive onClick={(e) => {
                        data.billable = e.target.value
                    }}>
                    <ToggleButton value="billable">Billable</ToggleButton>
                    <ToggleButton value="non-billable">Billable</ToggleButton>
                </ToggleButtonGroup>
                <br></br>
                <Button variant="contained" onSubmit={(e) => submit(e)}>Submit</Button>
            </form>
        </div>
    );
}

export default PostForm;