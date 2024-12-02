import { useState, useEffect } from 'react';
import { ScrollText, BookOpen, FileSpreadsheet, FolderKanban } from 'lucide-react';
import AddAssignment from './AddAssignment';
import AssignmentList from './AssignmentList';
import type { Assignment, AssignmentType, Grade } from '../types';

const ASSIGNMENT_TYPES: { id: AssignmentType; label: string; icon: typeof ScrollText }[] = [
  { id: 'homework', label: 'Homework', icon: ScrollText },
  { id: 'classwork', label: 'Classwork', icon: BookOpen },
  { id: 'worksheet', label: 'Worksheet', icon: FileSpreadsheet },
  { id: 'project', label: 'Project', icon: FolderKanban },
];

export default function AssignmentManagement() {
  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem('assignments');
    return saved ? JSON.parse(saved) : [];
  });

  const [grades] = useState<Grade[]>(() => {
    const saved = localStorage.getItem('grades');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [selectedType, setSelectedType] = useState<AssignmentType>('homework');
  const [isAddingNew, setIsAddingNew] = useState(false);

  useEffect(() => {
    localStorage.setItem('assignments', JSON.stringify(assignments));
  }, [assignments]);

  const handleAddAssignment = (newAssignment: Assignment) => {
    setAssignments(prev => [...prev, newAssignment]);
    setIsAddingNew(false);
  };

  const handleDeleteAssignment = (assignmentId: string) => {
    setAssignments(prev => prev.filter(a => a.id !== assignmentId));
  };

  const handleTypeSelect = (type: AssignmentType) => {
    setSelectedType(type);
    setIsAddingNew(true);
  };

  // If no grades exist, show a message to add grades first
  if (grades.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-fade-in">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Grades Available</h2>
          <p className="text-gray-500">Please add at least one grade before creating assignments.</p>
          {/* You might want to add a link to the grades section here */}
        </div>
      </div>
    );
  }

  if (isAddingNew) {
    return (
      <div className="animate-fade-in">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Add New {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}</h2>
          <button
            onClick={() => setIsAddingNew(false)}
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            Cancel
          </button>
        </div>
        <AddAssignment
          onAdd={handleAddAssignment}
          selectedType={selectedType}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Track Missing Assignments</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ASSIGNMENT_TYPES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleTypeSelect(id)}
              className={`
                flex items-center gap-3 p-4 rounded-lg border-2 border-dashed
                transition-all duration-200 hover:border-indigo-500 hover:bg-indigo-50
                group cursor-pointer
                ${selectedType === id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}
              `}
            >
              <Icon className={`w-6 h-6 ${selectedType === id ? 'text-indigo-600' : 'text-gray-400'} group-hover:text-indigo-600`} />
              <span className="font-medium text-gray-900">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <AssignmentList
        assignments={assignments}
        onDelete={handleDeleteAssignment}
      />
    </div>
  );
}