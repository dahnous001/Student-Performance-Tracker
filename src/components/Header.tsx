interface HeaderProps {
  teacherName: string;
  schoolLogo: string;
  appName: string;
}

export default function Header({ teacherName, schoolLogo, appName }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={schoolLogo}
              alt="School logo"
              className="h-12 w-12 object-contain"
            />
            <h1 className="text-2xl font-bold text-gray-900">{appName}</h1>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-gray-500">Developed by</span>
            <span className="text-sm font-medium text-gray-900">{teacherName}</span>
          </div>
        </div>
      </div>
    </header>
  );
}