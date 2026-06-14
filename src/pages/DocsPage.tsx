import React from 'react';
import { Terminal, Copy, Check } from 'lucide-react';
import { cn } from '../lib/utils';

export default function DocsPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 text-slate-300">
      <header className="flex items-center justify-between bg-black/20 p-6 rounded-xl border border-white/5 mt-[-10px] shadow-sm">
        <div>
          <h1 className="text-3xl font-medium text-white tracking-tight">API Documentation</h1>
          <p className="text-xs text-slate-500 mt-1">Integrate Promptora into your applications using our OpenAI-compatible API.</p>
        </div>
      </header>

      <div className="space-y-12">
        <section>
          <h2 className="text-lg font-medium tracking-tight border-b border-white/5 pb-2 mb-6 text-white">Base URL</h2>
          <p className="text-slate-400 text-sm mb-4 tracking-wide">All API requests should be made relative to the current application host.</p>
          <CodeBlock code={`${window.location.origin}/api/v1`} />
        </section>

        <section>
          <h2 className="text-lg font-medium tracking-tight border-b border-white/5 pb-2 mb-6 text-white">Authentication</h2>
          <p className="text-slate-400 text-sm mb-4 tracking-wide">Authenticate your API requests by providing your API key in the Authorization header.</p>
          <CodeBlock code={`Authorization: Bearer sk_your_api_key_here`} />
        </section>

        <section>
          <h2 className="text-lg font-medium tracking-tight border-b border-white/5 pb-2 mb-6 text-white">
            Supported Models
          </h2>
          <div className="flex flex-wrap gap-2">
            {["GPT-4o", "Claude", "Gemini", "Llama"].map(model => (
              <span
                key={model}
                className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-sm"
              >
                {model}
              </span>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-medium tracking-tight border-b border-white/5 pb-2 mb-6 text-white">Chat Completions</h2>
          <p className="text-slate-400 text-sm mb-4 tracking-wide">
            Our gateway is compatible with the standard OpenAI chat completions API format. 
            Promptora provides a unified API layer that lets you access multiple AI models through a single endpoint.
          </p>
          
          <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2 mt-6">Endpoint</h3>
          <CodeBlock code={`POST /chat/completions`} />

          <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2 mt-8">Example Request (cURL)</h3>
          <CodeBlock code={`curl ${window.location.origin}/api/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer sk_your_api_key_here" \\
  -d '{
    "model": "anthropic/claude-3-haiku",
    "messages": [
      {
        "role": "user",
        "content": "Compose a short poem about stars."
      }
    ]
  }'`} />

          <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2 mt-8">
            Example Response
          </h3>
          <CodeBlock code={`{
  "id": "chatcmpl_xxx",
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "Hello from Promptora"
      }
    }
  ]
}`} />
        </section>
      </div>
    </div>
  );
}

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = React.useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-xl border border-white/5 bg-[#0a0a0a] overflow-hidden shadow-sm">
      <pre className="p-5 overflow-x-auto">
        <code className="text-sm font-mono text-indigo-400 leading-relaxed">{code}</code>
      </pre>
      <button 
        onClick={handleCopy}
        className="absolute top-3 right-3 p-2 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-white/10 border border-transparent hover:border-white/5"
      >
        {copied ? <Check className="w-4 h-4 text-indigo-400" /> : <Copy className="w-4 h-4 text-slate-400 hover:text-white" />}
      </button>
    </div>
  );
}