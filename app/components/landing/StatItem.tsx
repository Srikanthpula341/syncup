
export const StatItem = ({ icon: Icon, value, label }: { icon: React.ReactNode, value: string, label: string }) => (
  <div className="flex items-start gap-4 p-4">
    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
      {Icon}
    </div>
    <div>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  </div>
)