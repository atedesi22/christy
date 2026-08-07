import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, AlertTriangle, ShieldCheck, Send, MessageCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

// Questions du Chatbot
const CHAT_QUESTIONS = [
  {
    id: 'reason',
    botMsg: "Si tu devais mettre des mots simples dessus... Selon toi, quelle a été la vraie raison de notre séparation ? 💬",
    placeholder: "Ton ressenti avec tes propres mots..."
  },
  {
    id: 'qualities',
    botMsg: "Pendant tout ce temps ensemble, quelles sont les qualités que tu as le plus appréciées chez moi ? ✨",
    placeholder: "Ce que tu aimais chez moi..."
  },
  {
    id: 'defects',
    botMsg: "Et à l'inverse, quels sont mes défauts ou comportements qui t'ont le plus blessée ou déçue ? 🖤",
    placeholder: "Sois totalement sincère, je veux comprendre..."
  },
  {
    id: 'expectations',
    botMsg: "Si on devait se donner une vraie chance d'essayer à nouveau, qu'est-ce que tu aimerais qui change absolument ? 🕊️",
    placeholder: "Tes besoins et ce que tu souhaites..."
  },
  {
    id: 'commitment',
    botMsg: "Et de ton côté, qu'es-tu prête à apporter ou faire évoluer pour construire quelque chose de sain et fort ? 🌹",
    placeholder: "Tes engagements pour nous deux..."
  }
];

