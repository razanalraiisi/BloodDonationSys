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
    // Prefer Redux user blood type; fall back to per-user localStorage if present
    const donorBloodType = (() => {
        const bt = user?.bloodType;
        if (bt) return bt;
        try {
            const email = user?.email || localStorage.getItem('userEmail');
            if (email) {
                const saved = localStorage.getItem(`profile.${email}.bloodType`);
                if (saved) return saved;
            }
        } catch {}
        return 'Unknown';
    })();

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
    const [centers, setCenters] = useState([]);
    const [hospitalFileNumber, setHospitalFileNumber] = useState('');

    const [donationError, setDonationError] = useState('');
    const [donationSuccess, setDonationSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    // Eligibility based on previous donation interval
    const [eligibility, setEligibility] = useState({ eligibleNow: true, nextDate: null, daysLeft: 0, lastType: null });

    const getIntervalDays = (type) => {
        switch (type) {
            case 'Whole Blood':
                return 56;
            case 'Platelets':
                return 7;
            case 'Plasma':
                return 28;
            case 'Double Red Cells':
                return 112;
            default:
                return 56;
        }
    };

    useEffect(() => {
        const email = user?.email || localStorage.getItem('userEmail');
        if (!email) return;
        axios.post('http://localhost:5000/donation/mine', { email })
            .then(res => {
                const list = Array.isArray(res.data) ? res.data : [];
                if (list.length === 0) {
                    setEligibility({ eligibleNow: true, nextDate: null, daysLeft: 0, lastType: null });
                    return;
                }
                const last = list[0]; // server returns sorted desc
                const lastDate = new Date(last.createdAt);
                const days = getIntervalDays(last.donationType);
                const next = new Date(lastDate);
                next.setDate(next.getDate() + days);
                const today = new Date();
                const eligibleNow = today >= next;
                const daysLeft = eligibleNow ? 0 : Math.max(0, Math.ceil((next.getTime() - today.getTime()) / (1000*60*60*24)));
                setEligibility({ eligibleNow, nextDate: next, daysLeft, lastType: last.donationType });
            })
            .catch(() => setEligibility({ eligibleNow: true, nextDate: null, daysLeft: 0, lastType: null }));
    }, [user?.email]);

    // Load donation centers from server for hospital dropdown
    useEffect(() => {
        axios.get('http://localhost:5000/api/donation-centers')
            .then(res => {
                const list = Array.isArray(res.data) ? res.data : [];
                setCenters(list);
            })
            .catch(() => setCenters([]));
    }, []);

    const validate = () => {
        const errs = {};
        if (!feelingWell) errs.feelingWell = 'Please select Yes or No.';
        if (!healthChanges) errs.healthChanges = 'Please select Yes or No.';
        if (!medication) errs.medication = 'Please select Yes or No.';
        if (!chronicIllness) errs.chronicIllness = 'Please select Yes or No.';
        if (!donationType) errs.donationType = 'Please select a donation type.';
        if (!hospitalLocation.trim()) errs.hospitalLocation = 'Please enter a preferred location.';
        if (!hospitalFileNumber.trim()) errs.hospitalFileNumber = 'Please enter the hospital file number.';
        return errs;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const v = validate();
        if (Object.keys(v).length > 0) {
            setErrors(v);
            setDonationError('Please complete all required fields.');
            return;
        }
        // Eligibility check per requested rules:
        // Fail if: Q1=No OR Q2=Yes OR Q3=Yes OR Q4=Yes
        const shouldFail =
            (feelingWell === 'No') ||
            (healthChanges === 'Yes') ||
            (medication === 'Yes') ||
            (chronicIllness === 'Yes');

        if (shouldFail) {
            setDonationError("Donation failed because it didn't match the terms and conditions.");
            return;
        }

        // Block if not yet eligible based on interval since last donation
        if (!eligibility.eligibleNow && eligibility.nextDate) {
            setDonationError(`You are not eligible to donate yet. Please wait until ${eligibility.nextDate.toLocaleDateString()}.`);
            return;
        }

        setDonationError('');
        setErrors({});
        setDonationSuccess('');
        setIsSubmitting(true);

        const payload = {
            donorEmail: user?.email || '',
            donorName: donorName,
            bloodType: donorBloodType,
            donationType,
            hospitalLocation,
            hospitalFileNumber,
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
                    <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <button
                            aria-label='Go back'
                            onClick={()=>navigate(-1)}
                            style={{
                                position: 'absolute', left: 0,
                                background: '#fff', border: '1px solid #E5E7EB', borderRadius: 999,
                                width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.06)'
                            }}
                        >
                            ←
                        </button>
                        <img alt='Logo' height={36} src={Logo} />
                    </div>
                </div>
                <h2 className="auth-title">Donate Blood Form</h2>
                <p
                    className="auth-label"
                    style={{ marginTop: '-8px', marginBottom: '16px', textAlign: 'center' }}
                >
                    Donor: <strong>{donorName}</strong> — Blood Type:
                    {" "}
                    <span
                        style={{
                            display: 'inline-block',
                            marginLeft: 6,
                            padding: '2px 10px',
                            borderRadius: 999,
                            backgroundColor: '#F3F4F6',
                            border: '1px solid #E5E7EB',
                            fontWeight: 600,
                        }}
                    >
                        {donorBloodType}
                    </span>
                </p>
                {/* Info link directly under donor name */}
                <p className='auth-label' style={{ textAlign: 'center', marginBottom: 12 }}>
                    See <a href='/info' style={{ color: '#B3261E', textDecoration: 'underline' }}>Eligibility & Terms</a> before you donate.
                </p>
                {!user?.email && (
                    <Alert color="warning" className='mb-3'>
                        Please log in before submitting a donation.
                    </Alert>
                )}
                {/* Hospital File Number directly under donor name */}
                <FormGroup className='mb-3'>
                    <Label className='auth-label'>Hospital File Number</Label>
                    <input
                        className='auth-input'
                        type='text'
                        value={hospitalFileNumber}
                        onChange={(e)=>setHospitalFileNumber(e.target.value)}
                        placeholder='e.g., HFN-123456'
                    />
                    {errors.hospitalFileNumber && <p className='auth-help' style={{ color: '#B3261E' }}>{errors.hospitalFileNumber}</p>}
                </FormGroup>
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
                {!eligibility.eligibleNow && eligibility.nextDate && (
                    <Alert color="warning" className='mb-3'>
                        You are not eligible to donate yet. Next eligible date ({eligibility.lastType}): {eligibility.nextDate.toLocaleDateString()} {eligibility.daysLeft ? `• ${eligibility.daysLeft} day(s) left` : ''}
                    </Alert>
                )}
                <form onSubmit={handleSubmit}>
                    {/* 1. Quick Health Check */}
                    <FormGroup className='mb-3 auth-radio-group'>
                        <Label className='auth-label d-block'>Are you feeling well today?</Label>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <Label className='me-3'>
                                <input type='radio' name='feelingWell' checked={feelingWell==='Yes'} onChange={()=>setFeelingWell('Yes')} /> Yes
                            </Label>
                            <Label>
                                <input type='radio' name='feelingWell' checked={feelingWell==='No'} onChange={()=>setFeelingWell('No')} /> No
                            </Label>
                        </div>
                        {errors.feelingWell && <p className='auth-help' style={{ color: '#B3261E' }}>{errors.feelingWell}</p>}
                    </FormGroup>

                    <FormGroup className='mb-3 auth-radio-group'>
                        <Label className='auth-label d-block'>Any new health changes since your last donation?</Label>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <Label className='me-3'>
                                <input type='radio' name='healthChanges' checked={healthChanges==='Yes'} onChange={()=>setHealthChanges('Yes')} /> Yes
                            </Label>
                            <Label>
                                <input type='radio' name='healthChanges' checked={healthChanges==='No'} onChange={()=>setHealthChanges('No')} /> No
                            </Label>
                        </div>
                        {errors.healthChanges && <p className='auth-help' style={{ color: '#B3261E' }}>{errors.healthChanges}</p>}
                    </FormGroup>

                    <FormGroup className='mb-3 auth-radio-group'>
                        <Label className='auth-label d-block'>Are you currently taking any medication?</Label>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <Label className='me-3'>
                                <input type='radio' name='medication' checked={medication==='Yes'} onChange={()=>setMedication('Yes')} /> Yes
                            </Label>
                            <Label>
                                <input type='radio' name='medication' checked={medication==='No'} onChange={()=>setMedication('No')} /> No
                            </Label>
                        </div>
                        {errors.medication && <p className='auth-help' style={{ color: '#B3261E' }}>{errors.medication}</p>}
                    </FormGroup>

                    <FormGroup className='mb-3 auth-radio-group'>
                        <Label className='auth-label d-block'>Do you have any chronic illnesses?</Label>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <Label className='me-3'>
                                <input type='radio' name='chronicIllness' checked={chronicIllness==='Yes'} onChange={()=>setChronicIllness('Yes')} /> Yes
                            </Label>
                            <Label>
                                <input type='radio' name='chronicIllness' checked={chronicIllness==='No'} onChange={()=>setChronicIllness('No')} /> No
                            </Label>
                        </div>
                        {errors.chronicIllness && <p className='auth-help' style={{ color: '#B3261E' }}>{errors.chronicIllness}</p>}
                    </FormGroup>

                    <FormGroup className='mb-3 auth-radio-group'>
                        <Label className='auth-label d-block'>Have you traveled recently in the last 14 days? (Optional)</Label>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <Label className='me-3'>
                                <input type='radio' name='traveledRecent' checked={traveledRecent==='Yes'} onChange={()=>setTraveledRecent('Yes')} /> Yes
                            </Label>
                            <Label>
                                <input type='radio' name='traveledRecent' checked={traveledRecent==='No'} onChange={()=>setTraveledRecent('No')} /> No
                            </Label>
                        </div>
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
                        {errors.donationType && <p className='auth-help' style={{ color: '#B3261E' }}>{errors.donationType}</p>}
                    </FormGroup>


                    {/* 3. Preferred Hospital / Location (from donation centers) */}
                    <FormGroup className='mb-3'>
                        <Label className='auth-label'>Preferred Hospital / Location</Label>
                        <select
                            className='auth-input'
                            value={hospitalLocation}
                            onChange={(e)=>setHospitalLocation(e.target.value)}
                            style={{ width: '100%' }}
                        >
                            <option value=''>Select a center</option>
                            {centers.map((c) => (
                                <option key={c._id} value={c.name || c.hospital || ''}>
                                    {c.name || c.hospital || 'Unnamed Center'}
                                </option>
                            ))}
                        </select>
                        {errors.hospitalLocation && <p className='auth-help' style={{ color: '#B3261E' }}>{errors.hospitalLocation}</p>}
                    </FormGroup>

                    <div className='auth-actions'>
                        <Button
                            type='submit'
                            className='auth-btn-primary w-100'
                            disabled={
                                isSubmitting ||
                                !user?.email ||
                                !feelingWell || !healthChanges || !medication || !chronicIllness ||
                                !donationType || !hospitalLocation.trim() || !hospitalFileNumber.trim() ||
                                (!eligibility.eligibleNow && !!eligibility.nextDate)
                            }
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default DonateBlood;
