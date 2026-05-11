import React, { useEffect, useState } from 'react';
import { MainLayout } from '../components/layout';
import { Card, Badge, Button, Input, Modal, Textarea, Toast } from '../components/ui';
import { useCreateModal } from '../contexts/CreateModalContext';
import { Plus, Filter, Search, GripVertical } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { useGlobalModal } from '../contexts/GlobalModalContext';
import TaskCreateForm from '../components/tasks/TaskCreateForm';
import {
  DndContext,
  closestCenter,
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
  } catch (error) {
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
          <div className="flex items-start gap-2">
            <button
              type="button"
              className="mt-1 flex-shrink-0 cursor-grab active:cursor-grabbing rounded-md p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
              aria-label={`Drag ${task.title}`}
              onClick={(event) => event.stopPropagation()}
              onPointerDown={(event) => event.stopPropagation()}
              {...attributes}
              {...listeners}
            >
              <GripVertical size={16} />
            </button>
            <h4 className="font-medium text-neutral-900 dark:text-neutral-100 flex-1">{task.title}</h4>
          </div>
          
          <div className="flex items-center justify-between text-xs">
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
            <span className="text-neutral-600 dark:text-neutral-400">{task.dueDate}</span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-neutral-200 dark:border-neutral-700">
            <span className="text-xs text-neutral-600 dark:text-neutral-400">{task.assignee}</span>
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-xs font-semibold text-white">
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
      className="flex min-h-[24rem] flex-col bg-white dark:bg-neutral-900/80 rounded-lg p-4 border border-neutral-200 dark:border-neutral-800 min-w-max lg:min-w-0 text-neutral-900 dark:text-neutral-100"
    >
      {children}
    </div>
  );
};

