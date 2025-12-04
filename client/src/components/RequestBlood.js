import { useState, useEffect } from 'react';
import { FormGroup, Label, Button } from 'reactstrap';
import axios from 'axios';
import { useSelector } from 'react-redux';

const RequestBlood = () => {
  const user = useSelector((state) => state.users.user);
  const [mode, setMode] = useState('self');
  const [fullName, setFullName] = useState('');
  const [patientId, setPatientId] = useState('');
  const [hospitalFileNumber, setHospitalFileNumber] = useState('');
  const [requesterRelationship, setRequesterRelationship] = useState('');
  const [email, setEmail] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [dateReq, setDateReq] = useState('');
  const [reason, setReason] = useState('');
  const [hospital, setHospital] = useState('');
  const [urgency, setUrgency] = useState('Normal');
  const [medicalReport, setMedicalReport] = useState(null);
  const [bloodUnits, setBloodUnits] = useState('');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const basePayload = { patientId, hospitalFileNumber, fullName, bloodType, dateReq, reason, hospital, urgency, bloodUnits, requesterRelationship };
      const payload = mode === 'self' ? { ...basePayload, email, mode: 'self' } : { ...basePayload, mode: 'other' };
      await axios.post("http://localhost:5000/request/create", {
        userEmail: user.email,
        patientName: fullName,
        bloodType,
        hospital,
        urgency,
        neededDate: dateReq
      });

      setMessage('Request submitted successfully');
      setFullName('');
      setEmail('');
      setBloodType('');
      setDateReq('');
      setReason('');
      setHospital('');
      setHospitalFileNumber('');
      setRequesterRelationship('');
      setUrgency('Normal');
      setMedicalReport(null);
      setBloodUnits('');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Submission failed';
      setError(msg);
    }
  };

  useEffect(() => {
    if (mode === 'self') {
      setFullName(user?.uname || '');
      setEmail(user?.email || '');
    } else {
      setFullName('');
      setEmail('');
      setPatientId('');
      setHospitalFileNumber('');
      setRequesterRelationship('');
    }
  }, [mode, user]);

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Request Blood Form</h2>
        <form onSubmit={handleSubmit}>
          <div className='form-grid'>
            <FormGroup className='mb-3 auth-radio-group col-span-2'>
              <Label className='auth-label d-block'>Request Type</Label>
              <Label className='me-3'>
                <input type='radio' name='reqtype' checked={mode === 'self'} onChange={() => setMode('self')} /> Request for Self
              </Label>
              <Label>
                <input type='radio' name='reqtype' checked={mode === 'other'} onChange={() => setMode('other')} /> Request for Someone Else
              </Label>
            </FormGroup>

            <FormGroup className='mb-3'>
              <Label className='auth-label'>Patient ID</Label>
              <input className='auth-input' type='text' value={patientId} onChange={(e) => setPatientId(e.target.value)} placeholder='Enter patient ID' disabled={mode === 'self'} />
            </FormGroup>
            <FormGroup className='mb-3'>
              <Label className='auth-label'>Hospital File Number</Label>
              <input className='auth-input' type='text' value={hospitalFileNumber} onChange={(e) => setHospitalFileNumber(e.target.value)} placeholder='Enter hospital file number' disabled={mode === 'self'} />
            </FormGroup>

            <FormGroup className='mb-3'>
              <Label className='auth-label'>Full Name</Label>
              <input className='auth-input' type='text' value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder='Enter full name' disabled={mode === 'self'} />
            </FormGroup>
            {mode === 'self' && (
              <FormGroup className='mb-3'>
                <Label className='auth-label'>Email</Label>
                <input className='auth-input' type='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='example@mail.com' disabled={mode === 'self'} />
              </FormGroup>
            )}

            <FormGroup className='mb-3'>
              <Label className='auth-label'>Blood Type</Label>
              <select className='auth-input' value={bloodType} onChange={(e) => setBloodType(e.target.value)} disabled={mode === 'self'}>
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
            </FormGroup>
            {mode === 'other' && (
              <FormGroup className='mb-3'>
                <Label className='auth-label'>Relationship to Patient</Label>
                <input className='auth-input' type='text' value={requesterRelationship} onChange={(e) => setRequesterRelationship(e.target.value)} placeholder='e.g., Parent, Sibling, Friend' />
              </FormGroup>
            )}

            <FormGroup className='mb-3'>
              <Label className='auth-label'>Blood Units (Optional)</Label>
              <input className='auth-input' type='number' min='1' max='10' value={bloodUnits} onChange={(e) => setBloodUnits(e.target.value)} placeholder='e.g., 2' />
            </FormGroup>
            <FormGroup className='mb-3'>
              <Label className='auth-label'>Date Required</Label>
              <input className='auth-input' type='date' value={dateReq} onChange={(e) => setDateReq(e.target.value)} />
            </FormGroup>

            <FormGroup className='mb-3'>
              <Label className='auth-label'>Reason for Request</Label>
              <input className='auth-input' type='text' value={reason} onChange={(e) => setReason(e.target.value)} placeholder='e.g., Surgery' />
            </FormGroup>
            <FormGroup className='mb-3'>
              <Label className='auth-label'>Hospital Name</Label>
              <input className='auth-input' type='text' value={hospital} onChange={(e) => setHospital(e.target.value)} placeholder='e.g., Sultan Qaboos Hospital' />
            </FormGroup>

            <FormGroup className='mb-3 col-span-2'>
              <Label className='auth-label'>Medical Report (Optional)</Label>
              <input
                className='auth-input'
                type='file'
                accept='.pdf,.jpg,.jpeg,.png'
                onChange={(e) => setMedicalReport(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
              />
              {medicalReport && (
                <p className='auth-help'>Selected: {medicalReport.name}</p>
              )}
            </FormGroup>

            <FormGroup className='mb-2 auth-radio-group col-span-2'>
              <Label className='auth-label d-block'>Urgency Level</Label>
              <Label className='me-3'>
                <input type='radio' name='urgency' checked={urgency === 'Normal'} onChange={() => setUrgency('Normal')} /> Normal
              </Label>
              <Label className='me-3'>
                <input type='radio' name='urgency' checked={urgency === 'Urgent'} onChange={() => setUrgency('Urgent')} /> Urgent
              </Label>
              <Label>
                <input type='radio' name='urgency' checked={urgency === 'Critical'} onChange={() => setUrgency('Critical')} /> Critical
              </Label>
            </FormGroup>

            <div className='auth-actions col-span-2'>
              <Button type='submit' className='auth-btn-primary w-100'>
                Submit
              </Button>
            </div>

            {message && <p className='auth-help col-span-2' style={{ color: '#2e7d32' }}>{message}</p>}
            {error && <p className='auth-help col-span-2' style={{ color: '#B3261E' }}>{error}</p>}
          </div>
        </form>
      </div>
    </div>
  );
}

export default RequestBlood;
