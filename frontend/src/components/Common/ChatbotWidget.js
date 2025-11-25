import React, { useState, useEffect, useRef } from 'react';
import { sendMessageToChatbot } from '../../api/chatbotApi';

const ChatbotWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I'm your Real Estate AI assistant for Bengaluru. Ask me about property trends or pricing factors!", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        const newUserMessage = { id: Date.now(), text: userMessage, sender: 'user' };
        
        setMessages(prev => [...prev, newUserMessage]);
        setInput('');
        setLoading(true);

        try {
            const history = messages.slice(-5);
            const response = await sendMessageToChatbot(userMessage, history);
            const newBotMessage = { id: Date.now() + 1, text: response.response, sender: 'bot' };
            setMessages(prev => [...prev, newBotMessage]);
        } catch (error) {
            console.error("Chatbot API Error:", error);
            const errorMessage = { id: Date.now() + 1, text: "Error: Could not connect to the AI service.", sender: 'bot' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Floating Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-brand-accent text-bg-dark-primary shadow-2xl hover:bg-white transition duration-300"
            >
                {isOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                )}
            </button>

            {/* Chatbot Window */}
            {isOpen && (
                <div className="fixed bottom-20 right-6 z-50 w-80 h-96 bg-bg-dark-card shadow-2xl rounded-lg flex flex-col border border-gray-700">
                    
                    {/* Header */}
                    <div className="p-3 bg-bg-dark-secondary text-brand-accent rounded-t-lg flex justify-between items-center border-b border-gray-700">
                        <h3 className="font-semibold text-lg">AI Assistant</h3>
                        <span className="text-sm text-text-muted">Online</span>
                    </div>

                    {/* Message Area */}
                    <div className="flex-grow p-3 space-y-3 overflow-y-auto custom-scrollbar">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs px-3 py-2 rounded-xl text-sm ${
                                    msg.sender === 'user' ? 'bg-brand-accent text-bg-dark-primary rounded-br-none' : 'bg-gray-700 text-text-light rounded-tl-none'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="max-w-xs px-3 py-2 rounded-xl text-sm bg-gray-700 text-text-muted rounded-tl-none animate-pulse">
                                    Typing...
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-3 border-t border-gray-700">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask a question..."
                            disabled={loading}
                            // FIX: Ensure text is dark and background is light for visibility
                            className="w-full p-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-accent text-sm disabled:bg-gray-800 bg-gray-100 text-gray-800"
                        />
                    </form>
                </div>
            )}
        </>
    );
};

export default ChatbotWidget;