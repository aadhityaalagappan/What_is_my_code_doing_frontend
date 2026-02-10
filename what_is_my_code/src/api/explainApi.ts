import type { CodeSolution, ExplainRequest } from "../types/chat";

const VITE_API_BASE_URL = 'https://whatismycodedoinggenai-production.up.railway.app'

export async function explainCode(req: ExplainRequest): Promise<CodeSolution> {
    const response = await fetch(`${VITE_API_BASE_URL}/explain-code`, {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(req),

    });

    if(!response.ok) {
        let detail = 'Request Failed';
        try {
            const err = await response.json();
            if(err?.detail) {
                detail = err.detail;
            } 
        } catch {
          // catch block  
        }
        throw new Error(detail);
    }
    return (await response.json()) as CodeSolution;


}