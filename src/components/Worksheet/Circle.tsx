export default function Circle({ n }: { n: number }) {
  const big = n >= 100
  return (
    <span className={`rounded-full border-[1.5px] border-text-base flex items-center justify-center font-sans font-bold shrink-0 ${big ? 'w-[27px] h-[27px] text-[10px]' : 'w-[21px] h-[21px] text-[11.5px]'}`}>
      {n}
    </span>
  )
}
