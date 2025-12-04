import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import axios from 'axios';

const User = () => {
    const user = useSelector((state)=>state.users.user);
    const [donations, setDonations] = useState([]);
    const fullName = user?.fullName || user?.uname || "Guest";
    const defPic = "https://i.pinimg.com/736x/b6/e6/87/b6e687094f11e465e7d710a6b5754a4e.jpg";

    useEffect(() => {
        const email = user?.email;
        if (!email) return;
        axios.post('http://localhost:5000/donation/mine', { email })
            .then(res => setDonations(res.data || []))
            .catch(() => setDonations([]));
    }, [user?.email]);

    return (
        <>
            <img src={defPic} className='profilepic' />
            <h1>{fullName}</h1>
            <div className='auth-card' style={{ marginTop: 16, maxWidth: 680, marginLeft: 'auto', marginRight: 'auto' }}>
                <h3 className='auth-title' style={{ fontSize: 18 }}>My Donations</h3>
                {donations.length === 0 ? (
                    <p className='auth-label'>No donations submitted yet.</p>
                ) : (
                    <div>
                        {donations.map((d) => (
                            <div
                                key={d._id}
                                style={{
                                    background: '#fff',
                                    border: '1px solid #eee',
                                    borderRadius: 12,
                                    padding: 12,
                                    marginBottom: 12,
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <p className='auth-label' style={{ marginBottom: 4 }}>
                                        <strong>{d.donationType}</strong> • {d.bloodType}
                                    </p>
                                    <p className='auth-label' style={{ marginBottom: 4, fontSize: 12, color: '#666' }}>
                                        {new Date(d.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <p className='auth-label' style={{ marginBottom: 8 }}>
                                    <strong>Location:</strong> {d.hospitalLocation || '—'}
                                </p>
                                <span
                                    className='auth-label'
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
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default User;
