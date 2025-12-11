import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import axios from 'axios';
import { updateProfile, getProfile } from '../features/UserSlice';

const User = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state)=>state.users.user);
    const [donations, setDonations] = useState([]);
    // Confirmation modal state
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState('Are you sure you want to delete?');
    const [confirmAction, setConfirmAction] = useState(null);
    // Next eligible donation logic based on last donation type
    const getIntervalDays = (type) => {
        switch (type) {
            case 'Whole Blood':
                return 56; // 8 weeks
            case 'Platelets':
                return 7;
            case 'Plasma':
                return 28;
            case 'Double Red Cells':
                return 112; // 16 weeks
            default:
                return 56; // sensible default
        }
    };
    const computeNextEligible = () => {
        if (!donations || donations.length === 0) return { date: null, daysLeft: null, type: null };
        const last = donations[0]; 
        const lastDate = new Date(last.createdAt);
        const days = getIntervalDays(last.donationType);
        const next = new Date(lastDate);
        next.setDate(next.getDate() + days);
        const today = new Date();
        const msDiff = next.getTime() - today.getTime();
        const daysLeft = Math.max(0, Math.ceil(msDiff / (1000*60*60*24)));
        return { date: next, daysLeft, type: last.donationType };
    };
    const [requests, setRequests] = useState([]);
    const [requestSort, setRequestSort] = useState(() => {
        try { return localStorage.getItem('profile.requestSort') || 'date_desc'; } catch { return 'date_desc'; }
    });
    const fullName = user?.fullName || user?.uname || "Guest";
    const bloodType = user?.bloodType || 'Unknown';
    const dobRaw = user?.dob || user?.dateOfBirth || '';
    const [editBloodType, setEditBloodType] = useState(bloodType);
    const [editDob, setEditDob] = useState(dobRaw ? new Date(dobRaw).toISOString().slice(0,10) : '');
    const [dobError, setDobError] = useState('');
    const [editPhone, setEditPhone] = useState('');
    const defPic = "https://i.pinimg.com/736x/b6/e6/87/b6e687094f11e465e7d710a6b5754a4e.jpg";
    const [displayName, setDisplayName] = useState(fullName);
    const [profileUrl, setProfileUrl] = useState('');
    const [healthHistory, setHealthHistory] = useState('');
    const [donationSort, setDonationSort] = useState(() => {
        try { return localStorage.getItem('profile.donationSort') || 'date_desc'; } catch { return 'date_desc'; }
    });
    const [saveMessage, setSaveMessage] = useState('');

    const fetchDonations = (email) => {
        axios.post('https://blooddonationsys.onrender.com/donation/mine', { email })
            .then(res => setDonations(res.data || []))
            .catch(() => setDonations([]));
    };
    const fetchRequests = (email) => {
        axios.post('https://blooddonationsys.onrender.com/request/mine', { email })
            .then(res => setRequests(Array.isArray(res.data) ? res.data : []))
            .catch(() => setRequests([]));
    };
    useEffect(() => {
        const email = user?.email;
        if (!email) return;
        fetchDonations(email);
        fetchRequests(email);
        // hydrate local edits if present (scoped per user)
        try {
            const savedName = localStorage.getItem(`profile.${email}.displayName`);
            const savedPic = localStorage.getItem(`profile.${email}.profileUrl`); // per-user only
            const savedBlood = localStorage.getItem(`profile.${email}.bloodType`);
            const savedDob = localStorage.getItem(`profile.${email}.dob`);
            const savedPhone = localStorage.getItem(`profile.${email}.phone`);
            const savedHealth = localStorage.getItem('profile.healthHistory');
            if (savedName) setDisplayName(savedName);
            if (savedPic) setProfileUrl(savedPic);
            if (savedBlood) setEditBloodType(savedBlood);
            if (savedDob) setEditDob(savedDob);
            if (savedPhone) setEditPhone(savedPhone);
            if (savedHealth) setHealthHistory(savedHealth);
            // remove legacy global avatar key to prevent cross-user leakage
            try { localStorage.removeItem('profile.profileUrl'); } catch {}
        } catch {}
        const onRequestCreated = () => {
            if (user?.email) fetchRequests(user.email);
        };
        window.addEventListener('request-created', onRequestCreated);
        const onVisibility = () => {
            if (document.visibilityState === 'visible' && user?.email) {
                fetchRequests(user.email);
                fetchDonations(user.email);
            }
        };
        document.addEventListener('visibilitychange', onVisibility);
        return () => {
            window.removeEventListener('request-created', onRequestCreated);
            document.removeEventListener('visibilitychange', onVisibility);
        };
    }, [user?.email]);

    const handleSaveProfile = async () => {
        if (!user?.email) return;
        // Validate DOB age 17+
        const today = new Date();
        if (editDob) {
            const d = new Date(editDob);
            const age = today.getFullYear() - d.getFullYear() - ((today.getMonth() < d.getMonth() || (today.getMonth() === d.getMonth() && today.getDate() < d.getDate())) ? 1 : 0);
            if (age < 17) {
                setDobError('You must be at least 17 years old.');
                return;
            }
        }
        const payload = {
            email: user.email,
            fullName: displayName || user.fullName,
            city: user.city || '',
            bloodType: editBloodType || user.bloodType,
            medicalHistory: healthHistory || '',
            dob: editDob || user.dob || '',
            gender: user.gender || '',
        };
        try {
            await dispatch(updateProfile(payload)).unwrap();
            await dispatch(getProfile(user.email));
            try { window.dispatchEvent(new Event('profile-updated')); } catch {}
            setSaveMessage('Details are saved.');
            setTimeout(() => setSaveMessage(''), 3000);
        } catch (e) {
            setSaveMessage('Failed to save details.');
            setTimeout(() => setSaveMessage(''), 3000);
        }
    };

    return (
        <div style={{ padding: '24px 16px', maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ marginBottom: 16 }}>
                <button
                    onClick={() => navigate('/home')}
                    title='Go to Home'
                    style={{
                        background: '#B3261E',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 50,
                        width: 40,
                        height: 40,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: 20,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    }}
                >
                    <FaHome />
                </button>
            </div>
            <h2 className='auth-title' style={{ textAlign: 'center', marginBottom: 24 }}>User Profile</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'stretch' }}>
                {/* Left: Profile card */}
                <div className='auth-card' style={{ padding: 20, boxShadow: '0 6px 20px rgba(0,0,0,0.08)', borderRadius: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14, marginLeft: 6 }}>
                        <div style={{ position: 'relative', width: 104, height: 104 }}>
                            <img src={profileUrl || defPic} alt='avatar' style={{ width: 104, height: 104, borderRadius: '50%', objectFit: 'cover', boxShadow: '0 4px 14px rgba(0,0,0,0.15)', border: '2px solid #fff' }} />
                            <label
                                title='Upload Photo'
                                style={{
                                    position: 'absolute',
                                    right: -6,
                                    bottom: -6,
                                    width: 28,
                                    height: 28,
                                    borderRadius: '50%',
                                    backgroundColor: '#e4002b',
                                    border: '2px solid #fff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                                }}
                            >
                                <span style={{ fontSize: 18, lineHeight: 1, color: '#fff' }}>+</span>
                                <input
                                    type='file'
                                    accept='image/*'
                                    style={{ display: 'none' }}
                                    onChange={(e)=>{
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        const reader = new FileReader();
                                        reader.onload = () => {
                                            const url = reader.result;
                                            if (typeof url === 'string') {
                                                setProfileUrl(url);
                                                try {
                                                    const email = user?.email;
                                                    if (email) {
                                                        localStorage.setItem(`profile.${email}.profileUrl`, url);
                                                    }
                                                } catch {}
                                                try { window.dispatchEvent(new Event('profile-updated')); } catch {}
                                            }
                                        };
                                        reader.readAsDataURL(file);
                                    }}
                                />
                            </label>
                        </div>
                        <div style={{ flex: 1 }}>
                            <div className='auth-label' style={{ fontWeight: 700 }}>
                                <input
                                    className='auth-input'
                                    value={displayName}
                                    onChange={(e)=>{
                                        setDisplayName(e.target.value);
                                        try { 
                                            const email = user?.email;
                                            if (email) {
                                                localStorage.setItem(`profile.${email}.displayName`, e.target.value);
                                            }
                                        } catch {}
                                    }}
                                    placeholder='Your name'
                                    style={{ maxWidth: 320 }}
                                />
                            </div>
                            <div className='auth-label' style={{ color: '#4B5563', fontSize: 13, marginTop: 6 }}>
                                {user?.email || ''}
                            </div>
                            <div className='auth-label' style={{ marginTop: 12 }}>
                                <label style={{ display: 'block', fontSize: 12, color: '#6B7280' }}>Blood Type</label>
                                <select
                                    className='auth-input'
                                    value={editBloodType}
                                    onChange={(e)=>{ 
                                        setEditBloodType(e.target.value); 
                                        try { 
                                            const email = user?.email; 
                                            if (email) {
                                                localStorage.setItem(`profile.${email}.bloodType`, e.target.value);
                                            }
                                        } catch {} 
                                    }}
                                    style={{ width: '100%' }}
                                >
                                    <option>O+</option>
                                    <option>O-</option>
                                    <option>A+</option>
                                    <option>A-</option>
                                    <option>B+</option>
                                    <option>B-</option>
                                    <option>AB+</option>
                                    <option>AB-</option>
                                </select>
                            </div>
                            <div className='auth-label' style={{ marginTop: 12 }}>
                                <label style={{ display: 'block', fontSize: 12, color: '#6B7280' }}>Date of Birth</label>
                                {(() => {
                                    const today = new Date();
                                    const maxDobDate = new Date(today.getFullYear() - 17, today.getMonth(), today.getDate());
                                    const maxDob = maxDobDate.toISOString().slice(0,10);
                                    return (
                                        <>
                                            <input
                                                className='auth-input'
                                                type='date'
                                                value={editDob}
                                                max={maxDob}
                                                onChange={(e)=>{
                                                    const val = e.target.value;
                                                    setEditDob(val);
                                                    if (!val) { setDobError(''); return; }
                                                    const d = new Date(val);
                                                    const age = today.getFullYear() - d.getFullYear() - ((today.getMonth() < d.getMonth() || (today.getMonth() === d.getMonth() && today.getDate() < d.getDate())) ? 1 : 0);
                                                    if (age < 17) {
                                                        setDobError('You must be at least 17 years old.');
                                                    } else {
                                                        setDobError('');
                                                        try {
                                                            const email = user?.email;
                                                            if (email) {
                                                                localStorage.setItem(`profile.${email}.dob`, val);
                                                            }
                                                        } catch {}
                                                    }
                                                }}
                                                style={{ width: '100%', borderColor: dobError ? '#ef4444' : undefined }}
                                            />
                                            {dobError && (<div className='auth-label' style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{dobError}</div>)}
                                            {!dobError && editDob && (<div className='auth-label' style={{ color: '#6B7280', fontSize: 12, marginTop: 4 }}>Minimum age: 17+</div>)}
                                        </>
                                    );
                                })()}
                                
                            </div>
                            <div className='auth-label' style={{ marginTop: 12 }}>
                                <label style={{ display: 'block', fontSize: 12, color: '#6B7280' }}>Phone Number</label>
                                <input
                                    className='auth-input'
                                    type='tel'
                                    inputMode='numeric'
                                    pattern='\d{8}'
                                    maxLength={8}
                                    placeholder='99888888'
                                    value={editPhone}
                                    onChange={(e)=>{
                                        const digitsOnly = (e.target.value || '').replace(/\D+/g, '').slice(0,8);
                                        setEditPhone(digitsOnly);
                                        try {
                                            const email = user?.email;
                                            if (email) {
                                                localStorage.setItem(`profile.${email}.phone`, digitsOnly);
                                            }
                                        } catch {}
                                    }}
                                    style={{ width: '100%' }}
                                />
                                <div className='auth-label' style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>Enter exactly 8 digits.</div>
                            </div>
                        </div>
                    </div>
                    <div className='auth-label' style={{ lineHeight: 1.8 }}>
                        <div>Total Donations: {donations.length}</div>
                        <div>Last Donation: {donations[0] ? new Date(donations[0].createdAt).toLocaleDateString() : '—'}</div>
                        <div style={{ marginTop: 10, padding: 14, background: '#fff7f7', border: '1px solid #ffcccc', borderRadius: 10, boxShadow: '0 2px 6px rgba(228,0,43,0.08)' }}>
                            <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                <span style={{ display: 'inline-flex', width: 20, height: 20, borderRadius: '50%', background: '#e4002b', color: '#fff', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>!</span>
                                <span style={{ fontSize: 18 }}>Next Eligible Donation</span>
                            </div>
                            <div>
                                {(() => {
                                    const ne = computeNextEligible();
                                    if (!ne.date) return <span style={{ fontSize: 14, color: '#555' }}>No recent donations recorded.</span>;
                                    return <span style={{ fontSize: 16 }}>{ne.date.toLocaleDateString()} • {ne.daysLeft ? `${ne.daysLeft} day(s) left` : 'Eligible now'}</span>;
                                })()}
                            </div>
                        </div>
                        <div style={{ marginTop: 12 }}>
                            <button
                                onClick={handleSaveProfile}
                                style={{
                                    background: '#e4002b', color: '#fff', border: 'none', borderRadius: 8,
                                    padding: '8px 14px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
                                }}
                                disabled={!user?.email}
                            >Save Profile</button>
                            {saveMessage && (
                                <span className='auth-label' style={{ marginLeft: 10, color: saveMessage.includes('Failed') ? '#B3261E' : '#065F46' }}>
                                    {saveMessage}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Donation history list */}
                <div className='auth-card' style={{ padding: 20, height: '100%', boxShadow: '0 6px 20px rgba(0,0,0,0.08)', borderRadius: 14 }}>
                    <div className='auth-title' style={{ fontSize: 20, fontWeight: 700, color: '#6B0000', textAlign: 'center', marginBottom: 10 }}>Donation History</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <span className='auth-label' style={{ color: '#374151', fontWeight: 600 }}>Your past donations</span>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                            <label className='auth-label' htmlFor='donation-sort' style={{ color: '#6B7280' }}>Sort</label>
                            <select
                                id='donation-sort'
                                className='auth-input'
                                value={donationSort}
                                onChange={(e)=>{ setDonationSort(e.target.value); try { localStorage.setItem('profile.donationSort', e.target.value); } catch {} }}
                                style={{ maxWidth: 200, paddingRight: 28, background: '#F9FAFB', borderColor: '#E5E7EB' }}
                            >
                                <option value='date_desc'>Newest first</option>
                                <option value='date_asc'>Oldest first</option>
                            </select>
                        </div>
                    </div>
                    {donations.length === 0 ? (
                        <p className='auth-label' style={{ textAlign: 'center' }}>No donations submitted yet.</p>
                    ) : (
                        <div>
                            {([...donations].sort((a,b)=>{
                                const da = new Date(a.createdAt).getTime();
                                const db = new Date(b.createdAt).getTime();
                                switch (donationSort) {
                                    case 'date_asc': return da - db;
                                    case 'date_desc':
                                    default:
                                        return db - da;
                                }
                            })).map((d, idx) => (
                                <div
                                    key={d._id}
                                    style={{
                                        background: '#fff',
                                        border: '1px solid #E5E7EB',
                                        borderRadius: 12,
                                        padding: 14,
                                        marginBottom: 12,
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                                    }}
                                >
                                    <div style={{ display: 'grid', gridTemplateColumns: '24px 1fr', alignItems: 'center', columnGap: 10 }}>
                                        <span style={{ fontSize: 20, lineHeight: 1 }}>🩸</span>
                                        <div className='auth-label' style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', columnGap: 8 }}>
                                            <span>Hospital Name: {d.hospitalLocation || '—'}</span>
                                            <span style={{ whiteSpace: 'nowrap' }}>Date: {new Date(d.createdAt).toLocaleDateString()} • Time: {new Date(d.createdAt).toLocaleTimeString()}</span>
                                        </div>
                                    </div>
                                    <div className='auth-label' style={{ marginTop: 8 }}>
                                        <span
                                            style={{
                                                display: 'inline-block',
                                                padding: '4px 10px',
                                                borderRadius: 999,
                                                background: '#f5f5f5',
                                                color: '#333',
                                                fontSize: 12
                                            }}
                                        >
                                            {d.status || 'Submitted'}
                                        </span>
                                    </div>
                                    {idx < donations.length - 1 && (<div style={{ marginTop: 10, borderTop: '1px solid #eee' }} />)}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Requests and Health side-by-side */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 30, alignItems: 'stretch' }}>
                {/* My Blood Requests */}
                <div className='auth-card' style={{ padding: 20, boxShadow: '0 6px 20px rgba(0,0,0,0.08)', borderRadius: 14, height: '100%', overflow: 'hidden' }}>
                    <div className='auth-title' style={{ fontSize: 20, fontWeight: 700, color: '#6B0000', textAlign: 'center', marginBottom: 14 }}>My Blood Requests</div>
                    <p className='auth-label' style={{ textAlign: 'center', marginBottom: 16 }}>
                        Submitting requests is not available in the profile. This section only shows your request history.
                    </p>
                    <div style={{ marginTop: 10 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <div className='auth-title' style={{ fontSize: 15 }}>History</div>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                                <label className='auth-label' htmlFor='request-sort' style={{ color: '#6B7280' }}>Sort</label>
                                <select
                                    id='request-sort'
                                    className='auth-input'
                                    value={requestSort}
                                    onChange={(e)=>{ setRequestSort(e.target.value); try { localStorage.setItem('profile.requestSort', e.target.value); } catch {} }}
                                    style={{ maxWidth: 200, paddingRight: 28, background: '#F9FAFB', borderColor: '#E5E7EB' }}
                                >
                                    <option value='date_desc'>Newest first</option>
                                    <option value='date_asc'>Oldest first</option>
                                </select>
                            </div>
                        </div>
                        {requests.length === 0 ? (
                            <p className='auth-label'>No requests yet.</p>
                        ) : (
                            <div>
                                {[...requests].sort((a,b)=>{
                                    const da = a.neededDate ? new Date(a.neededDate).getTime() : (a.createdAt ? new Date(a.createdAt).getTime() : 0);
                                    const db = b.neededDate ? new Date(b.neededDate).getTime() : (b.createdAt ? new Date(b.createdAt).getTime() : 0);
                                    switch (requestSort) {
                                        case 'date_asc': return da - db;
                                        case 'date_desc':
                                        default: return db - da;
                                    }
                                }).map((r, idx) => {
                                    const rel = (r.relationship || '').toLowerCase();
                                    const mode = (r.mode || '').toLowerCase();
                                    const isSelf = mode === 'self' || rel === 'self';
                                    return (
                                        <div key={r._id || idx} style={{ border: '1px solid #E5E7EB', borderRadius: 12, padding: 14, marginBottom: 12, background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', columnGap: 12, width: '100%' }}>
                                                <span style={{
                                                    display: 'inline-block',
                                                    padding: '4px 10px',
                                                    borderRadius: 999,
                                                    background: isSelf ? '#E6FFFA' : '#F3F4F6',
                                                    border: '1px solid ' + (isSelf ? '#81E6D9' : '#E5E7EB'),
                                                    color: isSelf ? '#055C5C' : '#374151',
                                                    fontSize: 12,
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                    {isSelf ? 'Self' : 'Someone Else'}
                                                </span>
                                                <div className='auth-label' style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, alignItems: 'center', overflowWrap: 'anywhere' }}>
                                                    <span style={{ wordBreak: 'break-word' }}>Blood Type: <strong>{r.bloodType || '—'}</strong></span>
                                                    <span style={{ wordBreak: 'break-word' }}>Hospital: <strong>{r.hospital || '—'}</strong></span>
                                                    <span style={{ wordBreak: 'break-word' }}>Units: <strong>{r.bloodUnits ?? '—'}</strong></span>
                                                    <span style={{ wordBreak: 'break-word' }}>Relation: <strong>{r.relationship || (isSelf ? 'Self' : 'Someone Else')}</strong></span>
                                                </div>
                                                <span className='auth-label' style={{ whiteSpace: 'nowrap', textAlign: 'right' }}>Needed: {r.neededDate ? new Date(r.neededDate).toLocaleDateString() : '—'}</span>
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', marginTop: 8, width: '100%' }}>
                                                <span className='auth-label' style={{ wordBreak: 'break-word' }}>Status: <strong>{r.status || 'Submitted'}</strong></span>
                                                {r.mode && (
                                                    <span className='auth-label' style={{ whiteSpace: 'nowrap' }}>Mode: <strong>{r.mode}</strong></span>
                                                )}
                                            </div>
                                            {idx < requests.length - 1 && (<div style={{ marginTop: 10, borderTop: '1px solid #eee' }} />)}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Health History & Uploaded Reports */}
                <div className='auth-card' style={{ padding: 20, boxShadow: '0 6px 20px rgba(0,0,0,0.08)', borderRadius: 14, height: '100%' }}>
                    <div className='auth-title' style={{ fontSize: 20, fontWeight: 700, color: '#6B0000', textAlign: 'center', marginBottom: 14 }}>Health History</div>
                    <p className='auth-label' style={{ textAlign: 'center', marginBottom: 12 }}>
                        Notes from signup are shown below. Adding new notes is disabled.
                    </p>
                    <div>
                        {Array.isArray(user?.medicalNotes) && user.medicalNotes.length > 0 ? (
                            <div>
                                {user.medicalNotes.map((n, idx) => (
                                    <div key={n._id || idx} style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: 8, border: '1px solid #E5E7EB', borderRadius: 10, padding: 10, marginBottom: 10, background: '#fff' }}>
                                        <span className='auth-label' style={{ wordBreak: 'break-word' }}>{n.text}</span>
                                        <button
                                            style={{ background: '#B3261E', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer' }}
                                            onClick={()=>{
                                                if (!user?.email) return;
                                                setConfirmMessage('Are you sure you want to delete this note?');
                                                setConfirmAction(()=> async ()=>{
                                                    try {
                                                        await axios.delete(`https://blooddonationsys.onrender.com/profile/notes/${n._id || ''}`, { data: { email: user.email, text: n.text } });
                                                        try { await dispatch(getProfile(user.email)); } catch {}
                                                    } catch (e) {
                                                        try {
                                                            await axios.delete(`https://blooddonationsys.onrender.com/profile/notes`, { data: { email: user.email, index: idx } });
                                                            try { await dispatch(getProfile(user.email)); } catch {}
                                                        } catch {}
                                                    }
                                                });
                                                setConfirmOpen(true);
                                            }}
                                        >Delete</button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className='auth-label'>No health notes from signup.</p>
                        )}
                    </div>

                    <div className='auth-title' style={{ fontSize: 18, fontWeight: 700, color: '#6B0000', marginTop: 18, marginBottom: 10 }}>Uploaded Medical Reports</div>
                    <p className='auth-label' style={{ marginBottom: 8 }}>Files you uploaded with your blood requests.</p>
                    {(() => {
                        const items = (Array.isArray(requests) ? requests : []).filter(r => !!r.medicalReportPath);
                        if (items.length === 0) return (<p className='auth-label'>No uploaded reports.</p>);
                        return (
                            <div>
                                {items.map((r) => {
                                    const filename = (r.medicalReportPath || '').split('/').pop();
                                    const url = filename ? `https://blooddonationsys.onrender.com/uploads/${filename}` : '';
                                    return (
                                        <div key={r._id} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', alignItems: 'center', gap: 8, border: '1px solid #E5E7EB', borderRadius: 10, padding: 10, marginBottom: 10, background: '#fff' }}>
                                            <span className='auth-label' style={{ overflowWrap: 'anywhere' }}>{filename}</span>
                                            <a href={url} target='_blank' rel='noreferrer' style={{ textDecoration: 'none' }}>
                                                <button style={{ background: '#374151', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer' }}>View</button>
                                            </a>
                                            <button
                                                style={{ background: '#B3261E', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer' }}
                                                onClick={()=>{
                                                    if (!user?.email) return;
                                                    setConfirmMessage('Are you sure you want to delete this uploaded file?');
                                                    setConfirmAction(()=> async ()=>{
                                                        try {
                                                            await axios.delete(`https://blooddonationsys.onrender.com/request/${r._id}/attachment`, { data: { email: user.email } });
                                                            try { fetchRequests(user.email); } catch {}
                                                        } catch {}
                                                    });
                                                    setConfirmOpen(true);
                                                }}
                                            >Delete</button>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })()}
                </div>
                {/* Confirmation Modal */}
                {confirmOpen && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                        <div style={{ background: '#fff', borderRadius: 12, padding: 16, width: 'min(90vw, 380px)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
                            <div className='auth-title' style={{ fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 8 }}>Confirm Delete</div>
                            <div className='auth-label' style={{ color: '#374151', marginBottom: 12 }}>{confirmMessage}</div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                                <button
                                    onClick={()=>{ setConfirmOpen(false); setConfirmAction(null); }}
                                    style={{ background: '#e5e7eb', color: '#111827', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer' }}
                                >Cancel</button>
                                <button
                                    onClick={async ()=>{ 
                                        const action = confirmAction; 
                                        setConfirmOpen(false); 
                                        setConfirmAction(null); 
                                        try { if (action) await action(); } catch {}
                                    }}
                                    style={{ background: '#B3261E', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer' }}
                                >Delete</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default User;
