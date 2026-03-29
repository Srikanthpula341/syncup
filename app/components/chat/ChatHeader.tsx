export default function ChatHeader() {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-b-4 border-black">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-orange-300 flex items-center justify-center font-bold text-white">
          SF
        </div>
        <div>
          <div className="font-semibold text-gray-800">George Alan</div>
          <div className="text-sm text-gray-500">Online</div>
        </div>
      </div>

      <div className="flex gap-4 text-gray-600 text-lg">
        <span>📹</span>
        <span>📞</span>
        <span>✨</span>
        <span>ℹ️</span>
      </div>
    </div>
  );
}