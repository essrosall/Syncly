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
    title: 'Start with the daily brief',
    description: 'Your dashboard brings together the daily brief, welcome message, and the most important work so you can decide what needs attention first.',
    hint: 'Use this area to scan the day before opening tasks or settings.',
  },
  {
    icon: CheckSquare,
    label: 'Tasks',
    title: 'Keep work organized by status',
    description: 'The Tasks board helps you move work between To Do, In Progress, Review, and Done so everything stays easy to track.',
    hint: 'This is where most users spend their time managing daily work.',
  },
  {
    icon: Briefcase,
    label: 'Workspaces',
    title: 'Group related work together',
    description: 'Workspaces keep projects separated, making it easier to manage teams, invite others, and switch between different areas of work.',
    hint: 'Use this when you want to separate product, design, and backend tasks.',
  },
  {
    icon: BarChart3,
    label: 'Analytics',
    title: 'Track progress at a glance',
    description: 'Analytics shows trends, completion balance, and workload patterns so you can see how the team is moving.',
    hint: 'Check this when you want a quick overview of progress.',
  },
  {
    icon: Settings2,
    label: 'Settings',
    title: 'Adjust your account and app options',
    description: 'Settings is where you review profile details, tutorials, and deployment-facing options as the app gets closer to production.',
    hint: 'Use this area for preferences and system setup.',
  },
];

const markTutorialSeen = () => {
  try {
    window.localStorage.setItem(TUTORIAL_SEEN_KEY, JSON.stringify({ completedAt: new Date().toISOString() }));
  } catch {
    // ignore storage issues
  }
};

const TutorialModal = ({ steps = tutorialSteps }) => {
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

  return (
    <div className="w-full max-w-none space-y-8">
      <div className="flex items-start justify-between gap-8">
        <div className="space-y-3">
          <Badge variant="primary" className="w-fit">Product tour</Badge>
          <h3 className="max-w-3xl text-3xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-100">A quick walkthrough of Syncly</h3>
          <p className="max-w-3xl text-base leading-7 text-neutral-600 dark:text-neutral-300">
            This tour explains the main parts of the system in a simple step-by-step modal. Use Next to continue, Back to review, or Skip to close it anytime.
          </p>
        </div>
        <div className="hidden rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 md:block">
          Available after successful login
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800">
          {stepLabels.map((label, index) => {
            const isActive = index === stepIndex;

            return (
              <button
                key={label}
                type="button"
                onClick={() => setStepIndex(index)}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-4 text-left text-sm transition-colors ${
                  isActive
                    ? 'bg-white text-neutral-950 shadow-sm ring-1 ring-neutral-200 dark:bg-neutral-700 dark:text-neutral-100 dark:ring-neutral-600'
                    : 'text-neutral-600 hover:bg-white hover:text-neutral-950 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-neutral-100'
                }`}
              >
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold ${isActive ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950' : 'bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300'}`}>
                  {index + 1}
                </span>
                <span className="font-medium">{label}</span>
              </button>
            );
          })}
        </div>

        <div className="min-h-[24rem] rounded-3xl border border-neutral-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] dark:border-neutral-700 dark:bg-neutral-800">
          <div className="flex items-start justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
                <StepIcon size={14} />
                <span>{currentStep.label}</span>
              </div>
              <h4 className="max-w-2xl text-3xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-100">{currentStep.title}</h4>
              <p className="max-w-2xl text-base leading-8 text-neutral-600 dark:text-neutral-300">{currentStep.description}</p>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-medium text-neutral-500 dark:border-neutral-700 dark:bg-neutral-700 dark:text-neutral-300">
              {stepIndex + 1}/{steps.length}
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-dashed border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-700 dark:bg-neutral-900/40">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">What to focus on</p>
            <p className="mt-3 text-base leading-7 text-neutral-700 dark:text-neutral-300">{currentStep.hint}</p>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <div className="text-sm text-neutral-500 dark:text-neutral-400">
              Step {stepIndex + 1} of {steps.length}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" type="button" onClick={skipTour}>
                Skip
              </Button>
              <Button type="button" variant="secondary" onClick={goBack} disabled={stepIndex === 0}>
                <ChevronLeft size={16} />
                Back
              </Button>
              {stepIndex < steps.length - 1 ? (
                <Button type="button" variant="primary" onClick={goNext}>
                  Next
                  <ChevronRight size={16} />
                </Button>
              ) : (
                <Button type="button" variant="primary" onClick={finishTour}>
                  Finish tour
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
        This tutorial opens only from the View Tutorial button after sign-in.
      </div>
    </div>
  );
};

export { TUTORIAL_SEEN_KEY };
export default TutorialModal;