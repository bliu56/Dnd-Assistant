import './FileUpload.css';
import React, {useState} from 'react';

function FileUpload(){


    const [file, fileToChange] = useState();


    const fileChangeHandler = (event) =>
    {
        fileToChange(event.target.files[0]);
    }

    const FileUploadHandler =() =>  
    {

        console.log(file)
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function() {
            var data = JSON.parse(reader.result);

          };
          
    };
 

    return(


            <div>            

        
                <input type="file" id="inputFile" onChange={fileChangeHandler}/>

            <div>
                <button onClick={FileUploadHandler} >Submit</button>

            </div>
           
           
            </div>


    );
}

export default FileUpload;