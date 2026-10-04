"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, ArrowUpRight } from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const QUICK_PROMPTS = [
  "Arduino নাকি ESP32 কোনটা ভালো?",
  "ঢাকার বাইরে ডেলিভারি কত দিনে হয়?",
  "ক্যাশ অন ডেলিভারি (COD) কীভাবে করব?",
  "রোবোটিক্স প্রোজেক্টের মোটর ড্রাইভার আছে?",
];

export function ChatWidget() {
  const [support, setSupport] = useState('');
  useEffect(()=>{ fetch('/api/settings').then(r=>r.ok?r.json():{}).then((s: Record<string,string>)=>setSupport((s.whatsapp || s.phone || '').replace(/\D/g,'').replace(/^0/,'880'))).catch(()=>{}); },[]);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "স্বাগতম! আমি জিয়ার টেক শপের শপ অ্যাসিস্ট্যান্ট। মাইক্রোকন্ট্রোলার, সেন্সর, রোবোটিক্স কম্পোনেন্ট বা ডেলিভারি সংক্রান্ত যেকোনো প্রশ্ন করতে পারেন!",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "instant", block: "nearest" });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputValue.trim();
    if (!text || loading) return;

    const userMessage: ChatMessage = { role: "user", content: text };
    const updatedHistory = [...messages, userMessage];
    setMessages(updatedHistory);
    setInputValue("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: updatedHistory.slice(1, -1),
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to get reply");
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || data.text || "দুঃখিত, কোনো উত্তর পাওয়া যায়নি।" },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "দুঃখিত, এই মুহূর্তে সার্ভারে সংযোগ সমস্যা হচ্ছে। সাহায্যের জন্য Contact Support পেজে যোগাযোগ করুন।",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shop-chat">
      {!isOpen && <button className="chat-trigger" aria-label="Open shop assistant" onClick={() => setIsOpen(true)}><MessageCircle size={21} /><span>Need a hand?</span></button>}
      {isOpen && <section className="chat-window" role="dialog" aria-label="Shop assistant" onKeyDown={event => { if (event.key === 'Escape') setIsOpen(false) }}>
        <header className="chat-heading"><MessageCircle size={21} /><div><h2>ZiaTech assistant</h2><p>Find a part. Plan your next step.</p></div><button aria-label="Close shop assistant" onClick={() => setIsOpen(false)}><X size={19} /></button></header>
        <div className="chat-messages" role="log" aria-live="polite" aria-label="Conversation">{messages.map((message, index) => <div key={index} className={`chat-message chat-message-${message.role}`}>{message.content}</div>)}{loading && <div className="chat-typing"><Loader2 size={15} className="animate-spin" />উত্তর তৈরি হচ্ছে...</div>}<div ref={messagesEndRef} /></div>
        {messages.length <= 2 && <div className="chat-prompts">{QUICK_PROMPTS.map(prompt => <button key={prompt} disabled={loading} onClick={() => handleSend(prompt)}>{prompt}</button>)}</div>}
        <form className="chat-form" onSubmit={event => { event.preventDefault(); handleSend() }}><input autoFocus aria-label="Your message" value={inputValue} onChange={event => setInputValue(event.target.value)} placeholder="আপনার প্রশ্ন লিখুন..." /><button type="submit" aria-label="Send message" disabled={loading || !inputValue.trim()}><Send size={17} /></button></form>
        {support && <a className="chat-support" href={`https://wa.me/${support}`} target="_blank" rel="noopener noreferrer">Talk to us on WhatsApp <ArrowUpRight size={13} /></a>}
      </section>}
    </div>
  );
}
