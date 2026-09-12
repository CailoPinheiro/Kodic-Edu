import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, Zap, BellOff } from 'lucide-react';

export function StudentFocusModal({ isOpen, onClose, showToast }) {
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isActive) {
      setIsActive(false);
      showToast('🎉 Ciclo Pomodoro concluído! Hora de um descanso de 5 minutos.');
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft, showToast]);

  if (!isOpen) return null;

  const toggleTimer = () => {
    const nextState = !isActive;
    setIsActive(nextState);
    if (nextState) {
      showToast('⚡ Modo Foco Ativado! Notificações silenciadas para máxima atenção.');
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setSecondsLeft(25 * 60);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ textAlign: 'center', alignItems: 'center' }}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="icon-btn" style={{ width: '32px', height: '32px' }} onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: '16px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid var(--kodic-amber)', display: 'inline-flex' }}>
          <Zap size={36} style={{ color: 'var(--kodic-amber)' }} />
        </div>

        <strong style={{ fontSize: '1.2rem' }}>Modo Foco & Pomodoro</strong>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', maxWidth: '340px' }}>
          Silencia notificações e garante imersão e concentração durante as atividades em sala de aula.
        </p>

        <div style={{ fontSize: '3.5rem', fontWeight: 900, fontFamily: 'monospace', color: 'var(--text-primary)', margin: '16px 0' }}>
          {formattedTime}
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            className="btn-primary"
            style={{ width: 'auto', padding: '10px 24px', background: isActive ? 'var(--kodic-amber)' : 'linear-gradient(135deg, var(--kodic-purple), var(--kodic-fuchsia))' }}
            onClick={toggleTimer}
          >
            {isActive ? <Pause size={18} /> : <Play size={18} />}
            <span>{isActive ? 'Pausar Ciclo' : 'Iniciar Foco (25m)'}</span>
          </button>
          <button className="btn-secondary" onClick={resetTimer}>
            <RotateCcw size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: 'var(--kodic-green)', marginTop: '12px' }}>
          <BellOff size={14} />
          <span>Notificações bloqueadas enquanto o cronômetro estiver ativo</span>
        </div>
      </div>
    </div>
  );
}
