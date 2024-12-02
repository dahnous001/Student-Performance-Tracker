import { useState } from 'react';
import { ChevronDown, ChevronRight, ScrollText, BookOpen, FileSpreadsheet, FolderKanban, Trash2 } from 'lucide-react';
import type { Assignment, Grade, Student } from '../types';

const ASSIGNMENT_ICONS = {
  homework: ScrollText,
  classwork: BookOpen,
  worksheet: FileSpreadsheet,
  project: FolderKanban,
};

interface AssignmentListProps {
  assignments: Assignment[];
  onDelete: (id: string) => void;
}

export default function AssignmentList({ assignments, onDelete }: AssignmentListProps) {
  const [grades] = useState<Grade[]>(() => {
    const saved = localStorage.getItem('grades');
    return saved ? JSON.parse(saved) : [];
  });

  const [students] = useState<Student[]>(() => {
    const saved = localStorage.getItem('students');
    return saved ? JSON.parse(saved) : [];
  });

  const [expandedGrades, setExpandedGrades] = useState<Record<string, boolean>>({});

  const toggleGrade = (gradeId: string) => {
    setExpandedGrades(prev => ({
      ...prev,
      [gradeId]: !prev[gradeId]
    }));
  };

  const getGradeAssignments = (gradeId: string) => {
    return assignments.filter(a => a.gradeId === gradeId);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (assignments.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500 text-center">No assignments tracked yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {grades.map((grade) => {
        const gradeAssignments = getGradeAssignments(grade.id);
        if (gradeAssignments.length === 0) return null;

        const isExpanded = expandedGrades[grade.id];

        return (
          <div key={grade.id} className="bg-white rounded-lg shadow overflow-hidden">
            <button
              onClick={() => toggleGrade(grade.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-indigo-500" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-indigo-500" />
                )}
                <h3 className="text-lg font-medium text-gray-900">
                  {grade.name}{grade.class ? ` - ${grade.class}` : ''}
                </h3>
                <span className="text-sm text-gray-500">
                  {gradeAssignments.length} assignments
                </span>
              </div>
            </button>

            {isExpanded && (
              <div className="border-t border-gray-100 p-4 animate-[slideDown_0.2s_ease-out]">
                <div className="space-y-3">
                  {gradeAssignments.map((assignment) => {
                    const Icon = ASSIGNMENT_ICONS[assignment.type];
                    const missingStudents = students.filter(s => 
                      assignment.studentIds.includes(s.id)
                    );

                    return (
                      <div
                        key={assignment.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                            <Icon className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {assignment.name}
                              {assignment.number && ` (${assignment.number})`}
                            </h4>
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                              <span>Week {assignment.weekNumber}</span>
                              <span>{formatDate(assignment.date)}</span>
                              <span>{missingStudents.length} students missing</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(assignment.id);
                            }}
                            className="p-1.5 hover:bg-red-100 rounded-full transition-colors"
                            aria-label="Delete assignment"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}