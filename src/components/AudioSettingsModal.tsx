import React, { useState } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { getTranslation } from '../i18n/translations';
import { speakEnglish, stopSpeaking } from '../utils/audio';
import {
  Volume2,
  VolumeX,
  Check,
  Play
} from 'lucide-react';

interface AudioSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AudioSettingsModal: React.FC<AudioSettingsModalProps> = ({ isOpen, onClose }) => {
  const { audioConfig, updateAudioConfig, availableVoices, language } = useAcademy();
  const t = getTranslation(language);

  const [testText, setTestText] = useState(
    'Hey there! Welcome to Eagle English Academy. Let’s practice American connected speech today!'
  );
  const [isPlaying, setIsPlaying] = useState(false);

  if (!isOpen) return null;

  const presets = [
    {
      id: 'us_female',
      name: t.audioPresetFemale,
      desc: t.audioPresetFemaleDesc,
      speed: 0.95,
      pitch: 1.05
    },
    {
      id: 'us_male',
      name: t.audioPresetMale,
      desc: t.audioPresetMaleDesc,
      speed: 0.95,
      pitch: 0.95
    },
    {
      id: 'esl_coach_slow',
      name: t.audioPresetSlow,
      desc: t.audioPresetSlowDesc,
      speed: 0.8,
      pitch: 1.0
    },
    {
      id: 'native_fast',
      name: t.audioPresetFast,
      desc: t.audioPresetFastDesc,
      speed: 1.1,
      pitch: 1.0
    }
  ];

  const handleApplyPreset = (p: typeof presets[0]) => {
    updateAudioConfig({
      preset: p.id as any,
      speed: p.speed,
      pitch: p.pitch
    });
  };

  const handleTestVoice = () => {
    setIsPlaying(true);
    speakEnglish(testText, audioConfig, () => {
      setIsPlaying(false);
    });
  };

  const handleStop = () => {
    stopSpeaking();
    setIsPlaying(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-fade-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#002868] flex items-center justify-center">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                {t.audioModalTitle}
              </h3>
              <p className="text-xs text-slate-500">
                {t.audioModalSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="space-y-5 mt-4">
          {/* Quick Presets */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              {t.audioRecommendedPresets}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {presets.map(p => {
                const isSelected = audioConfig.preset === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => handleApplyPreset(p)}
                    className={`p-3 rounded-xl border transition cursor-pointer text-xs ${
                      isSelected
                        ? 'border-blue-700 bg-blue-50/70 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>{p.name}</span>
                      {isSelected && <Check className="w-4 h-4 text-blue-700" />}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      {p.desc}
                    </p>
                    <div className="text-[10px] text-blue-900 font-semibold mt-2">
                      {t.audioSpeechSpeed}: {p.speed}x • {t.audioPitch}: {p.pitch}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Voice Engine Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {t.audioBrowserVoice} ({availableVoices.length} disponíveis)
            </label>
            <select
              value={audioConfig.selectedVoiceName || ''}
              onChange={e => updateAudioConfig({ selectedVoiceName: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium"
            >
              <option value="">{t.audioDefaultVoice}</option>
              {availableVoices.map(v => (
                <option key={v.name} value={v.name}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </div>

          {/* Speed & Pitch Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>{t.audioSpeechSpeed}</span>
                <span className="font-bold text-blue-900">{audioConfig.speed.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.6"
                max="1.4"
                step="0.05"
                value={audioConfig.speed}
                onChange={e => updateAudioConfig({ speed: parseFloat(e.target.value) })}
                className="w-full accent-blue-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>0.6x ({t.audioSpeedSlow})</span>
                <span>1.0x ({t.audioSpeedNormal})</span>
                <span>1.4x ({t.audioSpeedFast})</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>{t.audioPitch}</span>
                <span className="font-bold text-blue-900">{audioConfig.pitch.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.3"
                step="0.05"
                value={audioConfig.pitch}
                onChange={e => updateAudioConfig({ pitch: parseFloat(e.target.value) })}
                className="w-full accent-blue-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>{t.audioPitchLow}</span>
                <span>{t.audioPitchDefault}</span>
                <span>{t.audioPitchHigh}</span>
              </div>
            </div>
          </div>

          {/* Test Audio Phrase Box */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              {t.audioTestPhrase}
            </label>
            <textarea
              rows={2}
              value={testText}
              onChange={e => setTestText(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white resize-none"
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleTestVoice}
                className="flex-1 py-2 bg-[#002868] hover:bg-blue-900 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{isPlaying ? t.audioTestingVoice : t.audioTestVoiceBtn}</span>
              </button>

              <button
                type="button"
                onClick={handleStop}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <VolumeX className="w-3.5 h-3.5" />
                <span>{t.audioStop}</span>
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              {t.audioSavePreferencesNote}
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
            >
              {t.audioSaveAndClose}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
