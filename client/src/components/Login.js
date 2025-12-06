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

const Login = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.users.user);
  const isSuccess = useSelector((state) => state.users.isSuccess);
  const isError = useSelector((state) => state.users.isError);
  const errorMsg = useSelector((state) => state.users.errorMsg); 

  const navigate = useNavigate();
  const location = useLocation();

  const [topAlerts, setTopAlerts] = useState([]);
  const [showRegisteredMsg, setShowRegisteredMsg] = useState(
    !!(location.state && location.state.justRegistered)
  );

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(UserSchemaValidation),
    mode: "onSubmit",
  });

  const onValid = async (data) => {
    
    try {
      await dispatch(getUser(data)).unwrap();
      
    } catch (err) {
      
      setTopAlerts([err?.message || "Email or password is incorrect."]);
      setTimeout(() => setTopAlerts([]), 4000);
    }
  };

  const onInvalid = (formErrors) => {
    
    const messages = Object.values(formErrors).map(err => err.message);
    setTopAlerts(messages);
    setTimeout(() => setTopAlerts([]), 4000);
  };

  useEffect(() => {
    if (isSuccess && user && user.email) {
      if (user.isAdmin) navigate("/admin");
      else navigate("/home");
    }
  }, [isSuccess, user, navigate]);

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-header">
          <img alt="Logo" height={36} src={Logo} />
        </div>

        {showRegisteredMsg && (
          <Alert color="success" toggle={() => setShowRegisteredMsg(false)}>
             You have successfully registered. Please sign in.
          </Alert>
        )}

        {topAlerts.length > 0 && (
          <Alert color="danger" style={{ fontWeight: 'bold', background: '#ffe6e6', borderColor: '#ff4d4d', color: '#b30000' }}>
             Please check the following:
            <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
              {topAlerts.map((msg, idx) => <li key={idx}>{msg}</li>)}
            </ul>
          </Alert>
        )}

        <h2 className="auth-title">Sign In Form</h2>

        <form onSubmit={handleSubmit(onValid, onInvalid)}>

          
          <FormGroup className="mb-3">
            <Label className="auth-label">Email</Label>
            <input
              {...register("email")}
              placeholder="example@mail.com"
              type="text"   // Yup handles validation
              autoComplete="off"
              className={`auth-input ${errors.email ? "input-error" : ""}`}
            />
          </FormGroup>

          
          <FormGroup className="mb-2">
            <Label className="auth-label">Password</Label>
            <input
              {...register("password")}
              placeholder="Enter your password"
              type="password"
              autoComplete="off"
              className={`auth-input ${errors.password ? "input-error" : ""}`}
            />
          </FormGroup>

          <div className="auth-actions">
            <Button type="submit" className="auth-btn-primary w-100">
              Sign In
            </Button>
          </div>

          <div className="auth-footer">
            No account? <Link to="/register">Sign Up</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
