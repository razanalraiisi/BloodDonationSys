import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Alert } from 'reactstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../features/UserSlice';
import { FormGroup, Label, Button } from 'reactstrap';
import Logo from '../assets/logo.jpeg';

const DonateBlood = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.users.user);
    const donorName = user?.fullName || user?.uname || 'Guest';
    const donorBloodType = user?.bloodType || 'Unknown';

    useEffect(() => {
        // If we have a logged-in user but missing fields, refresh from DB
        if (user?.email && (!user.bloodType || !user.fullName)) {
            dispatch(getProfile(user.email));
        }
        // If Redux has no user, try loading email from localStorage and fetch profile
        if (!user?.email) {
            try {
                const email = localStorage.getItem('userEmail');
                if (email) {
                    dispatch(getProfile(email));
                } else {
                    // No user in Redux or localStorage: force login first
                    navigate('/login', { replace: true, state: { from: '/donate' } });
                }
            } catch {}
        }
    }, [dispatch, user?.email]);
    const [feelingWell, setFeelingWell] = useState('');
    const [healthChanges, setHealthChanges] = useState('');
    const [medication, setMedication] = useState('');
    const [chronicIllness, setChronicIllness] = useState('');
    const [traveledRecent, setTraveledRecent] = useState('');

    const [donationType, setDonationType] = useState('');

    const [hospitalLocation, setHospitalLocation] = useState('');

    const [donationError, setDonationError] = useState('');
    const [donationSuccess, setDonationSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Eligibility check per requested rules:
        // Fail if: Q1=No OR Q2=No OR Q3=Yes OR Q4=Yes
        const shouldFail =
            (feelingWell === 'No') ||
            (healthChanges === 'No') ||
            (medication === 'Yes') ||
            (chronicIllness === 'Yes');

        if (shouldFail) {
            setDonationError("Donation failed because it didn't match the terms and conditions.");
            return;
        }

        setDonationError('');
        setDonationSuccess('');
        setIsSubmitting(true);

        const payload = {
            donorEmail: user?.email || '',
            donorName: donorName,
            bloodType: donorBloodType,
            donationType,
            hospitalLocation,
            feelingWell,
            healthChanges,
            medication,
            chronicIllness,
            traveledRecent,
        };

        axios.post('http://localhost:5000/donation/create', payload)
            .then(() => {
                setDonationSuccess('Donation submitted successfully.');
            })
            .catch((err) => {
                const msg = err?.response?.data?.message || 'Failed to submit donation.';
                setDonationError(msg);
            })
            .finally(() => setIsSubmitting(false));
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <img alt='Logo' height={36} src={Logo} />
                </div>
                <h2 className="auth-title">Donate Blood Form</h2>
                <p className="auth-label" style={{ marginTop: '-8px', marginBottom: '16px' }}>
                    Donor: {donorName} — Blood Type: {donorBloodType}
                </p>
                {!user?.email && (
                    <Alert color="warning" className='mb-3'>
                        Please log in before submitting a donation.
                    </Alert>
                )}
                {donationError && (
                    <Alert color="danger" className='mb-3'>
                        {donationError}
                    </Alert>
                )}
                {donationSuccess && (
                    <Alert color="success" className='mb-3'>
                        {donationSuccess}
                    </Alert>
                )}
                <form onSubmit={handleSubmit}>
                    {/* 1. Quick Health Check */}
                    <FormGroup className='mb-3 auth-radio-group'>
                        <Label className='auth-label d-block'>Are you feeling well today?</Label>
                        <Label className='me-3'>
                            <input type='radio' name='feelingWell' checked={feelingWell==='Yes'} onChange={()=>setFeelingWell('Yes')} /> Yes
                        </Label>
                        <Label>
                            <input type='radio' name='feelingWell' checked={feelingWell==='No'} onChange={()=>setFeelingWell('No')} /> No
                        </Label>
                    </FormGroup>

                    <FormGroup className='mb-3 auth-radio-group'>
                        <Label className='auth-label d-block'>Any new health changes since your last donation?</Label>
                        <Label className='me-3'>
                            <input type='radio' name='healthChanges' checked={healthChanges==='Yes'} onChange={()=>setHealthChanges('Yes')} /> Yes
                        </Label>
                        <Label>
                            <input type='radio' name='healthChanges' checked={healthChanges==='No'} onChange={()=>setHealthChanges('No')} /> No
                        </Label>
                    </FormGroup>

                    <FormGroup className='mb-3 auth-radio-group'>
                        <Label className='auth-label d-block'>Are you currently taking any medication?</Label>
                        <Label className='me-3'>
                            <input type='radio' name='medication' checked={medication==='No'} onChange={()=>setMedication('No')} /> No
                        </Label>
                        <Label>
                            <input type='radio' name='medication' checked={medication==='Yes'} onChange={()=>setMedication('Yes')} /> Yes
                        </Label>
                    </FormGroup>

                    <FormGroup className='mb-3 auth-radio-group'>
                        <Label className='auth-label d-block'>Do you have any chronic illnesses?</Label>
                        <Label className='me-3'>
                            <input type='radio' name='chronicIllness' checked={chronicIllness==='No'} onChange={()=>setChronicIllness('No')} /> No
                        </Label>
                        <Label>
                            <input type='radio' name='chronicIllness' checked={chronicIllness==='Yes'} onChange={()=>setChronicIllness('Yes')} /> Yes
                        </Label>
                    </FormGroup>

                    <FormGroup className='mb-3 auth-radio-group'>
                        <Label className='auth-label d-block'>Have you traveled recently in the last 14 days? (Optional)</Label>
                        <Label className='me-3'>
                            <input type='radio' name='traveledRecent' checked={traveledRecent==='Yes'} onChange={()=>setTraveledRecent('Yes')} /> Yes
                        </Label>
                        <Label>
                            <input type='radio' name='traveledRecent' checked={traveledRecent==='No'} onChange={()=>setTraveledRecent('No')} /> No
                        </Label>
                    </FormGroup>

                    {/* 2. Donation Preferences */}
                    <FormGroup className='mb-3 auth-radio-group'>
                        <Label className='auth-label d-block'>Type of Donation</Label>
                        <Label className='me-3'>
                            <input type='radio' name='donationType' checked={donationType==='Whole Blood'} onChange={()=>setDonationType('Whole Blood')} /> Whole Blood
                        </Label>
                        <Label className='me-3'>
                            <input type='radio' name='donationType' checked={donationType==='Plasma'} onChange={()=>setDonationType('Plasma')} /> Plasma
                        </Label>
                        <Label>
                            <input type='radio' name='donationType' checked={donationType==='Platelets'} onChange={()=>setDonationType('Platelets')} /> Platelets
                        </Label>
                    </FormGroup>


                    {/* 3. Preferred Hospital / Location */}
                    <FormGroup className='mb-3'>
                        <Label className='auth-label'>Preferred Hospital / Location</Label>
                        <input
                            className='auth-input'
                            type='text'
                            value={hospitalLocation}
                            onChange={(e)=>setHospitalLocation(e.target.value)}
                            placeholder='Enter hospital or donation location'
                        />
                    </FormGroup>

                    <div className='auth-actions'>
                        <Button type='submit' className='auth-btn-primary w-100' disabled={isSubmitting || !user?.email}>
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default DonateBlood;
