/* eslint-disable react/prop-types */

function File({ file, onDelete }) {
  const fileUrl = URL.createObjectURL(file);

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white p-4 m-2">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <img
            src={fileUrl}
            alt={file.name}
            className="w-12 h-12 object-cover"
          />
        </div>
        <div className="ml-4">
          <div className="text-lg font-bold">{file.name}</div>
          <div className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</div>
        </div>
      </div>
      <div className="mt-4 flex justify-between">
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:text-indigo-900"
        >
          View
        </a>
        <button
          onClick={() => onDelete(file)}
          className="text-red-600 hover:text-red-900"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default File;
