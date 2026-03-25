import { useMask } from 'mask-hook';

const styles = {
  container: {
    fontFamily: 'system-ui, sans-serif',
    maxWidth: 480,
    margin: '40px auto',
    padding: '0 16px',
  },
  card: {
    border: '1px solid #ddd',
    borderRadius: 8,
    padding: 24,
    marginBottom: 24,
    background: '#fff',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  },
  label: {
    display: 'block',
    fontWeight: 600,
    marginBottom: 8,
    color: '#333',
  },
  inputRow: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: '8px 12px',
    fontSize: 16,
    border: '1px solid #ccc',
    borderRadius: 6,
    outline: 'none',
    letterSpacing: 2,
    fontFamily: 'monospace',
  },
  button: {
    padding: '8px 14px',
    fontSize: 14,
    border: '1px solid #888',
    borderRadius: 6,
    cursor: 'pointer',
    background: '#f5f5f5',
    whiteSpace: 'nowrap' as const,
  },
  info: {
    marginTop: 12,
    fontSize: 13,
    color: '#666',
    lineHeight: 1.6,
  },
  tag: {
    display: 'inline-block',
    background: '#eef',
    borderRadius: 4,
    padding: '1px 6px',
    fontFamily: 'monospace',
    color: '#334',
  },
  complete: {
    color: '#090',
    fontWeight: 600,
  },
  incomplete: {
    color: '#c60',
    fontWeight: 600,
  },
} as const;

function MaskField({ type }: { type: 'ssn' | 'ein' }) {
  const { displayValue, formattedValue, maskedValue, onChange, toggleMask, isMasked, isComplete, value } =
    useMask({ type, defaultMasked: false });

  const label = type === 'ssn' ? 'Social Security Number (SSN)' : 'Employer Identification Number (EIN)';
  const placeholder = type === 'ssn' ? '___-__-____' : '__-_______';

  return (
    <div style={styles.card}>
      <label style={styles.label}>{label}</label>
      <div style={styles.inputRow}>
        <input
          style={styles.input}
          type="text"
          inputMode="numeric"
          placeholder={placeholder}
          value={displayValue}
          onChange={(e) => onChange(e.target.value)}
          maxLength={type === 'ssn' ? 11 : 10}
        />
        <button style={styles.button} onClick={toggleMask}>
          {isMasked ? '👁 Show' : '🙈 Hide'}
        </button>
      </div>
      <div style={styles.info}>
        <div>
          Raw digits: <span style={styles.tag}>{value || '—'}</span>
        </div>
        <div>
          Formatted: <span style={styles.tag}>{formattedValue || '—'}</span>
        </div>
        <div>
          Masked: <span style={styles.tag}>{maskedValue || '—'}</span>
        </div>
        <div>
          Status:{' '}
          <span style={isComplete ? styles.complete : styles.incomplete}>
            {isComplete ? '✓ Complete' : `${value.length}/9 digits`}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div style={styles.container}>
      <h1 style={{ marginBottom: 8 }}>mask-hook demo</h1>
      <p style={{ color: '#555', marginBottom: 24 }}>
        Type digits into the fields below. The hook formats them automatically
        and lets you toggle between masked and plain display.
      </p>
      <MaskField type="ssn" />
      <MaskField type="ein" />
    </div>
  );
}
