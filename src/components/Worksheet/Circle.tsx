export default function Circle({ n }: { n: number }) {
  return (
    <span className="w-[21px] h-[21px] rounded-full border-[1.5px] border-text-base flex items-center justify-center font-sans text-[11.5px] font-bold shrink-0">
      {n}
    </span>
  )
}
