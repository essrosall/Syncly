import { useMemo, useState } from 'react';
import { useGlobalModal } from '../../contexts/GlobalModalContext';
import Button from './Button';
import Badge from './Badge';
import { LayoutDashboard, CheckSquare, Briefcase, BarChart3, Settings2, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

const TUTORIAL_SEEN_KEY = 'syncly:seenTutorialTour';

const tutorialSteps = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    title: 'Daily brief & quick overview',
    description: 'See today’s priorities and quick links to jump into work.',
    image: '/src/assets/hero.png',
  },
  {
    icon: CheckSquare,
    label: 'Tasks',
    title: 'Track tasks by status',
    description: 'Move tasks between columns to reflect progress and ownership.',
    image: '/src/assets/react.svg',
  },
  {
    icon: Briefcase,
    label: 'Workspaces',
    title: 'Organize projects and teams',
    description: 'Create separate workspaces for different projects and invite collaborators.',
    image: '/src/assets/logo.svg',
  },
  {
    icon: BarChart3,
    label: 'Analytics',
    title: 'Simple progress insights',
    description: 'Quick charts to help you spot trends and balance workload.',
    image: '/src/assets/vite.svg',
  },
];

const markTutorialSeen = () => {
  try {
    window.localStorage.setItem(TUTORIAL_SEEN_KEY, JSON.stringify({ completedAt: new Date().toISOString() }));
  } catch {
    // ignore storage issues
  }
};

const TutorialModal = ({ steps = tutorialSteps, sizeClass = 'max-w-6xl' }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const { closeModal } = useGlobalModal();

  const currentStep = steps[stepIndex] || steps[0];
  const StepIcon = currentStep.icon;

  const stepLabels = useMemo(() => steps.map((step) => step.label), [steps]);

  const goNext = () => setStepIndex((index) => Math.min(steps.length - 1, index + 1));
  const goBack = () => setStepIndex((index) => Math.max(0, index - 1));
  const finishTour = () => {
    markTutorialSeen();
    closeModal();
  };
  const skipTour = () => {
    markTutorialSeen();
    closeModal();
  };

  // Render as a fixed overlay so shell:false openings are visible.
  return (
    <div className="fixed inset-0 flex items-center justify-center p-6" style={{ zIndex: 9200 }}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeModal} style={{ zIndex: 9200 }} />
      <div className={`relative w-full ${sizeClass} tutorial-modal-root`} style={{ zIndex: 9300 }}>
        <div className="overflow-hidden rounded-lg bg-white dark:bg-neutral-800 shadow-[0_30px_80px_rgba(2,6,23,0.6)] border border-neutral-200">
          <div className="flex w-full min-h-[360px]">
            <div className="w-72 border-r border-neutral-100 p-4 dark:border-neutral-700">
              <div className="mb-3">
                <Badge variant="primary">Product tour</Badge>
                <h3 className="mt-3 text-base font-semibold text-neutral-900 dark:text-neutral-100">Quick walkthrough</h3>
                <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400">Click a step or use Next</p>
              </div>

              <nav className="space-y-2 overflow-y-auto max-h-[60vh]">
                {stepLabels.map((label, index) => {
                  const isActive = index === stepIndex;
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setStepIndex(index)}
                      className={`flex w-full items-center gap-3 rounded px-3 py-2 text-left text-sm transition-colors ${isActive ? 'bg-neutral-50 dark:bg-neutral-900' : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'}`}
                    >
                      <span className={`flex h-8 w-8 items-center justify-center rounded text-sm font-semibold ${isActive ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900' : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300'}`}>
                        {index + 1}
                      </span>
                      <span className="font-medium truncate">{label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="flex-1 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase text-neutral-500 dark:text-neutral-400">
                    <StepIcon size={16} />
                    <span>{currentStep.label}</span>
                  </div>
                  <h4 className="mt-2 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{currentStep.title}</h4>
                  <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{currentStep.description}</p>
                </div>

                <div className="text-sm text-neutral-500 dark:text-neutral-400">{stepIndex + 1}/{steps.length}</div>
              </div>

              {currentStep.image && (
                <div className="mt-6 flex items-center justify-center">
                  <img src={currentStep.image} alt={currentStep.label} className="max-h-64 w-full object-contain rounded" />
                </div>
              )}

              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-neutral-500 dark:text-neutral-400">Step {stepIndex + 1} of {steps.length}</div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" onClick={skipTour}>Skip</Button>
                  <Button variant="secondary" onClick={goBack} disabled={stepIndex === 0}><ChevronLeft size={16} /> Back</Button>
                  {stepIndex < steps.length - 1 ? (
                    <Button variant="primary" onClick={goNext}>Next</Button>
                  ) : (
                    <Button variant="primary" onClick={finishTour}>Finish tour</Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { TUTORIAL_SEEN_KEY };
export default TutorialModal;