import { Link, useNavigate } from 'react-router-dom';
import Logo from '../assets/logo.jpeg';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Card = ({ title, children, icon }) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: '#fff',
        border: '1px solid #E5E7EB',
        borderRadius: 16,
        padding: 16,
        boxShadow: hover ? '0px 4px 12px rgba(0,0,0,0.08)' : '0 2px 6px rgba(0,0,0,0.05)',
        transform: hover ? 'translateY(-2px)' : 'none',
        transition: 'box-shadow 150ms ease, transform 150ms ease',
        minHeight: 180
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        {icon && (
          <span
            style={{
              width: 28,
              height: 28,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              marginLeft: 2,
              marginRight: 2
            }}
          >
            {icon}
          </span>
        )}
        <h3
          className="auth-title"
          style={{ fontSize: 20, fontWeight: 700, color: '#6b0000', margin: 0 }}
        >
          {title}
        </h3>
      </div>
      <div className="auth-label" style={{ lineHeight: 1.7 }}>{children}</div>
    </div>
  );
};

const EligibilityTerms = () => {
  const navigate = useNavigate();
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(()=>{
    let mounted = true;
    (async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/eligibility-terms');
        const items = Array.isArray(res.data) ? res.data : [];
        const activeSorted = items.filter(t=>t.active).sort((a,b)=> (a.order||0) - (b.order||0));
        if (mounted) setTerms(activeSorted);
      } catch (e) {
        if (mounted) setError('Unable to load terms right now.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return ()=>{ mounted = false; };
  }, []);

  return (
    <div className="auth-page" style={{ position: 'relative' }}>
      {/* Soft background shape */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(closest-side, rgba(255, 218, 218, 0.5), rgba(253, 244, 244, 0.3) 60%, rgba(253, 244, 244, 0) 100%)',
          pointerEvents: 'none'
        }}
      />
      <div className="auth-card" style={{ maxWidth: 960, margin: '0 auto' }}>
        <div className="auth-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, position: 'relative' }}>
          <button
            aria-label='Go back'
            onClick={()=>navigate('/home')}
            style={{
              position: 'absolute', left: 10,
              background: '#fff', border: '1px solid #E5E7EB', borderRadius: 999,
              width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.06)'
            }}
          >
            ←
          </button>
          <img alt='Logo' height={48} src={Logo} />
        </div>
        <h2 className="auth-title" style={{ textAlign: 'center' }}>Eligibility & Terms</h2>
        <p className="auth-label" style={{ textAlign: 'center', marginBottom: 20 }}>
          Please review these guidelines before attempting to donate.
        </p>

        {loading ? (
          <p className="auth-label" style={{ textAlign: 'center' }}>Loading terms…</p>
        ) : error ? (
          <p className="auth-label" style={{ textAlign: 'center', color: '#B3261E' }}>{error}</p>
        ) : terms.length === 0 ? (
          <p className="auth-label" style={{ textAlign: 'center' }}>No terms available.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 16, rowGap: 24 }}>
            {terms.map((t)=> (
              <Card key={t._id} title={t.title} icon="📄">
                <div style={{ whiteSpace: 'pre-wrap' }}>{t.description}</div>
                <div className="auth-help" style={{ marginTop: 8, color: '#6B7280' }}>
                  {t.category ? `Category: ${t.category}` : ''}
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="auth-actions" style={{ display: 'flex', justifyContent: 'center', marginTop: 28, paddingTop: 10 }}>
          <Link className="auth-btn-primary" to="/donate">Go to Donate</Link>
        </div>
      </div>
    </div>
  );
};

export default EligibilityTerms;
