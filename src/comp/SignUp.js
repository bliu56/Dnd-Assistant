import './SignUp.css';
import { useState } from 'react'
import {Form, Button} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase-config';

function SignUp(){ 
    
    //Holds the email to sign up with
    const [newEmail, setNewEmail] = useState("");

    //Holds the password to set with email
    const [newPassword, setNewPassword] = useState("");

    //Should hold the same password as above to ensure correct password set
    const [comfirmPassword, setComfirmPassword] = useState("");

    //Used to naviagte between pages
    const navigate = useNavigate();

    //Function to signup
    const signup = () => {
        if(newPassword !== comfirmPassword){
            alert("Passwords do not match");
        }
        else
        {
            createUserWithEmailAndPassword(auth, newEmail, newPassword)
            .then((userCredential) => {
                console.log(userCredential);
                navigate('/login')
            })
            .catch((error) => {
                alert("Error. Plz refresh page and try again");
            });
        }
    }

    return(
        <>
            <div className='box'>
                <div className='box-items'>
                    <Form className='basic-login'>
                        {/* ---------------Email Form------------------ */}
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" onChange={(e) => {setNewEmail(e.target.value);}} autoComplete='off' />
                        </Form.Group>

                        {/* ---------------Password Form------------------ */}
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" onChange={(e) => {setNewPassword(e.target.value);}} autoComplete='off' />
                        </Form.Group>

                        {/* ---------------Password Comfirm Form------------------ */}
                        <Form.Group className="mb-3" controlId="formBasicComfirmPassword">
                            <Form.Label>Comfirm Password</Form.Label>
                            <Form.Control type="comfirmPassword" placeholder=" Enter the same password as above" onChange={(e) => {setComfirmPassword(e.target.value);}} autoComplete='off' />
                        </Form.Group>

                        {/* ---------------Sign Up Button------------------ */}
                        <Button variant="primary" onClick={signup}>
                            Sign Up
                        </Button>

                        {/* ---------------Back Button------------------ */}
                        <div className='back-button'>
                            <Link to='/login' className='remove-link'>
                                back
                            </Link>
                        </div>
                    </Form>
                </div>
            </div>
        </>
    );
}

export default SignUp;