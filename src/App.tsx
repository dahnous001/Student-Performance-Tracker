import { useEffect, useState } from 'react';
import './index.css';
import WelcomeForm from './components/WelcomeForm';
import Header from './components/Header';
import GradeManagement from './components/GradeManagement';
import StudentManagement from './components/StudentManagement';
import AssignmentManagement from './components/AssignmentManagement';
import TabNavigation from './components/TabNavigation';
import type { TeacherInfo } from './types';

function App() {
  const [teacherInfo, setTeacherInfo] = useState<TeacherInfo | null>(() => {
    const saved = localStorage.getItem('teacherInfo');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState('grades');

  const tabs = [
    { id: 'grades', label: 'Grade Entry' },
    { id: 'students', label: 'Student Entry' },
    { id: 'assignments', label: 'Assignments' },
  ];

  useEffect(() => {
    if (teacherInfo) {
      localStorage.setItem('teacherInfo', JSON.stringify(teacherInfo));
    }
  }, [teacherInfo]);

  const handleWelcomeComplete = (name: string, logo: string, appName: string) => {
    setTeacherInfo({ name, schoolLogo: logo, appName });
  };

  if (!teacherInfo) {
    return <WelcomeForm onComplete={handleWelcomeComplete} />;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'grades':
        return <GradeManagement />;
      case 'students':
        return <StudentManagement />;
      case 'assignments':
        return <AssignmentManagement />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        teacherName={teacherInfo.name} 
        schoolLogo={teacherInfo.schoolLogo} 
        appName={teacherInfo.appName}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TabNavigation 
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <div className="mt-6">
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
}

export default App;