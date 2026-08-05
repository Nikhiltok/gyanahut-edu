import type { Question } from "@/types/question";

import { api } from "./api";

export async function getWrongQuestions() {
  const { data } = await api.get<{ success: true; message: string; data: Question[] }>("/revision/wrong/");
  return data.data;
}

export async function getDifficultQuestions() {
  const { data } = await api.get<{ success: true; message: string; data: Question[] }>(
    "/revision/difficult/",
  );
  return data.data;
}
