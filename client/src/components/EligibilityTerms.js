import { Link, useNavigate } from 'react-router-dom';
import Logo from '../assets/logo.jpeg';
import { useState } from 'react';

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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 16, rowGap: 24 }}>
          <Card title="Eligibility Checklist" icon="✅">
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              <li>You are feeling well today.</li>
              <li>No recent health changes since your last donation.</li>
              <li>You are not currently taking any medication.</li>
              <li>You do not have chronic illnesses that prevent donation.</li>
            </ul>
          </Card>

          <Card title="Minimum Intervals" icon="⏱️">
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              <li><strong>Whole Blood:</strong> 56 days (8 weeks)</li>
              <li><strong>Platelets:</strong> 7 days</li>
              <li><strong>Plasma:</strong> 28 days</li>
              <li><strong>Double Red Cells:</strong> 112 days (16 weeks)</li>
            </ul>
            <p className="auth-help" style={{ marginTop: 8 }}>
              If you try to donate earlier, the Donate form will show your next eligible date and block submission.
            </p>
          </Card>

          <Card title="ID, Age & Safety" icon="🩺">
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              <li>Bring a valid ID on donation day.</li>
              <li>Meet the minimum age and weight per local regulations.</li>
              <li>Hydrate well and have a light meal before donating.</li>
            </ul>
          </Card>

          <Card title="Terms & Consent" icon="📄">
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              <li>Provide accurate information about your health history.</li>
              <li>Your data is used to provide services and ensure safety.</li>
              <li>By donating, you consent to standard screening and processing.</li>
            </ul>
          </Card>
        </div>

        <div className="auth-actions" style={{ display: 'flex', justifyContent: 'center', marginTop: 28, paddingTop: 10 }}>
          <Link className="auth-btn-primary" to="/donate">Go to Donate</Link>
        </div>
      </div>
    </div>
  );
};

export default EligibilityTerms;
