import { FormGroup, Label, Button } from 'reactstrap';
import Logo from '../assets/logo.jpeg';
import { UserRegisterSchemaValidation } from '../validations/UserRegisterSchemaValidation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { addUser } from '../features/UserSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.users.isLoading);
  const navigate = useNavigate();

  // form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [dob, setDob] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [gender, setGender] = useState('');

  // ❗ MAX DATE FOR 17-YEAR-OLD LIMIT
  const getMaxDOB = () => {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 17);
    return today.toISOString().split("T")[0];
  };
  const maxDate = getMaxDOB();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ resolver: yupResolver(UserRegisterSchemaValidation) });

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

    dispatch(addUser(data))
      .unwrap()
      .then(() => {
        navigate("/login", { state: { justRegistered: true } });
      })
      .catch(() => {});
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <img alt='Logo' height={36} src={Logo} />
        </div>
        <h2 className="auth-title">Sign Up</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup className='mb-3'>
            <Label className='auth-label'>Full Name</Label>
            <input
              {...register('fullName')}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder='Full Name'
              type='text'
              className='auth-input'
            />
            <p className='auth-help' style={{ color: '#B3261E' }}>{errors.fullName?.message}</p>
          </FormGroup>

          <FormGroup className='mb-3'>
            <Label className='auth-label'>Email</Label>
            <input
              {...register('email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='example@mail.com'
              type='email'
              className='auth-input'
            />
            <p className='auth-help' style={{ color: '#B3261E' }}>{errors.email?.message}</p>
          </FormGroup>

          <FormGroup className='mb-3'>
            <Label className='auth-label'>Password</Label>
            <input
              {...register('password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Enter your password'
              type='password'
              className='auth-input'
            />
            <p className='auth-help' style={{ color: '#B3261E' }}>{errors.password?.message}</p>
          </FormGroup>

          <FormGroup className='mb-3'>
            <Label className='auth-label'>Blood Type</Label>
            <select
              {...register('bloodType')}
              value={bloodType}
              onChange={(e) => setBloodType(e.target.value)}
              className='auth-input'
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
            <p className='auth-help' style={{ color: '#B3261E' }}>{errors.bloodType?.message}</p>
          </FormGroup>

          {/* 👇 UPDATED DATE OF BIRTH WITH 17+ LIMIT */}
          <FormGroup className='mb-3'>
            <Label className='auth-label'>Date of Birth</Label>
            <input
              {...register('dob')}
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              type='date'
              className='auth-input'
              max={maxDate}   // prevents selecting under 17
            />
            <p className='auth-help' style={{ color: '#B3261E' }}>{errors.dob?.message}</p>
          </FormGroup>

          <FormGroup className='mb-3'>
            <Label className='auth-label'>City</Label>
            <input
              {...register('city')}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              type='text'
              className='auth-input'
            />
            <p className='auth-help' style={{ color: '#B3261E' }}>{errors.city?.message}</p>
          </FormGroup>

          {/* 👇 UPDATED GENDER → RADIO BUTTONS */}
          <FormGroup className='mb-3'>
            <Label className='auth-label'>Gender</Label>

            <div style={{ display: 'flex', gap: '20px', marginTop: '5px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input
                  type="radio"
                  {...register("gender")}
                  value="Male"
                  checked={gender === "Male"}
                  onChange={(e) => setGender(e.target.value)}
                />
                Male
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input
                  type="radio"
                  {...register("gender")}
                  value="Female"
                  checked={gender === "Female"}
                  onChange={(e) => setGender(e.target.value)}
                />
                Female
              </label>
            </div>

            <p className='auth-help' style={{ color: '#B3261E' }}>{errors.gender?.message}</p>
          </FormGroup>

          <FormGroup className='mb-3'>
            <Label className='auth-label'>Medical History (optional)</Label>
            <textarea
              {...register('medicalHistory')}
              value={medicalHistory}
              onChange={(e) => setMedicalHistory(e.target.value)}
              className='auth-input'
              placeholder='Any relevant medical history (optional)'
            ></textarea>
          </FormGroup>

          <div className='auth-actions'>
            <Button type='submit' className='auth-btn-primary w-100' disabled={isLoading}>
              {isLoading ? 'Signing Up...' : 'Sign Up'}
            </Button>
          </div>

          <div className='auth-footer'>
            Already have an account? <a href='/login'>Sign In</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
