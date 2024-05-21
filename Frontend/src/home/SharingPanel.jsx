function SharingPanel() {
  const handleFileChange = () => {};
  const handleUploadClick = () => {};
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Share a File</h2>
      <div className="mb-4">
        <label
          htmlFor="fileInput"
          className="block text-sm font-medium text-gray-700"
        >
          Select a file to share
        </label>
        <input
          type="file"
          id="fileInput"
          onChange={handleFileChange}
          className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <button
        onClick={handleUploadClick}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 from-neutral-200"
      >
        send
      </button>
    </div>
  );
}

export default SharingPanel;
