import { FormGroup, Label, Button, Alert } from 'reactstrap';
import Logo from '../assets/logo.jpeg';
import { UserSchemaValidation } from '../validations/userSchemaValidation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getUser } from '../features/UserSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';

const Login = () => {

    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const user = useSelector((state) => state.users.user);
    const isSuccess = useSelector((state) => state.users.isSuccess);
    const isError = useSelector((state) => state.users.isError);

    const navigate = useNavigate();
    const location = useLocation();

    const [showRegisteredMsg, setShowRegisteredMsg] = useState(
        !!(location.state && location.state.justRegistered)
    );

    const {
        register,
        handleSubmit: submitForm,
        formState: { errors }
    } = useForm({ resolver: yupResolver(UserSchemaValidation) });

    const validate = () => {
        const data = {
            email: email,
            password: password,
        };
        dispatch(getUser(data));
    };

    // ✅ UPDATED REDIRECTION LOGIC
    useEffect(() => {
        if (isSuccess && user && user.email) {
            if (user.isAdmin) {
                navigate("/admin");   // redirect admin to dashboard
            } else {
                navigate("/home");    // normal user home page
            }
        }

        if (isError) {
            navigate("/");
        }
    }, [user, isSuccess, isError, navigate]);

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <img alt='Logo' height={36} src={Logo} />
                </div>

                {showRegisteredMsg && (
                    <Alert color="success" toggle={() => setShowRegisteredMsg(false)}>
                        You have successfully registered. Please sign in.
                    </Alert>
                )}

                <h2 className="auth-title">Sign In Form</h2>

                <form>
                    <FormGroup className='mb-3'>
                        <Label className='auth-label'>Email</Label>
                        <input
                            {...register('email', {
                                value: email,
                                onChange: (e) => setEmail(e.target.value)
                            })}
                            placeholder='example@mail.com'
                            type='email'
                            className='auth-input' />
                        <p className='auth-help' style={{ color: '#B3261E' }}>{errors.email?.message}</p>
                    </FormGroup>

                    <FormGroup className='mb-2'>
                        <Label className='auth-label'>Password</Label>
                        <input
                            {...register('password', {
                                value: password,
                                onChange: (e) => setPassword(e.target.value)
                            })}
                            placeholder='Enter your password'
                            type='password'
                            className='auth-input' />
                        <p className='auth-help' style={{ color: '#B3261E' }}>{errors.password?.message}</p>
                    </FormGroup>

                    <div className='auth-actions'>
                        <Button onClick={submitForm(validate)} className='auth-btn-primary w-100'>
                            Sign In
                        </Button>
                    </div>

                    <div className='auth-footer'>
                        No account? <Link to='/register'>Sign Up</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
