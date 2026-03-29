export default function MessageInput() {
  return (
    <div className="bg-white px-4 py-3 flex items-center gap-3">
      <button className="text-gray-500 text-xl">➕</button>
      <button className="text-gray-500 text-xl">🎤</button>
      <button className="text-gray-500 text-xl">😊</button>

      <input
        type="text"
        placeholder="Type a message..."
        className="flex-1 border rounded-full px-4 py-2 outline-none"
      />

      <button className="bg-orange-500 text-white w-10 h-10 rounded-full flex items-center justify-center">
        ➤
      </button>
    </div>
  );
}