import './FileUpload.css';
import React, {useEffect, useState} from 'react';
import { auth } from '../firebase-config';
import userEvent from '@testing-library/user-event';
import { doc, getFirestore, setDoc } from "firebase/firestore"; 

const db=getFirestore();



function FileUpload(){

    const [extratedData, setData] = useState();

    const [file, fileToChange] = useState();


    const fileChangeHandler = (event) =>
    {
        fileToChange(event.target.files[0]);
    }

 

    const FileUploadHandler =() =>  
    {
                    const reader = new FileReader();
                    reader.readAsText(file);
                    reader.onload = function() {
                        var data = JSON.parse(reader.result);
                        var user=auth.currentUser;
                        const uid=user.uid;

                       // const uid="BWLSuKe0yMw206XTBrxC";
                        const path="User/"+uid+"/characters"
                        const fileName=file.name;
                        //setDoc("User/BWLSuKe0yMw206XTBrxC/characters", "test");
                        //const colRef=collection()
                        setDoc(doc(db,path, fileName), data);
                        

                        //SEPERATE folder should be named w/ uid
                        //ping/connect firebase w/ specific userID
                        //navigate to their specific table for characters
                        //push json to firebase folder
                        
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