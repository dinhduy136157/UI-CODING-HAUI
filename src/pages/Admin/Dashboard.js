export default function Dashboard() {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Dashboard Giáo viên</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium">Tổng bài tập</h3>
          <p className="text-3xl font-bold">24</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-medium">Bài nộp mới</h3>
          <p className="text-3xl font-bold">5</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="font-medium">Học sinh</h3>
          <p className="text-3xl font-bold">42</p>
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-medium mb-2">Hoạt động gần đây</h3>
        <ul className="space-y-2">
          <li className="p-2 hover:bg-gray-50">Học sinh A nộp bài tập 1</li>
          <li className="p-2 hover:bg-gray-50">Học sinh B đặt câu hỏi</li>
        </ul>
      </div>
    </div>
  );
}