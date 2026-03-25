import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import { EinFormats, SsnFormats, useMask } from 'mask-hook';
import type { MaskInfo } from 'mask-hook';

type TabKey = 'ssn' | 'ein';

type DemoPageProps = {
  title: string;
  description: string;
  placeholder: string;
  seedValue: string;
  maskInfo: MaskInfo;
};

function DemoPage({ title, description, placeholder, seedValue, maskInfo }: DemoPageProps) {
  const defaultMaskedValue = seedValue.replace(/\D/g, '');
  const [storedValue, setStoredValue] = useState(seedValue);

  const {
    displayedValue,
    isDirty,
    isNumberVisible,
    canEyeIconVisible,
    handleInputFocused,
    handleInputBlurred,
    setIsNumberVisible,
    onChangeText,
    initialize,
  } = useMask({
    maskInfo,
    defaultMaskedValue,
    unmaskedValue: storedValue,
    onValueChanged: setStoredValue,
  });

  useEffect(() => {
    initialize();
  }, [initialize]);

  const digitCount = storedValue.replace(/\D/g, '').length;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChangeText(event.target.value);
  };

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Focused page initialization</p>
          <h2>{title}</h2>
        </div>
        <button
          className="ghost-button green-button"
          type="button"
          onClick={() => setIsNumberVisible(!isNumberVisible)}
          disabled={!canEyeIconVisible}
        >
          {isNumberVisible ? 'Hide digits' : 'Show digits'}
        </button>
      </div>
      <p className="panel-copy">{description}</p>
      <label className="field-label" htmlFor={title}>
        Masked input
      </label>
      <input
        id={title}
        className="field-input"
        inputMode="numeric"
        maxLength={placeholder.length + 1}
        onBlur={handleInputBlurred}
        onChange={handleChange}
        onFocus={handleInputFocused}
        placeholder={placeholder}
        value={displayedValue}
      />
      <dl className="stats-grid">
        <div>
          <dt>Stored value</dt>
          <dd>{storedValue || 'empty'}</dd>
        </div>
        <div>
          <dt>Digits</dt>
          <dd>{digitCount}/9</dd>
        </div>
        <div>
          <dt>Visibility</dt>
          <dd>{isNumberVisible ? 'Visible' : 'Masked'}</dd>
        </div>
        <div>
          <dt>Dirty state</dt>
          <dd>{isDirty ? 'Modified' : 'Initial value'}</dd>
        </div>
      </dl>
    </section>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('ssn');

  return (
    <main className="app-shell">
      <section className="hero-card">
        <p className="eyebrow">mask-hook</p>
        <h1>demo-web</h1>
        <p className="hero-copy">
          Each tab mounts its page on selection, and that page immediately calls initialize so the masked default state is restored when the page loads.
        </p>
      </section>

      <nav className="tab-row" aria-label="Demo pages">
        <button
          className={activeTab === 'ssn' ? 'tab-button is-active' : 'tab-button'}
          type="button"
          onClick={() => setActiveTab('ssn')}
        >
          SSN page
        </button>
        <button
          className={activeTab === 'ein' ? 'tab-button is-active' : 'tab-button'}
          type="button"
          onClick={() => setActiveTab('ein')}
        >
          EIN page
        </button>
      </nav>

      {activeTab === 'ssn' ? (
        <DemoPage
            key="ssn"
          description="This page seeds a masked SSN and restores it whenever the tab becomes active."
          maskInfo={SsnFormats}
          placeholder="___-__-____"
          seedValue="6789"
          title="SSN Demo"
        />
      ) : (
        <DemoPage
            key="ein"
          description="This page uses the EIN format and the same initialize-on-focus pattern."
          maskInfo={EinFormats}
          placeholder="__-_______"
          seedValue="6789"
          title="EIN Demo"
        />
      )}
    </main>
  );
}