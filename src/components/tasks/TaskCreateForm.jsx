import React, { useState } from 'react';
import { Button, Input, Textarea } from '../ui';
import { useToast } from '../../contexts/ToastContext';
import { useGlobalModal } from '../../contexts/GlobalModalContext';

const TASKS_STORAGE_KEY = 'syncly:tasks';
const TASK_ACTIVITY_STORAGE_KEY = 'syncly:taskActivity';

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
  const [title, setTitle] = useState('');
  const [assignee, setAssignee] = useState(initialAssignee);
  const [priority, setPriority] = useState(initialPriority);
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');

  const { addToast } = useToast();
  const { closeModal } = useGlobalModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;

    const tasks = readStoredJson(TASKS_STORAGE_KEY, {}) || {};
    const nextId = getNextTaskId(tasks);
    const newTask = { id: nextId, title: t, priority, assignee, dueDate, description };

    const nextTasks = { ...tasks, [column]: [...(tasks[column] || []), newTask] };
    try { window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(nextTasks)); } catch (e) {}

    // activity
    try {
      const activity = readStoredJson(TASK_ACTIVITY_STORAGE_KEY, {}) || {};
      activity[String(nextId)] = [
        { type: 'activity', message: 'Task created', author: 'You', timestamp: new Date().toISOString() },
      ];
      window.localStorage.setItem(TASK_ACTIVITY_STORAGE_KEY, JSON.stringify(activity));
    } catch (e) {}

    addToast({ title: 'Task created', message: `"${t}" added to ${column}`, variant: 'success' });
    closeModal();
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <label className="space-y-2">
        <span className="text-sm font-semibold">Title</span>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
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
      </label>

      <label className="space-y-2">
        <span className="text-sm font-semibold">Notes</span>
        <Textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>

      <div className="flex justify-end gap-3">
        <Button variant="secondary" type="button" onClick={() => closeModal()}>Cancel</Button>
        <Button variant="primary" type="submit">Create Task</Button>
      </div>
    </form>
  );
};

export default TaskCreateForm;
