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
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
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
    const [workDateState, setWorkDateState] = useState(new Date());

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

    if (typeof (clients) === 'undefined') return (
        <Box sx={{ display: 'flex' }}>
            <CircularProgress />
        </Box>
    )
    if (typeof (jobs) === 'undefined') return (
        <Box sx={{ display: 'flex' }}>
            <CircularProgress />
        </Box>
    )
    if (typeof (projects) === 'undefined') return (
        <Box sx={{ display: 'flex' }}>
            <CircularProgress />
        </Box>
    )

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
                    weekStartDayIndex={1}
                    placeholder="Work date"
                    onChange={(e) => {
                        setWorkDateState(e);
                        let date = e.toLocaleString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit', 
                            hour12: true 
                        });
                        data.workDate = date;
                    }}
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
                    <ToggleButton value="non-billable">Non-billable</ToggleButton>
                </ToggleButtonGroup>
                <br></br>
                <Button variant="contained" onClick={submit}>Submit</Button>
            </form>
        </div>
    );
}

export default PostForm;