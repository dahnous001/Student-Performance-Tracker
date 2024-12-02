import { useState, useEffect } from 'react';
import { Check, Search, UserCircle } from 'lucide-react';
import type { Student } from '../types';

interface StudentSelectorProps {
  gradeId: string;
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
}

export default function StudentSelector({ gradeId, selectedIds, onChange }: StudentSelectorProps) {
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('students');
    return saved ? JSON.parse(saved) : [];
  });

  const [searchTerm, setSearchTerm] = useState('');

  const gradeStudents = students
    .filter(student => student.gradeId === gradeId)
    .filter(student => 
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const toggleStudent = (studentId: string) => {
    const newSelection = selectedIds.includes(studentId)
      ? selectedIds.filter(id => id !== studentId)
      : [...selectedIds, studentId];
    onChange(newSelection);
  };

  if (!gradeId) {
    return (
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <p className="text-gray-500 text-center">Please select a grade first</p>
      </div>
    );
  }

  if (gradeStudents.length === 0) {
    return (
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <p className="text-gray-500 text-center">No students found in this grade</p>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="p-3 border-b border-gray-200 bg-gray-50">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="max-h-64 overflow-y-auto p-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {gradeStudents.map((student) => {
          const isSelected = selectedIds.includes(student.id);
          return (
            <button
              key={student.id}
              onClick={() => toggleStudent(student.id)}
              className={`
                flex items-center gap-3 p-2 rounded-lg transition-all
                ${isSelected 
                  ? 'bg-indigo-50 border-2 border-indigo-500' 
                  : 'border-2 border-transparent hover:bg-gray-50'
                }
              `}
            >
              {student.picture ? (
                <img
                  src={student.picture}
                  alt={student.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <UserCircle className="w-8 h-8 text-gray-400" />
              )}
              <span className="flex-1 text-left font-medium text-gray-900">
                {student.name}
              </span>
              <div className={`
                w-5 h-5 rounded-full border-2 flex items-center justify-center
                ${isSelected
                  ? 'border-indigo-500 bg-indigo-500'
                  : 'border-gray-300'
                }
              `}>
                {isSelected && <Check className="w-3 h-3 text-white" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}