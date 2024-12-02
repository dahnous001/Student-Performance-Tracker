import { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { Grade, Student } from '../types';
import Toast from './Toast';

export default function BulkStudentUpload() {
  const [grades, setGrades] = useState<Grade[]>(() => {
    const saved = localStorage.getItem('grades');
    return saved ? JSON.parse(saved) : [];
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('students');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedGrade, setSelectedGrade] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!selectedGrade) {
      showToast('Please select a grade first', 'error');
      return;
    }

    if (file.type !== 'text/csv') {
      showToast('Please upload a CSV file', 'error');
      return;
    }

    try {
      const text = await file.text();
      const rows = text.split('\n').map(row => row.split(','));
      
      // Skip header row and empty rows
      const validRows = rows.slice(1).filter(row => row.length >= 1 && row[0].trim());

      const newStudents: Student[] = validRows.map(row => ({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: row[0].trim(),
        email: row[1]?.trim() || undefined,
        gradeId: selectedGrade,
      }));

      setStudents(prev => [...prev, ...newStudents]);
      showToast(`Successfully added ${newStudents.length} students`, 'success');
      
      // Reset file input
      e.target.value = '';
    } catch (error) {
      showToast('Error processing CSV file', 'error');
    }
  };

  if (grades.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500 text-center">Please add grades before uploading students</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 animate-fade-in">
      <div className="space-y-6">
        <div>
          <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">
            Select Grade *
          </label>
          <select
            id="grade"
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload CSV File
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-500 transition-colors cursor-pointer">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept=".csv"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500">CSV file only</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">CSV Format Instructions:</h3>
          <p className="text-sm text-blue-600">
            The CSV file should have the following columns:<br />
            1. Student Name (required)<br />
            2. Email (optional)<br />
            <br />
            Example:<br />
            <code>Name,Email<br />
            John Doe,john@example.com<br />
            Jane Smith,jane@example.com</code>
          </p>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}