import { useState } from "react";
import type { ExplainLevel } from "../types/chat";

type Props = {
    loading: boolean;
    onSubmit: (payload: {
        code: string;
        level?: ExplainLevel
    }) => void;
    onClear: () => void;
}

export default function CodeInputPanel({loading, onSubmit, onClear}: Props) {
    const [code, setCode] = useState<string>("");

    function handleClear() {
        setCode("");
        onClear();
    }

    return (
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-4">
            <h2 className="text-lg font-semibold mb-3">Explain My Code</h2>

            <label className="text-sm text-zinc-600"></label>
            <textarea 
                className="mt-1 w-full h-72 border border-zinc-200 rounded-xl p-3 font-mono text-sm"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={loading}
                placeholder="Paste your code which needs explanation...."
                />

            <button
                className="mt-3 w-full bg-zinc-900 text-white rounded-xl py-2 font-medium disabled:opacity-60"
                onClick={() => onSubmit({ code })}
                disabled={loading || code.trim().length == 0}
                type="button"
            >
                {loading && (
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                )}
                {loading ? "Dissecting..." : "Dissect"}

            </button>


            <button
                className="mt-3 w-full bg-zinc-900 text-white rounded-xl py-2 font-medium disabled:opacity-60"
                onClick={handleClear}
                disabled={loading || code.trim().length == 0}
                type="button"
            >
                {'Clear chat'}

            </button>


        </div>

    );
}