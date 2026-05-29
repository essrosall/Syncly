import React, { useMemo, useState } from 'react';
import { Button, Input, Textarea } from '../ui';
import { useToast } from '../../contexts/ToastContext';
import { useGlobalModal } from '../../contexts/GlobalModalContext';
import usePersistentState from '../../hooks/usePersistentState';

const TASKS_STORAGE_KEY = 'syncly:tasks';
const TASK_ACTIVITY_STORAGE_KEY = 'syncly:taskActivity';
const WORKSPACES_STORAGE_KEY = 'syncly:workspaces';

const defaultWorkspaces = [
  { id: 1, name: 'Product Design' },
  { id: 2, name: 'Mobile App' },
  { id: 3, name: 'Backend Services' },
];

const TASK_TYPE_OPTIONS = ['Feature', 'Bug', 'Research', 'Design', 'Support'];

const readStoredJson = (key, fallback) => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
};

const getNextTaskId = (tasks) => {
  const taskIds = Object.values(tasks).flat().map((task) => Number(task.id) || 0);
  return (taskIds.length > 0 ? Math.max(...taskIds) : 0) + 1;
};

const TaskCreateForm = ({ column = 'todo', assignee: initialAssignee = 'You', priority: initialPriority = 'medium' }) => {
  const DRAFT_KEY = 'syncly:taskDraft';
  const workspaceOptions = useMemo(() => readStoredJson(WORKSPACES_STORAGE_KEY, defaultWorkspaces), []);

  const [draft, setDraft, clearDraft] = usePersistentState(DRAFT_KEY, {
    title: '',
    assignee: initialAssignee,
    priority: initialPriority,
    dueDate: '',
    description: '',
    workspace: '',
    workspaceId: '',
    taskType: 'Feature',
  });

  const [title, setTitle] = useState(draft.title || '');
  const [assignee, setAssignee] = useState(draft.assignee || initialAssignee);
  const [priority, setPriority] = useState(draft.priority || initialPriority);
  const [dueDate, setDueDate] = useState(draft.dueDate || '');
  const [description, setDescription] = useState(draft.description || '');
  const [workspace, setWorkspace] = useState(draft.workspace || '');
  const [workspaceId, setWorkspaceId] = useState(draft.workspaceId || '');
  const [taskType, setTaskType] = useState(draft.taskType || 'Feature');

  const { addToast } = useToast();
  const { closeModal } = useGlobalModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;

    const tasks = readStoredJson(TASKS_STORAGE_KEY, {}) || {};
    const nextId = getNextTaskId(tasks);
    const selectedWorkspace = workspaceOptions.find((item) => String(item.id) === String(workspaceId));
    const workspaceName = selectedWorkspace?.name || workspace;

    const newTask = {
      id: nextId,
      title: t,
      priority,
      assignee,
      dueDate,
      description,
      workspace: workspaceName,
      workspaceId: selectedWorkspace?.id || workspaceId || '',
      taskType,
    };

    const nextTasks = { ...tasks, [column]: [...(tasks[column] || []), newTask] };
    try { window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(nextTasks)); } catch (e) {}
    try { window.dispatchEvent(new Event('syncly:tasks-updated')); } catch (e) {}

    // activity
    try {
      const activity = readStoredJson(TASK_ACTIVITY_STORAGE_KEY, {}) || {};
      activity[String(nextId)] = [
        { type: 'activity', message: 'Task created', author: 'You', timestamp: new Date().toISOString() },
      ];
      window.localStorage.setItem(TASK_ACTIVITY_STORAGE_KEY, JSON.stringify(activity));
    } catch (e) {}

    addToast({ title: 'Task created', message: `"${t}" added to ${workspaceName || column}`, variant: 'success' });
    closeModal();

    // clear draft
    clearDraft();
  };

  React.useEffect(() => {
    setDraft({ title, assignee, priority, dueDate, description, workspace, workspaceId, taskType });
  }, [assignee, description, dueDate, priority, setDraft, taskType, title, workspace, workspaceId]);

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="rounded-base border border-primary-200 bg-primary-50 p-5 dark:border-primary-700/30 dark:bg-primary-600/10">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-base bg-neutral-900 text-white shadow-sm dark:bg-neutral-100 dark:text-neutral-900">
            <span className="text-sm font-semibold">+</span>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-700 dark:text-primary-200">Quick setup</p>
            <p className="text-sm font-medium text-neutral-950 dark:text-neutral-100">Name the work, pick the focus, and add a date.</p>
            <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">
              A clear title, a workspace, and a due date make the task easier to route, review, and revisit later.
            </p>
          </div>
        </div>
      </div>

      <label className="space-y-2">
        <span className="text-sm font-semibold">Title</span>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Prepare login flow demo" />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold">Task Type</span>
          <select value={taskType} onChange={(e) => setTaskType(e.target.value)} className="input-base w-full">
            {TASK_TYPE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold">Workspace</span>
          <select
            value={workspaceId}
            onChange={(e) => {
              const nextId = e.target.value;
              const selected = workspaceOptions.find((item) => String(item.id) === String(nextId));
              setWorkspaceId(nextId);
              setWorkspace(selected?.name || '');
            }}
            className="input-base w-full"
          >
            <option value="">Unassigned</option>
            {workspaceOptions.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold">Priority</span>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className="input-base w-full">
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold">Assignee</span>
          <select value={assignee} onChange={(e) => setAssignee(e.target.value)} className="input-base w-full">
            <option>You</option>
            <option>Alex</option>
            <option>Mike</option>
            <option>Sarah</option>
            <option>Admin</option>
          </select>
        </label>
      </div>

      <label className="space-y-2">
        <span className="text-sm font-semibold">Due Date</span>
        <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        <p className="text-xs text-neutral-500 dark:text-neutral-400">Pick a date so the dashboard can highlight the task before it slips.</p>
      </label>

      <label className="space-y-2">
        <span className="text-sm font-semibold">Notes</span>
        <Textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add context, links, dependencies, or a quick checklist..." />
      </label>

      <div className="flex justify-end gap-3">
        <Button variant="secondary" type="button" onClick={() => closeModal()}>Cancel</Button>
        <Button variant="primary" type="submit">Create Task</Button>
      </div>
    </form>
  );
};

export default TaskCreateForm;
