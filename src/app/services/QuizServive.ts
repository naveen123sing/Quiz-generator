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

export interface CreateAccountPayload {
    name: string;
    email: string;
    plan: string;
}

// const getBasicToken = () => {
//     const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
//     const clientSecret = process.env.NEXT_PUBLIC_CLIENT_SECRET;

//     const encoded = btoa(`${clientId}:${clientSecret}`);

//     return `Basic ${encoded}`;
// };

const getAccessToken = async () => {
    // const basicToken = getBasicToken();
    const apiKey = localStorage.getItem("api_key");

    if (!apiKey) {
        throw new Error("API key not found. Please create your account first.");
    }

    const response = await axiosClient.get("/auth/guest", {
        headers: {
            // Authorization: basicToken,
            "x-api-key": apiKey,
            "Content-Type": "application/json",
        },
    });

    const token = response.data.access_token;

    localStorage.setItem("token", token);

    return token;
};

export const generateQuiz = async (
    file: File,
    questionCount: number
) => {
    let token = localStorage.getItem("token");

    if (!token) {
        token = await getAccessToken();
    }

    const formData = new FormData();

    formData.append("file", file);
    formData.append("fileName", file.name);
    formData.append("fileType", file.type);
    formData.append("questionCount", String(questionCount));

    const response = await axiosClient.post(
        "/upload-and-generate",
        formData
    );

    // if (!localStorage.getItem("token") && response.data.token) {
    //     localStorage.setItem("token", response.data.token);
    // }

    return response.data;
};

export const useGenerateQuiz = () => {
    return useMutation({
        mutationFn: ({ file, questionCount }: { file: File; questionCount: number }) =>
            generateQuiz(file, questionCount),
    });
};

export const createAccount = async (payload: CreateAccountPayload) => {
    const formData = new FormData();

    formData.append("name", payload.name);
    formData.append("email", payload.email);
    formData.append("plan", payload.plan);

    const response = await axiosClient.post("/admin/create-customer", formData);

    return response.data;
};

export const useCreateAccount = () => {
    return useMutation({
        mutationFn: (payload: CreateAccountPayload) => createAccount(payload),
    });
};
