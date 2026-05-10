import React, { useState } from 'react';
import { MainLayout } from '../components/layout';
import { Card, Badge, Button, Input } from '../components/ui';
import { Plus, Filter, Search, GripVertical } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Draggable task card component
const DraggableTask = ({ task, columnId }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `${columnId}-${task.id}` });

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
      {...attributes}
      {...listeners}
    >
      <Card className="hover:shadow-md transition-all">
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <GripVertical size={16} className="text-neutral-400 mt-1 flex-shrink-0" />
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
              {task.priority}
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

const Tasks = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const mockUser = {
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
  };

  const [tasks, setTasks] = useState({
    todo: [
      { id: 1, title: 'Setup database', priority: 'high', assignee: 'You', dueDate: '2024-05-15' },
      { id: 2, title: 'Create API documentation', priority: 'medium', assignee: 'Alex', dueDate: '2024-05-20' },
    ],
    'in-progress': [
      { id: 3, title: 'Design landing page', priority: 'high', assignee: 'You', dueDate: '2024-05-12' },
      { id: 4, title: 'Implement user auth', priority: 'high', assignee: 'Mike', dueDate: '2024-05-18' },
    ],
    review: [
      { id: 5, title: 'Performance optimization', priority: 'low', assignee: 'Sarah', dueDate: '2024-05-22' },
    ],
    done: [
      { id: 6, title: 'Project setup', priority: 'high', assignee: 'You', dueDate: '2024-05-10' },
      { id: 7, title: 'Team onboarding', priority: 'medium', assignee: 'Admin', dueDate: '2024-05-09' },
    ],
  });

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

    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    // Parse the task and column IDs
    const [activeColumnId, activeTaskId] = activeId.split('-');
    const [overColumnId, overTaskId] = overId.split('-');

    // If task is dropped on the same position, do nothing
    if (activeId === overId) return;

    setTasks((prevTasks) => {
      const activeTasks = [...prevTasks[activeColumnId]];
      const overTasks = overColumnId ? [...prevTasks[overColumnId]] : [...prevTasks[activeColumnId]];

      const activeTaskIndex = activeTasks.findIndex(
        (t) => String(t.id) === activeTaskId
      );
      const overTaskIndex = overTasks.findIndex(
        (t) => String(t.id) === overTaskId
      );

      if (activeColumnId === overColumnId) {
        // Reorder within the same column
        const newTasks = arrayMove(activeTasks, activeTaskIndex, overTaskIndex);
        return { ...prevTasks, [activeColumnId]: newTasks };
      } else {
        // Move task to a different column
        const [movedTask] = activeTasks.splice(activeTaskIndex, 1);
        const newOverTasks = [...overTasks];
        newOverTasks.splice(overTaskIndex >= 0 ? overTaskIndex : newOverTasks.length, 0, movedTask);

        return {
          ...prevTasks,
          [activeColumnId]: activeTasks,
          [overColumnId]: newOverTasks,
        };
      }
    });
  };

  return (
    <MainLayout user={mockUser} activeTab="tasks">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-neutral-900 dark:text-neutral-100">Tasks</h1>
            <p className="text-neutral-700 dark:text-neutral-400">Manage all your tasks and deadlines</p>
          </div>
          <Button variant="primary" className="gap-2">
            <Plus size={18} /> New Task
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
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

        {/* Kanban Board */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-6 overflow-x-auto pb-4">
            {taskColumns.map((column) => (
              <div
                key={column.id}
                className="flex flex-col bg-white dark:bg-neutral-900/80 rounded-lg p-4 border border-neutral-200 dark:border-neutral-800 min-w-max lg:min-w-0 text-neutral-900 dark:text-neutral-100"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg">{column.title}</h3>
                    <Badge variant={column.color} size="sm">
                      {tasks[column.id].length}
                    </Badge>
                  </div>
                  <button className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100">
                    <Plus size={18} />
                  </button>
                </div>

                {/* Tasks List */}
                <div className="space-y-3 flex-1">
                  <SortableContext
                    items={tasks[column.id].map((t) => `${column.id}-${t.id}`)}
                    strategy={verticalListSortingStrategy}
                  >
                    {tasks[column.id].map((task) => (
                      <DraggableTask
                        key={task.id}
                        task={task}
                        columnId={column.id}
                      />
                    ))}
                  </SortableContext>
                </div>
              </div>
            ))}
          </div>
        </DndContext>
      </div>
    </MainLayout>
  );
};

export default Tasks;
