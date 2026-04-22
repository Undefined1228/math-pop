export function usePrintAnswers(
  showAnswer: boolean,
  setShowAnswer: (v: boolean) => void,
) {
  return () => {
    if (showAnswer) {
      window.print()
      return
    }
    setShowAnswer(true)
    const afterPrint = () => {
      setShowAnswer(false)
      window.removeEventListener('afterprint', afterPrint)
    }
    window.addEventListener('afterprint', afterPrint)
    setTimeout(() => window.print(), 50)
  }
}
