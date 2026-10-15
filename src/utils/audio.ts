import confetti from 'canvas-confetti';
import { AudioVoiceConfig } from '../types';

export function playCelebrationConfetti() {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0A2540', '#DC2626', '#FFFFFF', '#3B82F6', '#F59E0B']
    });
  } catch {
    // Graceful fallback
  }
}

export function playSuccessChime() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
    osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    osc.start();
    osc.stop(ctx.currentTime + 0.45);
  } catch {
    // silent fallback
  }
}

export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return [];
  }
  return window.speechSynthesis.getVoices();
}

export function getEnglishVoices(): SpeechSynthesisVoice[] {
  const all = getAvailableVoices();
  // Filter for English voices, prioritizing US English
  const english = all.filter(v => v.lang.startsWith('en'));
  if (english.length > 0) return english;
  return all;
}

export const DEFAULT_AUDIO_CONFIG: AudioVoiceConfig = {
  selectedVoiceName: '',
  speed: 0.95,
  pitch: 1.0,
  preset: 'system_best'
};

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export function speakEnglish(text: string, config?: Partial<AudioVoiceConfig>, onEnd?: () => void) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';

  // Apply speed & pitch
  const rate = config?.speed ?? 0.95;
  const pitch = config?.pitch ?? 1.0;
  utterance.rate = Math.max(0.5, Math.min(2.0, rate));
  utterance.pitch = Math.max(0.5, Math.min(1.8, pitch));

  const voices = window.speechSynthesis.getVoices();

  // If a specific voice was requested by name
  if (config?.selectedVoiceName) {
    const found = voices.find(v => v.name === config.selectedVoiceName);
    if (found) {
      utterance.voice = found;
    }
  }

  // If no voice set yet, check preset or find best US voice
  if (!utterance.voice && voices.length > 0) {
    if (config?.preset === 'us_female') {
      const female = voices.find(v =>
        v.lang.includes('en') &&
        (v.name.includes('Samantha') || v.name.includes('Zira') || v.name.includes('Jenny') || v.name.includes('Female') || v.name.includes('Google US English'))
      );
      if (female) utterance.voice = female;
    } else if (config?.preset === 'us_male') {
      const male = voices.find(v =>
        v.lang.includes('en') &&
        (v.name.includes('Alex') || v.name.includes('David') || v.name.includes('Guy') || v.name.includes('Male'))
      );
      if (male) utterance.voice = male;
    }

    // Default fallback to best US English voice
    if (!utterance.voice) {
      const usVoice = voices.find(v => v.lang === 'en-US' || v.name.includes('US') || v.name.includes('United States'));
      if (usVoice) utterance.voice = usVoice;
    }
  }

  if (onEnd) {
    utterance.onend = () => onEnd();
    utterance.onerror = () => onEnd();
  }

  window.speechSynthesis.speak(utterance);
}
