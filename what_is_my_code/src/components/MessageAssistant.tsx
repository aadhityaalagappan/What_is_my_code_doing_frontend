import React, { useMemo, useState } from "react";
import type { CodeSolution } from "../types/chat";

type TabKey = "explanation" | "timecomplexity" | "spacecomplexity" | "commonerrors";

function ContentRenderer({ text }: { text: string }) {
  const sections = text.split(/(```[\s\S]*?```)/g);
  
  return (
    <div className="space-y-4">
      {sections.map((section, index) => {
        if (section.startsWith('```') && section.endsWith('```')) {
          const lines = section.slice(3, -3).split('\n');
          const language = lines[0].trim();
          const code = lines.slice(1).join('\n');
          
          return (
            <div key={index} className="my-6 bg-zinc-50 border-l-4 border-blue-500 rounded-r-lg overflow-hidden">
              {language && (
                <div className="bg-zinc-100 px-4 py-2 text-xs font-semibold text-zinc-600 border-b border-zinc-200">
                  {language}
                </div>
              )}
              <pre className="p-5 overflow-x-auto">
                <code className="text-sm font-mono text-zinc-800 leading-relaxed whitespace-pre">
                  {code}
                </code>
              </pre>
            </div>
          );
        }
        
        return (
          <div key={index} className="formatted-content">
            {section.split('\n').map((line, lineIndex) => {
              if (!line.trim()) return <div key={lineIndex} className="h-3" />;
              
              if (line.startsWith('## ')) {
                return (
                  <h2 key={lineIndex} className="text-2xl font-bold text-zinc-900 mt-8 mb-4 pb-3 border-b-2 border-zinc-300">
                    {line.replace('## ', '')}
                  </h2>
                );
              }
              if (line.startsWith('### ')) {
                return (
                  <h3 key={lineIndex} className="text-xl font-bold text-zinc-800 mt-6 mb-3">
                    {line.replace('### ', '')}
                  </h3>
                );
              }
              if (line.startsWith('#### ')) {
                return (
                  <h4 key={lineIndex} className="text-lg font-semibold text-zinc-700 mt-5 mb-2">
                    {line.replace('#### ', '')}
                  </h4>
                );
              }
              
              if (line.trim() === '---') {
                return <hr key={lineIndex} className="my-6 border-t-2 border-zinc-200" />;
              }
              
              if (line.trim().startsWith('- ')) {
                return (
                  <div key={lineIndex} className="flex gap-3 my-2 ml-4">
                    <span className="text-blue-600 font-bold">•</span>
                    <span className="text-zinc-700 leading-relaxed flex-1">
                      {formatInlineContent(line.trim().substring(2))}
                    </span>
                  </div>
                );
              }
              
              const numberedMatch = line.match(/^(\d+)\.\s+(.+)$/);
              if (numberedMatch) {
                return (
                  <div key={lineIndex} className="flex gap-3 my-2 ml-4">
                    <span className="text-blue-600 font-bold">{numberedMatch[1]}.</span>
                    <span className="text-zinc-700 leading-relaxed flex-1">
                      {formatInlineContent(numberedMatch[2])}
                    </span>
                  </div>
                );
              }
              
              if (line.trim().startsWith('|')) {
                return null;
              }
              
              return (
                <p key={lineIndex} className="text-zinc-700 leading-relaxed my-3 text-base">
                  {formatInlineContent(line)}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function formatInlineContent(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  
  const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    
    const content = match[0];
    if (content.startsWith('**') && content.endsWith('**')) {
      parts.push(
        <strong key={match.index} className="font-bold text-zinc-900">
          {content.slice(2, -2)}
        </strong>
      );
    } else if (content.startsWith('`') && content.endsWith('`')) {
      parts.push(
        <code key={match.index} className="bg-rose-50 text-rose-700 px-2 py-1 rounded font-mono text-sm font-semibold border border-rose-200">
          {content.slice(1, -1)}
        </code>
      );
    }
    
    lastIndex = regex.lastIndex;
  }
  
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  
  return parts.length > 0 ? parts : text;
}

function TableRenderer({ text }: { text: string }) {
  const lines = text.split('\n').filter(line => line.trim().startsWith('|'));
  
  if (lines.length === 0) return null;
  
  const headerCells = lines[0].split('|').filter(cell => cell.trim()).map(cell => cell.trim());
  
  const rows = lines.slice(2).map(line => 
    line.split('|').filter(cell => cell.trim()).map(cell => cell.trim())
  );
  
  return (
    <div className="overflow-x-auto my-6 rounded-xl border-2 border-zinc-200 shadow-sm">
      <table className="min-w-full divide-y divide-zinc-200">
        <thead className="bg-gradient-to-r from-zinc-100 to-zinc-50">
          <tr>
            {headerCells.map((header, i) => (
              <th key={i} className="px-5 py-4 text-left text-xs font-bold text-zinc-800 uppercase tracking-wider border-b-2 border-zinc-300">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-zinc-100">
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} className="px-5 py-4 text-sm text-zinc-700 font-medium">
                  {formatInlineContent(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FormattedContent({ text }: { text: string }) {
  const hasTable = text.includes('|---');
  
  if (hasTable) {
    const parts = text.split(/(\n\|[^\n]+\|(?:\n\|[^\n]+\|)+)/g);
    
    return (
      <div>
        {parts.map((part, index) => {
          if (part.includes('|---')) {
            return <TableRenderer key={index} text={part} />;
          }
          return <ContentRenderer key={index} text={part} />;
        })}
      </div>
    );
  }
  
  return <ContentRenderer text={text} />;
}

export default function MessageAssistant({ data }: { data: CodeSolution }) {
  const [tab, setTab] = useState<TabKey>("explanation");

  const tabs = useMemo(
    () => [
      { 
        key: "explanation" as const, 
        label: "Explanation", 
        body: data.explanation,
      },
      { 
        key: "timecomplexity" as const, 
        label: "Time Complexity", 
        body: data.timecomplexity,
      },
      { 
        key: "spacecomplexity" as const, 
        label: "Space Complexity", 
        body: data.spacecomplexity,
      },
      { 
        key: "commonerrors" as const, 
        label: "Common Errors", 
        body: data.commonerrors,
      },
    ],
    [data]
  );

  const activeTab = tabs.find((t) => t.key === tab);

  return (
    <div className="flex justify-start mb-6">
      <div className="max-w-[96%] bg-white rounded-2xl border-2 border-zinc-200 shadow-lg overflow-hidden">
        <div className="px-6 pt-5 pb-3 bg-gradient-to-r from-blue-50 via-white to-blue-50 border-b-2 border-zinc-200">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="text-sm font-bold text-zinc-700 tracking-wide">Code Assistant</div>
          </div>
        </div>

        <div className="flex gap-1 bg-zinc-50 px-3 overflow-x-auto border-b-2 border-zinc-100">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={[
                "px-2 py-3.5 text-sm whitespace-nowrap transition-all relative flex items-center gap-2.5 font-semibold rounded-t-lg",
                tab === t.key
                  ? "bg-white text-zinc-900 shadow-sm -mb-px border-t-4 border-blue-600"
                  : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100",
              ].join(" ")}
              type="button"
            >
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        <div className="p-8 bg-white min-h-[500px] max-h-[800px] overflow-y-auto">
          {activeTab && (
            <div className="transition-opacity duration-300">
              <FormattedContent text={activeTab.body ?? ''} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
