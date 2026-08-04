import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  User,
  Volume2,
  VolumeX,
  Sparkles,
  AlertOctagon,
  RefreshCw,
  MessageSquare,
  ShieldAlert,
  Mic,
  MicOff,
  Radio,
  AudioWaveform,
  Headphones,
  Square,
} from 'lucide-react';
import { Message, SeverityLevel } from '../types';
import { ApiClient } from '../services/apiClient';

interface AssistantPageProps {
  conversationId?: string;
}

export const AssistantPage: React.FC<AssistantPageProps> = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      conversationId: 'c1',
      sender: 'assistant',
      content:
        "Greetings. I am ResQ AI, your emergency protocol assistant. Tell me what disaster or medical situation you are facing, and I will give you immediate, prioritized step-by-step instructions. You can type or speak to me directly.",
      timestamp: new Date().toISOString(),
      triageLevel: 'moderate',
    },
  ]);
  const [input, setInput] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  // Voice Assistant Settings & State
  const [autoSpeak, setAutoSpeak] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isVoiceLoopMode, setIsVoiceLoopMode] = useState<boolean>(false);

  // Web Speech API Voice Dictation State
  const [isListening, setIsListening] = useState<boolean>(false);
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [dictationError, setDictationError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const speechSupported =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const ttsSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, interimTranscript, isSpeaking]);

  // Clean up speech recognition & synthesis on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
      if (ttsSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const stopSpeaking = () => {
    if (ttsSupported) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setSpeakingId(null);
  };

  const speakText = (id: string | null, text: string, onEnd?: () => void) => {
    if (!ttsSupported) return;

    window.speechSynthesis.cancel();

    // Sanitize text for clean vocal output
    const cleanText = text
      .replace(/[*#_`]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Pick English voice if available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(
      (v) =>
        v.lang.startsWith('en') &&
        (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Alex'))
    ) || voices.find((v) => v.lang.startsWith('en'));

    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      if (id) setSpeakingId(id);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingId(null);
      if (onEnd) onEnd();
    };

    utterance.onerror = (err) => {
      console.warn('Speech synthesis error:', err);
      setIsSpeaking(false);
      setSpeakingId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const toggleDictation = () => {
    setDictationError(null);
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
      setIsListening(false);
      return;
    }

    // Stop speaking if AI was talking
    stopSpeaking();

    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setDictationError('Web Speech API dictation is not supported in this browser.');
      return;
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setDictationError(null);
      };

      recognition.onresult = (event: any) => {
        let final = '';
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcript;
          } else {
            interim += transcript;
          }
        }

        if (final) {
          const combined = final.trim();
          setInput(combined);
          // Automatically send if in hands-free voice loop mode
          if (isVoiceLoopMode) {
            handleSend(combined);
          }
        } else {
          setInterimTranscript(interim);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setDictationError('Microphone permission denied. Please enable mic access.');
        } else if (event.error !== 'no-speech') {
          setDictationError(`Voice dictation error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (err: any) {
      console.error('Failed to start SpeechRecognition:', err);
      setDictationError('Could not start microphone session.');
      setIsListening(false);
    }
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isTyping) return;

    // Stop listening & speaking
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
    }
    stopSpeaking();

    setInput('');
    setInterimTranscript('');

    const userMsg: Message = {
      id: 'm-' + Date.now(),
      conversationId: 'c1',
      sender: 'user',
      content: query,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const history = messages.map((m) => ({ sender: m.sender, content: m.content }));
      const response = await ApiClient.sendChatMessage(query, history);

      const aiMsg: Message = {
        id: 'm-ai-' + Date.now(),
        conversationId: 'c1',
        sender: 'assistant',
        content: response.reply,
        timestamp: new Date().toISOString(),
        triageLevel: response.triageLevel,
      };

      setMessages((prev) => [...prev, aiMsg]);

      // If Auto-Speak or Voice Loop Mode is active, speak the reply aloud!
      if (autoSpeak || isVoiceLoopMode) {
        speakText(aiMsg.id, response.reply, () => {
          // If in continuous voice loop mode, resume listening after speaking
          if (isVoiceLoopMode) {
            setTimeout(() => {
              toggleDictation();
            }, 400);
          }
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
    }
  };

  const handlePromptChip = (prompt: string) => {
    handleSend(prompt);
  };

  const toggleIndividualSpeech = (id: string, text: string) => {
    if (speakingId === id && isSpeaking) {
      stopSpeaking();
    } else {
      speakText(id, text);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6.5rem)] max-w-4xl mx-auto animate-fade-in text-slate-100 space-y-4">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800 gap-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-cyan-500/20">
              <Bot className="w-5 h-5" />
            </div>
            {isSpeaking && (
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-500 border-2 border-slate-900"></span>
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold font-display text-white">ResQ Voice Assistant</h2>
              {ttsSupported && (
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                  isVoiceLoopMode
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                }`}>
                  <Radio className="w-3 h-3 animate-pulse" />
                  {isVoiceLoopMode ? 'Interactive Voice Loop' : 'Speech Engine Active'}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">Gemini 3.6 Flash · Web Speech Audio Protocol</p>
          </div>
        </div>

        {/* Voice Controls Bar */}
        <div className="flex items-center gap-2">
          {/* Auto Read Aloud Toggle */}
          <button
            onClick={() => setAutoSpeak(!autoSpeak)}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all flex items-center gap-1.5 ${
              autoSpeak
                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                : 'bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle automatic vocal response reading"
          >
            {autoSpeak ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Auto-Speak</span>
          </button>

          {/* Hands-Free Voice Loop Mode Toggle */}
          {speechSupported && (
            <button
              onClick={() => {
                const next = !isVoiceLoopMode;
                setIsVoiceLoopMode(next);
                if (next) {
                  setAutoSpeak(true);
                  // Start listening immediately
                  if (!isListening) toggleDictation();
                } else {
                  stopSpeaking();
                  if (isListening && recognitionRef.current) {
                    try {
                      recognitionRef.current.stop();
                    } catch (_) {}
                  }
                }
              }}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all flex items-center gap-1.5 ${
                isVoiceLoopMode
                  ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white border-rose-400/40 shadow-lg shadow-rose-500/20 animate-pulse'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
              title="Continuous back-and-forth voice conversation mode"
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>{isVoiceLoopMode ? 'Voice Mode Active' : 'Start Voice Mode'}</span>
            </button>
          )}

          {/* Reset Session */}
          <button
            onClick={() => {
              stopSpeaking();
              if (isListening && recognitionRef.current) {
                try {
                  recognitionRef.current.stop();
                } catch (_) {}
              }
              setMessages([
                {
                  id: 'm1',
                  conversationId: 'c1',
                  sender: 'assistant',
                  content: 'Chat session reset. What emergency instructions do you need?',
                  timestamp: new Date().toISOString(),
                },
              ]);
            }}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors text-xs flex items-center gap-1.5"
            title="New Chat Session"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Voice Assistant Live Status Banner */}
      {(isSpeaking || isListening || isVoiceLoopMode) && (
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3 text-xs animate-fade-in shadow-lg">
          <div className="flex items-center gap-3">
            {isSpeaking ? (
              <div className="flex items-center gap-2 text-cyan-400 font-medium">
                <AudioWaveform className="w-4 h-4 animate-bounce" />
                <span>Assistant is speaking...</span>
                <div className="flex items-end gap-0.5 h-3">
                  <span className="w-1 bg-cyan-400 animate-pulse h-full rounded-full"></span>
                  <span className="w-1 bg-cyan-400 animate-pulse h-2 rounded-full delay-75"></span>
                  <span className="w-1 bg-cyan-400 animate-pulse h-3.5 rounded-full delay-150"></span>
                  <span className="w-1 bg-cyan-400 animate-pulse h-1.5 rounded-full delay-100"></span>
                </div>
              </div>
            ) : isListening ? (
              <div className="flex items-center gap-2 text-rose-400 font-medium">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                </span>
                <span>Listening hands-free:</span>
                <span className="text-slate-300 italic">{interimTranscript || 'Speak your emergency details...'}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-amber-400 font-medium">
                <Headphones className="w-4 h-4 animate-spin" />
                <span>Hands-Free Voice Assistant Ready</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-rose-400 text-[11px] font-semibold flex items-center gap-1 border border-rose-500/20"
              >
                <Square className="w-3 h-3 fill-current" />
                <span>Stop Speech</span>
              </button>
            )}
            {isListening && (
              <button
                onClick={toggleDictation}
                className="text-xs text-slate-400 hover:text-slate-200 underline"
              >
                Pause Mic
              </button>
            )}
          </div>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isThisSpeaking = speakingId === msg.id && isSpeaking;

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className={`w-8 h-8 rounded-lg ${
                  isThisSpeaking
                    ? 'bg-gradient-to-br from-rose-500 to-amber-500 animate-pulse'
                    : 'bg-gradient-to-br from-cyan-500 to-blue-600'
                } text-slate-950 font-bold flex items-center justify-center text-xs flex-shrink-0 mt-1 shadow-md shadow-cyan-500/10`}>
                  RQ
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-2 ${
                  isUser
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-medium rounded-br-none shadow-lg shadow-cyan-500/10'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                }`}
              >
                {!isUser && (
                  <div className="flex items-center justify-between gap-2 pb-1 border-b border-slate-800">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        msg.triageLevel === 'critical'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : msg.triageLevel === 'high'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      Triage: {msg.triageLevel || 'moderate'}
                    </span>

                    <button
                      onClick={() => toggleIndividualSpeech(msg.id, msg.content)}
                      className="text-slate-400 hover:text-cyan-400 transition-colors p-1 flex items-center gap-1"
                      title={isThisSpeaking ? 'Stop Talking' : 'Read Aloud'}
                    >
                      {isThisSpeaking ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                          <span className="text-[10px] text-cyan-400 font-semibold">Speaking</span>
                        </>
                      ) : (
                        <Volume2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                )}

                <div className="whitespace-pre-wrap">{msg.content}</div>

                <div className={`text-[10px] ${isUser ? 'text-slate-900/70 text-right' : 'text-slate-500'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 font-bold flex items-center justify-center text-xs flex-shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold">
              RQ
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 text-xs flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
              <span>ResQ AI analyzing protocol & preparing voice response...</span>
            </div>
          </div>
        )}

        <div ref={logEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => handlePromptChip('Flash flood entering my home, what do I do?')}
          className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-all flex-shrink-0"
        >
          🌊 Flash flood steps
        </button>
        <button
          onClick={() => handlePromptChip('How do I treat a second-degree burn?')}
          className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-all flex-shrink-0"
        >
          🩹 Burn first aid
        </button>
        <button
          onClick={() => handlePromptChip('Earthquake just stopped, what should I inspect?')}
          className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-all flex-shrink-0"
        >
          🏚️ Post-earthquake inspection
        </button>
        <button
          onClick={() => handlePromptChip('Wildfire smoke in the air, how to protect lungs?')}
          className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-all flex-shrink-0"
        >
          🔥 Wildfire smoke defense
        </button>
      </div>

      {/* Dictation Error Banner if any */}
      {dictationError && (
        <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2 text-xs text-amber-400 animate-fade-in">
          <AlertOctagon className="w-4 h-4 flex-shrink-0" />
          <span>{dictationError}</span>
        </div>
      )}

      {/* Input Row */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 pt-1"
      >
        <div className="relative flex-1 flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              isListening
                ? "Listening... speak emergency details now..."
                : isSpeaking
                ? "Assistant talking... ask a question or wait..."
                : "Describe your emergency situation or speak hands-free..."
            }
            className={`w-full bg-slate-900 border ${
              isListening
                ? 'border-rose-500/80 ring-1 ring-rose-500/40'
                : isSpeaking
                ? 'border-cyan-500/60 ring-1 ring-cyan-500/20'
                : 'border-slate-800 focus:border-cyan-500/60'
            } rounded-xl pl-4 pr-11 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-all`}
          />

          <button
            type="button"
            onClick={toggleDictation}
            className={`absolute right-2 p-2 rounded-lg transition-all ${
              isListening
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 animate-pulse'
                : 'text-slate-400 hover:text-cyan-400 hover:bg-slate-800'
            }`}
            title={
              !speechSupported
                ? 'Speech Recognition not supported in browser'
                : isListening
                ? 'Stop Voice Dictation'
                : 'Start Voice Dictation (Hands-Free)'
            }
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
        </div>

        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 transition-all flex-shrink-0"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};


