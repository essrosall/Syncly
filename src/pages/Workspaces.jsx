import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderKanban, Users, MoreHorizontal, Layers3, Search, Plus, Clock3, CheckCircle2, ArrowRight, PencilLine, Copy, Archive, Trash2, ExternalLink, CalendarDays } from 'lucide-react';
import { MainLayout } from '../components/layout';
import { Card, Button, Badge, Input, Textarea } from '../components/ui';
import { useGlobalModal } from '../contexts/GlobalModalContext';
import { useToast } from '../contexts/ToastContext';

const TASKS_STORAGE_KEY = 'syncly:tasks';
const WORKSPACES_STORAGE_KEY = 'syncly:workspaces';

const defaultWorkspaces = [
  {
    id: 1,
    name: 'Product Design',
    description: 'Design direction, wireframes, and polish for the main product experience.',
    color: 'primary',
    status: 'Active',
    members: ['Sarah', 'Alex', 'Maya', 'You', 'Admin'],
    inviteCode: 'DESIGN-1001',
    keywords: ['design', 'ui', 'ux', 'landing', 'product'],
  },
  {
    id: 2,
    name: 'Mobile App',
    description: 'Mobile UI, responsive flows, and cross-device testing.',
    color: 'warning',
    status: 'Review',
    members: ['Sarah', 'Mike', 'You'],
    inviteCode: 'MOBILE-1002',
    keywords: ['mobile', 'app', 'responsive', 'ios', 'android'],
  },
  {
    id: 3,
    name: 'Backend Services',
    description: 'API work, auth flows, and server-side reliability.',
    color: 'success',
    status: 'Active',
    members: ['Admin', 'You', 'Mike', 'Sarah'],
    inviteCode: 'BACKEND-1003',
    keywords: ['backend', 'api', 'auth', 'database', 'server'],
  },
];

const defaultTasks = {
  todo: [],
  'in-progress': [],
  review: [],
  done: [],
};

const workspaceToneMap = {
  primary: {
    bar: 'from-primary-600 via-primary-500 to-primary-300',
    accentBg: 'bg-primary-50 dark:bg-primary-500/10',
    accentText: 'text-primary-700 dark:text-primary-200',
    border: 'border-primary-200 dark:border-primary-700',
  },
  warning: {
    bar: 'from-warning-600 via-warning-500 to-warning-300',
    accentBg: 'bg-warning-50 dark:bg-warning-500/10',
    accentText: 'text-warning-700 dark:text-warning-200',
    border: 'border-warning-200 dark:border-warning-700',
  },
  success: {
    bar: 'from-success-600 via-success-500 to-success-300',
    accentBg: 'bg-success-50 dark:bg-success-500/10',
    accentText: 'text-success-700 dark:text-success-200',
    border: 'border-success-200 dark:border-success-700',
  },
};

const readStoredJson = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const writeStoredJson = (key, value) => {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage errors
  }
};

const generateInviteCode = (name, id) => {
  const base = slugify(name).replace(/-/g, '').slice(0, 6).toUpperCase() || 'SYNC';
  const suffix = String(id || Date.now()).slice(-4);
  return `${base}-${suffix}`;
};

