import { Link } from 'react-router-dom';
import { Button } from '../components/ui';

const Privacy = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-neutral-900 px-4">
      <div className="max-w-3xl w-full">
        <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-neutral-600 mb-6">This is a placeholder for the Privacy Policy. Replace with your full privacy policy copy.</p>
        <div className="flex gap-3">
          <Link to="/signup"><Button variant="outline">Back</Button></Link>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
