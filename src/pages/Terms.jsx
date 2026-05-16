import { Link } from 'react-router-dom';
import { Button } from '../components/ui';

const Terms = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-neutral-900 px-4">
      <div className="max-w-3xl w-full">
        <h1 className="text-2xl font-bold mb-4">Terms of Service</h1>
        <p className="text-neutral-600 mb-6">This is a placeholder for the Terms of Service. Replace with your full terms copy.</p>
        <div className="flex gap-3">
          <Link to="/signup"><Button variant="outline">Back</Button></Link>
        </div>
      </div>
    </div>
  );
};

export default Terms;
