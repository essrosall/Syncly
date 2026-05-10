import React, { useState } from 'react';
import { MainLayout } from '../components/layout';
import { Card, Badge, Button, Input } from '../components/ui';
import { Plus, Filter, Search } from 'lucide-react';

const Tasks = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const mockUser = {
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
  };

  const taskColumns = [
    {
      id: 'todo',
      title: 'To Do',
      color: 'default',
      tasks: [
        { id: 1, title: 'Setup database', priority: 'high', assignee: 'You', dueDate: '2024-05-15' },
        { id: 2, title: 'Create API documentation', priority: 'medium', assignee: 'Alex', dueDate: '2024-05-20' },
      ],
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      color: 'primary',
      tasks: [
        { id: 3, title: 'Design landing page', priority: 'high', assignee: 'You', dueDate: '2024-05-12' },
        { id: 4, title: 'Implement user auth', priority: 'high', assignee: 'Mike', dueDate: '2024-05-18' },
      ],
    },
    {
      id: 'review',
      title: 'In Review',
      color: 'warning',
      tasks: [
        { id: 5, title: 'Performance optimization', priority: 'low', assignee: 'Sarah', dueDate: '2024-05-22' },
      ],
    },
    {
      id: 'done',
      title: 'Done',
      color: 'success',
      tasks: [
        { id: 6, title: 'Project setup', priority: 'high', assignee: 'You', dueDate: '2024-05-10' },
        { id: 7, title: 'Team onboarding', priority: 'medium', assignee: 'Admin', dueDate: '2024-05-09' },
      ],
    },
  ];

  return (
    <MainLayout user={mockUser} activeTab="tasks">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Tasks</h1>
            <p className="text-neutral-400">Manage all your tasks and deadlines</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-6 overflow-x-auto pb-4">
          {taskColumns.map((column) => (
            <div key={column.id} className="flex flex-col bg-neutral-900/50 rounded-lg p-4 border border-neutral-800 min-w-max lg:min-w-0">
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg">{column.title}</h3>
                  <Badge variant={column.color} size="sm">{column.tasks.length}</Badge>
                </div>
                <button className="text-neutral-400 hover:text-neutral-200">
                  <Plus size={18} />
                </button>
              </div>

              {/* Tasks List */}
              <div className="space-y-3 flex-1">
                {column.tasks.map((task) => (
                  <Card
                    key={task.id}
                    className="cursor-move hover:shadow-lg transition-all group"
                    hover
                  >
                    <div className="space-y-3">
                      <h4 className="font-medium group-hover:text-primary-400 transition-colors">{task.title}</h4>
                      
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
                        <span className="text-neutral-400">{task.dueDate}</span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-neutral-700">
                        <span className="text-xs text-neutral-400">{task.assignee}</span>
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-xs font-semibold text-white">
                          {task.assignee.charAt(0)}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Tasks;