const Tasks = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriorities, setSelectedPriorities] = useState(['high', 'medium', 'low']);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditingTask, setIsEditingTask] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [taskForm, setTaskForm] = useState(null);
  const [taskActivity, setTaskActivity] = useState(() => readStoredJson(TASK_ACTIVITY_STORAGE_KEY, defaultTaskActivity));
  const [commentDraft, setCommentDraft] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const { addToast } = useToast();
  const { openModal } = useGlobalModal();

  const { createRequest, clearRequest } = useCreateModal();
  
  const mockUser = {
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
  };

  const [tasks, setTasks] = useState(() => readStoredJson(TASKS_STORAGE_KEY, defaultTasks));

  useEffect(() => {
    try {
      window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Unable to persist tasks:', error);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      window.localStorage.setItem(TASK_ACTIVITY_STORAGE_KEY, JSON.stringify(taskActivity));
    } catch (error) {
      console.error('Unable to persist task activity:', error);
    }
  }, [taskActivity]);

  // Filter tasks based on search term and priority
  const getFilteredTasks = (columnTasks) => {
    return columnTasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = selectedPriorities.includes(task.priority);
      return matchesSearch && matchesPriority;
    });
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
    try {
      const params = new URLSearchParams(window.location.search);
      const newParam = params.get('new');
      if (newParam) {
        handleStartCreate(newParam);
        // prefill assignee/priority if provided
        const assignee = params.get('assignee');
        const priority = params.get('priority');
        if (assignee || priority) {
          setTaskForm((prev) => ({ ...(prev || {}), ...(assignee ? { assignee } : {}), ...(priority ? { priority } : {}) }));
        }
        // remove the param so refresh doesn't re-open
        params.delete('new');
        params.delete('assignee');
        params.delete('priority');
        const newSearch = params.toString();
        const newUrl = window.location.pathname + (newSearch ? `?${newSearch}` : '');
        window.history.replaceState(null, '', newUrl);
      }

      // check for a top-level create request (set by other UI pieces via localStorage)
      const rawCreate = window.localStorage.getItem('syncly:createRequest');
      if (rawCreate) {
        try {
          const parsed = JSON.parse(rawCreate);
          const col = parsed.column || 'todo';
          handleStartCreate(col);
          if (parsed.assignee || parsed.priority) {
            setTaskForm((prev) => ({ ...(prev || {}), ...(parsed.assignee ? { assignee: parsed.assignee } : {}), ...(parsed.priority ? { priority: parsed.priority } : {}) }));
          }
        } catch (e) {
          // ignore parse errors
        }
        window.localStorage.removeItem('syncly:createRequest');
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Listen for in-app create requests via the CreateModal context
  useEffect(() => {
    if (!createRequest) return;
    try {
      const col = createRequest.column || 'todo';
      handleStartCreate(col);
      if (createRequest.assignee || createRequest.priority) {
        setTaskForm((prev) => ({ ...(prev || {}), ...(createRequest.assignee ? { assignee: createRequest.assignee } : {}), ...(createRequest.priority ? { priority: createRequest.priority } : {}) }));
      }
    } catch (e) {
      // ignore
    }
    // clear the request so it doesn't re-open
    try {
      clearRequest();
    } catch (e) {}
  }, [createRequest, clearRequest]);

  const addTaskActivityEntry = (taskId, entry) => {
    const taskKey = getTaskKey(taskId);

    setTaskActivity((prev) => ({
      ...prev,
      [taskKey]: [...(prev[taskKey] || []), entry],
    }));
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
      const newTaskId = getNextTaskId(tasks);
      const newTask = {
        id: newTaskId,
        ...updatedTaskData,
        columnId: nextColumnId,
      };

      setTasks((prevTasks) => ({
        ...prevTasks,
        [nextColumnId]: [...(prevTasks[nextColumnId] || []), newTask],
      }));

      setTaskActivity((prev) => ({
        ...prev,
        [getTaskKey(newTaskId)]: [
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
      } catch (e) {
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

    setTaskForm(null);
    setIsEditingTask(false);
    setIsCreatingTask(false);
  };

  const handleAddComment = () => {
    if (!selectedTask) return;

    const trimmedComment = commentDraft.trim();

    if (!trimmedComment) return;

    addTaskActivityEntry(selectedTask.id, {
      type: 'comment',
      message: trimmedComment,
      author: mockUser.name,
      timestamp: new Date().toISOString(),
    });

    setCommentDraft('');
  };

  const handleDeleteTask = () => {
    if (!selectedTask) return;

    const shouldDelete = window.confirm('Delete this task? This action cannot be undone.');

    if (!shouldDelete) return;

    setTasks((prevTasks) => ({
      ...prevTasks,
      [selectedTask.columnId]: (prevTasks[selectedTask.columnId] || []).filter(
        (task) => String(task.id) !== String(selectedTask.id)
      ),
    }));
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
          return { ...prevTasks, [activeColumnId]: newTasks };
        }

        // Cross-column move
        if (overColumnId && prevTasks[overColumnId] !== undefined) {
          console.log('Moving to different column:', overColumnId);
          const [movedTask] = activeTasks.splice(activeTaskIndex, 1);
          const newOverTasks = [...(prevTasks[overColumnId] || [])];
          newOverTasks.splice(overTaskIndex >= 0 ? overTaskIndex : newOverTasks.length, 0, movedTask);

          return {
            ...prevTasks,
            [activeColumnId]: activeTasks,
            [overColumnId]: newOverTasks,
          };
        }

        console.log('No valid drop target found');
        return prevTasks;
      } catch (error) {
        console.error('Drag error:', error);
        return prevTasks;
      }
    });
  };

  return (
    <MainLayout user={mockUser} activeTab="tasks">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Tasks</h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Manage all your tasks and deadlines</p>
          </div>
                  <Button variant="primary" className="gap-2" onClick={() => openModal(TaskCreateForm, { column: 'todo' })}>
                    <Plus size={18} /> New Task
                  </Button>
        </div>

        {/* Filters */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search tasks..."
                icon={Search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="secondary" className="gap-2">
              <Filter size={18} /> Filter
            </Button>
          </div>

          {/* Priority Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 self-center">Priority:</span>
            <div className="flex gap-2">
              {['high', 'medium', 'low'].map((priority) => (
                <button
                  key={priority}
                  onClick={() => togglePriority(priority)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    selectedPriorities.includes(priority)
                      ? priority === 'high'
                        ? 'bg-red-500 text-white'
                        : priority === 'medium'
                        ? 'bg-amber-500 text-white'
                        : 'bg-neutral-500 text-white'
                      : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-400'
                  }`}
                >
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Kanban Board */}
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
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-6 overflow-x-auto pb-4">
              {taskColumns.map((column) => (
                <ColumnWrapper key={column.id} column={column}>
                {/* Column Header */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg">{column.title}</h3>
                    <Badge variant={column.color} size="sm">
                      {getFilteredTasks(tasks[column.id]).length}
                    </Badge>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleStartCreate(column.id)}
                    className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                {/* Tasks List */}
                <div className="space-y-3 flex-1">
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
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-sm font-semibold text-white">
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
                    <p className="text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 p-4">
                      {selectedTask.description || 'No notes added yet.'}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      Activity & Comments
                    </h3>

                    <div className="space-y-3 max-h-64 overflow-y-auto rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 p-4">
                      {(taskActivity[getTaskKey(selectedTask.id)] || []).length > 0 ? (
                        (taskActivity[getTaskKey(selectedTask.id)] || []).map((entry, index) => (
                          <div key={`${entry.timestamp}-${index}`} className="flex gap-3">
                            <div className={`mt-1 h-2.5 w-2.5 rounded-full ${entry.type === 'comment' ? 'bg-primary-500' : 'bg-neutral-400'}`} />
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
