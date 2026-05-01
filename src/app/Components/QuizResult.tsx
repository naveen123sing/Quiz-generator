import { useState } from 'react';
import { SparklesIcon, RotateCcwIcon, DownloadIcon } from './Icon';
import QuizCard from './QuizCard';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface QuizResultsProps {
  questions: Question[];
  onRegenerate: () => void;
  onDownload: () => void;

}



export default function QuizResults({ questions, onRegenerate, onDownload }: QuizResultsProps) {

  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);


  const handleOptionSelect = (questionId: number, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const calculateScore = () => {
    let score = 0;

    questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        score++;
      }
    });

    return score;
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  return (
    <div className="mt-12">
      {/* Header with AI indicator and actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {/* <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm">
            <SparklesIcon className="w-4 h-4"/>
            <span className="text-sm text-gray-700">AI Generated</span>
          </div> */}
          <div className="px-4 py-2 rounded-full bg-white shadow-sm">
            <span className="text-sm text-gray-700">
              <span style={{ color: '#4F46E5' }}>
                {questions.length} Questions
              </span>{' '}
              Generated
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onRegenerate}
            className="px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-2"
          >
            <RotateCcwIcon className="w-4 h-4" />
            Regenerate Quiz
          </button>
          <button
            onClick={onDownload}
            className="px-5 py-2.5 rounded-lg text-white transition-all flex items-center gap-2 hover:opacity-90"
            style={{ backgroundColor: '#4F46E5' }}
          >
            <DownloadIcon className="w-4 h-4" />
            Download Quiz
          </button>
        </div>
      </div>

      {/* Quiz Cards */}
      <div className="space-y-4">
        {questions?.length > 0 ? (
          questions.map((question) => (
            <QuizCard
              key={question.id}
              questionNumber={question.id}
              question={question.question}
              options={question.options}
              correctAnswer={question.correctAnswer}
              selectedOption={answers[question.id] ?? null}
              onSelectOption={handleOptionSelect}
              explanation={question.explanation}
              isSubmitted={isSubmitted}
            />
          ))
        ) : (
          <p className="text-center text-gray-500">No questions available</p>
        )}
      </div>

      <button
        onClick={handleSubmit}
        className="bg-indigo-600 text-white px-6 py-2 rounded-lg"
      >
        Submit Quiz
      </button>

      {isSubmitted && (
        <div className="mt-6 p-4 bg-green-100 rounded-lg">
          <h2 className="text-lg font-semibold">
            Your Score: {calculateScore()} / {questions.length}
          </h2>
        </div>
      )}
    </div>

  );
}
