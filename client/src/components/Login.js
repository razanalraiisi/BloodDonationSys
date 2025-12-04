import { Container, Row, Col, FormGroup, Label, Input, Button, Alert } from 'reactstrap';
import { UserSchemaValidation } from '../validations/userSchemaValidation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getUser } from '../features/UserSlice';
import {useDispatch,useSelector} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import Logo from "../assets/logo.jpeg";

const Login = () => {

    //UseStates
    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');
    const dispatch=useDispatch();
    const user=useSelector((state)=>state.users.user);
    const isSuccess=useSelector((state)=>state.users.isSuccess);
    const isError=useSelector((state)=>state.users.isError);
    const navigate=useNavigate();
    const location = useLocation();
    const [showRegisteredMsg, setShowRegisteredMsg] = useState(!!(location.state && location.state.justRegistered));

    //Validation Configuration
    const {
        register,
        handleSubmit: submitForm,
        formState: { errors }
    } = useForm({ resolver: yupResolver(UserSchemaValidation) });

    const validate = () => {
        const data={
            email:email,
            password:password,
        }
        dispatch(getUser(data));
    }

    useEffect(()=>{
        if (isSuccess && user && user.email) {
            navigate("/home");
        }
        if (isError) {
            navigate("/");
        }
    },[user,isSuccess,isError,navigate]);

    return (
        <div>
            <Container fluid>
                <Row className='div-row'>
                    <Col md='6' className='div-col'>
                        <form className='div-form'>
                            {showRegisteredMsg && (
                                <Alert color="success" toggle={()=>setShowRegisteredMsg(false)}>
                                    You have successfully registered. Please sign in.
                                </Alert>
                            )}
                            <div>
                                <img alt='Logo' className='img-fluid rounded mx-auto d-block' src={Logo} style={{width:"150px", height:"150px"}}></img>
                            </div>
                            <FormGroup>
                                <Label>Email</Label>
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
                                <Label>Password</Label>
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
                                <Input type='checkbox'></Input>
                                <Label>Remmber Me</Label>
                            </FormGroup>
                            <FormGroup>
                                <Button
                                    onClick={submitForm(validate)}
                                    className='form-control'
                                    color='dark'>
                                    Sign In
                                </Button>
                            </FormGroup>
                            <FormGroup className='text-center'>
                                <Label>Forget password</Label>
                            </FormGroup >
                            <FormGroup className='text-center'>
                                <Label>No Account? <Link to='/register'>Sign Up Now...</Link></Label>
                            </FormGroup>
                        </form>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Login;