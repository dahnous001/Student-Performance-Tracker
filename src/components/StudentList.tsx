import { useState, useEffect } from 'react';
import { UserCircle, Trash2, ChevronDown, ChevronRight, Users, Pencil } from 'lucide-react';
import { Grade, Student } from '../types';
import Toast from './Toast';
import EditStudentModal from './EditStudentModal';

interface StudentListProps {
  students: Student[];
  onDeleteStudent: (studentId: string) => void;
  onUpdateStudent: (updatedStudent: Student) => void;
}

export default function StudentList({ students, onDeleteStudent, onUpdateStudent }: StudentListProps) {
  const [grades, setGrades] = useState<Grade[]>(() => {
    const saved = localStorage.getItem('grades');
    return saved ? JSON.parse(saved) : [];
  });

  const [expandedGrades, setExpandedGrades] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  useEffect(() => {
    // Initialize all grades as expanded
    const initialExpanded: Record<string, boolean> = {};
    grades.forEach(grade => {
      initialExpanded[grade.id] = true;
    });
    setExpandedGrades(initialExpanded);
  }, [grades]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  };

  const toggleGrade = (gradeId: string) => {
    setExpandedGrades(prev => ({
      ...prev,
      [gradeId]: !prev[gradeId]
    }));
  };

  const handleDeleteStudent = (studentId: string, studentName: string) => {
    onDeleteStudent(studentId);
    showToast(`Student ${studentName} removed successfully`, 'success');
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    onUpdateStudent(updatedStudent);
    setEditingStudent(null);
    showToast(`Student ${updatedStudent.name} updated successfully`, 'success');
  };

  const getStudentsForGrade = (gradeId: string) => {
    return students.filter(student => student.gradeId === gradeId);
  };

  if (grades.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500 text-center">No grades added yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {grades.map((grade) => {
        const gradeStudents = getStudentsForGrade(grade.id);
        const isExpanded = expandedGrades[grade.id];

        return (
          <div key={grade.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
              <button
                onClick={() => toggleGrade(grade.id)}
                className="flex items-center gap-3 flex-1"
                aria-expanded={isExpanded}
              >
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-indigo-500" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-indigo-500" />
                )}
                <h3 className="text-lg font-medium text-gray-900">
                  {grade.name}{grade.class ? ` - ${grade.class}` : ''}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Users className="w-4 h-4" />
                  <span>{gradeStudents.length} students</span>
                </div>
              </button>
            </div>

            {isExpanded && (
              <div className="border-t border-gray-100 p-4 animate-[slideDown_0.2s_ease-out]">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {gradeStudents.length === 0 ? (
                    <p className="text-gray-500 col-span-full text-center py-4">No students in this grade</p>
                  ) : (
                    gradeStudents.map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-all"
                      >
                        {student.picture ? (
                          <img
                            src={student.picture}
                            alt={student.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                            <UserCircle className="w-8 h-8 text-indigo-500" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{student.name}</p>
                          {student.email && (
                            <p className="text-sm text-gray-500 truncate">{student.email}</p>
                          )}
                        </div>
                        <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEditStudent(student)}
                            className="p-1.5 hover:bg-indigo-100 rounded-full transition-colors"
                            aria-label={`Edit ${student.name}`}
                            type="button"
                          >
                            <Pencil className="w-4 h-4 text-indigo-600" />
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(student.id, student.name)}
                            className="p-1.5 hover:bg-red-100 rounded-full transition-colors"
                            aria-label={`Delete ${student.name}`}
                            type="button"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
      
      {editingStudent && (
        <EditStudentModal
          student={editingStudent}
          onClose={() => setEditingStudent(null)}
          onUpdate={handleUpdateStudent}
        />
      )}
      
      {toast && <Toast message={toast.message} type={toast.type} />}

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-0.5rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}