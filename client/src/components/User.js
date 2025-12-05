import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import axios from 'axios';

const User = () => {
    const user = useSelector((state)=>state.users.user);
    const [donations, setDonations] = useState([]);
    const [donationSort, setDonationSort] = useState(() => {
        try { return localStorage.getItem('profile.donationSort') || 'date_desc'; } catch { return 'date_desc'; }
    });
    const defPic = "https://i.pinimg.com/736x/b6/e6/87/b6e687094f11e465e7d710a6b5754a4e.jpg";
    const [displayName, setDisplayName] = useState(user?.fullName || user?.uname || "Guest");
    const [profileUrl, setProfileUrl] = useState('');
    const [editBloodType, setEditBloodType] = useState(user?.bloodType || 'Unknown');
    const dobRaw = user?.dob || user?.dateOfBirth || '';
    const [editDob, setEditDob] = useState(dobRaw ? new Date(dobRaw).toISOString().slice(0,10) : '');
    const [dobError, setDobError] = useState('');
    const [editPhone, setEditPhone] = useState('');
    const [healthHistory, setHealthHistory] = useState('');

    // fetch donations
    useEffect(() => {
        const email = user?.email;
        if (!email) return;
        axios.post('http://localhost:5000/donation/mine', { email })
            .then(res => setDonations(res.data || []))
            .catch(() => setDonations([]));
        // hydrate local edits
        try {
            const savedName = localStorage.getItem('profile.displayName');
            const savedPic = localStorage.getItem('profile.profileUrl');
            const savedBlood = localStorage.getItem('profile.bloodType');
            const savedDob = localStorage.getItem('profile.dob');
            const savedPhone = localStorage.getItem('profile.phone');
            const savedHealth = localStorage.getItem('profile.healthHistory');
            if (savedName) setDisplayName(savedName);
            if (savedPic) setProfileUrl(savedPic);
            if (savedBlood) setEditBloodType(savedBlood);
            if (savedDob) setEditDob(savedDob);
            if (savedPhone) setEditPhone(savedPhone);
            if (savedHealth) setHealthHistory(savedHealth);
        } catch {}
    }, [user?.email]);

    // compute next eligible donation
    const getIntervalDays = (type) => {
        switch (type) {
            case 'Whole Blood': return 56;
            case 'Platelets': return 7;
            case 'Plasma': return 28;
            case 'Double Red Cells': return 112;
            default: return 56;
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
        const diff = Math.max(0, Math.ceil((next.getTime() - today.getTime()) / (1000*60*60*24)));
        return { date: next, daysLeft: diff, type: last.donationType };
    };

    return (
        <div style={{ padding: 20, maxWidth: 1100, margin: '0 auto' }}>
            <h2 className='auth-title' style={{ textAlign: 'center', marginBottom: 24 }}>User Profile</h2>

            {/* Top: left profile + right donations */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'stretch' }}>
                {/* Left column: profile and editable fields */}
                <div className='auth-card' style={{ padding: 20, boxShadow: '0 6px 20px rgba(0,0,0,0.08)', borderRadius: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14, marginLeft: 6 }}>
                        <div style={{ position: 'relative', width: 104, height: 104 }}>
                            <img src={profileUrl || defPic} alt='avatar' style={{ width: 104, height: 104, borderRadius: '50%', objectFit: 'cover', boxShadow: '0 4px 14px rgba(0,0,0,0.15)', border: '2px solid #fff' }} />
                            <label
                                title='Upload Photo'
                                style={{ position: 'absolute', right: -6, bottom: -6, width: 28, height: 28, borderRadius: '50%', background: '#e4002b', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}
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
                                                try { localStorage.setItem('profile.profileUrl', url); } catch {}
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
                                    onChange={(e)=>{ setDisplayName(e.target.value); try { localStorage.setItem('profile.displayName', e.target.value); } catch {} }}
                                    placeholder='Your name'
                                    style={{ maxWidth: 320 }}
                                />
                            </div>
                            <div className='auth-label' style={{ color: '#4B5563', fontSize: 13, marginTop: 6 }}>{user?.email || ''}</div>
                            <div className='auth-label' style={{ marginTop: 12 }}>
                                <label style={{ display: 'block', fontSize: 12, color: '#6B7280' }}>Blood Type</label>
                                <select className='auth-input' value={editBloodType} onChange={(e)=>{ setEditBloodType(e.target.value); try { localStorage.setItem('profile.bloodType', e.target.value); } catch {} }} style={{ width: '100%' }}>
                                    <option>O+</option><option>O-</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option>
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
                                                    if (age < 17) { setDobError('You must be at least 17 years old.'); }
                                                    else { setDobError(''); try { localStorage.setItem('profile.dob', val); } catch {} }
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
                                    onChange={(e)=>{ const digits = (e.target.value || '').replace(/\D+/g, '').slice(0,8); setEditPhone(digits); try { localStorage.setItem('profile.phone', digits); } catch {} }}
                                    style={{ width: '100%' }}
                                />
                                <div className='auth-label' style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>Enter exactly 8 digits.</div>
                            </div>

                            {/* Next eligible donation box */}
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
                        </div>
                    </div>
                </div>

                {/* Right column: donation history with sorting */}
                <div className='auth-card' style={{ padding: 20, height: '100%', boxShadow: '0 6px 20px rgba(0,0,0,0.08)', borderRadius: 14 }}>
                    <div className='auth-title' style={{ fontSize: 20, fontWeight: 700, color: '#6B0000', textAlign: 'center', marginBottom: 10 }}>Donation History</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <span className='auth-label' style={{ color: '#374151', fontWeight: 600 }}>Your past donations</span>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                            <label className='auth-label' htmlFor='donation-sort' style={{ color: '#6B7280' }}>Sort</label>
                            <select id='donation-sort' className='auth-input' value={donationSort} onChange={(e)=>{ setDonationSort(e.target.value); try { localStorage.setItem('profile.donationSort', e.target.value); } catch {} }} style={{ maxWidth: 200, paddingRight: 28, background: '#F9FAFB', borderColor: '#E5E7EB' }}>
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
                                    default: return db - da;
                                }
                            })).map((d, idx) => (
                                <div key={d._id} style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: 14, marginBottom: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '24px 1fr', alignItems: 'center', columnGap: 10 }}>
                                        <span style={{ fontSize: 20, lineHeight: 1 }}>🩸</span>
                                        <div className='auth-label' style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', columnGap: 8 }}>
                                            <span>Hospital Name: {d.hospitalLocation || '—'}</span>
                                            <span style={{ whiteSpace: 'nowrap' }}>Date: {new Date(d.createdAt).toLocaleDateString()} • Time: {new Date(d.createdAt).toLocaleTimeString()}</span>
                                        </div>
                                    </div>
                                    <div className='auth-label' style={{ marginTop: 8 }}>
                                        <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: 999, background: '#f5f5f5', color: '#333', fontSize: 12 }}>{d.status || 'Submitted'}</span>
                                    </div>
                                    {idx < donations.length - 1 && (<div style={{ marginTop: 10, borderTop: '1px solid #eee' }} />)}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom row: Requests + Health History side-by-side */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 30, alignItems: 'stretch' }}>
                {/* My Blood Requests (history-only placeholder) */}
                <div className='auth-card' style={{ padding: 20, boxShadow: '0 6px 20px rgba(0,0,0,0.08)', borderRadius: 14, height: '100%' }}>
                    <div className='auth-title' style={{ fontSize: 20, fontWeight: 700, color: '#6B0000', textAlign: 'center', marginBottom: 14 }}>My Blood Requests</div>
                    <p className='auth-label' style={{ textAlign: 'center', marginBottom: 16 }}>Submitting requests is not available in the profile. This section only shows your request history.</p>
                    <div style={{ marginTop: 10 }}>
                        <div className='auth-title' style={{ fontSize: 15, marginBottom: 8 }}>History</div>
                        <p className='auth-label'>No requests yet.</p>
                    </div>
                </div>

                {/* Health History */}
                <div className='auth-card' style={{ padding: 20, boxShadow: '0 6px 20px rgba(0,0,0,0.08)', borderRadius: 14, height: '100%' }}>
                    <div className='auth-title' style={{ fontSize: 20, fontWeight: 700, color: '#6B0000', textAlign: 'center', marginBottom: 14 }}>Health History</div>
                    <p className='auth-label' style={{ textAlign: 'center', marginBottom: 12 }}>Add any relevant notes (allergies, past conditions, medications). This is private and stored locally until backend support.</p>
                    <label className='auth-label d-block' style={{ marginBottom: 6 }}>Notes</label>
                    <textarea className='auth-input' rows={8} placeholder='e.g., Allergy to penicillin. No chronic conditions. Not taking medication.' value={healthHistory} onChange={(e)=>{ setHealthHistory(e.target.value); try { localStorage.setItem('profile.healthHistory', e.target.value); } catch {} }} style={{ width: '100%' }} />
                </div>
            </div>
        </div>
    );
};

export default User;
