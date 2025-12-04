import { Container, Row, Col, FormGroup, Label, Button } from 'reactstrap';
import { UserRegisterSchemaValidation } from '../validations/UserRegisterSchemaValidation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useEffect } from 'react';
import { addUser } from '../features/UserSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Logo from "../assets/logo.jpeg";
 
const Register = () => {
 

    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');
    let [uname, setuname] = useState('');
    let [pic, setPic] = useState('');
    const dispatch = useDispatch();
    const message = useSelector((state) => state.users.message);
    const navigate = useNavigate();
 

    const {
        register,
        handleSubmit: submitForm,
        formState: { errors }
    } = useForm({ resolver: yupResolver(UserRegisterSchemaValidation) });
 
    const validate = () => {
        const data = {
            uname: uname,
            email: email,
            password: password,
            profilepic: pic
        };
        dispatch(addUser(data));
    };
 
    useEffect(() => {
        if (message === "User already exists") {
            alert("User already exists");
        } else if (message === "User registered successfully") {
            alert("Registration successful!");
            navigate("/");
        }
    }, [message, navigate]);
 
    return (
        <div>
            <Container fluid>
                <Row className='div-row'>
                    <Col md='6' className='div-col'>
                        <form className='div-form'>
                            <div>
                                <img alt='Logo' className='img-fluid rounded mx-auto d-block' src={Logo} style={{width:"150px", height:"150px"}}></img>
                            </div>
                            <FormGroup>
                                <Label>UserName:</Label>
                                <input
                                    {...register('uname', {
                                        value: uname,
                                        onChange: (e) => setuname(e.target.value)
                                    })}
                                    placeholder='Please Enter your username here...'
                                    type='text' className='form-control' />
                                <p style={{ color: 'red' }}>{errors.uname?.message}</p>
                            </FormGroup>
                            <FormGroup>
                                <Label>Profile Picture:</Label>
                                <input
                                    {...register('pic', {
                                        value: pic,
                                        onChange: (e) => setPic(e.target.value)
                                    })}
                                    placeholder='Please Enter your Profile picture here...'
                                    type='text' className='form-control' />
                                <p style={{ color: 'red' }}>{errors.pic?.message}</p>
                            </FormGroup>
                            <FormGroup>
                                <Label>Email:</Label>
                                <input
                                    {...register('email', {
                                        value: email,
                                        onChange: (e) => setEmail(e.target.value)
                                    })}
                                    placeholder='Please Enter your Email here...'
                                    type='email' className='form-control' />
                                <p style={{ color: 'red' }}>{errors.email?.message}</p>
                            </FormGroup>
                            <FormGroup>
                                <Label>Password:</Label>
                                <input
                                    {...register('password', {
                                        value: password,
                                        onChange: (e) => setPassword(e.target.value)
                                    })}
                                    placeholder='Please Enter your Password here...'
                                    type='password' className='form-control' />
                                <p style={{ color: 'red' }}>{errors.password?.message}</p>
                            </FormGroup>
                            <FormGroup>
                                <Button
                                    onClick={submitForm(validate)}
                                    className='form-control'
                                    color='dark'>
                                    Sign In
                                </Button>
                            </FormGroup>
                            <FormGroup>
                                <p>{message}</p>
                            </FormGroup>
                        </form>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
 
export default Register;