export default function BirthdaySurprise() {
  const [step, setStep] = useState('welcome'); // 'welcome' | 'message' | 'saved' | 'chatbot' | 'summary' | 'destroyed'
  const [countdown, setCountdown] = useState(20);
  const [isCounting, setIsCounting] = useState(false);

  // État du Chatbot
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentInput, setCurrentInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const chatEndRef = useRef(null);

  // Ton numéro de téléphone WhatsApp au format international (ex: "33612345678" ou "2376XXXXXXXX")
  const YOUR_WHATSAPP_NUMBER = "237694865872"; 

  // Déclencher les confettis
  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#fb7185', '#e11d48', '#ffffff', '#171717']
    });
  };

  // Compte à rebours
  useEffect(() => {
    let timer;
    if (isCounting && countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    } else if (countdown === 0 && isCounting) {
      setStep('destroyed');
      setIsCounting(false);
    }
    return () => clearInterval(timer);
  }, [isCounting, countdown]);

  // Scroll automatique dans le chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleStartMessage = () => {
    setStep('message');
    setIsCounting(true);
  };

  const handleCancelDestruction = () => {
    setIsCounting(false);
    setStep('saved');
    triggerConfetti();
  };

  const handleStartChatbot = () => {
    setStep('chatbot');
    triggerConfetti();
    // Message de bienvenue du bot
    setChatHistory([
      { sender: 'bot', text: "Je suis tellement content(e) que tu aies ouvert cette porte... 🖤" },
      { sender: 'bot', text: CHAT_QUESTIONS[0].botMsg }
    ]);
  };

  const handleSendAnswer = (e) => {
    e.preventDefault();
    if (!currentInput.trim()) return;

    const currentQ = CHAT_QUESTIONS[currentQuestionIdx];
    const userMsg = currentInput.trim();

    // Enregistrer la réponse
    const updatedAnswers = { ...answers, [currentQ.id]: userMsg };
    setAnswers(updatedAnswers);

    // Mettre à jour l'historique du chat avec la réponse utilisateur
    const newHistory = [...chatHistory, { sender: 'user', text: userMsg }];
    setChatHistory(newHistory);
    setCurrentInput('');

    // Passer à la question suivante ou finir
    if (currentQuestionIdx < CHAT_QUESTIONS.length - 1) {
      const nextIdx = currentQuestionIdx + 1;
      setCurrentQuestionIdx(nextIdx);
      setTimeout(() => {
        setChatHistory((prev) => [
          ...prev,
          { sender: 'bot', text: CHAT_QUESTIONS[nextIdx].botMsg }
        ]);
      }, 600);
    } else {
      // Fin du questionnaire
      setTimeout(() => {
        setChatHistory((prev) => [
          ...prev,
          { sender: 'bot', text: "Merci du fond du cœur pour ta sincérité. C'est le plus beau cadeau. Voici le résumé de tes mots..." }
        ]);
        setTimeout(() => setStep('summary'), 1500);
      }, 600);
    }
  };

  // Préparer le message WhatsApp
  const formatWhatsAppMessage = () => {
    let text = `✨ *RÉPONSES POUR NOS 20 ANS* ✨\n\n`;
    text += `🖤 *Raison séparation:* ${answers.reason || ''}\n\n`;
    text += `🌟 *Mes qualités:* ${answers.qualities || ''}\n\n`;
    text += `💔 *Mes défauts:* ${answers.defects || ''}\n\n`;
    text += `🕊️ *Ce qu'elle aimerait qui change:* ${answers.expectations || ''}\n\n`;
    text += `🌹 *Son engagement:* ${answers.commitment || ''}\n`;
    return encodeURIComponent(text);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-4 font-sans select-none">
      <div className="w-full max-w-md bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden flex flex-col min-h-[520px] justify-between">
        
        <AnimatePresence mode="wait">
          
          {/* ÉTAPE 1 : Accueil */}
          {step === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="text-center space-y-6 my-auto"
            >
              <div className="relative inline-block">
                <div className="absolute -inset-1 rounded-full bg-rose-500/20 blur-md animate-pulse"></div>
                <div className="relative p-5 rounded-full bg-neutral-900 border border-neutral-700/60">
                  <Sparkles className="w-8 h-8 text-rose-400 animate-spin-slow" />
                </div>
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-light tracking-wide text-neutral-100">
                  Un instant suspendu...
                </h1>
                <p className="text-xs uppercase tracking-widest text-rose-400 font-mono">20 ANS • 08 AOÛT</p>
              </div>
              
              <p className="text-sm text-neutral-400 font-light leading-relaxed px-2">
                Ce lien s'autodétruira très bientôt. Souhaites-tu découvrir ce que j'ai à te dire avant qu'il ne soit trop tard ?
              </p>

              <div className="pt-4 flex flex-col gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleStartMessage}
                  className="w-full py-4 bg-gradient-to-r from-rose-950/60 to-neutral-900 border border-rose-800/60 text-rose-200 rounded-2xl font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-950/40"
                >
                  <Heart className="w-4 h-4 text-rose-400 fill-rose-400/30 animate-pulse" />
                  Continuer
                </motion.button>
                
                <button
                  onClick={() => alert("Certaines portes restent fermées pour toujours... 🌑")}
                  className="py-3 text-neutral-500 hover:text-neutral-400 text-xs font-light transition-colors"
                >
                  Quitter sans regarder
                </button>
              </div>
            </motion.div>
          )}

          {/* ÉTAPE 2 : Message ultime + compte à rebours */}
          {step === 'message' && (
            <motion.div
              key="message"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="space-y-5 my-auto"
            >
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <span className="text-xs uppercase tracking-widest text-neutral-500 font-mono">MESSAGE UNIQUE</span>
                <div className="flex items-center gap-2 bg-rose-950/60 border border-rose-800/50 px-3 py-1 rounded-full text-xs text-rose-300 font-mono">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
                  <span>Autodestruction: {countdown}s</span>
                </div>
              </div>

              <div className="space-y-3 text-neutral-300 text-sm font-light leading-relaxed max-h-[320px] overflow-y-auto pr-1">
                <p className="text-base text-rose-300 font-serif italic">
                  Joyeux 20ème anniversaire... ✨
                </p>

                <p>
                  20 ans. C'est un cap particulier, le début d'un tout nouveau chapitre.
                </p>

                <p>
                  Je voulais simplement te laisser cette petite empreinte, discrète et élégante, à l'image de ce que tu es. Ta gentillesse, ton calme naturel, cette timidité touchante et cette grâce mystérieuse que tu portes si bien.
                </p>

                <p>
                  Aujourd'hui marque la fin d'une époque et le début d'une autre. Je te souhaite le meilleur pour tout ce que tu entreprendras, du bonheur, de la réussite et des moments aussi doux et profonds que toi.
                </p>

                <p className="text-neutral-400 text-xs italic border-l-2 border-neutral-700 pl-3 py-1 mt-4">
                  Ce message s'effacera dans quelques secondes... à moins que tu ne décides de garder cette trace.
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCancelDestruction}
                className="w-full py-3.5 bg-neutral-800 hover:bg-neutral-700/80 border border-neutral-700 text-neutral-200 rounded-2xl text-xs font-medium flex items-center justify-center gap-2 shadow-lg"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Annuler l'autodestruction
              </motion.button>
            </motion.div>
          )}

          {/* ÉTAPE 3 : Révélation + Bouton Recommencer */}
          {step === 'saved' && (
            <motion.div
              key="saved"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="text-center space-y-5 my-auto"
            >
              <div className="text-5xl animate-bounce">🖤✨</div>
              
              <h2 className="text-xl font-medium text-rose-200">
                Message sauvegardé !
              </h2>

              <p className="text-sm text-neutral-300 leading-relaxed font-light">
                Oups... En réalité, ce message ne s'est jamais détruit 😉✨
              </p>
              
              <p className="text-xs text-neutral-400 leading-relaxed italic bg-neutral-900/80 border border-neutral-800 p-3 rounded-2xl">
                Si tu as pris la peine de cliquer sur ce bouton avant les 20 secondes, c'est peut-être la preuve qu'au fond... tu ne m'as pas tout à fait oublié toi non plus 🤫🖤
              </p>

              {/* BOUTON SECONDE CHANCE */}
              <div className="pt-2 flex flex-col gap-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleStartChatbot}
                  className="w-full py-4 bg-gradient-to-r from-rose-900 via-rose-950 to-neutral-900 border border-rose-700/60 text-rose-100 rounded-2xl font-medium text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-rose-950/60"
                >
                  <Sparkles className="w-4 h-4 text-rose-400" />
                  Et si on réécrivait la suite ?
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ÉTAPE 4 : Mini Chatbot */}
          {step === 'chatbot' && (
            <motion.div
              key="chatbot"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="flex flex-col h-[480px] justify-between"
            >
              {/* En-tête du Chat */}
              <div className="border-b border-neutral-800 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  <span className="text-xs font-mono text-neutral-300">Discussion sincère</span>
                </div>
                <span className="text-[10px] font-mono text-neutral-500">
                  {currentQuestionIdx + 1} / {CHAT_QUESTIONS.length}
                </span>
              </div>

              {/* Barre de progression */}
              <div className="w-full bg-neutral-800 h-1 rounded-full overflow-hidden my-2">
                <motion.div
                  className="bg-rose-500 h-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestionIdx + 1) / CHAT_QUESTIONS.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Historique des messages */}
              <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1 text-xs leading-relaxed">
                {chatHistory.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3.5 rounded-2xl ${
                        msg.sender === 'user'
                          ? 'bg-rose-900/60 text-rose-100 border border-rose-800/50 rounded-br-none'
                          : 'bg-neutral-800/80 text-neutral-200 border border-neutral-700/50 rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Champ de saisie */}
              <form onSubmit={handleSendAnswer} className="pt-2 border-t border-neutral-800 flex gap-2">
                <input
                  type="text"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  placeholder={CHAT_QUESTIONS[currentQuestionIdx]?.placeholder || "Ton message..."}
                  className="flex-1 bg-neutral-900 border border-neutral-800 focus:border-rose-800 text-neutral-200 rounded-xl px-3.5 py-2.5 text-xs outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={!currentInput.trim()}
                  className="p-2.5 bg-rose-900/80 hover:bg-rose-800 border border-rose-700 text-rose-200 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          )}

          {/* ÉTAPE 5 : Résumé & Envoi */}
          {step === 'summary' && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 my-auto text-center"
            >
              <div className="p-3 bg-rose-950/40 border border-rose-800/40 rounded-full inline-block">
                <CheckCircle2 className="w-8 h-8 text-rose-400" />
              </div>

              <h2 className="text-lg font-medium text-rose-200">
                Merci pour tes mots... 🕊️
              </h2>

              <p className="text-xs text-neutral-400 leading-relaxed font-light">
                Chaque réponse compte. Si tu es d'accord pour qu'on en discute sereinement, tu peux me les partager directement.
              </p>

              <div className="p-3 bg-neutral-900/90 border border-neutral-800 rounded-2xl text-left space-y-2 text-[11px] text-neutral-300 max-h-[160px] overflow-y-auto">
                <p><strong>Separation:</strong> {answers.reason}</p>
                <p><strong>Qualités:</strong> {answers.qualities}</p>
                <p><strong>Défauts:</strong> {answers.defects}</p>
                <p><strong>Attentes:</strong> {answers.expectations}</p>
                <p><strong>Engagement:</strong> {answers.commitment}</p>
              </div>

              <a
                href={`https://wa.me/${YOUR_WHATSAPP_NUMBER}?text=${formatWhatsAppMessage()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-200 rounded-2xl text-xs font-medium flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-950/50"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                Envoyer nos réponses sur WhatsApp
              </a>
            </motion.div>
          )}

          {/* ÉTAPE 6 : Destruit */}
          {step === 'destroyed' && (
            <motion.div
              key="destroyed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center space-y-4 my-auto py-8"
            >
              <div className="text-4xl opacity-30">💨</div>
              <h2 className="text-lg font-light text-neutral-400">
                Message autodétruit.
              </h2>
              <p className="text-xs text-neutral-600">
                Le temps est écoulé. Ce souvenir appartient désormais au passé.
              </p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}