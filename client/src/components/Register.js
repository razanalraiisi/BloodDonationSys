import { Container, Row, Col, FormGroup, Label, Button } from 'reactstrap';
import Logo from '../assets/logo.png';
import { UserRegisterSchemaValidation } from '../validations/UserRegisterSchemaValidation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useEffect } from 'react';
import { addUser } from '../features/UserSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const dispatch = useDispatch();
  const message = useSelector((state) => state.users.message);
  const navigate = useNavigate();

  // form fields state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [dob, setDob] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [gender, setGender] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ resolver: yupResolver(UserRegisterSchemaValidation) });

  // Send form data to backend
  const onSubmit = () => {
    const data = {
      fullName,
      email,
      password,
      bloodType,
      dob,
      city,
      gender,
      medicalHistory
    };

    dispatch(addUser(data));
  };

  // Watch register success/error
  useEffect(() => {
    if (message === "User already exists") {
      alert("User already exists");
    } else if (message === "User registered successfully") {
      alert("Registration successful!");
      navigate("/login");
    }
  }, [message, navigate]);

  return (
    <div>
      <Container fluid>
        <Row className='div-row'>
          <Col md='6' className='div-col'>
            <form className='div-form' onSubmit={handleSubmit(onSubmit)}>
              <div>
                <img alt='Logo' className='img-fluid rounded mx-auto d-block' src={Logo}></img>
              </div>

              {/* FULL NAME */}
              <FormGroup>
                <Label>Full Name:</Label>
                <input
                  {...register('fullName')}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder='Full Name'
                  type='text'
                  className='form-control'
                />
                <p style={{ color: 'red' }}>{errors.fullName?.message}</p>
              </FormGroup>

              {/* EMAIL */}
              <FormGroup>
                <Label>Email:</Label>
                <input
                  {...register('email')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='Email'
                  type='email'
                  className='form-control'
                />
                <p style={{ color: 'red' }}>{errors.email?.message}</p>
              </FormGroup>

              {/* PASSWORD */}
              <FormGroup>
                <Label>Password:</Label>
                <input
                  {...register('password')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='Password'
                  type='password'
                  className='form-control'
                />
                <p style={{ color: 'red' }}>{errors.password?.message}</p>
              </FormGroup>

              {/* BLOOD TYPE */}
              <FormGroup>
                <Label>Blood Type:</Label>
                <select
                  {...register('bloodType')}
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                  className='form-control'
                >
                  <option value=''>Select</option>
                  <option>O+</option>
                  <option>O-</option>
                  <option>A+</option>
                  <option>A-</option>
                  <option>B+</option>
                  <option>B-</option>
                  <option>AB+</option>
                  <option>AB-</option>
                </select>
                <p style={{ color: 'red' }}>{errors.bloodType?.message}</p>
              </FormGroup>

              {/* DOB */}
              <FormGroup>
                <Label>Date of Birth:</Label>
                <input
                  {...register('dob')}
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  type='date'
                  className='form-control'
                />
                <p style={{ color: 'red' }}>{errors.dob?.message}</p>
              </FormGroup>

              {/* CITY */}
              <FormGroup>
                <Label>City:</Label>
                <input
                  {...register('city')}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  type='text'
                  className='form-control'
                />
                <p style={{ color: 'red' }}>{errors.city?.message}</p>
              </FormGroup>

              {/* GENDER */}
              <FormGroup>
                <Label>Gender:</Label>
                <select
                  {...register('gender')}
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className='form-control'
                >
                  <option value=''>Select</option>
                  <option>Female</option>
                  <option>Male</option>
                  <option>Other</option>
                </select>
                <p style={{ color: 'red' }}>{errors.gender?.message}</p>
              </FormGroup>

              {/* MEDICAL HISTORY */}
              <FormGroup>
                <Label>Medical History (optional):</Label>
                <textarea
                  {...register('medicalHistory')}
                  value={medicalHistory}
                  onChange={(e) => setMedicalHistory(e.target.value)}
                  className='form-control'
                  placeholder='Any relevant medical history (optional)'
                ></textarea>
              </FormGroup>

              {/* SUBMIT BUTTON */}
              <FormGroup>
                <Button type='submit' className='form-control' color='dark'>
                  Sign Up
                </Button>
              </FormGroup>

            </form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;
