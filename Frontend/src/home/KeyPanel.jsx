function KeyPanel() {
  let userInput;
  const handleInputChange = () => {};
  return (
    <div className="flex flex-col items-center justify-center min-h-screen shadow-lg bg-gray-100">
      <div className="bg-white p-8 rounded shadow-lg w-96 ">
        <label
          className="block text-gray-700 text-lg font-bold mb-2"
          htmlFor="secretCode">
          secret Code
        </label>
        <input
          type="text"
          id="secretCode"
          value={userInput}
          onChange={handleInputChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter your secret Code"
        />
        <button
          type="button"
          id="secr-code-btn"
          className=" m-0 px-1 py-2 rounded-md mt-3 bg-red-600 text-white justify-center ">
          Submit
        </button>
      </div>
    </div>
  );
}

export default KeyPanel;