const slugify = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const parseDueDate = (value) => {
  if (!value) return null;
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatShortDate = (value) => {
  const parsed = parseDueDate(value);
  if (!parsed) return 'No due date';

  return parsed.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

const getRelativeDueLabel = (value) => {
  const parsed = parseDueDate(value);
  if (!parsed) return 'No due date';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffDays = Math.round((parsed.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
  if (diffDays < 0) return `${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? '' : 's'} overdue`;
  if (diffDays === 0) return 'Due today';
  if (diffDays === 1) return 'Due tomorrow';
  return `Due in ${diffDays} days`;
};

const getWorkspaceTokens = (workspace) => {
  const tokens = new Set([
    ...(workspace.name || '').toLowerCase().split(/\s+/),
    ...(workspace.description || '').toLowerCase().split(/\s+/),
    ...(workspace.keywords || []).map((item) => String(item).toLowerCase()),
  ]);

  return [...tokens].filter((item) => item && item.length > 2);
};

const workspaceMatchesTask = (workspace, task) => {
  const workspaceName = (workspace.name || '').toLowerCase();
  const workspaceSlug = slugify(workspaceName);
  const taskWorkspaceId = task.workspaceId != null ? String(task.workspaceId) : '';
  const taskWorkspaceName = String(task.workspace || task.workspaceName || '').toLowerCase();

  if (taskWorkspaceId && String(workspace.id) === taskWorkspaceId) return true;
  if (taskWorkspaceName) {
    if (taskWorkspaceName === workspaceName) return true;
    if (slugify(taskWorkspaceName) === workspaceSlug) return true;
  }

  const haystack = `${task.title} ${task.description || ''} ${task.assignee || ''}`.toLowerCase();
  const tokens = getWorkspaceTokens(workspace);

  if (tokens.some((token) => haystack.includes(token))) {
    return true;
  }

  if (workspaceName.includes('design')) return haystack.includes('design') || haystack.includes('landing') || haystack.includes('ui');
  if (workspaceName.includes('mobile')) return haystack.includes('mobile') || haystack.includes('responsive') || haystack.includes('app');
  if (workspaceName.includes('backend')) return haystack.includes('api') || haystack.includes('auth') || haystack.includes('database') || haystack.includes('server');

  return false;
};

const getWorkspaceSummary = (workspace, tasksByColumn) => {
  const allTasks = Object.entries(tasksByColumn || {}).flatMap(([columnId, tasks]) =>
    (tasks || []).map((task) => ({ ...task, columnId }))
  );

  const matchedTasks = allTasks.filter((task) => workspaceMatchesTask(workspace, task));
  const activeTasks = matchedTasks.filter((task) => task.columnId !== 'done');
  const completedTasks = matchedTasks.filter((task) => task.columnId === 'done');
  const overdueTasks = activeTasks.filter((task) => {
    const due = parseDueDate(task.dueDate);
    if (!due) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return due < today;
  });
  const dueSoonTasks = activeTasks.filter((task) => {
    const due = parseDueDate(task.dueDate);
    if (!due) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.round((due.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
    return diffDays >= 0 && diffDays <= 2;
  });

  const progress = matchedTasks.length > 0 ? Math.round((completedTasks.length / matchedTasks.length) * 100) : 0;

  return {
    matchedTasks,
    activeTasks,
    completedTasks,
    overdueTasks,
    dueSoonTasks,
    progress,
    total: matchedTasks.length,
  };
};

const WorkspaceCreateForm = ({ onCreate, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [membersText, setMembersText] = useState('You, Sarah');
  const [color, setColor] = useState('primary');

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextName = name.trim();
    if (!nextName) return;

    const members = membersText
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    onCreate({
      name: nextName,
      description: description.trim(),
      color,
      members,
      inviteCode: generateInviteCode(nextName),
      keywords: getWorkspaceTokens({ name: nextName, description }),
      status: 'Active',
    });
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="rounded-3xl border border-primary-200 bg-primary-50 p-5 dark:border-primary-700/30 dark:bg-primary-600/10">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-neutral-900 text-white shadow-sm dark:bg-neutral-100 dark:text-neutral-900">
            <span className="text-sm font-semibold">+</span>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-700 dark:text-primary-200">Workspace setup</p>
            <p className="text-sm font-medium text-neutral-950 dark:text-neutral-100">Create a shared space for a team, project, or area of work.</p>
            <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">
              Add a name, describe what belongs here, and list the members who should have access. The invite code is generated automatically after you save.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Workspace name</label>
        <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="E.g. Marketing Launch" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Description</label>
        <Textarea rows={4} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What will this workspace be used for?" />
      </div>

      <div className="grid gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(16rem,0.8fr)]">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Members</label>
          <Input value={membersText} onChange={(event) => setMembersText(event.target.value)} placeholder="Comma-separated names" />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">Example: You, Sarah, Alex</p>
        </div>

        <div className="space-y-2">
          <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Accent color</span>
          <div className="flex flex-wrap gap-2">
          {[
            { value: 'primary', label: 'Primary' },
            { value: 'warning', label: 'Warning' },
            { value: 'success', label: 'Success' },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setColor(option.value)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                color === option.value
                  ? 'border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900'
                  : 'border-neutral-200 bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
              }`}
            >
              {option.label}
            </button>
          ))}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-dashed border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-700 dark:bg-neutral-900/40">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">What this workspace helps with</p>
        <div className="mt-3 grid gap-3 text-sm text-neutral-600 dark:text-neutral-300 md:grid-cols-3">
          <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 dark:border-neutral-700 dark:bg-neutral-800">
            Keep related tasks grouped together
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 dark:border-neutral-700 dark:bg-neutral-800">
            Share access with the right people
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 dark:border-neutral-700 dark:bg-neutral-800">
            Generate an invite code automatically
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <Button variant="secondary" type="button" className="bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" className="bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800">
          Create Workspace
        </Button>
      </div>
    </form>
  );
};

const WorkspaceDetailsModal = ({ workspace, summary, onClose, onOpenTasks }) => {
  const tone = workspaceToneMap[workspace.color] || workspaceToneMap.primary;
  const topTasks = summary.matchedTasks
    .filter((task) => task.columnId !== 'done')
    .sort((a, b) => {
      const aDue = parseDueDate(a.dueDate);
      const bDue = parseDueDate(b.dueDate);
      const aTime = aDue ? aDue.getTime() : Number.POSITIVE_INFINITY;
      const bTime = bDue ? bDue.getTime() : Number.POSITIVE_INFINITY;
      return aTime - bTime;
    })
    .slice(0, 4);

  return (
    <div className="space-y-5">
      <div className={`rounded-2xl border ${tone.border} ${tone.accentBg} p-5`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className={`text-xs font-semibold uppercase tracking-wide ${tone.accentText}`}>Workspace overview</p>
            <h3 className="mt-1 truncate text-2xl font-semibold text-neutral-950 dark:text-neutral-100" title={workspace.name}>
              {workspace.name}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400" title={workspace.description}>
              {workspace.description}
            </p>
          </div>
          <Badge variant={workspace.color} size="sm">
            {workspace.status || 'Active'}
          </Badge>
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-900/40">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">Invite code</p>
            <p
              className="mt-1 truncate text-lg font-semibold text-neutral-950 dark:text-neutral-100"
              title={workspace.inviteCode || generateInviteCode(workspace.name, workspace.id)}
            >
              {workspace.inviteCode || generateInviteCode(workspace.name, workspace.id)}
            </p>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Share this code with teammates so they can join the right workspace.</p>
          </div>
          <Button
            variant="secondary"
            className="bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
            onClick={async () => {
              const code = workspace.inviteCode || generateInviteCode(workspace.name, workspace.id);
              try {
                await navigator.clipboard.writeText(code);
                window.dispatchEvent(new Event('syncly:toast-copy-invite'));
              } catch {
                window.prompt('Copy invite code', code);
              }
            }}
          >
            <Copy size={16} /> Copy code
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-md bg-neutral-100 p-3 dark:bg-neutral-800">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">Members</p>
          <p className="mt-1 text-lg font-semibold text-neutral-950 dark:text-neutral-100">{workspace.members?.length || 0}</p>
        </div>
        <div className="rounded-md bg-neutral-100 p-3 dark:bg-neutral-800">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">Matched tasks</p>
          <p className="mt-1 text-lg font-semibold text-neutral-950 dark:text-neutral-100">{summary.total}</p>
        </div>
        <div className="rounded-md bg-neutral-100 p-3 dark:bg-neutral-800">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">Progress</p>
          <p className="mt-1 text-lg font-semibold text-neutral-950 dark:text-neutral-100">{summary.progress}%</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-md bg-neutral-100 p-3 dark:bg-neutral-800">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">Active</p>
          <p className="mt-1 text-lg font-semibold text-neutral-950 dark:text-neutral-100">{summary.activeTasks.length}</p>
        </div>
        <div className="rounded-md bg-neutral-100 p-3 dark:bg-neutral-800">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">Completed</p>
          <p className="mt-1 text-lg font-semibold text-neutral-950 dark:text-neutral-100">{summary.completedTasks.length}</p>
        </div>
        <div className="rounded-md bg-neutral-100 p-3 dark:bg-neutral-800">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">Needs focus</p>
          <p className="mt-1 text-lg font-semibold text-neutral-950 dark:text-neutral-100">{summary.overdueTasks.length}</p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">Upcoming tasks</h4>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">What needs attention in this workspace right now.</p>
          </div>
          <Button variant="secondary" size="sm" className="bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800" onClick={onOpenTasks}>
            <ExternalLink size={16} /> View Tasks
          </Button>
        </div>

        <div className="mt-3 space-y-2">
          {topTasks.length > 0 ? topTasks.map((task) => {
            const priorityVariant = task.priority === 'high' ? 'error' : task.priority === 'medium' ? 'warning' : 'success';

            return (
              <div key={task.id} className="flex items-start justify-between gap-3 rounded-md border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-700 dark:bg-neutral-800">
                <div className="min-w-0">
                  <p className="font-medium text-neutral-950 dark:text-neutral-100">{task.title}</p>
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{getRelativeDueLabel(task.dueDate)} • {task.assignee}</p>
                </div>
                <Badge variant={priorityVariant} size="sm">
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </Badge>
              </div>
            );
          }) : (
            <div className="rounded-md border border-dashed border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
              No tasks match this workspace yet.
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <Button variant="secondary" className="bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" className="bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800" onClick={onOpenTasks}>
          <ArrowRight size={16} /> View Tasks
        </Button>
      </div>
    </div>
  );
};

const Workspaces = () => {
  const mockUser = { name: 'Sarah Johnson', email: 'sarah@example.com' };
  const navigate = useNavigate();
  const { openModal, closeModal } = useGlobalModal();
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [workspaceList, setWorkspaceList] = useState(() => readStoredJson(WORKSPACES_STORAGE_KEY, defaultWorkspaces));
  const [taskColumns, setTaskColumns] = useState(() => readStoredJson(TASKS_STORAGE_KEY, defaultTasks));
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    const syncWorkspaces = () => setWorkspaceList(readStoredJson(WORKSPACES_STORAGE_KEY, defaultWorkspaces));
    const syncTasks = () => setTaskColumns(readStoredJson(TASKS_STORAGE_KEY, defaultTasks));

    window.addEventListener('storage', syncWorkspaces);
    window.addEventListener('storage', syncTasks);
    window.addEventListener('syncly:workspaces-updated', syncWorkspaces);
    window.addEventListener('syncly:tasks-updated', syncTasks);

    return () => {
      window.removeEventListener('storage', syncWorkspaces);
      window.removeEventListener('storage', syncTasks);
      window.removeEventListener('syncly:workspaces-updated', syncWorkspaces);
      window.removeEventListener('syncly:tasks-updated', syncTasks);
    };
  }, []);

  useEffect(() => {
    const nextWorkspaceList = workspaceList.map((workspace) => {
      if (workspace.inviteCode) return workspace;
      return { ...workspace, inviteCode: generateInviteCode(workspace.name, workspace.id) };
    });

    if (nextWorkspaceList.some((workspace, index) => workspace.inviteCode !== workspaceList[index]?.inviteCode)) {
      setWorkspaceList(nextWorkspaceList);
      writeStoredJson(WORKSPACES_STORAGE_KEY, nextWorkspaceList);
    }
  }, [workspaceList]);

  useEffect(() => {
    writeStoredJson(WORKSPACES_STORAGE_KEY, workspaceList);
  }, [workspaceList]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!event.target.closest?.('[data-workspace-menu]')) {
        setOpenMenuId(null);
      }
    };

    if (openMenuId !== null) {
      document.addEventListener('pointerdown', handlePointerDown);
    }

    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [openMenuId]);

  const workspaceData = useMemo(() => {
    return workspaceList.map((workspace) => ({
      ...workspace,
      summary: getWorkspaceSummary(workspace, taskColumns),
    }));
  }, [workspaceList, taskColumns]);

  const workspaceMetrics = useMemo(() => {
    const allTaskSummaries = workspaceData.map((workspace) => workspace.summary);
    const totalMembers = new Set(workspaceList.flatMap((workspace) => workspace.members || [])).size;

    return [
      { label: 'Total Workspaces', value: String(workspaceList.length), icon: Layers3, caption: 'Saved workspace groups' },
      { label: 'Active Members', value: String(totalMembers), icon: Users, caption: 'People across workspaces' },
      { label: 'Active Tasks', value: String(allTaskSummaries.reduce((sum, item) => sum + item.activeTasks.length, 0)), icon: Clock3, caption: 'In progress or pending' },
      { label: 'Completed Tasks', value: String(allTaskSummaries.reduce((sum, item) => sum + item.completedTasks.length, 0)), icon: CheckCircle2, caption: 'Already delivered' },
    ];
  }, [workspaceData, workspaceList]);

  const filteredWorkspaces = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return workspaceData;

    return workspaceData.filter((workspace) => {
      const haystack = [workspace.name, workspace.description, ...(workspace.members || []), ...(workspace.keywords || [])].join(' ').toLowerCase();
      return haystack.includes(query);
    });
  }, [searchTerm, workspaceData]);

  const persistWorkspaceList = (nextList) => {
    setWorkspaceList(nextList);
    writeStoredJson(WORKSPACES_STORAGE_KEY, nextList);
    try {
      window.dispatchEvent(new Event('syncly:workspaces-updated'));
    } catch {
      // ignore event errors
    }
  };

  const handleOpenCreate = () => {
    openModal(WorkspaceCreateForm, {
      title: 'Create Workspace',
      sizeClass: 'max-w-6xl',
      onClose: closeModal,
      onCreate: (workspace) => {
        const next = [
          {
            id: Date.now(),
            ...workspace,
            inviteCode: workspace.inviteCode || generateInviteCode(workspace.name, workspace.id),
          },
          ...workspaceList,
        ];

        persistWorkspaceList(next);
        closeModal();
        addToast({ title: 'Workspace created', message: `${workspace.name} is ready to go.`, variant: 'success' });
      },
    });
  };

  const handleOpenTasks = (workspace) => {
    const workspaceSlug = slugify(workspace.name);
    navigate(`/tasks?workspace=${workspaceSlug}`);
  };

  const handleManageWorkspace = (workspace) => {
    const summary = getWorkspaceSummary(workspace, taskColumns);

    openModal(WorkspaceDetailsModal, {
      title: 'Workspace Details',
      workspace,
      summary,
      onClose: closeModal,
      onOpenTasks: () => {
        closeModal();
        handleOpenTasks(workspace);
      },
    });
  };

  const handleRenameWorkspace = (workspace) => {
    const nextName = window.prompt('Rename workspace', workspace.name);
    if (!nextName) return;

    const trimmed = nextName.trim();
    if (!trimmed || trimmed === workspace.name) return;

    persistWorkspaceList(
      workspaceList.map((item) =>
        item.id === workspace.id
          ? { ...item, name: trimmed, keywords: getWorkspaceTokens({ name: trimmed, description: item.description }), updatedAt: new Date().toISOString() }
          : item
      )
    );

    addToast({ title: 'Workspace renamed', message: `${workspace.name} is now ${trimmed}.`, variant: 'success' });
  };

  const handleDuplicateWorkspace = (workspace) => {
    const duplicateName = `${workspace.name} Copy`;
    const next = [
      {
        ...workspace,
        id: Date.now(),
        name: duplicateName,
        status: 'Active',
        inviteCode: generateInviteCode(duplicateName, Date.now()),
        keywords: getWorkspaceTokens({ name: duplicateName, description: workspace.description }),
      },
      ...workspaceList,
    ];

    persistWorkspaceList(next);
    addToast({ title: 'Workspace duplicated', message: `${workspace.name} copied successfully.`, variant: 'success' });
  };

  const handleToggleArchive = (workspace) => {
    const isArchived = workspace.status === 'Archived';
    const nextStatus = isArchived ? 'Active' : 'Archived';

    persistWorkspaceList(
      workspaceList.map((item) =>
        item.id === workspace.id ? { ...item, status: nextStatus, updatedAt: new Date().toISOString() } : item
      )
    );

    addToast({
      title: isArchived ? 'Workspace restored' : 'Workspace archived',
      message: `${workspace.name} is now ${nextStatus.toLowerCase()}.`,
      variant: 'success',
    });
  };

  const handleDeleteWorkspace = (workspace) => {
    const confirmed = window.confirm(`Delete ${workspace.name}? This cannot be undone.`);
    if (!confirmed) return;

    persistWorkspaceList(workspaceList.filter((item) => item.id !== workspace.id));
    addToast({ title: 'Workspace deleted', message: `${workspace.name} has been removed.`, variant: 'success' });
  };

  return (
    <MainLayout user={mockUser} activeTab="workspaces">
      <div className="space-y-6 animate-fade-in-up">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div id="workspaces-overview">
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-100">Workspaces</h1>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">Organize teams and manage projects across dedicated workspaces.</p>
          </div>
          <Button variant="primary" size="sm" className="bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800" onClick={handleOpenCreate}>
            <FolderKanban size={18} /> Create Workspace
          </Button>
        </div>

        <Card className="rounded-md border-neutral-200 bg-white p-5 shadow-[0_12px_30px_rgba(17,25,43,0.04)] dark:border-neutral-700 dark:bg-neutral-800">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-neutral-950 dark:text-neutral-100">Workspace overview</h2>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">The workspace section now stays in sync with the task board and keeps details live across the app.</p>
            </div>
            <div className="w-full lg:max-w-sm">
              <div className="flex items-center gap-3 rounded-md border border-neutral-200 bg-white px-4 py-3 shadow-[0_10px_25px_rgba(17,25,43,0.05)] dark:border-neutral-700 dark:bg-neutral-800">
                <Search size={18} className="text-neutral-400 dark:text-neutral-500" />
                <Input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search workspaces or members"
                  className="border-0 p-0 shadow-none focus:ring-0"
                />
              </div>
            </div>
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {workspaceMetrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <Card key={metric.label} className="rounded-md border-neutral-200 bg-white p-6 shadow-[0_12px_30px_rgba(17,25,43,0.04)] dark:border-neutral-700 dark:bg-neutral-800">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">{metric.label}</p>
                    <p className="mt-3 text-3xl font-semibold text-neutral-950 dark:text-neutral-100">{metric.value}</p>
                    <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">{metric.caption}</p>
                  </div>
                  <div className="rounded-md bg-neutral-100 p-3 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-200">
                    <Icon size={20} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredWorkspaces.length > 0 ? (
            filteredWorkspaces.map((workspace) => {
              const tone = workspaceToneMap[workspace.color] || workspaceToneMap.primary;
              const summary = workspace.summary;
              const memberCount = workspace.members?.length || 0;
              const recentTask = summary.matchedTasks[0];

              return (
                <Card
                  key={workspace.id}
                  id={`workspace-${slugify(workspace.name)}`}
                  className={`relative overflow-hidden rounded-base border bg-white p-6 shadow-[0_12px_30px_rgba(17,25,43,0.04)] transition-transform hover:-translate-y-0.5 dark:bg-neutral-800 ${tone.border}`}
                >
                  <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${tone.bar}`} />

                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Badge variant={workspace.color} size="sm">
                          {workspace.status || (summary.progress >= 75 ? 'On track' : summary.progress >= 40 ? 'Active' : 'Needs focus')}
                        </Badge>
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${tone.accentBg} ${tone.accentText}`}>
                          {workspace.color}
                        </span>
                      </div>
                      <p className="mt-3 text-xl font-semibold text-neutral-950 dark:text-neutral-100">{workspace.name}</p>
                      <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">{workspace.description}</p>
                    </div>

                    <div className="relative" data-workspace-menu>
                      <button
                        type="button"
                        onClick={() => setOpenMenuId((current) => (current === workspace.id ? null : workspace.id))}
                        className="rounded-md border border-neutral-200 bg-neutral-50 p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-neutral-100"
                        aria-label={`Workspace actions for ${workspace.name}`}
                      >
                        <MoreHorizontal size={16} />
                      </button>

                      {openMenuId === workspace.id && (
                        <div className="absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-700 dark:bg-neutral-800">
                          {[
                            { label: 'Rename', icon: PencilLine, action: () => handleRenameWorkspace(workspace) },
                            { label: 'Duplicate', icon: Copy, action: () => handleDuplicateWorkspace(workspace) },
                            { label: workspace.status === 'Archived' ? 'Restore' : 'Archive', icon: Archive, action: () => handleToggleArchive(workspace) },
                            { label: 'Delete', icon: Trash2, action: () => handleDeleteWorkspace(workspace), danger: true },
                          ].map((item) => {
                            const Icon = item.icon;
                            return (
                              <button
                                key={item.label}
                                type="button"
                                onClick={() => {
                                  item.action();
                                  setOpenMenuId(null);
                                }}
                                className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-700 ${item.danger ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30' : 'text-neutral-700 dark:text-neutral-200'}`}
                              >
                                <Icon size={16} />
                                {item.label}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div className={`rounded-md ${tone.accentBg} p-3`}>
                      <p className={`text-xs font-semibold uppercase tracking-wide ${tone.accentText}`}>Focus</p>
                      <p className="mt-1 text-sm font-medium text-neutral-950 dark:text-neutral-100">{workspace.keywords?.slice(0, 3).join(', ') || 'General delivery'}</p>
                    </div>
                    <div className={`rounded-md ${tone.accentBg} p-3`}>
                      <p className={`text-xs font-semibold uppercase tracking-wide ${tone.accentText}`}>Recent task</p>
                      <p
                        className="mt-1 truncate text-sm font-medium text-neutral-950 dark:text-neutral-100"
                        title={recentTask?.title || 'No linked tasks yet'}
                      >
                        {recentTask?.title || 'No linked tasks yet'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between text-sm text-neutral-500 dark:text-neutral-400">
                      <span>Progress</span>
                      <span>{summary.progress}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-700">
                      <div className={`h-full rounded-full bg-gradient-to-r ${tone.bar}`} style={{ width: `${summary.progress}%` }} />
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-md bg-neutral-50 px-3 py-2 text-sm dark:bg-neutral-700/40">
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">Members</p>
                      <p className="mt-1 font-semibold text-neutral-950 dark:text-neutral-100">{memberCount}</p>
                    </div>
                    <div className="rounded-md bg-neutral-50 px-3 py-2 text-sm dark:bg-neutral-700/40">
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">Active</p>
                      <p className="mt-1 font-semibold text-neutral-950 dark:text-neutral-100">{summary.activeTasks.length}</p>
                    </div>
                    <div className="rounded-md bg-neutral-50 px-3 py-2 text-sm dark:bg-neutral-700/40">
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">Due soon</p>
                      <p className="mt-1 font-semibold text-neutral-950 dark:text-neutral-100">{summary.dueSoonTasks.length}</p>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">View the connected task board</p>
                      <p className="font-medium text-neutral-950 dark:text-neutral-100">Live task handoff</p>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
                      onClick={() => handleManageWorkspace(workspace)}
                    >
                      <ArrowRight size={16} /> Manage
                    </Button>
                  </div>
                </Card>
              );
            })
          ) : (
            <Card className="rounded-md border border-dashed border-neutral-200 bg-white p-8 text-center dark:border-neutral-700 dark:bg-neutral-800">
              <p className="text-lg font-semibold text-neutral-950 dark:text-neutral-100">No workspaces match your search.</p>
              <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">Try a different keyword or create a new workspace.</p>
              <div className="mt-4 flex justify-center">
                <Button variant="primary" className="bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800" onClick={handleOpenCreate}>
                  <Plus size={16} /> Create Workspace
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Workspaces;
