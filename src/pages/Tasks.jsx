import { useEffect, useRef, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { MainLayout } from '../components/layout';
import { Card, Badge, Button, Input, Modal, Textarea, Toast } from '../components/ui';
import { useCreateModal } from '../contexts/CreateModalContext';
import { Plus, Filter, Search, GripVertical, X } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { useGlobalModal } from '../contexts/GlobalModalContext';
import { useNotifications } from '../contexts/NotificationContext';
import TaskCreateForm from '../components/tasks/TaskCreateForm';
import {
  DndContext,
  rectIntersection,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const taskStatusOptions = [
  { value: 'todo', label: 'To Do', variant: 'default' },
  { value: 'in-progress', label: 'In Progress', variant: 'primary' },
  { value: 'review', label: 'In Review', variant: 'warning' },
  { value: 'done', label: 'Done', variant: 'success' },
];

const assigneeOptions = ['You', 'Alex', 'Mike', 'Sarah', 'Admin'];

const priorityOptions = ['high', 'medium', 'low'];

const TASKS_STORAGE_KEY = 'syncly:tasks';
const TASK_ACTIVITY_STORAGE_KEY = 'syncly:taskActivity';

const defaultTasks = {
  todo: [
    { id: 1, title: 'Setup database', priority: 'high', assignee: 'You', dueDate: '2024-05-15', description: 'Configure schema, migrations, and initial tables.' },
    { id: 2, title: 'Create API documentation', priority: 'medium', assignee: 'Alex', dueDate: '2024-05-20', description: 'Document endpoints, request payloads, and response examples.' },
  ],
  'in-progress': [
    { id: 3, title: 'Design landing page', priority: 'high', assignee: 'You', dueDate: '2024-05-12', description: 'Sketch the hero section, layout, and visual direction.' },
    { id: 4, title: 'Implement user auth', priority: 'high', assignee: 'Mike', dueDate: '2024-05-18', description: 'Wire up login, signup, and session handling.' },
  ],
  review: [
    { id: 5, title: 'Performance optimization', priority: 'low', assignee: 'Sarah', dueDate: '2024-05-22', description: 'Profile slow flows and reduce rendering overhead.' },
  ],
  done: [
    { id: 6, title: 'Project setup', priority: 'high', assignee: 'You', dueDate: '2024-05-10', description: 'Initialize the repo, tooling, and starter structure.' },
    { id: 7, title: 'Team onboarding', priority: 'medium', assignee: 'Admin', dueDate: '2024-05-09', description: 'Prepare kickoff notes, access, and checklist items.' },
  ],
};

const readStoredJson = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;

  try {
    const storedValue = window.localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : fallback;
  } catch {
    return fallback;
  }
};

const createTaskForm = (task) => ({
  title: task.title || '',
  priority: task.priority || 'medium',
  assignee: task.assignee || 'You',
  dueDate: task.dueDate || '',
  status: task.columnId || 'todo',
  description: task.description || '',
});

const createEmptyTaskForm = (columnId = 'todo') => ({
  title: '',
  priority: 'medium',
  assignee: 'You',
  dueDate: '',
  status: columnId,
  description: '',
});

const getTaskStatusMeta = (columnId) =>
  taskStatusOptions.find((option) => option.value === columnId) || taskStatusOptions[0];

const getTaskKey = (taskId) => String(taskId);

const TASK_ID_SEPARATOR = '::';

const buildTaskDndId = (columnId, taskId) => `${columnId}${TASK_ID_SEPARATOR}${taskId}`;

const parseTaskDndId = (id) => {
  const rawId = String(id);

  if (rawId.includes(TASK_ID_SEPARATOR)) {
    const separatorIndex = rawId.lastIndexOf(TASK_ID_SEPARATOR);
    return {
      columnId: rawId.slice(0, separatorIndex),
      taskId: rawId.slice(separatorIndex + TASK_ID_SEPARATOR.length),
    };
  }

  return {
    columnId: rawId,
    taskId: null,
  };
};

const getNextTaskId = (tasks) => {
  const taskIds = Object.values(tasks).flat().map((task) => Number(task.id) || 0);
  return (taskIds.length > 0 ? Math.max(...taskIds) : 0) + 1;
};

const formatActivityTime = (timestamp) =>
  new Date(timestamp).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

function createInitialTaskActivity() {
  return {
  '1': [
    {
      type: 'activity',
      message: 'Task created',
      author: 'System',
      timestamp: '2024-05-01T09:00:00Z',
    },
  ],
  '2': [
    {
      type: 'activity',
      message: 'Task created',
      author: 'System',
      timestamp: '2024-05-02T09:00:00Z',
    },
  ],
  '3': [
    {
      type: 'activity',
      message: 'Task created',
      author: 'System',
      timestamp: '2024-05-03T09:00:00Z',
    },
  ],
  '4': [
    {
      type: 'activity',
      message: 'Task created',
      author: 'System',
      timestamp: '2024-05-04T09:00:00Z',
    },
  ],
  '5': [
    {
      type: 'activity',
      message: 'Task created',
      author: 'System',
      timestamp: '2024-05-05T09:00:00Z',
    },
  ],
  '6': [
    {
      type: 'activity',
      message: 'Task created',
      author: 'System',
      timestamp: '2024-05-06T09:00:00Z',
    },
  ],
  '7': [
    {
      type: 'activity',
      message: 'Task created',
      author: 'System',
      timestamp: '2024-05-07T09:00:00Z',
    },
  ],
  };
}

const defaultTaskActivity = createInitialTaskActivity();

const mapTaskRowToTask = (row) => ({
  id: row.id,
  title: row.title,
  description: row.description || '',
  priority: row.priority || 'medium',
  assignee: row.assignee || 'You',
  dueDate: row.due_date ? new Date(row.due_date).toISOString().slice(0, 10) : '',
  columnId: row.status || 'todo',
});

const mapActivityRowToEntry = (row) => ({
  type: row.action === 'comment' ? 'comment' : 'activity',
  message: row.meta?.message || row.action || 'Activity',
  author: row.meta?.author || 'System',
  timestamp: row.created_at,
});

// Draggable task card component
const DraggableTask = ({ task, columnId, onTaskClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: buildTaskDndId(columnId, task.id) });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="cursor-grab active:cursor-grabbing"
    >
      <Card 
        className="hover:shadow-md transition-all cursor-pointer"
        onClick={() => onTaskClick(task, columnId)}
        data-task-id={task.id}
      >
        <div className="space-y-3">
          <div className="flex items-start gap-2 justify-between">
            <div className="flex items-start gap-2 flex-1">
              <button
                type="button"
                className="mt-1 flex-shrink-0 cursor-grab active:cursor-grabbing rounded-md border border-neutral-200 bg-white p-1 text-neutral-400 hover:bg-neutral-50 hover:text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:hover:text-neutral-200"
                aria-label={`Drag ${task.title}`}
                onClick={(event) => event.stopPropagation()}
                onPointerDown={(event) => event.stopPropagation()}
                {...attributes}
                {...listeners}
              >
                <GripVertical size={16} />
              </button>
              <h4 className="font-medium text-neutral-900 dark:text-neutral-100">{task.title}</h4>
            </div>
            <Badge
              variant={
                task.priority === 'high'
                  ? 'error'
                  : task.priority === 'medium'
                  ? 'warning'
                  : 'default'
              }
              size="sm"
            >
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
          </div>
          
          {task.description && (
            <p className="text-xs text-neutral-600 dark:text-neutral-400">{task.description}</p>
          )}
          
          <div className="flex items-center justify-between pt-2 border-t border-neutral-200 dark:border-neutral-700">
            <span className="text-xs text-neutral-600 dark:text-neutral-400">{task.dueDate}</span>
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-neutral-300 to-neutral-500 flex items-center justify-center text-xs font-semibold text-white dark:from-primary-400 dark:to-primary-600">
              {task.assignee.charAt(0)}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Column wrapper that registers as a droppable container so items can be dropped into empty columns
const ColumnWrapper = ({ column, children }) => {
  const { setNodeRef } = useDroppable({ id: column.id });

  return (
    <div
      ref={setNodeRef}
      data-column-id={column.id}
      className="flex min-h-[24rem] min-w-max flex-col rounded-md border border-neutral-200 bg-white p-4 text-neutral-950 shadow-[0_12px_30px_rgba(17,25,43,0.04)] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 lg:min-w-0"
    >
      {children}
    </div>
  );
};

const Tasks = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriorities, setSelectedPriorities] = useState(['high', 'medium', 'low']);
  const [selectedAssignees, setSelectedAssignees] = useState([...assigneeOptions]);
  const [dueDateSort, setDueDateSort] = useState('none');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isTaskSearchFocused, setIsTaskSearchFocused] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditingTask, setIsEditingTask] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [taskForm, setTaskForm] = useState(null);
  const [taskActivity, setTaskActivity] = useState(() => readStoredJson(TASK_ACTIVITY_STORAGE_KEY, defaultTaskActivity));
  const [commentDraft, setCommentDraft] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const filterMenuRef = useRef(null);
  const { addToast } = useToast();
  const { openModal } = useGlobalModal();
  const { addNotification, refreshNotifications } = useNotifications();

  const { createRequest, clearRequest } = useCreateModal();
  
  const mockUser = {
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
  };

  const { user } = useAuth();

  const [tasks, setTasks] = useState(() => readStoredJson(TASKS_STORAGE_KEY, defaultTasks));

  // Load tasks from Supabase for authenticated users
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (!isSupabaseConfigured || !supabase || !user) return;

      try {
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });

        if (error) return;
        if (!mounted) return;

        const grouped = data.reduce((acc, row) => {
          const col = row.status || 'todo';
          acc[col] = acc[col] || [];
          acc[col].push({ ...mapTaskRowToTask(row), columnId: col });
          return acc;
        }, {});

        // ensure all columns exist
        const next = { ...defaultTasks };
        Object.keys(grouped).forEach((k) => {
          next[k] = grouped[k];
        });

        setTasks(next);
      } catch (err) {
        // ignore and keep local state
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [user]);

  useEffect(() => {
    try {
      window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Unable to persist tasks:', error);
    }
  }, [tasks]);

  useEffect(() => {
    refreshNotifications();
  }, [tasks, refreshNotifications]);

  useEffect(() => {
    try {
      window.localStorage.setItem(TASK_ACTIVITY_STORAGE_KEY, JSON.stringify(taskActivity));
    } catch (error) {
      console.error('Unable to persist task activity:', error);
    }
  }, [taskActivity]);

  useEffect(() => {
    let mounted = true;

    const loadTaskTimeline = async () => {
      if (!selectedTask || !isSupabaseConfigured || !supabase || !user) return;

      try {
        const [activityResult, commentResult] = await Promise.all([
          supabase
            .from('activity_logs')
            .select('*')
            .eq('task_id', String(selectedTask.id))
            .order('created_at', { ascending: true }),
          supabase
            .from('task_comments')
            .select('*')
            .eq('task_id', String(selectedTask.id))
            .order('created_at', { ascending: true }),
        ]);

        if (!mounted) return;

        const activityRows = activityResult.data || [];
        const commentRows = commentResult.data || [];

        const timeline = [
          ...activityRows.map(mapActivityRowToEntry),
          ...commentRows.map((row) => ({
            type: 'comment',
            message: row.body,
            author: row.user_id === user.id ? 'You' : 'Member',
            timestamp: row.created_at,
          })),
        ].sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp));

        setTaskActivity((prev) => ({
          ...prev,
          [getTaskKey(selectedTask.id)]: timeline,
        }));
      } catch {
        // ignore and keep local activity/comments
      }
    };

    loadTaskTimeline();

    return () => {
      mounted = false;
    };
  }, [selectedTask, user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };

    if (isFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterOpen]);

  // Filter tasks based on search term, priority, assignee, and due date sorting
  const getFilteredTasks = (columnTasks) => {
    const filtered = columnTasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = selectedPriorities.includes(task.priority);
      const matchesAssignee = selectedAssignees.includes(task.assignee);
      return matchesSearch && matchesPriority && matchesAssignee;
    });

    const parseDueDate = (task) => {
      const timestamp = Date.parse(task.dueDate);
      return Number.isNaN(timestamp) ? null : timestamp;
    };

    if (dueDateSort === 'nearest') {
      return [...filtered].sort((a, b) => {
        const aDate = parseDueDate(a);
        const bDate = parseDueDate(b);
        if (aDate === null && bDate === null) return 0;
        if (aDate === null) return 1;
        if (bDate === null) return -1;
        return aDate - bDate;
      });
    }

    if (dueDateSort === 'farthest') {
      return [...filtered].sort((a, b) => {
        const aDate = parseDueDate(a);
        const bDate = parseDueDate(b);
        if (aDate === null && bDate === null) return 0;
        if (aDate === null) return 1;
        if (bDate === null) return -1;
        return bDate - aDate;
      });
    }

    return filtered;
  };

  // Toggle priority filter
  const togglePriority = (priority) => {
    setSelectedPriorities((prev) => {
      if (prev.includes(priority)) {
        return prev.filter((p) => p !== priority);
      } else {
        return [...prev, priority];
      }
    });
  };

  const toggleAssignee = (assignee) => {
    setSelectedAssignees((prev) => {
      if (prev.includes(assignee)) {
        return prev.filter((person) => person !== assignee);
      }
      return [...prev, assignee];
    });
  };

  const hasActiveFilters =
    searchTerm.trim().length > 0 ||
    selectedPriorities.length !== priorityOptions.length ||
    selectedAssignees.length !== assigneeOptions.length ||
    dueDateSort !== 'none';

  const activeAdvancedFilterCount =
    (selectedAssignees.length !== assigneeOptions.length ? 1 : 0) +
    (dueDateSort !== 'none' ? 1 : 0);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedPriorities([...priorityOptions]);
    setSelectedAssignees([...assigneeOptions]);
    setDueDateSort('none');
  };

  // Handle task click to open modal
  const handleTaskClick = (task, columnId) => {
    setSelectedTask({ ...task, columnId });
    setTaskForm(null);
    setIsEditingTask(false);
    setIsCreatingTask(false);
    setCommentDraft('');
  };

  const handleStartCreate = (columnId = 'todo') => {
    setSelectedTask({
      id: null,
      title: '',
      priority: 'medium',
      assignee: 'You',
      dueDate: '',
      columnId,
      description: '',
    });
    setTaskForm(createEmptyTaskForm(columnId));
    setIsCreatingTask(true);
    setIsEditingTask(true);
    setCommentDraft('');
  };

  const handleCloseTaskModal = () => {
    setSelectedTask(null);
    setTaskForm(null);
    setIsEditingTask(false);
    setIsCreatingTask(false);
    setCommentDraft('');
  };

  // Open create modal when URL contains ?new=<columnId> or when a top-level create request is present in localStorage
  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const params = new URLSearchParams(window.location.search);
        const newParam = params.get('new');
        if (newParam) {
          handleStartCreate(newParam);
          const assignee = params.get('assignee');
          const priority = params.get('priority');
          if (assignee || priority) {
            setTaskForm((prev) => ({ ...(prev || {}), ...(assignee ? { assignee } : {}), ...(priority ? { priority } : {}) }));
          }
          params.delete('new');
          params.delete('assignee');
          params.delete('priority');
          const newSearch = params.toString();
          const newUrl = window.location.pathname + (newSearch ? `?${newSearch}` : '');
          window.history.replaceState(null, '', newUrl);
        }

        const rawCreate = window.localStorage.getItem('syncly:createRequest');
        if (rawCreate) {
          try {
            const parsed = JSON.parse(rawCreate);
            const col = parsed.column || 'todo';
            handleStartCreate(col);
            if (parsed.assignee || parsed.priority) {
              setTaskForm((prev) => ({ ...(prev || {}), ...(parsed.assignee ? { assignee: parsed.assignee } : {}), ...(parsed.priority ? { priority: parsed.priority } : {}) }));
            }
          } catch {
            return;
          }
          window.localStorage.removeItem('syncly:createRequest');
        }
      } catch {
        return;
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  // Listen for in-app create requests via the CreateModal context
  useEffect(() => {
    if (!createRequest) return;
    const timer = window.setTimeout(() => {
      try {
        const col = createRequest.column || 'todo';
        handleStartCreate(col);
        if (createRequest.assignee || createRequest.priority) {
          setTaskForm((prev) => ({ ...(prev || {}), ...(createRequest.assignee ? { assignee: createRequest.assignee } : {}), ...(createRequest.priority ? { priority: createRequest.priority } : {}) }));
        }
      } catch {
        return;
      }
      try {
        clearRequest();
      } catch {
        return;
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [createRequest, clearRequest]);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const targetTaskId = params.get('taskId');

      if (!targetTaskId) return;

      let locatedTask = null;
      let locatedColumnId = null;

      Object.entries(tasks).some(([columnId, columnTasks]) => {
        const match = (columnTasks || []).find((task) => String(task.id) === String(targetTaskId));
        if (!match) return false;

        locatedTask = match;
        locatedColumnId = columnId;
        return true;
      });

      if (locatedTask && locatedColumnId) {
        setSelectedTask({ ...locatedTask, columnId: locatedColumnId });
        setTaskForm(null);
        setIsEditingTask(false);
        setIsCreatingTask(false);
        setCommentDraft('');

        if (params.get('focus') === 'comment') {
          window.setTimeout(() => {
            document.getElementById('task-comment-input')?.focus();
          }, 60);
        }
      }

      params.delete('taskId');
      params.delete('focus');

      const nextSearch = params.toString();
      const nextUrl = `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ''}`;
      window.history.replaceState(null, '', nextUrl);
    } catch {
      return;
    }
  }, [tasks]);

  const addTaskActivityEntry = (taskId, entry) => {
    const taskKey = getTaskKey(taskId);

    setTaskActivity((prev) => ({
      ...prev,
      [taskKey]: [...(prev[taskKey] || []), entry],
    }));

    if (isSupabaseConfigured && supabase && user) {
      (async () => {
        try {
          await supabase.from('activity_logs').insert([
            {
              task_id: String(taskId),
              user_id: user.id,
              action: entry.type === 'comment' ? 'comment' : 'activity',
              meta: {
                message: entry.message,
                author: entry.author,
              },
            },
          ]);
        } catch {
          // keep local activity if DB write fails
        }
      })();
    }
  };

  const handleStartEdit = () => {
    if (!selectedTask) return;

    setTaskForm(createTaskForm(selectedTask));
    setIsEditingTask(true);
    setIsCreatingTask(false);
  };

  const handleCancelEdit = () => {
    if (isCreatingTask) {
      handleCloseTaskModal();
      return;
    }

    setTaskForm(null);
    setIsEditingTask(false);
  };

  const handleTaskFormChange = (field, value) => {
    setTaskForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveTask = () => {
    if (!selectedTask || !taskForm) return;

    const title = taskForm.title.trim();
    if (!title) return;

    const originalColumnId = selectedTask.columnId;
    const nextColumnId = taskForm.status;
    const updatedTaskData = {
      title,
      priority: taskForm.priority,
      assignee: taskForm.assignee,
      dueDate: taskForm.dueDate,
      description: taskForm.description.trim(),
    };

    if (isCreatingTask) {
      const tempId = `local-${Date.now()}`;
      const newTask = {
        id: tempId,
        ...updatedTaskData,
        columnId: nextColumnId,
      };

      setTasks((prevTasks) => ({
        ...prevTasks,
        [nextColumnId]: [...(prevTasks[nextColumnId] || []), newTask],
      }));

      // Persist to Supabase if configured
      if (isSupabaseConfigured && supabase && user) {
        (async () => {
          try {
            const { data, error } = await supabase.from('tasks').insert([
              {
                user_id: user.id,
                title: newTask.title,
                description: newTask.description,
                status: newTask.columnId,
                due_date: newTask.dueDate || null,
                priority: newTask.priority || 'medium',
                assignee: newTask.assignee || 'You',
              },
            ]).select().single();

            if (!error && data) {
              // replace temp id with real id
              setTasks((prev) => {
                const list = (prev[nextColumnId] || []).map((t) => (t.id === tempId ? { ...t, id: data.id } : t));
                return { ...prev, [nextColumnId]: list };
              });

              setTaskActivity((prev) => {
                const nextActivity = { ...prev };
                const tempKey = getTaskKey(tempId);
                const realKey = getTaskKey(data.id);
                nextActivity[realKey] = nextActivity[tempKey] || nextActivity[realKey] || [];
                if (nextActivity[tempKey]) {
                  delete nextActivity[tempKey];
                }
                return nextActivity;
              });

              try {
                await supabase.from('activity_logs').insert([
                  {
                    task_id: String(data.id),
                    user_id: user.id,
                    action: 'created',
                    meta: {
                      message: 'Task created',
                      author: mockUser.name,
                    },
                  },
                ]);
              } catch {
                // ignore
              }
            }
          } catch {
            // ignore DB errors, keep local task
          }
        })();
      }

      setTaskActivity((prev) => ({
        ...prev,
        [getTaskKey(tempId)]: [
          {
            type: 'activity',
            message: 'Task created',
            author: mockUser.name,
            timestamp: new Date().toISOString(),
          },
        ],
      }));

      // show toast confirmation via global toast manager
      try {
        addToast({ title: 'Task created', message: 'Your task was added to To Do', variant: 'success' });
      } catch {
        setToastMessage({ title: 'Task created', message: 'Your task was added to To Do', variant: 'success' });
      }

      // close modal after creation (user can reopen by clicking task)
      handleCloseTaskModal();
      return;
    }

    const changedFields = [];

    if (selectedTask.title !== updatedTaskData.title) changedFields.push('title');
    if (selectedTask.priority !== updatedTaskData.priority) changedFields.push('priority');
    if (selectedTask.assignee !== updatedTaskData.assignee) changedFields.push('assignee');
    if (selectedTask.dueDate !== updatedTaskData.dueDate) changedFields.push('due date');
    if ((selectedTask.description || '') !== updatedTaskData.description) changedFields.push('notes');
    if (selectedTask.columnId !== nextColumnId) changedFields.push('status');

    setTasks((prevTasks) => {
      const sourceTasks = [...(prevTasks[originalColumnId] || [])];
      const taskIndex = sourceTasks.findIndex((task) => String(task.id) === String(selectedTask.id));

      if (taskIndex < 0) return prevTasks;

      if (originalColumnId === nextColumnId) {
        return {
          ...prevTasks,
          [originalColumnId]: sourceTasks.map((task) =>
            String(task.id) === String(selectedTask.id)
              ? { ...task, ...updatedTaskData }
              : task
          ),
        };
      }

      const [movedTask] = sourceTasks.splice(taskIndex, 1);
      const targetTasks = [...(prevTasks[nextColumnId] || [])];

      targetTasks.push({ ...movedTask, ...updatedTaskData });

      return {
        ...prevTasks,
        [originalColumnId]: sourceTasks,
        [nextColumnId]: targetTasks,
      };
    });

    setSelectedTask({
      ...selectedTask,
      ...updatedTaskData,
      columnId: nextColumnId,
    });

    if (changedFields.length > 0) {
      addTaskActivityEntry(selectedTask.id, {
        type: 'activity',
        message: `Updated ${changedFields.join(', ')}`,
        author: mockUser.name,
        timestamp: new Date().toISOString(),
      });
    }

    // Persist update to Supabase if possible
    if (isSupabaseConfigured && supabase && user) {
      (async () => {
        try {
          const taskId = selectedTask.id;
          if (taskId && typeof taskId === 'string') {
            await supabase.from('tasks').update({
              title: updatedTaskData.title,
              description: updatedTaskData.description,
              status: nextColumnId,
              due_date: updatedTaskData.dueDate || null,
              priority: updatedTaskData.priority || 'medium',
              assignee: updatedTaskData.assignee || 'You',
            }).eq('id', taskId);
          }
        } catch {
          // ignore
        }
      })();
    }

    setTaskForm(null);
    setIsEditingTask(false);
    setIsCreatingTask(false);
  };

  const handleAddComment = () => {
    if (!selectedTask) return;

    const trimmedComment = commentDraft.trim();

    if (!trimmedComment) return;

    const createdAt = new Date().toISOString();

    addTaskActivityEntry(selectedTask.id, {
      type: 'comment',
      message: trimmedComment,
      author: mockUser.name,
      timestamp: createdAt,
    });

    if (isSupabaseConfigured && supabase && user) {
      (async () => {
        try {
          await supabase.from('task_comments').insert([
            {
              task_id: String(selectedTask.id),
              user_id: user.id,
              body: trimmedComment,
            },
          ]);
        } catch {
          // ignore
        }
      })();
    }

    addNotification({
      type: 'comment',
      title: `New comment: ${selectedTask.title}`,
      message: trimmedComment,
      path: `/tasks?taskId=${selectedTask.id}&focus=comment`,
      taskId: String(selectedTask.id),
      sourceKey: `comment:${selectedTask.id}:${createdAt}`,
      createdAt,
    });

    setCommentDraft('');
  };

  const handleDeleteTask = () => {
    if (!selectedTask) return;

    const shouldDelete = window.confirm('Delete this task? This action cannot be undone.');

    if (!shouldDelete) return;

    const taskId = selectedTask.id;

    setTasks((prevTasks) => ({
      ...prevTasks,
      [selectedTask.columnId]: (prevTasks[selectedTask.columnId] || []).filter(
        (task) => String(task.id) !== String(selectedTask.id)
      ),
    }));

    if (isSupabaseConfigured && supabase && user) {
      (async () => {
        try {
          if (taskId && String(taskId).startsWith('local-') === false) {
            await supabase.from('task_comments').delete().eq('task_id', taskId);
            await supabase.from('activity_logs').delete().eq('task_id', taskId);
            await supabase.from('tasks').delete().eq('id', taskId);
          }
        } catch {
          // ignore
        }
      })();
    }
    setTaskActivity((prev) => {
      const nextActivity = { ...prev };
      delete nextActivity[getTaskKey(selectedTask.id)];
      return nextActivity;
    });
    setSelectedTask(null);
    setTaskForm(null);
    setIsEditingTask(false);
    setIsCreatingTask(false);
  };

  const taskColumns = [
    { id: 'todo', title: 'To Do', color: 'default' },
    { id: 'in-progress', title: 'In Progress', color: 'primary' },
    { id: 'review', title: 'In Review', color: 'warning' },
    { id: 'done', title: 'Done', color: 'success' },
  ];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      distance: 8,
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) {
      console.log('No drop target detected');
      return;
    }

    const activeId = String(active.id);
    const overId = String(over.id);

    console.log('Drag ended - Active:', activeId, 'Over:', overId);

    const { columnId: activeColumnId, taskId: activeTaskId } = parseTaskDndId(activeId);
    const { columnId: overColumnId, taskId: overTaskId } = parseTaskDndId(overId);

    console.log('Parsed - From column:', activeColumnId, 'task:', activeTaskId, 'To column:', overColumnId, 'task:', overTaskId);

    // If task is dropped on the same position, do nothing
    if (activeId === overId) {
      console.log('Same position, skipping');
      return;
    }

    let movedTaskId = null;
    let nextColumnForMove = null;

    setTasks((prevTasks) => {
      try {
        const activeTasks = [...(prevTasks[activeColumnId] || [])];
        const overTasks = overColumnId ? [...(prevTasks[overColumnId] || [])] : [];

        const activeTaskIndex = activeTasks.findIndex(
          (t) => String(t.id) === activeTaskId
        );

        if (activeTaskIndex < 0) {
          console.log('Active task not found');
          return prevTasks;
        }

        const overTaskIndex = overColumnId && overTaskId
          ? overTasks.findIndex((t) => String(t.id) === overTaskId)
          : -1;

        // Same column reordering
        if (activeColumnId === overColumnId) {
          console.log('Reordering in same column');
          const newTasks = arrayMove(activeTasks, activeTaskIndex, Math.max(0, overTaskIndex));
          movedTaskId = activeTaskId;
          nextColumnForMove = activeColumnId;
          return { ...prevTasks, [activeColumnId]: newTasks };
        }

        // Cross-column move
        if (overColumnId && prevTasks[overColumnId] !== undefined) {
          console.log('Moving to different column:', overColumnId);
          const [movedTask] = activeTasks.splice(activeTaskIndex, 1);
          const newOverTasks = [...(prevTasks[overColumnId] || [])];
          newOverTasks.splice(overTaskIndex >= 0 ? overTaskIndex : newOverTasks.length, 0, movedTask);

          movedTaskId = String(movedTask.id);
          nextColumnForMove = overColumnId;

          return {
            ...prevTasks,
            [activeColumnId]: activeTasks,
            [overColumnId]: newOverTasks,
          };
        }

        console.log('No valid drop target found');
        return prevTasks;
      } catch {
        return prevTasks;
      }
    });

    if (isSupabaseConfigured && supabase && user && movedTaskId && nextColumnForMove) {
      (async () => {
        try {
          if (!String(movedTaskId).startsWith('local-')) {
            await supabase.from('tasks').update({ status: nextColumnForMove }).eq('id', movedTaskId);
          }
        } catch {
          // ignore
        }
      })();
    }
  };

  return (
    <MainLayout 
      user={mockUser} 
      activeTab="tasks"
      onNotifications={() => {}}
      onLayout={() => addToast({ title: 'Layout', message: 'Grid view coming soon!', variant: 'default' })}
      onMore={() => addToast({ title: 'More Options', message: 'Additional options coming soon!', variant: 'default' })}
    >
      <div className="space-y-6 animate-fade-in-up">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div id="tasks-overview">
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-100">Tasks</h1>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">Organize, prioritize, and track all your work in one place.</p>
          </div>
          <Button size="sm" variant="primary" className="gap-2 bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-600" onClick={() => openModal(TaskCreateForm, { column: 'todo' })}>
            <Plus size={16} /> New Task
          </Button>
        </div>

        <Card className="rounded-md border-neutral-200 bg-white p-5 shadow-[0_12px_30px_rgba(17,25,43,0.04)] dark:border-neutral-700 dark:bg-neutral-800">
          <div className="space-y-4">
            <div className="flex flex-col gap-3 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)_auto] lg:items-center lg:gap-4 ">
              <div className="flex flex-wrap items-center gap-2 rounded-md py-3 dark:border-neutral-700 dark:bg-neutral-800/70 lg:justify-start">
                  <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">Priority</span>
                  <div className="flex flex-wrap gap-2">
                    {priorityOptions.map((priority) => (
                      <button
                        key={priority}
                        onClick={() => togglePriority(priority)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                          selectedPriorities.includes(priority)
                            ? priority === 'high'
                              ? 'border-red-200 bg-red-100 text-red-700'
                              : priority === 'medium'
                              ? 'border-amber-200 bg-amber-100 text-amber-700'
                              : 'border-emerald-200 bg-emerald-100 text-emerald-700'
                            : 'border-neutral-200 bg-neutral-100 text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                        }`}
                      >
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

              <div className="w-full max-w-xl justify-self-center">
                <div className={`flex w-full items-center gap-3 rounded-md border px-4 py-3 shadow-[0_10px_25px_rgba(17,25,43,0.05)] transition-colors ${isTaskSearchFocused ? 'border-primary-500 bg-white dark:border-primary-500 dark:bg-neutral-800' : 'border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800'}`}>
                  <Search size={18} className="text-neutral-400 dark:text-neutral-500" />
                  <input
                    type="text"
                    placeholder="Search tasks by title"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsTaskSearchFocused(true)}
                    onBlur={() => setIsTaskSearchFocused(false)}
                    className="w-full bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none dark:text-neutral-100 dark:placeholder:text-neutral-500"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm('')}
                      className="flex-shrink-0 rounded-md p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                      aria-label="Clear task search"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>

              <div ref={filterMenuRef} className="relative self-start justify-self-end lg:self-center">
                <Button
                  variant="secondary"
                  className="gap-2"
                  onClick={() => setIsFilterOpen((prev) => !prev)}
                  title="Filter by assignee and due date"
                >
                  <Filter size={18} />
                  Filters
                  {activeAdvancedFilterCount > 0 && (
                    <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-xs font-semibold text-white dark:bg-neutral-100 dark:text-neutral-900">
                      {activeAdvancedFilterCount}
                    </span>
                  )}
                </Button>

                {isFilterOpen && (
                  <div className="absolute right-0 z-20 mt-2 w-[19rem] rounded-md border border-neutral-200 bg-white p-4 shadow-xl dark:border-neutral-700 dark:bg-neutral-800">
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">Assignee</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {assigneeOptions.map((assignee) => (
                            <button
                              key={assignee}
                              type="button"
                              onClick={() => toggleAssignee(assignee)}
                              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                                selectedAssignees.includes(assignee)
                                  ? 'border-primary-200 bg-primary-100 text-primary-700 dark:border-primary-600/50 dark:bg-primary-600/20 dark:text-primary-200'
                                  : 'border-neutral-200 bg-neutral-100 text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                              }`}
                            >
                              {assignee}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">Due Date</p>
                        <div className="mt-2 grid grid-cols-1 gap-2">
                          {[{ value: 'none', label: 'Default order' }, { value: 'nearest', label: 'Closest due date first' }, { value: 'farthest', label: 'Farthest due date first' }].map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => setDueDateSort(option.value)}
                              className={`rounded-md border px-3 py-2 text-left text-xs font-medium transition-all ${
                                dueDateSort === option.value
                                  ? 'border-primary-300 bg-primary-100 text-primary-700 dark:border-primary-600/60 dark:bg-primary-600/20 dark:text-primary-200'
                                  : 'border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-neutral-200 pt-3 dark:border-neutral-700">
                        <button
                          type="button"
                          onClick={handleResetFilters}
                          className="text-xs font-semibold text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                        >
                          Reset all filters
                        </button>
                        <Button size="sm" variant="secondary" onClick={() => setIsFilterOpen(false)}>
                          Done
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                {hasActiveFilters ? 'Filtered view' : 'Showing all tasks'}
              </span>
            </div>
          </div>
        </Card>

        <DndContext
          sensors={sensors}
          collisionDetection={rectIntersection}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={taskColumns.flatMap((column) =>
              getFilteredTasks(tasks[column.id]).map((t) => buildTaskDndId(column.id, t.id))
            )}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid grid-cols-1 gap-4 overflow-x-auto pb-4 lg:grid-cols-2 2xl:grid-cols-4">
              {taskColumns.map((column) => (
                <ColumnWrapper key={column.id} column={column}>
                  <div className="mb-4 flex items-center justify-between border-b border-neutral-200 pb-4 dark:border-neutral-700">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-neutral-950 dark:text-neutral-100">{column.title}</h3>
                      <Badge variant={column.color} size="sm">
                        {getFilteredTasks(tasks[column.id]).length}
                      </Badge>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleStartCreate(column.id)}
                      className="rounded-full bg-neutral-100 p-2 text-neutral-500 transition-colors hover:bg-neutral-200 hover:text-neutral-900 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-neutral-100"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className="flex flex-1 flex-col space-y-3">
                    {getFilteredTasks(tasks[column.id]).map((task) => (
                      <DraggableTask
                        key={task.id}
                        task={task}
                        columnId={column.id}
                        onTaskClick={handleTaskClick}
                      />
                    ))}
                  </div>
                </ColumnWrapper>
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {/* Task Details Modal */}
        <Modal
          isOpen={selectedTask !== null}
          onClose={handleCloseTaskModal}
          title={isCreatingTask ? 'Create Task' : isEditingTask ? 'Edit Task' : selectedTask?.title || 'Task Details'}
          className="max-w-2xl"
        >
          {selectedTask && (
            <div className="space-y-6">
              {!isEditingTask ? (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">Task details</p>
                      <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                        {selectedTask.title}
                      </h3>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm" onClick={handleStartEdit}>
                        Edit
                      </Button>
                      <Button variant="danger" size="sm" onClick={handleDeleteTask}>
                        Delete
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                        Status
                      </h3>
                      <Badge variant={getTaskStatusMeta(selectedTask.columnId).variant}>
                        {getTaskStatusMeta(selectedTask.columnId).label}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                        Priority
                      </h3>
                      <Badge
                        variant={
                          selectedTask.priority === 'high'
                            ? 'error'
                            : selectedTask.priority === 'medium'
                            ? 'warning'
                            : 'default'
                        }
                      >
                        {selectedTask.priority.charAt(0).toUpperCase() + selectedTask.priority.slice(1)}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                        Due Date
                      </h3>
                      <p className="text-neutral-700 dark:text-neutral-300">{selectedTask.dueDate}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                        Assigned To
                      </h3>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neutral-300 to-neutral-500 flex items-center justify-center text-sm font-semibold text-white dark:from-primary-400 dark:to-primary-600">
                          {selectedTask.assignee.charAt(0)}
                        </div>
                        <p className="text-neutral-700 dark:text-neutral-300">{selectedTask.assignee}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                      Notes
                    </h3>
                    <p className="text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap rounded-md border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 p-4">
                      {selectedTask.description || 'No notes added yet.'}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      Activity & Comments
                    </h3>

                    <div className="space-y-3 max-h-64 overflow-y-auto rounded-md border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 p-4">
                      {(taskActivity[getTaskKey(selectedTask.id)] || []).length > 0 ? (
                        (taskActivity[getTaskKey(selectedTask.id)] || []).map((entry, index) => (
                          <div key={`${entry.timestamp}-${index}`} className="flex gap-3">
                            <div className={`mt-1 h-2.5 w-2.5 rounded-full ${entry.type === 'comment' ? 'bg-neutral-500 dark:bg-primary-500' : 'bg-neutral-400'}`} />
                            <div className="flex-1 space-y-1">
                              <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                                <span className="font-medium text-neutral-700 dark:text-neutral-300">{entry.author}</span>
                                <span>{formatActivityTime(entry.timestamp)}</span>
                                <Badge size="sm" variant={entry.type === 'comment' ? 'primary' : 'default'}>
                                  {entry.type === 'comment' ? 'Comment' : 'Update'}
                                </Badge>
                              </div>
                              <p className="text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">
                                {entry.message}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">No activity yet.</p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Textarea
                        id="task-comment-input"
                        rows={3}
                        placeholder="Write a comment..."
                        value={commentDraft}
                        onChange={(event) => setCommentDraft(event.target.value)}
                      />
                      <div className="flex justify-end">
                        <Button variant="secondary" size="sm" onClick={handleAddComment} disabled={!commentDraft.trim()}>
                          Add Comment
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <form
                  className="space-y-5"
                  onSubmit={(event) => {
                    event.preventDefault();
                    handleSaveTask();
                  }}
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="space-y-2 sm:col-span-2">
                      <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Title</span>
                      <Input
                        value={taskForm?.title || ''}
                        onChange={(event) => handleTaskFormChange('title', event.target.value)}
                        placeholder="Task title"
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Priority</span>
                      <select
                        value={taskForm?.priority || 'medium'}
                        onChange={(event) => handleTaskFormChange('priority', event.target.value)}
                        className="input-base w-full"
                      >
                        {priorityOptions.map((priority) => (
                          <option key={priority} value={priority}>
                            {priority.charAt(0).toUpperCase() + priority.slice(1)}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="space-y-2">
                      <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Status</span>
                      <select
                        value={taskForm?.status || 'todo'}
                        onChange={(event) => handleTaskFormChange('status', event.target.value)}
                        className="input-base w-full"
                      >
                        {taskStatusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="space-y-2">
                      <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Due Date</span>
                      <Input
                        type="date"
                        value={taskForm?.dueDate || ''}
                        onChange={(event) => handleTaskFormChange('dueDate', event.target.value)}
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Assignee</span>
                      <select
                        value={taskForm?.assignee || 'You'}
                        onChange={(event) => handleTaskFormChange('assignee', event.target.value)}
                        className="input-base w-full"
                      >
                        {assigneeOptions.map((assignee) => (
                          <option key={assignee} value={assignee}>
                            {assignee}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="space-y-2 sm:col-span-2">
                      <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Notes</span>
                      <Textarea
                        rows={5}
                        placeholder="Add task notes or details"
                        value={taskForm?.description || ''}
                        onChange={(event) => handleTaskFormChange('description', event.target.value)}
                      />
                    </label>
                  </div>

                  <div className="flex flex-col-reverse gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800 sm:flex-row sm:justify-between">
                    {isCreatingTask ? <span /> : (
                      <Button variant="danger" onClick={handleDeleteTask}>
                        Delete Task
                      </Button>
                    )}
                    <div className="flex gap-3">
                      <Button variant="secondary" onClick={handleCancelEdit}>
                        {isCreatingTask ? 'Cancel' : 'Cancel'}
                      </Button>
                      <Button variant="primary" type="submit">
                        {isCreatingTask ? 'Create Task' : 'Save Changes'}
                      </Button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          )}
        </Modal>
        {/* Toast component */}
        <Toast
          title={toastMessage?.title}
          message={toastMessage?.message}
          variant={toastMessage?.variant}
          onClose={() => setToastMessage(null)}
        />
      </div>
    </MainLayout>
  );
};

export default Tasks;
