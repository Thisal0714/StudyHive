export default function Notes() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Notes</h2>
        <p className="text-gray-600 mt-2">Manage your study notes</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Your Notes</h3>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Create New Note
          </button>
        </div>
        
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No notes yet. Create your first note to get started!</p>
        </div>
      </div>
    </div>
  );
}
