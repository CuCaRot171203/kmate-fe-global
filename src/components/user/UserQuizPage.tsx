'use client';

import { useState } from 'react';
import { Button } from 'antd';
import {
  QuestionOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  RightOutlined,
  TrophyOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';

// ─── Types ────────────────────────────────────────────────────────────────────

type QuizStatus = 'completed' | 'in-progress' | 'not-started';
type QuizCategory = 'Vocabulary' | 'Grammar' | 'Mixed';

interface QuizCard {
  id: string;
  title: string;
  category: QuizCategory;
  level: string;
  levelColor: string;
  totalQuestions: number;
  score: number | null;
  status: QuizStatus;
  progress: number;
  color: string;
  questions: QuizQuestion[];
}

interface QuizQuestion {
  id: string;
  korean: string;
  romanization: string;
  meaning: string;
  options: QuizOption[];
  correctIndex: number;
}

interface QuizOption {
  label: string;
  text: string;
  isCorrect: boolean;
}

interface AnswerState {
  selectedIndex: number | null;
  answered: boolean;
  isCorrect: boolean;
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const SAMPLE_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    korean: '감사합니다',
    romanization: 'gamsahamnida',
    meaning: 'Cảm ơn (trang trọng)',
    correctIndex: 1,
    options: [
      { label: 'A', text: 'Xin chào', isCorrect: false },
      { label: 'B', text: 'Cảm ơn', isCorrect: true },
      { label: 'C', text: 'Tạm biệt', isCorrect: false },
      { label: 'D', text: 'Xin lỗi', isCorrect: false },
    ],
  },
  {
    id: 'q2',
    korean: '안녕하세요',
    romanization: 'annyeonghaseyo',
    meaning: 'Xin chào (chào hỏi)',
    correctIndex: 0,
    options: [
      { label: 'A', text: 'Xin chào', isCorrect: true },
      { label: 'B', text: 'Cảm ơn', isCorrect: false },
      { label: 'C', text: 'Tạm biệt', isCorrect: false },
      { label: 'D', text: 'Khỏe không', isCorrect: false },
    ],
  },
  {
    id: 'q3',
    korean: '미안합니다',
    romanization: 'mianhamnida',
    meaning: 'Xin lỗi',
    correctIndex: 2,
    options: [
      { label: 'A', text: 'Xin chào', isCorrect: false },
      { label: 'B', text: 'Cảm ơn', isCorrect: false },
      { label: 'C', text: 'Xin lỗi', isCorrect: true },
      { label: 'D', text: 'Tạm biệt', isCorrect: false },
    ],
  },
  {
    id: 'q4',
    korean: '네',
    romanization: 'ne',
    meaning: 'Vâng / Có',
    correctIndex: 3,
    options: [
      { label: 'A', text: 'Không', isCorrect: false },
      { label: 'B', text: 'Tạm biệt', isCorrect: false },
      { label: 'C', text: 'Cảm ơn', isCorrect: false },
      { label: 'D', text: 'Vâng / Có', isCorrect: true },
    ],
  },
  {
    id: 'q5',
    korean: '괜찮아요',
    romanization: 'gwaenchanayo',
    meaning: 'Không sao',
    correctIndex: 1,
    options: [
      { label: 'A', text: 'Xin lỗi', isCorrect: false },
      { label: 'B', text: 'Không sao', isCorrect: true },
      { label: 'C', text: 'Xin chào', isCorrect: false },
      { label: 'D', text: 'Tạm biệt', isCorrect: false },
    ],
  },
  {
    id: 'q6',
    korean: '좋아요',
    romanization: 'joayo',
    meaning: 'Tốt / Hay',
    correctIndex: 0,
    options: [
      { label: 'A', text: 'Tốt / Hay', isCorrect: true },
      { label: 'B', text: 'Không', isCorrect: false },
      { label: 'C', text: 'Xin lỗi', isCorrect: false },
      { label: 'D', text: 'Cảm ơn', isCorrect: false },
    ],
  },
  {
    id: 'q7',
    korean: '만나서 반갑습니다',
    romanization: 'mannaseo bangapseumnida',
    meaning: 'Rất vui được gặp bạn',
    correctIndex: 2,
    options: [
      { label: 'A', text: 'Tạm biệt', isCorrect: false },
      { label: 'B', text: 'Khỏe không', isCorrect: false },
      { label: 'C', text: 'Rất vui được gặp bạn', isCorrect: true },
      { label: 'D', text: 'Cảm ơn', isCorrect: false },
    ],
  },
  {
    id: 'q8',
    korean: '잘 지내요?',
    romanization: 'jal jinaeyo',
    meaning: 'Bạn khỏe không?',
    correctIndex: 3,
    options: [
      { label: 'A', text: 'Tạm biệt', isCorrect: false },
      { label: 'B', text: 'Cảm ơn', isCorrect: false },
      { label: 'C', text: 'Xin chào', isCorrect: false },
      { label: 'D', text: 'Bạn khỏe không?', isCorrect: true },
    ],
  },
  {
    id: 'q9',
    korean: '안녕히 가세요',
    romanization: 'annyeonghi gaseyo',
    meaning: 'Tạm biệt (người đi)',
    correctIndex: 1,
    options: [
      { label: 'A', text: 'Xin chào', isCorrect: false },
      { label: 'B', text: 'Tạm biệt (người đi)', isCorrect: true },
      { label: 'C', text: 'Cảm ơn', isCorrect: false },
      { label: 'D', text: 'Không sao', isCorrect: false },
    ],
  },
  {
    id: 'q10',
    korean: '열심히 해요',
    romanization: 'yeolsimhi haeyo',
    meaning: 'Làm việc chăm chỉ',
    correctIndex: 0,
    options: [
      { label: 'A', text: 'Làm việc chăm chỉ', isCorrect: true },
      { label: 'B', text: 'Xin lỗi', isCorrect: false },
      { label: 'C', text: 'Tạm biệt', isCorrect: false },
      { label: 'D', text: 'Khỏe không', isCorrect: false },
    ],
  },
];

