import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  size: number;
  emoji: string;
}

const EMOJIS = ['🎉', '📚', '🏡', '🎁', '✨', '🌿', '⭐', '🍃'];
const COLORS = ['#4a7c59', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899', '#10b981'];

function generateConfetti(count: number): ConfettiPiece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    delay: Math.random() * 0.8,
    size: 14 + Math.random() * 14,
    emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
  }));
}

interface SuccessAnimationProps {
  show: boolean;
  onDone: () => void;
}

export default function SuccessAnimation({ show, onDone }: SuccessAnimationProps) {
  const [confetti] = useState(() => generateConfetti(24));

  useEffect(() => {
    if (show) {
      const timer = setTimeout(onDone, 3200);
      return () => clearTimeout(timer);
    }
  }, [show, onDone]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="success"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none overflow-hidden"
        >
          {/* Confettis */}
          {confetti.map((p) => (
            <motion.span
              key={p.id}
              initial={{ x: `${p.x}vw`, y: '-5vh', rotate: 0, opacity: 1 }}
              animate={{ y: '110vh', rotate: 720, opacity: 0 }}
              transition={{ duration: 2.5 + Math.random(), delay: p.delay, ease: 'easeIn' }}
              className="absolute top-0"
              style={{ fontSize: p.size, left: 0 }}
            >
              {p.emoji}
            </motion.span>
          ))}

          {/* Message central */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25, delay: 0.1 }}
            className="pointer-events-auto bg-white rounded-3xl shadow-2xl px-8 py-6 flex flex-col items-center gap-3 max-w-xs mx-4 text-center"
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-5xl"
            >
              🏡
            </motion.div>
            <h3 className="font-display font-bold text-gray-800 text-xl">Merci !</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Vous participez à la magie des cabanes.<br />
              <span className="text-moss-600 font-semibold">La communauté vous remercie ✨</span>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
