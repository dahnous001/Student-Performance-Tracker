import { useState, useCallback } from 'react';
import { Upload } from 'lucide-react';
import { Grade, Student } from '../types';
import Toast from './Toast';

interface IndividualStudentFormProps {
  onAddStudent: (student: Student) => void;
}

export default function IndividualStudentForm({ onAddStudent }: IndividualStudentFormProps) {
  const [grades] = useState<Grade[]>(() => {
    const saved = localStorage.getItem('grades');
    return saved ? JSON.parse(saved) : [];
  });

  const [formData, setFormData] = useState({
    name: '',
    gradeId: '',
    email: '',
    picture: '',
  });

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const validateImage = (file: File): boolean => {
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image must be less than 5MB', 'error');
      return false;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      showToast('Please upload a valid image file (JPEG, PNG, or GIF)', 'error');
      return false;
    }

    return true;
  };

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateImage(file)) {
      e.target.value = ''; // Reset file input
      return;
    }

    setIsProcessingImage(true);
    
    const reader = new FileReader();
    
    reader.onloadend = () => {
      try {
        setFormData(prev => ({ ...prev, picture: reader.result as string }));
      } catch (error) {
        showToast('Error processing image. Please try again.', 'error');
      } finally {
        setIsProcessingImage(false);
      }
    };

    reader.onerror = () => {
      showToast('Error reading image file. Please try again.', 'error');
      setIsProcessingImage(false);
      e.target.value = ''; // Reset file input
    };

    try {
      reader.readAsDataURL(file);
    } catch (error) {
      showToast('Error reading image file. Please try again.', 'error');
      setIsProcessingImage(false);
      e.target.value = ''; // Reset file input
    }
  }, [showToast]);

  const resetForm = () => {
    setFormData({
      name: '',
      gradeId: '',
      email: '',
      picture: '',
    });
    // Reset file input if it exists
    const fileInput = document.getElementById('picture') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isProcessingImage) {
      showToast('Please wait while the image is being processed', 'error');
      return;
    }

    try {
      if (!formData.name.trim()) {
        showToast('Please enter student name', 'error');
        return;
      }
      if (!formData.gradeId) {
        showToast('Please select a grade', 'error');
        return;
      }

      const selectedGrade = grades.find(g => g.id === formData.gradeId);
      if (!selectedGrade) {
        showToast('Invalid grade selected', 'error');
        return;
      }

      const gradeName = selectedGrade.class 
        ? `${selectedGrade.name} - ${selectedGrade.class}` 
        : selectedGrade.name;

      const newStudent: Student = {
        id: crypto.randomUUID(),
        name: formData.name.trim(),
        gradeId: formData.gradeId,
        ...(formData.email && { email: formData.email.trim() }),
        ...(formData.picture && { picture: formData.picture }),
      };

      // Call the passed down function to add the student
      onAddStudent(newStudent);
      
      showToast(`Student ${formData.name} added successfully to ${gradeName}`, 'success');
      
      // Reset form
      resetForm();

    } catch (error) {
      console.error('Error adding student:', error);
      showToast('Failed to add student. Please try again.', 'error');
    }
  };

  if (grades.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500 text-center">Please add grades before adding students</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Student Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter student name"
            />
          </div>

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
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email (Optional)
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter student email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student Picture (Optional)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-500 transition-colors cursor-pointer">
              <div className="space-y-1 text-center">
                <div className="flex flex-col items-center">
                  {formData.picture ? (
                    <img 
                      src={formData.picture} 
                      alt="Preview" 
                      className="h-24 w-24 object-cover rounded-full mb-4"
                    />
                  ) : (
                    <Upload className={`h-12 w-12 ${isProcessingImage ? 'text-indigo-400 animate-pulse' : 'text-gray-400'}`} />
                  )}
                </div>
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="picture" className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                    <span>{isProcessingImage ? 'Processing...' : 'Upload a picture'}</span>
                    <input
                      id="picture"
                      name="picture"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isProcessingImage}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isProcessingImage}
          className={`w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium ${
            isProcessingImage ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isProcessingImage ? 'Processing...' : 'Add Student'}
        </button>
      </form>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}