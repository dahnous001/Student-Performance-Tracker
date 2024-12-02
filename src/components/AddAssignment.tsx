import { useState, useEffect } from 'react';
import { Calendar, Users } from 'lucide-react';
import type { Assignment, AssignmentType, Grade, Student } from '../types';
import StudentSelector from './StudentSelector';

interface AddAssignmentProps {
  onAdd: (assignment: Assignment) => void;
  selectedType: AssignmentType;
}

export default function AddAssignment({ onAdd, selectedType }: AddAssignmentProps) {
  const [grades] = useState<Grade[]>(() => {
    const saved = localStorage.getItem('grades');
    return saved ? JSON.parse(saved) : [];
  });

  const [formData, setFormData] = useState({
    gradeId: '',
    name: '',
    number: '',
    date: new Date().toISOString().split('T')[0],
    weekNumber: new Date().getWeek(),
    studentIds: [] as string[],
  });

  const [error, setError] = useState('');

  // Extend Date prototype to get week number
  declare global {
    interface Date {
      getWeek(): number;
    }
  }

  Date.prototype.getWeek = function() {
    const d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1)/7);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.gradeId) {
      setError('Please select a grade');
      return;
    }
    if (!formData.name.trim()) {
      setError('Please enter assignment name');
      return;
    }
    if (formData.studentIds.length === 0) {
      setError('Please select at least one student');
      return;
    }

    const newAssignment: Assignment = {
      id: crypto.randomUUID(),
      type: selectedType,
      ...formData,
    };

    onAdd(newAssignment);
  };

  const handleStudentSelection = (studentIds: string[]) => {
    setFormData(prev => ({ ...prev, studentIds }));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">
              Grade *
            </label>
            <select
              id="grade"
              value={formData.gradeId}
              onChange={(e) => setFormData(prev => ({ ...prev, gradeId: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select a grade</option>
              {grades.map((grade) => (
                <option key={grade.id} value={grade.id}>
                  {grade.name}{grade.class ? ` - ${grade.class}` : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Assignment Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={`Enter ${selectedType} name`}
            />
          </div>

          <div>
            <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">
              Assignment Number
            </label>
            <input
              type="text"
              id="number"
              value={formData.number}
              onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., HW-1"
            />
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date *
            </label>
            <div className="relative">
              <input
                type="date"
                id="date"
                value={formData.date}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  setFormData(prev => ({
                    ...prev,
                    date: e.target.value,
                    weekNumber: date.getWeek(),
                  }));
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Missing Students *
              </label>
              <span className="text-sm text-gray-500">
                Week {formData.weekNumber}
              </span>
            </div>
            
            <StudentSelector
              gradeId={formData.gradeId}
              selectedIds={formData.studentIds}
              onChange={handleStudentSelection}
            />
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Add Assignment
          </button>
        </div>
      </form>
    </div>
  );
}