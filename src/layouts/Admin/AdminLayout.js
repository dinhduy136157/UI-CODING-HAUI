import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Admin/Sidebar';
import Header from '../../components/Admin/Header'; // Giữ nguyên Header của user hoặc tạo AdminHeader nếu cần

export default function AdminLayout() {
  const [selectedTab, setSelectedTab] = useState('dashboard');

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      
      <div className="flex-1 flex flex-col">
        <Header /> {/* Có thể thay bằng AdminHeader sau */}
        
        <main className="flex-1 p-6">
          <Outlet /> {/* Nơi hiển thị nội dung admin */}
        </main>
      </div>
    </div>
  );
}