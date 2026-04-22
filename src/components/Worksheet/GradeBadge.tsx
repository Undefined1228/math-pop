export default function GradeBadge({ result }: { result: boolean }) {
  return (
    <span className={`absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-white text-[11px] font-bold shadow-sm z-10 print:hidden ${result ? 'bg-green-500' : 'bg-red-400'}`}>
      {result ? '○' : '×'}
    </span>
  )
}
