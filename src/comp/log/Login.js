import './Login.css';
import { useState } from 'react'
import { Form, Button} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase-config';

function Login(){

    //Login email from the form
    const [email, setEmail] = useState("");
    //Password from the form
    const [password, setPassword] = useState("");

    //Used to naviagte to other pages
    const navigate = useNavigate();

    //Used to login via Google
    const provider = new GoogleAuthProvider();

    //Function that allows Google Login
    //If error is anything otherthan closin the Google popup, it alerts the user
    const googleSignIn = () => {
        signInWithPopup(auth, provider).then(
            (r) => {
                console.log(r);
                navigate('/')
            })
            .catch((error) => {
                if (error.code !== 'auth/popup-closed-by-user'){
                    alert("Error. Pls refresh the page and try again.")
                }
            });
    };

    //Function that lets you sign in with email and password
    const emailSignIn = () => {
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // const user = userCredential.user;
            console.log(userCredential)
            navigate('/')
        })
        .catch((error) => {
            alert('Invalid password or email');
        });
    };

    return(
        <>
            <div className='box'>
                <div className='box-items'>
                    <Form className='basic-login'>
                        {/* ---------------Email Form------------------ */}
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" onChange={(e) => {setEmail(e.target.value);}} autoComplete='off' />
                        </Form.Group>

                        {/* ---------------Password Form------------------ */}
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" onChange={(e) => {setPassword(e.target.value);}} autoComplete='off' />
                        </Form.Group>

                        {/* ---------------Password Reset------------------ */}
                        <div className='text-primary forget'>
                            <Link to='passwordrestore' className='remove-link'>
                                Forget Password
                            </Link>
                        </div>

                        {/* ---------------Login Button------------------ */}
                        <Button variant="primary" onClick={emailSignIn}>
                            Login
                        </Button>
                    </Form>

                    {/* ---------------Google Login------------------ */}
                    <div className='alt-login'>
                        <span className='google-button' onClick={googleSignIn}>
                            Google Sign In
                        </span>
                    </div>

                    {/* ---------------Create Account------------------ */}
                    <div className='text-primary sign-up-button'>
                        <Link to='signup' className='remove-link'>
                            Create Account
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;