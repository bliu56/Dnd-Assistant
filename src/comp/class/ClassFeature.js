import React, { useState, useEffect } from 'react';
import Axios from 'axios';

const file = require("../../json/classes.json")

function ClassFeature(name){

    const [classSearch, setClassSearch] = useState(name);

    const Test = () =>{
        console.log(classSearch);
    }

    return(
        <div>
            {name}
            <button onClick={Test}>test</button>
        </div>
    );
}

export default ClassFeature;