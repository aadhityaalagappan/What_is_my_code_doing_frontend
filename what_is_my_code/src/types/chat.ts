export type ExplainLevel = "beginner" | "intermediate" | "advanced";

export type ExplainRequest = {
    code: string;
    level: ExplainLevel;
}

export interface CodeSolution {
    explanation: string;
    timecomplexity: string;
    spacecomplexity: string;
    commonerrors: string;
  }

export type ChatMessage =  {
    id: string;
    role: "user";
    code: string;
    level: ExplainLevel;
    createdAt: number;
} | {
    id: string;
    role: "assistant";
    data: CodeSolution;
    createdAt: number;
}