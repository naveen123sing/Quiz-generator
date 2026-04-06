'use client';

import { useState } from 'react';
import Header from './Components/Header';
import UploadArea from './Components/UploadArea';
import QuizResults from './Components/QuizResult';
import { useGenerateQuiz } from "@/app/services/QuizServive";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface ApiQuestion {
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  } | any[];
  answer?: "A" | "B" | "C" | "D";
  correctAnswer?: number;
  explanation?: string;
}

export default function Home() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { mutate, isPending } = useGenerateQuiz();

  // function isOptionObject(
  //   options: ApiQuestion["options"]
  // ): options is { A: string; B: string; C: string; D: string } {
  //   return !Array.isArray(options);
  // }

  const formatQuestions = (data: any): Question[] => {
    return (data?.questions ?? []).map((q: ApiQuestion, index: number) => {

      // CASE 1: options is object
      if (!Array.isArray(q.options)) {
        const optionsObj = q.options as {
          A: string;
          B: string;
          C: string;
          D: string;
        };

        const optionsArray = [
          optionsObj.A,
          optionsObj.B,
          optionsObj.C,
          optionsObj.D,
        ];

        const correctAnswerIndex = q.answer
          ? ["A", "B", "C", "D"].indexOf(q.answer)
          : -1;

        return {
          id: index + 1,
          question: q.question,
          options: optionsArray,
          correctAnswer: correctAnswerIndex,
          explanation: q.explanation ?? "",
        };
      }

      return {
        id: index + 1,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer ?? -1,
        explanation: q.explanation ?? "",
      };
    });
  };

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setLoading(true);
    setError(null);

    mutate(
      { file, questionCount: 10 },
      {
        onSuccess: (data) => {
          setQuestions(formatQuestions(data));
        },
        onError: (err: any) => {
          setError(err?.message ?? 'Failed to generate quiz');
        },
        onSettled: () => {
          setLoading(false);
        },
      }
    );
  };

  const handleRegenerate = () => {
    if (!uploadedFile) {
      alert("Please upload file first");
      return;
    }

    setLoading(true);

    mutate(
      { file: uploadedFile, questionCount: 10 },
      {
        onSuccess: (data) => {
          setQuestions(formatQuestions(data));
        },
        onError: (err: any) => {
          setError(err?.message ?? 'Failed to regenerate quiz');
        },
        onSettled: () => {
          setLoading(false);
        },
      }
    );
  };

  const handleDownload = () => {
    const quizText = questions
      .map((q) => {
        return `${q.id}. ${q.question}\n${q.options.map((opt, idx) => `   ${String.fromCharCode(65 + idx)}. ${opt}`).join('\n')}\n   Correct Answer: ${String.fromCharCode(65 + q.correctAnswer)}\n`;
      })
      .join('\n');

    const blob = new Blob([quizText], { type: 'text/Plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai-quiz-questions.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9FAFB' }}>
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl text-gray-900 mb-4">
            Generate <span style={{ color: '#4F46E5' }}>AI-Powered</span> Quizzes
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your study notes or PDF files and let AI automatically create engaging quiz questions to test your knowledge.
          </p>
        </div>

        <UploadArea
          onFileLoaded={handleFileUpload}
          error={error}
          loading={loading}
        />
        {(loading || isPending) && (
          <div className="mt-6 flex justify-center">
            <div className="bg-amber-100 shadow-md rounded-xl px-6 py-4 flex items-center gap-4 ">

              <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>

              <p className="text-gray-700 text-sm font-medium">
                Generating quiz, please wait...
              </p>

            </div>
          </div>
        )}

        {questions.length > 0 && (
          <QuizResults
            questions={questions}
            onRegenerate={handleRegenerate}
            onDownload={handleDownload}
          />
        )}
      </main>
    </div>
  );

}
