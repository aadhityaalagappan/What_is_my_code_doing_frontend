
export default function MessageUser({ code }: { code: string; }) {
    return (
        <div className="flex justify-end">
            <div className="max-w-[85%] bg-zinc-900 text-white rounded-2xl p-4">
                <pre className="whitespace-pre-wrap text-xs font-mono bg-black/20 p-3 rounded-xl overflow-auto">
                    {code}
                </pre>
            </div>
        </div>
    )
}