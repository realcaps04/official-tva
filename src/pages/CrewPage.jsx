import Members from '../components/Members';
import { useEffect } from 'react';

export default function CrewPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ paddingTop: '80px' }}>
      <Members limit={undefined} showViewAll={false} />
    </div>
  );
}
