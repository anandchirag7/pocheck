
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { chatWithBackendLLM } from '../services/llmService';
import { SqlDisplay } from './SqlDisplay';
import { SQL_TEMPLATES } from '../constants';
import Sidebar from './Sidebar';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Welcome to POCheck Workspace. I can use validated Teradata templates or generate custom SQL via your LLM. Set your parameters in the sidebar to begin.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAiEnabled, setIsAiEnabled] = useState(false);
  const [queryParams, setQueryParams] = useState<Record<string, string>>({
    '@ID': '',
    '@CostCenterNumber': '',
    '@SupplierID': '',
    '@SourceSystem': '',
    '@FromDate': '',
    '@ToDate': '',
    '@UserID': ''
  });
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (customInput?: string, templateId?: string) => {
    const textToSend = customInput || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    if (!customInput) setInput('');
    setIsLoading(true);

    try {
      let content = "";
      let metadata: any = {};

      if (templateId && SQL_TEMPLATES[templateId] && !isAiEnabled) {
        let sql = SQL_TEMPLATES[templateId];
        Object.entries(queryParams).forEach(([key, value]) => {
          if (value) sql = sql.split(key).join(`'${value}'`);
        });

        metadata.sql = sql;
        metadata.isFaq = true;
        content = `I've fetched data using the **${templateId}** master template.\n\n| Filter | Active Value |\n| :--- | :--- |\n${Object.entries(queryParams).filter(([_,v]) => v).map(([k,v]) => `| ${k} | ${v} |`).join('\n')}\n\n*Standard Query Engine active.*`;
      } else {
        // BACKEND LLM MODE
        const history = messages.map(m => ({ role: m.role, content: m.content }));
        content = await chatWithBackendLLM(textToSend, history, queryParams);
        
        // Extract SQL if present in markdown
        const sqlMatch = content.match(/```sql\n([\s\S]*?)\n```/);
        if (sqlMatch) {
          metadata.sql = sqlMatch[1];
        }
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: content || "I'm sorry, I couldn't process that request.",
        timestamp: new Date(),
        metadata
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Backend LLM communication error. Please try again.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const activeColor = isAiEnabled ? 'emerald' : 'indigo';

  return (
    <div className="flex h-screen w-full bg-slate-950 overflow-hidden text-slate-900">
      <Sidebar 
        onSelectTemplate={(prompt, id) => handleSend(prompt, id)} 
        onParamsChange={setQueryParams}
        params={queryParams}
        isAiEnabled={isAiEnabled}
        onAiToggle={setIsAiEnabled}
      />
      
      <div className="flex flex-col flex-1 bg-white relative shadow-2xl">
        <header className="px-6 py-4 bg-white border-b flex justify-between items-center shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 bg-${activeColor}-600 rounded-xl flex items-center justify-center font-black text-white text-lg transition-colors shadow-lg`}>PO</div>
            <div>
              <h1 className="font-extrabold text-slate-900 tracking-tight">
                POCheck <span className={`text-${activeColor}-600 text-sm font-medium transition-colors underline decoration-2 underline-offset-4`}>{isAiEnabled ? 'Backend LLM' : 'Template Mode'}</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Enterprise Dashboard v3.7</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className={`hidden sm:flex items-center gap-2 px-3 py-1 rounded-full border border-${activeColor}-200 bg-${activeColor}-50`}>
              <div className={`w-2 h-2 rounded-full bg-${activeColor}-500 animate-pulse`}></div>
              <span className={`text-[10px] font-bold text-${activeColor}-700 uppercase`}>{isAiEnabled ? 'LLM Gateway' : 'Standard Engine'}</span>
            </div>
            <button onClick={() => setMessages([messages[0]])} className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-tighter">Clear Chat</button>
          </div>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6 bg-slate-50/50 custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[90%] lg:max-w-[80%] ${msg.role === 'user' ? 'order-2' : ''}`}>
                  <div className={`p-5 rounded-2xl border ${
                    msg.role === 'user' 
                    ? `bg-${activeColor}-600 text-white border-${activeColor}-500 shadow-xl shadow-${activeColor}-100` 
                    : 'bg-white text-slate-800 border-slate-200 shadow-md'
                  } transition-all`}>
                    <div className="prose prose-sm max-w-none whitespace-pre-wrap leading-relaxed">
                      {msg.content}
                    </div>
                    {msg.metadata?.sql && <SqlDisplay sql={msg.metadata.sql} />}
                  </div>
                  <div className={`mt-2 px-2 text-[10px] font-bold text-slate-400 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {msg.timestamp.toLocaleTimeString()} {msg.metadata?.isFaq ? '(Master Template)' : '(LLM Synthetic)'}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className={`w-2 h-2 bg-${activeColor}-500 rounded-full animate-bounce`}></div>
                    <div className={`w-2 h-2 bg-${activeColor}-500 rounded-full animate-bounce [animation-delay:-0.15s]`}></div>
                    <div className={`w-2 h-2 bg-${activeColor}-500 rounded-full animate-bounce [animation-delay:-0.3s]`}></div>
                  </div>
                  <span className={`text-xs font-bold text-${activeColor}-500 uppercase tracking-wider`}>
                    {isAiEnabled ? 'Consulting LLM Gateway...' : 'Applying Template Logic...'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="p-6 bg-white border-t">
          <div className="max-w-4xl mx-auto flex gap-4 items-end">
            <div className={`flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 shadow-inner flex items-center gap-3 focus-within:border-${activeColor}-500 transition-all focus-within:ring-2 focus-within:ring-${activeColor}-100`}>
              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                placeholder={isAiEnabled ? "Ask your LLM for custom data analysis..." : "Standard prompt or select library item..."}
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium outline-none resize-none"
              />
            </div>
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className={`h-12 w-12 flex items-center justify-center rounded-2xl bg-${activeColor}-600 text-white shadow-xl hover:bg-${activeColor}-700 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ChatInterface;
