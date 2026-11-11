import { useCallback, useState } from 'react';
import { APP } from './config/app';
import { useInactivityReset } from './hooks/useInactivityReset';
import { IdleScreen } from './screens/IdleScreen';
import { SelectScreen } from './screens/SelectScreen';
import { ScanScreen } from './screens/ScanScreen';
import { ResultScreen } from './screens/ResultScreen';
import type { Measurement, ScreenId } from './types';

export default function App() {
  const [screen, setScreen] = useState<ScreenId>('idle');
  const [measurement, setMeasurement] = useState<Measurement | null>(null);

  const toIdle = useCallback(() => {
    setMeasurement(null);
    setScreen('idle');
  }, []);
  const toSelect = useCallback(() => setScreen('select'), []);
  const toScan = useCallback(() => setScreen('scan'), []);
  const onScanned = useCallback((m: Measurement) => {
    setMeasurement(m);
    setScreen('result');
  }, []);

  useInactivityReset(screen === 'idle' ? 0 : APP.idleTimeoutMs[screen], toIdle, screen);

  switch (screen) {
    case 'idle':
      return <IdleScreen onStart={toSelect} />;
    case 'select':
      return <SelectScreen onStart={toScan} onBack={toIdle} />;
    case 'scan':
      return <ScanScreen onComplete={onScanned} onCancel={toSelect} />;
    case 'result':
      return measurement ? (
        <ResultScreen measurement={measurement} onRescan={toScan} onDone={toIdle} />
      ) : null;
  }
}