const QUIZZES: QuizCard[] = [
  {
    id: 'giao-tiep-co-ban',
    title: 'Giao tiếp cơ bản',
    category: 'Vocabulary',
    level: 'Sơ cấp',
    levelColor: '#00e5ff',
    totalQuestions: 10,
    score: 80,
    status: 'completed',
    progress: 100,
    color: '#00e5ff',
    questions: SAMPLE_QUESTIONS,
  },
  {
    id: 'the-thao-giai-tri',
    title: 'Thể thao & Giải trí',
    category: 'Vocabulary',
    level: 'Trung cấp',
    levelColor: '#7c4dff',
    totalQuestions: 10,
    score: null,
    status: 'not-started',
    progress: 0,
    color: '#7c4dff',
    questions: SAMPLE_QUESTIONS,
  },
  {
    id: 'kdrama-pho-bien',
    title: 'K-Drama Phổ biến',
    category: 'Vocabulary',
    level: 'Cao cấp',
    levelColor: '#f59e0b',
    totalQuestions: 10,
    score: 70,
    status: 'completed',
    progress: 100,
    color: '#f59e0b',
    questions: SAMPLE_QUESTIONS,
  },
  {
    id: 'canh-hoi-thoai-vp',
    title: 'Cảnh hội thoại văn phòng',
    category: 'Grammar',
    level: 'Sơ cấp',
    levelColor: '#00e5ff',
    totalQuestions: 10,
    score: null,
    status: 'in-progress',
    progress: 40,
    color: '#00e5ff',
    questions: SAMPLE_QUESTIONS,
  },
  {
    id: 'ngu-phap-duoi-kinh-ngu',
    title: 'Ngữ pháp đuôi kính ngữ',
    category: 'Grammar',
    level: 'Trung cấp',
    levelColor: '#7c4dff',
    totalQuestions: 10,
    score: null,
    status: 'not-started',
    progress: 0,
    color: '#7c4dff',
    questions: SAMPLE_QUESTIONS,
  },
  {
    id: 'tong-hop-level-1',
    title: 'Tổng hợp Level 1',
    category: 'Mixed',
    level: 'Sơ cấp',
    levelColor: '#00e5ff',
    totalQuestions: 10,
    score: 90,
    status: 'completed',
    progress: 100,
    color: '#00e5ff',
    questions: SAMPLE_QUESTIONS,
  },
];

const LEVEL_COLORS: Record<string, string> = {
  'Sơ cấp': '#00e5ff',
  'Trung cấp': '#7c4dff',
  'Cao cấp': '#f59e0b',
};

// ─── Mascot Component ─────────────────────────────────────────────────────────

