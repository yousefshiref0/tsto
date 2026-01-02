import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { SplashScreen } from './components/SplashScreen';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { LiveAttendance } from './components/LiveAttendance';
import { Students } from './components/Students';
import { StudentProfile } from './components/StudentProfile';
import { Reports } from './components/Reports';
import { Settings } from './components/Settings';
import { BottomNav } from './components/BottomNav';

type Screen = 'splash' | 'login' | 'app';
type NavTab = 'dashboard' | 'live' | 'students' | 'reports' | 'settings';

interface Student {
  id: string;
  name: string;
  studentId: string;
  email: string;
  status: 'present' | 'absent';
  attendanceRate: number;
  lastSeen?: string;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check for system dark mode preference on mount
  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeMediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    darkModeMediaQuery.addEventListener('change', handleChange);
    return () => darkModeMediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Apply dark mode class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleSplashComplete = () => {
    setCurrentScreen('login');
  };

  const handleLogin = () => {
    setCurrentScreen('app');
  };

  const handleLogout = () => {
    setCurrentScreen('login');
    setActiveTab('dashboard');
    setSelectedStudent(null);
  };

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
  };

  const handleBackFromProfile = () => {
    setSelectedStudent(null);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Render splash screen
  if (currentScreen === 'splash') {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  // Render login screen
  if (currentScreen === 'login') {
    return <Login onLogin={handleLogin} />;
  }

  // Render main app with navigation
  return (
    <div className="max-w-md mx-auto bg-background min-h-screen">
      <AnimatePresence mode="wait">
        {selectedStudent ? (
          <StudentProfile
            key="student-profile"
            student={selectedStudent}
            onBack={handleBackFromProfile}
          />
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <Dashboard key="dashboard" userName="Sarah" />
            )}
            {activeTab === 'live' && (
              <LiveAttendance key="live" />
            )}
            {activeTab === 'students' && (
              <Students key="students" onViewStudent={handleViewStudent} />
            )}
            {activeTab === 'reports' && (
              <Reports key="reports" />
            )}
            {activeTab === 'settings' && (
              <Settings
                key="settings"
                onLogout={handleLogout}
                isDarkMode={isDarkMode}
                onToggleDarkMode={toggleDarkMode}
              />
            )}
          </>
        )}
      </AnimatePresence>

      {!selectedStudent && (
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      )}
    </div>
  );
}
