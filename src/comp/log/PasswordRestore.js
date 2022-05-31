import './PasswordRestore.css';
import { Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../../firebase-config';

function PasswordRestore(){

    //Takes in the email to be sent the reset link
    //Default set to null
    const [resetEmail, setResetEmail] = useState("null");

    //Holds whether email has been sent yet
    const [sentEmail, setSentEmail] = useState(false);

    //Used to navigate to other pages
    const navigate = useNavigate();

    //Fucntion that resets the password
    //On success, then shows the page that tells user email is sent
    //On fail, if the email is not in our database, we ignore the error for security reasons
    //If the email is invalid (not an email), we alert the user that the email is invalid.
    //Else general error alert
    const resetPassword = () => {
        if(resetEmail === "null"){
            alert("Please enter an email");
        }
        else
        {
            sendPasswordResetEmail(auth, resetEmail)
            .then(() => {
                setSentEmail(true);
            })
            .catch((error) => {
                if(error.code !== 'auth/user-not-found'){
                    if(error.code !== 'auth/invalid-email'){
                        console.log(error.code)
                        alert("Error. Pls refresh page and try again");
                    }
                    else{
                        alert("Invalid Email")
                    }
                }
                else{
                    setSentEmail(true);
                }
            });
        }
    }

    return(
        <>
            <div className='box'>
                <div className='box-items'>
                    {/* ---------------Email Reset Form------------------ */}
                    <Form className={ sentEmail? 'keep-hidden' : 'basic-reset'}>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Password Recovery</Form.Label>
                                <div>
                                    <Form.Text>Enter your email to reset your password</Form.Text>
                                </div>
                                <Form.Control type="email" placeholder="Enter email" autoComplete='off' 
                                    onChange={(e) => {setResetEmail(e.target.value);}}/>
                            </Form.Group>
                    </Form>

                    {/* ---------------Email Reset Sent Form------------------ */}
                    <Form className={ sentEmail? 'basic-reset' : 'keep-hidden'}>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Email Sent</Form.Label>
                                <div>
                                    <Form.Text>Please check your email to reset your password</Form.Text>
                                </div>
                            </Form.Group>
                    </Form>
                </div>

                {/* ---------------Reset Button------------------ */}
                <div className={ sentEmail? 'keep-hidden' : 'box-items'}>
                    <Button variant='primary reset-button' onClick={()=>{resetPassword();}}>
                        Submit
                    </Button>
                </div>

                {/* ---------------Back to Login Button------------------ */}
                <div className={ sentEmail? 'box-items' : 'keep-hidden'}>
                    <Button variant='primary reset-button' onClick={()=>{navigate('/login')}}>
                        Back to login
                    </Button>
                </div>
            </div>
        </>
    );
}

export default PasswordRestore;