function KMateMascot({ message }: { message?: string }) {
  const messages = [
    'Bạn làm tốt lắm! Tiến lên nào!',
    'Giỏi quá! Học tiếp thôi!',
    'Chính xác! Hãy giữ nhịp đều nhé!',
  ];
  const displayMessage = message ?? messages[Math.floor(Math.random() * messages.length)];

  return (
    <div className="fixed bottom-8 right-8 z-40 flex flex-col items-end gap-2 animate-fade-in">
      <div className="relative bg-white/10 backdrop-blur-md border border-primary/30 rounded-2xl px-4 py-3 max-w-[220px] shadow-lg">
        <div className="absolute -right-2 bottom-4 w-4 h-4 bg-white/10 border-r border-b border-primary/30 rotate-45 transform translate-y-1" />
        <p className="text-xs text-white leading-relaxed font-medium relative z-10">
          {displayMessage}
        </p>
      </div>
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
        <div className="relative w-16 h-16 rounded-full border-2 border-primary/40 bg-primary/10 flex items-center justify-center overflow-hidden">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="14" width="24" height="20" rx="4" fill="#7C4DFF" />
            <rect x="12" y="8" width="16" height="8" rx="3" fill="#00e5ff" />
            <circle cx="15" cy="22" r="2" fill="#00e5ff" />
            <circle cx="25" cy="22" r="2" fill="#00e5ff" />
            <rect x="17" y="27" width="6" height="2" rx="1" fill="#ffffff" opacity="0.8" />
            <line x1="4" y1="20" x2="8" y2="20" stroke="#7C4DFF" strokeWidth="2" strokeLinecap="round" />
            <line x1="32" y1="20" x2="36" y2="20" stroke="#7C4DFF" strokeWidth="2" strokeLinecap="round" />
            <circle cx="20" cy="5" r="2" fill="#f59e0b" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ─── Quiz Card ────────────────────────────────────────────────────────────────

function QuizCard({ quiz, onStart, onReview }: {
  quiz: QuizCard;
  onStart: () => void;
  onReview: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const isCompleted = quiz.status === 'completed';
  const isInProgress = quiz.status === 'in-progress';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="user-glass-card p-6 flex flex-col gap-4 cursor-pointer transition-all duration-300"
      style={{
        borderColor: hovered ? quiz.color + '60' : 'rgba(255,255,255,0.1)',
        boxShadow: hovered ? `0 0 20px ${quiz.color}30` : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={isCompleted ? onReview : onStart}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
            style={{ color: quiz.color, backgroundColor: quiz.color + '15' }}
          >
            {quiz.category}
          </span>
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
            style={{ color: quiz.levelColor, backgroundColor: quiz.levelColor + '15' }}
          >
            {quiz.level}
          </span>
        </div>
        <span className="text-xs text-slate-400">{quiz.totalQuestions} câu</span>
      </div>

      {/* Title */}
      <div>
        <h3 className="text-lg font-bold text-white mb-1">{quiz.title}</h3>
      </div>

      {/* Progress bar (in-progress only) */}
      {isInProgress && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Tiến độ</span>
            <span className="text-xs font-bold" style={{ color: quiz.color }}>
              {quiz.progress}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${quiz.progress}%`,
                background: `linear-gradient(90deg, ${quiz.color}80, ${quiz.color})`,
                boxShadow: `0 0 8px ${quiz.color}60`,
              }}
            />
          </div>
        </div>
      )}

      {/* Score (completed only) */}
      {isCompleted && (
        <div className="flex items-center gap-2">
          <TrophyOutlined style={{ color: '#f59e0b', fontSize: 16 }} />
          <span className="text-sm font-bold text-white">
            {quiz.score}%
          </span>
          <span className="text-xs text-slate-400">hoàn thành</span>
        </div>
      )}

      {/* Status + CTA */}
      <div className="flex items-center justify-between pt-1 mt-auto">
        <div className="flex items-center gap-1.5">
          {isCompleted && (
            <>
              <CheckCircleOutlined style={{ color: '#22c55e', fontSize: 14 }} />
              <span className="text-xs text-slate-400">Hoàn thành</span>
            </>
          )}
          {isInProgress && (
            <>
              <SafetyCertificateOutlined style={{ color: '#f59e0b', fontSize: 14 }} />
              <span className="text-xs text-slate-400">Đang làm</span>
            </>
          )}
          {!isCompleted && !isInProgress && (
            <>
              <QuestionOutlined style={{ color: quiz.color, fontSize: 14 }} />
              <span className="text-xs text-slate-400">Chưa làm</span>
            </>
          )}
        </div>
        <button
          className="text-xs font-bold px-4 py-2 rounded-xl transition-all hover:scale-105 active:scale-95"
          style={{
            backgroundColor: quiz.color + '20',
            color: quiz.color,
            border: `1px solid ${quiz.color}40`,
          }}
          onClick={(e) => { e.stopPropagation(); isCompleted ? onReview() : onStart(); }}
        >
          {isCompleted ? 'Xem lại' : 'Làm quiz'}
        </button>
      </div>
    </motion.div>
  );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────

function StatsBar() {
  const completed = QUIZZES.filter(q => q.status === 'completed').length;
  const avgScore = Math.round(
    QUIZZES.filter(q => q.score !== null)
      .reduce((sum, q) => sum + (q.score ?? 0), 0) / completed
  );

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="user-glass-card p-4 flex flex-col items-center gap-1">
        <span className="text-2xl font-extrabold text-white">{QUIZZES.length}</span>
        <span className="text-xs text-slate-400">Tổng quiz</span>
      </div>
      <div className="user-glass-card p-4 flex flex-col items-center gap-1">
        <span className="text-2xl font-extrabold text-green-400">{completed}</span>
        <span className="text-xs text-slate-400">Đã hoàn thành</span>
      </div>
      <div className="user-glass-card p-4 flex flex-col items-center gap-1">
        <span className="text-2xl font-extrabold text-amber-400">{avgScore}%</span>
        <span className="text-xs text-slate-400">Điểm TB</span>
      </div>
    </div>
  );
}

// ─── Answer Option ─────────────────────────────────────────────────────────────

function AnswerOption({
  option,
  index,
  selected,
  answered,
  correctIndex,
  onClick,
}: {
  option: { label: string; text: string };
  index: number;
  selected: boolean;
  answered: boolean;
  correctIndex: number;
  onClick: () => void;
}) {
  const isCorrect = index === correctIndex;
  const isSelected = selected && !answered;

  let borderColor = 'rgba(0,229,255,0.1)';
  let bgColor = 'rgba(0,229,255,0.03)';
  let labelBg = 'rgba(30,41,59,0.8)';
  let labelColor = '#94a3b8';
  let icon = null;
  let iconColor = 'transparent';

  if (answered && isCorrect) {
    borderColor = '#22c55e';
    bgColor = 'rgba(34,197,94,0.1)';
    labelBg = '#22c55e';
    labelColor = '#ffffff';
    icon = <CheckCircleOutlined style={{ color: '#22c55e', fontSize: 18 }} />;
    iconColor = '#22c55e';
  } else if (answered && isSelected && !isCorrect) {
    borderColor = '#ef4444';
    bgColor = 'rgba(239,68,68,0.1)';
    labelBg = '#ef4444';
    labelColor = '#ffffff';
    icon = <CloseCircleOutlined style={{ color: '#ef4444', fontSize: 18 }} />;
    iconColor = '#ef4444';
  } else if (isSelected) {
    borderColor = '#00e5ff';
    bgColor = 'rgba(0,229,255,0.1)';
    labelBg = '#00e5ff';
    labelColor = '#0B0B0F';
  }

  return (
    <button
      onClick={answered ? undefined : onClick}
      disabled={answered}
      className="flex items-center justify-between p-5 rounded-2xl transition-all group"
      style={{
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        cursor: answered ? 'default' : 'pointer',
        boxShadow: isSelected && !answered ? `0 0 12px ${borderColor}60` : 'none',
      }}
    >
      <div className="flex items-center gap-4">
        <span
          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all"
          style={{ backgroundColor: labelBg, color: labelColor }}
        >
          {option.label}
        </span>
        <span className="text-base font-semibold text-white">{option.text}</span>
      </div>
      <span style={{ color: iconColor }}>{icon}</span>
    </button>
  );
}

// ─── Quiz Detail View ─────────────────────────────────────────────────────────

function QuizDetailView({ quiz, onBack }: { quiz: QuizCard; onBack: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerState, setAnswerState] = useState<AnswerState>({
    selectedIndex: null,
    answered: false,
    isCorrect: false,
  });
  const [correctCount, setCorrectCount] = useState(0);
  const [completed, setCompleted] = useState(false);
  const totalQuestions = quiz.questions.length;
  const currentQ = quiz.questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + (completed ? 1 : 0)) / totalQuestions) * 100);
  const finalScore = Math.round((correctCount / totalQuestions) * 100);

  const handleSelectAnswer = (index: number) => {
    if (answerState.answered) return;
    const isCorrect = index === currentQ.correctIndex;
    setAnswerState({ selectedIndex: index, answered: true, isCorrect });
    if (isCorrect) setCorrectCount((c) => c + 1);
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((i) => i + 1);
      setAnswerState({ selectedIndex: null, answered: false, isCorrect: false });
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setCorrectCount(0);
    setCompleted(false);
    setAnswerState({ selectedIndex: null, answered: false, isCorrect: false });
  };

  if (completed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 animate-fade-in">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="w-28 h-28 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: finalScore >= 70 ? 'rgba(34,197,94,0.15)' : 'rgba(249,115,22,0.15)',
            border: `2px solid ${finalScore >= 70 ? '#22c55e' : '#f59e0b'}40`,
            boxShadow: finalScore >= 70
              ? '0 0 30px rgba(34,197,94,0.3)'
              : '0 0 30px rgba(249,115,22,0.3)',
          }}
        >
          <div className="text-center">
            <p className="text-4xl font-black" style={{ color: finalScore >= 70 ? '#22c55e' : '#f59e0b' }}>
              {finalScore}%
            </p>
          </div>
        </motion.div>
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-white">
            {finalScore >= 70 ? 'Xuất sắc!' : 'Cố gắng hơn nhé!'}
          </h2>
          <p className="text-slate-400">
            Bạn trả lời đúng <span className="font-bold text-white">{correctCount}</span> /{' '}
            <span className="font-bold text-white">{totalQuestions}</span> câu hỏi
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRestart}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 text-white font-bold border border-white/10 hover:bg-white/10 transition-all"
          >
            <RightOutlined style={{ fontSize: 14, transform: 'rotate(180deg)' }} />
            Làm lại
          </button>
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-bold hover:opacity-90 transition-all"
            style={{ boxShadow: '0 0 20px rgba(0,229,255,0.3)' }}
          >
            Quay lại danh sách
            <RightOutlined style={{ fontSize: 14 }} />
          </button>
        </div>
        <KMateMascot message="Chúc mừng bạn! Tuyệt vời lắm!" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium !bg-transparent border-0 cursor-pointer"
        >
          <RightOutlined style={{ fontSize: 14, transform: 'rotate(180deg)' }} />
          <span>Quay lại</span>
        </button>
        <h2 className="text-base font-bold text-white">{quiz.title}</h2>
        <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full">
          <span className="text-xs font-bold text-primary">
            {currentIndex + 1} / {totalQuestions}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Tiến độ</span>
          <span className="font-bold text-white">{progressPercent}%</span>
        </div>
        <div className="w-full h-3 bg-slate-800/50 rounded-full overflow-hidden border border-primary/5 p-0.5">
          <div
            className="h-full rounded-full transition-all duration-500 relative"
            style={{
              width: `${progressPercent}%`,
              background: 'linear-gradient(90deg, #7C4DFF, #00e5ff)',
              boxShadow: '0 0 10px rgba(0,229,255,0.5)',
            }}
          >
            <div className="absolute top-0 right-0 h-full w-4 bg-white/20 blur-sm rounded-r-full" />
          </div>
        </div>
      </div>

      {/* Question card */}
      <div className="relative group">
        <div className="absolute -top-6 -right-6 w-12 h-12 border border-primary/30 rounded-lg rotate-12 bg-primary/5 backdrop-blur-sm -z-10" />
        <div className="absolute -bottom-4 -left-8 w-16 h-16 bg-secondary/10 rounded-full blur-xl -z-10" />

        <div
          className="rounded-3xl p-10 flex flex-col items-center text-center shadow-2xl relative overflow-hidden"
          style={{
            background: 'rgba(23,50,54,0.3)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(0,229,255,0.2)',
          }}
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
          <span
            className="px-4 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-6"
            style={{ color: quiz.color, backgroundColor: quiz.color + '15', border: `1px solid ${quiz.color}30` }}
          >
            {quiz.category} Challenge
          </span>
          <p className="text-sm font-medium text-slate-400 mb-4">Chọn đáp án đúng nhất cho từ dưới đây:</p>
          <p
            className="text-5xl font-extrabold text-white tracking-tight mb-2"
            style={{ textShadow: '0 0 30px rgba(0,229,255,0.3)' }}
          >
            {currentQ.korean}
          </p>
          <p className="text-primary/60 text-lg font-medium italic mb-4">
            ({currentQ.romanization})
          </p>

          {/* Answer grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-4">
            {currentQ.options.map((option, index) => (
              <AnswerOption
                key={option.label}
                option={option}
                index={index}
                selected={answerState.selectedIndex === index}
                answered={answerState.answered}
                correctIndex={currentQ.correctIndex}
                onClick={() => handleSelectAnswer(index)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Next button */}
      <div className="flex justify-end">
        <button
          onClick={handleNext}
          disabled={!answerState.answered}
          className="flex items-center gap-3 px-8 py-4 rounded-2xl font-bold tracking-wide transition-all"
          style={{
            background: answerState.answered
              ? 'linear-gradient(90deg, #7C4DFF, #00e5ff)'
              : 'rgba(255,255,255,0.05)',
            color: answerState.answered ? 'white' : 'rgba(255,255,255,0.3)',
            cursor: answerState.answered ? 'pointer' : 'not-allowed',
            boxShadow: answerState.answered ? '0 0 20px rgba(124,77,255,0.3)' : 'none',
          }}
        >
          {currentIndex < totalQuestions - 1 ? 'Câu hỏi tiếp theo' : 'Hoàn thành'}
          <RightOutlined style={{ fontSize: 14 }} />
        </button>
      </div>

      <KMateMascot />
    </div>
  );
}

// ─── Quiz List View ────────────────────────────────────────────────────────────

function QuizListView({ onSelectQuiz }: { onSelectQuiz: (quiz: QuizCard) => void }) {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white">
            Luyện tập{' '}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Quiz
            </span>
          </h1>
          <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
            <QuestionOutlined className="text-primary" />
            Kiểm tra kiến thức từ các video gần đây.
          </p>
        </div>
        {/* Mascot tip */}
        <div
          className="flex items-center gap-4 p-4 rounded-2xl"
          style={{ background: 'rgba(11,11,15,0.8)', border: '1px solid rgba(0,229,255,0.1)' }}
        >
          <div className="relative w-16 h-16 flex-shrink-0">
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse blur-xl" />
            <div className="relative w-16 h-16 rounded-full border border-primary/40 bg-primary/10 flex items-center justify-center overflow-hidden">
              <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="8" y="14" width="24" height="20" rx="4" fill="#7C4DFF" />
                <rect x="12" y="8" width="16" height="8" rx="3" fill="#00e5ff" />
                <circle cx="15" cy="22" r="2" fill="#00e5ff" />
                <circle cx="25" cy="22" r="2" fill="#00e5ff" />
                <rect x="17" y="27" width="6" height="2" rx="1" fill="#ffffff" opacity="0.8" />
                <circle cx="20" cy="5" r="2" fill="#f59e0b" />
              </svg>
            </div>
          </div>
          <div>
            <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1">
              AI MATE đang theo dõi
            </p>
            <p className="text-xs text-slate-300">Bạn đang làm rất tốt, giữ vững nhé!</p>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <StatsBar />

      {/* Quiz grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {QUIZZES.map((quiz) => (
          <QuizCard
            key={quiz.id}
            quiz={quiz}
            onStart={() => onSelectQuiz(quiz)}
            onReview={() => onSelectQuiz(quiz)}
          />
        ))}
      </div>

      {/* Decorative blob */}
      <div className="pointer-events-none fixed -bottom-20 -right-20 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
      <div className="pointer-events-none fixed -top-20 -left-20 h-[500px] w-[500px] rounded-full bg-secondary/5 blur-[120px]" />
    </div>
  );
}

// ─── Main Page Component ─────────────────────────────────────────────────────

export default function UserQuizPage() {
  const [activeQuiz, setActiveQuiz] = useState<QuizCard | null>(null);

  return (
    <div className="p-6 lg:p-10 min-h-full bg-gradient-cyber">
      {activeQuiz ? (
        <QuizDetailView quiz={activeQuiz} onBack={() => setActiveQuiz(null)} />
      ) : (
        <QuizListView onSelectQuiz={setActiveQuiz} />
      )}
    </div>
  );
}
