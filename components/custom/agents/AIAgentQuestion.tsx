import React, { useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { ClearificationQuestions } from './CreateAgent'

type Props = {
  questionList: ClearificationQuestions[]
  onComplete: any
}

const AIAgentQuestion = ({ questionList, onComplete }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  console.log(questionList)

  const currentQuestion = questionList[currentIndex]
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] || '' : ''
  const progress = questionList.length ? ((currentIndex + 1) / questionList.length) * 100 : 0

  const handleAnswer = (value: string) => {
    if (!currentQuestion) return
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }))
  }

  const handleNext = () => {
    if (!currentQuestion || !currentAnswer.trim()) return

    if (currentIndex < questionList.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      return
    }

    onComplete(answers);
    console.log(answers);

    //console.log({ ...answers, [currentQuestion.id]: currentAnswer })
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
  }

  if (!currentQuestion) return null

  return (
    <div className='w-full max-w-4xl mx-auto py-3'>
      <div className='mb-8'>
        <div className='mb-4 flex items-center justify-between gap-4'>
          <span className='text-sm text-muted-foreground'>
            Question {currentIndex + 1} of {questionList.length}
          </span>
          <span className='text-sm font-medium text-foreground'>
            {Math.round(progress)}%
          </span>
        </div>

        <div className='h-2 w-full overflow-hidden rounded-full bg-zinc-200'>
          <div
            className='h-full rounded-full bg-zinc-900 transition-all duration-300'
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className='space-y-8'>
        <div className='space-y-4'>
          <p className='text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500'>
            HELP ME UNDERSTAND YOUR REQUEST
          </p>
          <h2 className='max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.04em] text-zinc-900 md:text-[1.8rem]'>
            {currentQuestion.question}
          </h2>
        </div>

        <div className='relative'>
          <input
            type='text'
            value={currentAnswer}
            onChange={(e) => handleAnswer(e.target.value)}
            placeholder={currentQuestion.customPlaceholder || 'Type your answer'}
            className='w-full rounded-2xl border border-zinc-300 bg-zinc-100 px-4 py-4 text-base text-zinc-900 placeholder:text-zinc-500 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200'
          />
        </div>
      </div>

      <div className='mt-10 flex items-center justify-between border-t border-zinc-200 pt-6'>
        <button
          type='button'
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className='inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium text-zinc-700 transition enabled:hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-40'
        >
          <ArrowLeft className='h-4 w-4' />
          Previous
        </button>

        <button
          type='button'
          onClick={handleNext}
          disabled={!currentAnswer.trim()}
          className='inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300'
        >
          Next
          <ArrowRight className='h-4 w-4' />
        </button>
      </div>
    </div>
  )
}

export default AIAgentQuestion
