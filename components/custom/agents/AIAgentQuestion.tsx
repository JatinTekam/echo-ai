import React, { useState } from 'react'
import { ClearificationQuestions } from './CreateAgent'

type Props={
    questionList: ClearificationQuestions[]
}

const AIAgentQuestion = ({questionList}:Props) => {
const [currentIndex,setCurrentIndex]=useState(0);
const [answers,setAnswers]=useState<Record<string,string>>();



  return (
    <div>
      
    </div>
  )
}

export default AIAgentQuestion
