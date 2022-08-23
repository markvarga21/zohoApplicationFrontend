import React from 'react';
import PostForm from './components/PostForm';
import Axios from 'axios';


function loadZohoObjectsIntoDatabase() {
    Axios.get("http://localhost:8080/fill");
}

function App() {
  loadZohoObjectsIntoDatabase();
  return (
    <div className="App">
        <PostForm/>
    </div>
  );
}

export default App;
