import { useState, useEffect } from 'react';
import { UserPlus, Upload, Users } from 'lucide-react';
import IndividualStudentForm from './IndividualStudentForm';
import BulkStudentUpload from './BulkStudentUpload';
import StudentList from './StudentList';
import type { Student } from '../types';

export default function StudentManagement() {
  const [mode, setMode] = useState<'individual' | 'bulk' | null>(null);
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('students');
    return saved ? JSON.parse(saved) : [];
  });

  // Update localStorage when students change
  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  const handleAddStudent = (newStudent: Student) => {
    setStudents(prev => [...prev, newStudent]);
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudents(prev => prev.filter(student => student.id !== studentId));
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents(prev => prev.map(student => 
      student.id === updatedStudent.id ? updatedStudent : student
    ));
  };

  const renderContent = () => {
    if (!mode) {
      return (
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <h2 className="text-2xl font-semibold text-center mb-8">Choose Entry Method</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <button
              onClick={() => setMode('individual')}
              className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
            >
              <UserPlus className="w-12 h-12 text-gray-400 group-hover:text-indigo-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Individual Entry</h3>
              <p className="text-sm text-gray-500 text-center mt-2">
                Add students one by one with detailed information
              </p>
            </button>

            <button
              onClick={() => setMode('bulk')}
              className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
            >
              <Upload className="w-12 h-12 text-gray-400 group-hover:text-indigo-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Bulk Upload</h3>
              <p className="text-sm text-gray-500 text-center mt-2">
                Import multiple students using a CSV file
              </p>
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6 mb-8">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {mode === 'individual' ? 'Add Individual Student' : 'Bulk Upload Students'}
          </h2>
          <button
            onClick={() => setMode(null)}
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            Change Entry Method
          </button>
        </div>

        {mode === 'individual' ? (
          <IndividualStudentForm onAddStudent={handleAddStudent} />
        ) : (
          <BulkStudentUpload />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {renderContent()}
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 bg-indigo-50 border-b border-indigo-100">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-indigo-900">Students by Grade</h2>
          </div>
        </div>
        <div className="p-6">
          <StudentList 
            students={students}
            onDeleteStudent={handleDeleteStudent}
            onUpdateStudent={handleUpdateStudent}
          />
        </div>
      </div>
    </div>
  );
}