import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import type { Grade } from '../types';

export default function GradeManagement() {
  const [grades, setGrades] = useState<Grade[]>(() => {
    const saved = localStorage.getItem('grades');
    return saved ? JSON.parse(saved) : [];
  });

  const [gradeName, setGradeName] = useState('');
  const [classSection, setClassSection] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('grades', JSON.stringify(grades));
    } catch (error) {
      console.error('Error saving grades:', error);
      setError('Error saving grades');
    }
  }, [grades]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!gradeName.trim()) {
      setError('Please enter a grade name');
      return;
    }

    const newGrade: Grade = {
      id: crypto.randomUUID(),
      name: gradeName,
      ...(classSection && { class: classSection })
    };

    setGrades(prev => [...prev, newGrade]);
    setGradeName('');
    setClassSection('');
    setError('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Add New Grade</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="gradeName" className="block text-sm font-medium text-gray-700 mb-1">
                Grade Name *
              </label>
              <input
                type="text"
                id="gradeName"
                value={gradeName}
                onChange={(e) => setGradeName(e.target.value)}
                placeholder="e.g., Grade 4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div className="w-32">
              <label htmlFor="classSection" className="block text-sm font-medium text-gray-700 mb-1">
                Class
              </label>
              <input
                type="text"
                id="classSection"
                value={classSection}
                onChange={(e) => setClassSection(e.target.value)}
                placeholder="e.g., A"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Add Grade
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-indigo-600" />
          <h2 className="text-xl font-semibold">Existing Grades</h2>
        </div>

        {grades.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No grades added yet</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {grades.map((grade) => (
              <div
                key={grade.id}
                className="p-4 bg-indigo-50 rounded-lg border border-indigo-100"
              >
                <h3 className="font-medium text-indigo-900">
                  {grade.name}
                  {grade.class && (
                    <span className="text-indigo-600 ml-1">- {grade.class}</span>
                  )}
                </h3>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}