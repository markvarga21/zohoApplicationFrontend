import React, { useState, useReducer } from "react";
import Axios from 'axios';
import { logRoles } from "@testing-library/react";
import Button from 'react-bootstrap/Button';



function PostForm(props) {
    const url = "http://localhost:8080/add";
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
    const [ignored, forceUpdate] = useReducer(x => x+1, 0);
    

    function jobListForClient(name) {
        /*
        const jobs = Axios.get("http://localhost:8080/jobs", {
            params: {
                'clientName': name
            }
        }).then(response => {
            console.log(response);
        })
        */
        if (name == "Aladar") return ["Job1", "Job2"];
        else return ["job3", "job4", "Job5"];
    }

    function getClients() {
        const request = Axios.get("http://localhost:8080/clients")
        .then(response => {
            return response.data;
        })
        
        //const ls = ["Aladar", "Janos"];
        //console.log(ls);
        //return ls;
    }

    function handle(e) {
        const newData = {...data}
        newData[e.target.id] = e.target.value
        setData(newData)
        console.log(newData)
        console.log(data.clientName)
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

    return (
        <div align="center">
            <form onSubmit={(e) => submit(e)}>
                <label>Client name:</label>
                {
                    getClients().map(item => {
                        return (
                            <div className="clientDiv">
                                <input type="radio" value={item} name="clientName" onChange={(e) => handle(e)} placeholder="clientName" id="clientName"/>
                                <label>{item}</label>
                            </div>
                        );
                    })
                }
                <label>Job name:</label>
                {
                    jobListForClient(data.clientName).map(item => {
                        return (
                            <div className="jobbDiv">
                                <input type="radio" value={item} name="jobName" onChange={(e) => handle(e)} placeholder="jobName" id="jobName"/>
                                <label>{item}</label>
                            </div>
                        );
                    })
                }
                <label>Project name:  </label>
                <input onChange={(e) => handle(e)} id="projectName" value={data.projectName} placeholder="projectName" type="text"></input>
                <br></br>
                <label>Work item name:  </label>
                <input onChange={(e) => handle(e)} id="workItem" value={data.workItem} placeholder="workItem" type="text"></input>
                <br></br>
                <label>Description:  </label>
                <input onChange={(e) => handle(e)} id="description" value={data.description} placeholder="description" type="text"></input>
                <br></br>
                <label>Work date:  </label>
                <input onChange={(e) => handle(e)} placeholder="date" id="workDate" value={data.workDate} type="workDate"></input>
                <br></br>
                <label>From time:  </label>
                <input onChange={(e) => handle(e)} id="fromTime" value={data.fromTime} placeholder="fromTime" type="text"></input>
                <br></br>
                <label>To time:  </label>
                <input onChange={(e) => handle(e)} id="toTime" value={data.toTime} placeholder="toTime" type="text"></input>
                <br></br>
                <label>Billable name:  </label>
                <input onChange={(e) => handle(e)} id="billable" value={data.billable} placeholder="billable" type="text"></input>
                <br></br>
                <button>Submit</button>
            </form>
        </div>
    );
}

export default PostForm;