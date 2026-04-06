'use client';

import { useState } from "react";
import { CheckIcon, XIcon } from "./Icon";

export type QuizQuestion = {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
};

interface QuizCardProps {
  questionNumber: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  onSelectOption: (questionId: number, optionIndex: number) => void;
  selectedOption: number | null;
  isSubmitted?: boolean;
}

export default function QuizCard({ questionNumber, question, options, correctAnswer, onSelectOption, explanation, selectedOption, isSubmitted = false }: QuizCardProps) {
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);
  // const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const toggleAnswer = () => {
    setIsAnswerVisible(!isAnswerVisible);
  };

  const handleOptionClick = (index: number) => {
    if (!isSubmitted) {
      onSelectOption(questionNumber, index);
    }
  };

  const getOptionStyle = (index: number) => {
    // If user hasn't selected this option, return default style
    if (!isSubmitted) {
      return selectedOption === index
        ? "border-indigo-500 bg-indigo-50"
        : "border-gray-200 bg-gray-50";
    }

    // AFTER submit → show correct/wrong
    if (index === correctAnswer) {
      return "border-green-500 bg-green-50 border-2";
    }

    if (index === selectedOption) {
      return "border-red-500 bg-red-50 border-2";
    }
    return "border-gray-200 bg-gray-50";
  };

  const getOptionLabelStyle = (index: number) => {
    if (!isSubmitted) {
      return selectedOption === index
        ? 'border-indigo-500 bg-indigo-500 text-white'
        : 'border-gray-300 text-gray-600 bg-white';
    }

    if (index === correctAnswer) {
      return 'border-green-500 bg-green-500 text-white';
    }

    if (index === selectedOption) {
      return 'border-red-500 bg-red-500 text-white';
    }
    return 'border-gray-300 text-gray-600 bg-white';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow mb-4">
      <div className="flex items-start gap-4">
        <div
          className=" w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
          style={{ backgroundColor: '#4F46E5' }}
        >
          {questionNumber}
        </div>

        <div className="flex-1">
          <h2 className="text-lg font-semibold text-zinc-900 mb-4">
            {question}
          </h2>

          {/* Options */}
          <div className="space-y-2 mb-4">
            {options.map((option, index) => (
              <div
                key={index}
                onClick={() => handleOptionClick(index)}
                className={`flex items-start gap-3 p-3 mb-5 rounded-lg border transition-all ${getOptionStyle(index)}`}
              >
                <div className={` w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs ${getOptionLabelStyle(index)}`}>
                  {selectedOption === index ? (
                    index === correctAnswer ? (
                      <CheckIcon className="w-4 h-4" />
                    ) : (
                      <XIcon className="w-4 h-4" />
                    )
                  ) : (
                    String.fromCharCode(65 + index)
                  )}
                </div>
                <p className={`text-sm flex-1 ${selectedOption === index
                  ? index === correctAnswer ? 'text-green-900' : 'text-red-900'
                  : 'text-gray-700'
                  }`}>
                  {option}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={toggleAnswer}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
          >
            <span className="text-sm">
              {isAnswerVisible ? 'Hide Answer' : 'Show Answer'}
            </span>
          </button>

          {isAnswerVisible && (
            <div
              className="mt-4 p-4 rounded-lg border-2"
              style={{ borderColor: '#10B981', backgroundColor: '#F0FDF4' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                  <CheckIcon className="w-4 h-4 text-white" />
                </div>
                <p className="text-sm text-green-800">
                  Correct Answer:
                </p>
              </div>

              {/* Correct Answer Box */}
              <div className="flex items-start gap-3 p-3 rounded-lg bg-white border border-green-200">
                <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">
                  {String.fromCharCode(65 + correctAnswer)}
                </div>
                <p className="text-sm text-gray-900 flex-1">
                  {explanation}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
