import axiosClient from "@/app/services/AxiosClient";
import { useMutation } from "@tanstack/react-query"

export interface QuizResponse {
    questions: {
        id: number;
        question: string;
        options: string[];
        correctAnswer: number;
    }[];
}

export const generateQuiz = async (
    file: File,
    questionCount: number
) => {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("fileName", file.name);
    formData.append("fileType", file.type);
    formData.append("questionCount", String(questionCount));

    const response = await axiosClient.post(
        "/upload-and-generate",
        formData
    );

    return response.data;
};

export const useGenerateQuiz = () => {
    return useMutation({
        mutationFn: ({ file, questionCount }: { file: File; questionCount: number }) =>
            generateQuiz(file, questionCount),
    });
};