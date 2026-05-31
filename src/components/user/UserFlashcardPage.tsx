'use client';

import { useState, useCallback } from 'react';
import { Button, Progress } from 'antd';
import {
  ArrowLeftOutlined,
  FireOutlined,
  SoundOutlined,
  CheckCircleOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import Image from 'next/image';

// ─── Types ────────────────────────────────────────────────────────────────────

type Rating = 'again' | 'hard' | 'good' | 'easy';

interface Flashcard {
  id: number;
  word: string;
  reading: string;
  meaning: string;
  phonetic: string;
}

interface Deck {
  id: string;
  name: string;
  level: string;
  levelNum: number;
  description: string;
  color: string;
  cardCount: number;
  dueCount: number;
  progress: number;
  cards: Flashcard[];
}

// ─── Sample Data ─────────────────────────────────────────────────────────────

const DECKS: Deck[] = [
  {
    id: 'basic',
    name: 'Giao tiếp cơ bản',
    level: 'Sơ cấp',
    levelNum: 1,
    description: 'Xin chào, tạm biệt, cảm ơn... Những lời chào đầu tiên.',
    color: '#00e5ff',
    cardCount: 15,
    dueCount: 12,
    progress: 65,
    cards: [
      { id: 1, word: '안녕하세요', reading: 'annyeonghaseyo', meaning: 'Xin chào (chào hỏi)', phonetic: 'An-nyông-ha-sê-yô' },
      { id: 2, word: '감사합니다', reading: 'gamsahamnida', meaning: 'Cảm ơn (trang trọng)', phonetic: 'Kam-sa-ham-ni-da' },
      { id: 3, word: '네', reading: 'ne', meaning: 'Vâng / Có', phonetic: 'Nê' },
      { id: 4, word: '아니요', reading: 'aniya', meaning: 'Không', phonetic: 'A-ni-yô' },
      { id: 5, word: '이름이 뭐예요?', reading: 'ireumi mwoyeyo', meaning: 'Tên bạn là gì?', phonetic: 'I-rêu-mi mô-yê-yô' },
      { id: 6, word: '만나서 반갑습니다', reading: 'mannaseo bangapseumnida', meaning: 'Rất vui được gặp bạn', phonetic: 'Man-na-sô bang-ap-sŭm-ni-da' },
      { id: 7, word: '잘 지내요?', reading: 'jal jinaeyo', meaning: 'Bạn khỏe không?', phonetic: 'Chan chi-nê-yô' },
      { id: 8, word: '네, 잘 지내요', reading: 'ne, jal jinaeyo', meaning: 'Vâng, khỏe', phonetic: 'Nê, chan chi-nê-yô' },
      { id: 9, word: '미안합니다', reading: 'mianhamnida', meaning: 'Xin lỗi', phonetic: 'Mi-an-ham-ni-da' },
      { id: 10, word: '괜찮아요', reading: 'gwaenchanayo', meaning: 'Không sao', phonetic: 'Kwên-chan-a-yô' },
      { id: 11, word: '안녕히 가세요', reading: 'annyeonghi gaseyo', meaning: 'Tạm biệt (người đi)', phonetic: 'An-nyông-hi ga-sê-yô' },
      { id: 12, word: '안녕히 계세요', reading: 'annyeonghi gyeseyo', meaning: 'Tạm biệt (người ở lại)', phonetic: 'An-nyông-hi kiê-sê-yô' },
      { id: 13, word: '어떻게 지내요?', reading: 'eotteoke jinaeyo', meaning: 'Bạn đang sống thế nào?', phonetic: 'Ô-ttô-khê chi-nê-yô' },
      { id: 14, word: '열심히 해요', reading: 'yeolsimhi haeyo', meaning: 'Làm việc chăm chỉ', phonetic: 'Yôl-sim-hi hê-yô' },
      { id: 15, word: '좋아요', reading: 'joayo', meaning: 'Tốt / Hay', phonetic: 'Chô-a-yô' },
    ],
  },
  {
    id: 'daily',
    name: 'Cuộc sống hàng ngày',
    level: 'Trung cấp',
    levelNum: 2,
    description: 'Ăn uống, sinh hoạt, giao tiếp trong đời thường.',
    color: '#7c4dff',
    cardCount: 15,
    dueCount: 8,
    progress: 40,
    cards: [
      { id: 1, word: '식사하셨어요?', reading: 'siksahasyeosseoyo', meaning: 'Bạn đã ăn chưa?', phonetic: 'Sik-sa-ha-syô-ssô-yô' },
      { id: 2, word: '뭐 먹을래요?', reading: 'mwo meogeullyeyo', meaning: 'Bạn muốn ăn gì?', phonetic: 'Mô mô-gŭl-lê-yô' },
      { id: 3, word: '맛있어요', reading: 'mas-isseoyo', meaning: 'Ngon', phonetic: 'Ma-ssi-ssô-yô' },
      { id: 4, word: '커피 한 잔 할래요?', reading: 'keopi han jan hallwey', meaning: 'Bạn có muốn uống cà phê không?', phonetic: 'Khô-pi han chan hal-lê-yô' },
      { id: 5, word: '몇 시에 일어나요?', reading: 'myeot si-e il-eona', meaning: 'Bạn thức dậy lúc mấy giờ?', phonetic: 'Myôt si-ê il-ê-na' },
      { id: 6, word: '퇴근했어요', reading: 'toegeun-haesseoyo', meaning: 'Tôi đã tan làm', phonetic: 'Thôê-gŭn hê-ssô-yô' },
      { id: 7, word: '오늘 일정이 뭐예요?', reading: 'oneul iljungi mwoyey', meaning: 'Lịch trình hôm nay của bạn là gì?', phonetic: 'Ô-nŭl il-chun-gi mô-yê' },
      { id: 8, word: '약속할게요', reading: 'yaksok-halgeyo', meaning: 'Tôi sẽ hứa', phonetic: 'Yak-sok hal-kê-yô' },
      { id: 9, word: '시간 없어요', reading: 'sikan eopsseo', meaning: 'Tôi không có thời gian', phonetic: 'Si-kan ôp-ssô' },
      { id: 10, word: '기다려요', reading: 'gidaelyeo', meaning: 'Tôi đợi', phonetic: 'Ki-da-ryô' },
      { id: 11, word: '도와주세요', reading: 'dowajuseyo', meaning: 'Hãy giúp tôi', phonetic: 'To-wa-chu-sê-yô' },
      { id: 12, word: '이거 뭐예요?', reading: 'igeo mwoyeyo', meaning: 'Đây là gì?', phonetic: 'I-gô mô-yê-yô' },
      { id: 13, word: '얼마예요?', reading: 'eolmayeyo', meaning: 'Bao nhiêu tiền?', phonetic: 'Ôl-ma-yê-yô' },
      { id: 14, word: '길이 어디예요?', reading: 'giri eodi-eyo', meaning: 'Đường ở đâu?', phonetic: 'Ki-ri ô-di-ê-yô' },
      { id: 15, word: '한국어 어려워요', reading: 'hangugeo eoryeowoyo', meaning: 'Tiếng Hàn khó', phonetic: 'Han-guk-ô ô-ryô-wô-yô' },
    ],
  },
  {
    id: 'honorific',
    name: 'Kính ngữ & Văn phòng',
    level: 'Cao cấp',
    levelNum: 3,
    description: 'Thành thạo đuôi kính ngữ trong môi trường công sở.',
    color: '#f59e0b',
    cardCount: 15,
    dueCount: 5,
    progress: 20,
    cards: [
      { id: 1, word: '존댓말을 써야 해요', reading: 'jondaenmareul sseoya haeyo', meaning: 'Bạn cần dùng lời nói tôn kính', phonetic: 'Chôn-dên-ma-rŭl ssô-ya hê-yô' },
      { id: 2, word: '사장님께 보고드릴게요', reading: 'sajangnim-kke bododeuril-k', meaning: 'Tôi sẽ báo cáo với giám đốc', phonetic: 'Sa-chang-nim-kkê po-to-dŭ-ril-kê-yô' },
      { id: 3, word: '이건 제가 결정할 수 없어요', reading: 'igeon jega gyeoljeonghal', meaning: 'Tôi không thể quyết định được', phonetic: 'I-gôn chê-ga kyôl-chông-hal su ốp-ssô-yô' },
      { id: 4, word: '말씀하시겠어요', reading: 'malsseumhasigesseoyo', meaning: 'Ông/bà sẽ nói', phonetic: 'Mal-ssŭm-ha-si-gê-ssô-yô' },
      { id: 5, word: '어떻게 하시면 될까요?', reading: 'eotteoke hasimyeon doelkkayo', meaning: 'Làm thế nào cho đây?', phonetic: 'Ô-ttô-khê ha-si-myôn tôil-kka-yô' },
      { id: 6, word: '참석해 주셔서 감사합니다', reading: 'chamsokhae jusyeoseo', meaning: 'Cảm ơn vì đã tham dự', phonetic: 'Cham-sok-hê chu-syô-sô kam-sa-ham-ni-da' },
      { id: 7, word: '양해해 주세요', reading: 'yanghaehae juseyo', meaning: 'Xin hãy thông cảm', phonetic: 'Yang-hê-hê chu-sê-yô' },
      { id: 8, word: '건의사항이 있으시면 말씀하세요', reading: 'geoni-sahng-i isseumyeon', meaning: 'Nếu có ý kiến đề xuất, xin hãy nói', phonetic: 'Kô-ni-sa-hng-i i-ssŭm-myôn' },
      { id: 9, word: '정말 죄송합니다', reading: 'jeongmal joesonghamnida', meaning: 'Tôi rất xin lỗi', phonetic: 'Chông-mal chô-song-ham-ni-da' },
      { id: 10, word: '확인해 드릴게요', reading: 'hwaginhae deuril-k', meaning: 'Tôi sẽ kiểm tra cho', phonetic: 'Hwa-kin-hê tŭ-ril-kê-yô' },
      { id: 11, word: '예약해 두었어요', reading: 'yeyakhae du-eosseoyo', meaning: 'Tôi đã đặt trước', phonetic: 'Yê-yak-hê tu-ô-ssô-yô' },
      { id: 12, word: '진심으로 감사드립니다', reading: 'jinsim-euro gamsadeuripnida', meaning: 'Tôi chân thành cảm ơn', phonetic: 'Chin-sim-ŭ-ro kam-sa-dŭ-rip-ni-da' },
      { id: 13, word: '보고서를 제출합니다', reading: 'bogoseo-reul chechulhamnida', meaning: 'Tôi xin nộp báo cáo', phonetic: 'Po-gô-sô-rŭl chê-chul-ham-ni-da' },
      { id: 14, word: '회의는 내일로 미뤄요', reading: 'hoeui-neun naeillo miuoyo', meaning: 'Cuộc họp hoãn sang ngày mai', phonetic: 'Hôê-ui-nŭn nê-il-lo mi-u-yô' },
      { id: 15, word: '도와주셔서 대단히 감사합니다', reading: 'dowajusyeoseo daehani', meaning: 'Rất cảm ơn vì đã giúp đỡ', phonetic: 'To-wa-chu-syô-sô tê-ha-ni' },
    ],
  },
];

const RATING_CONFIG: Record<Rating, { label: string; sub: string; color: string; bgColor: string; borderColor: string }> = {
  again: { label: 'Lại', sub: '1m', color: '#ef4444', bgColor: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.3)' },
  hard:  { label: 'Khó', sub: '6m', color: '#f97316', bgColor: 'rgba(249,115,22,0.1)', borderColor: 'rgba(249,115,22,0.3)' },
  good:  { label: 'Tốt', sub: '1d', color: '#22c55e', bgColor: 'rgba(34,197,94,0.1)', borderColor: 'rgba(34,197,94,0.3)' },
  easy:  { label: 'Dễ',  sub: '4d', color: '#00e5ff', bgColor: 'rgba(0,229,255,0.1)', borderColor: 'rgba(0,229,255,0.3)' },
};

// ─── Mascot Component ─────────────────────────────────────────────────────────

const KMATE_MASCOT_MESSAGES = [
  'Bạn làm tốt lắm! Tiến lên nào!',
  'Giỏi quá! Học tiếp thôi!',
  'Tuyệt vời! Bạn đang tiến bộ rất nhanh!',
  'Chính xác! Hãy giữ nhịp đều nhé!',
];

function KMateMascot({ message }: { message?: string }) {
  const displayMessage = message ?? KMATE_MASCOT_MESSAGES[Math.floor(Math.random() * KMATE_MASCOT_MESSAGES.length)];

  return (
    <div className="fixed bottom-8 right-8 z-40 flex flex-col items-end gap-2 animate-fade-in">
      {/* Speech bubble */}
      <div className="relative bg-white/10 backdrop-blur-md border border-primary/30 rounded-2xl px-4 py-3 max-w-[220px] shadow-lg">
        <div className="absolute -right-2 bottom-4 w-4 h-4 bg-white/10 border-r border-b border-primary/30 rotate-45 transform translate-y-1" />
        <p className="text-xs text-white leading-relaxed font-medium relative z-10">
          {displayMessage}
        </p>
      </div>

      {/* Robot image */}
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

// ─── Rating Button ────────────────────────────────────────────────────────────

function RatingButton({ rating, onClick }: { rating: Rating; onClick: () => void }) {
  const config = RATING_CONFIG[rating];

  return (
    <button
      onClick={onClick}
      className="flex-1 flex flex-col items-center justify-center py-4 rounded-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
      style={{
        backgroundColor: config.bgColor,
        border: `1px solid ${config.borderColor}`,
        color: config.color,
      }}
    >
      <span className="text-sm font-bold">{config.label}</span>
      <span className="text-[10px] opacity-70 mt-0.5">{config.sub}</span>
    </button>
  );
}

// ─── Flashcard Component ──────────────────────────────────────────────────────

function FlashcardDisplay({
  card,
  isRevealed,
  onReveal,
}: {
  card: Flashcard;
  isRevealed: boolean;
  onReveal: () => void;
}) {
  return (
    <div className="w-full flex flex-col items-center gap-4">
      {/* Card body */}
      <div
        className="relative w-full max-w-lg user-glass-card p-10 flex flex-col items-center gap-3 select-none"
        style={{ borderColor: 'rgba(124, 77, 255, 0.3)', minHeight: 240 }}
      >
        {/* Decorative glow */}
        <div
          className="absolute inset-0 opacity-20 rounded-2xl pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(124,77,255,0.3) 0%, transparent 70%)',
          }}
        />

        {/* Korean word */}
        <span
          className="text-6xl font-korean font-bold text-white relative z-10 text-center leading-none"
          style={{ textShadow: '0 0 20px rgba(124,77,255,0.4)' }}
        >
          {card.word}
        </span>

        {/* Reading */}
        <span className="text-lg text-slate-300 relative z-10 font-mono tracking-wide">
          /{card.reading}/
        </span>

        {/* Phonetic guide */}
        <span className="text-xs text-slate-500 relative z-10 italic">
          {card.phonetic}
        </span>

        {/* Meaning reveal */}
        <div
          className={`w-full mt-2 overflow-hidden transition-all duration-500 ease-in-out ${isRevealed ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <div
            className="mt-4 pt-4 border-t border-white/10 flex flex-col items-center gap-1"
            style={{ borderColor: 'rgba(124, 77, 255, 0.2)' }}
          >
            <span className="text-xs font-bold text-primary uppercase tracking-wider">Nghĩa</span>
            <span className="text-xl font-semibold text-white text-center">{card.meaning}</span>
          </div>
        </div>
      </div>

      {/* Reveal button */}
      {!isRevealed && (
        <Button
          type="primary"
          size="large"
          onClick={onReveal}
          className="!bg-primary/20 !text-primary !border !border-primary/30 !font-bold !rounded-2xl !px-8 hover:!bg-primary/30 hover:!scale-105 active:!scale-95 transition-all"
        >
          XEM NGHĨA
        </Button>
      )}

      {/* Sound button */}
      <Button
        type="text"
        icon={<SoundOutlined className="text-slate-400 text-lg" />}
        className="!text-slate-400 hover:!text-white transition-colors !p-2 !rounded-full hover:!bg-white/5"
        onClick={() => {}}
        title="Phát âm"
      />
    </div>
  );
}

// ─── Deck Card ────────────────────────────────────────────────────────────────

function DeckCard({ deck, onStart }: { deck: Deck; onStart: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="user-glass-card p-6 flex flex-col gap-4 cursor-pointer transition-all duration-300"
      style={{
        borderColor: hovered ? deck.color + '60' : 'rgba(255,255,255,0.1)',
        boxShadow: hovered ? `0 0 20px ${deck.color}30` : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onStart}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: deck.color, boxShadow: `0 0 8px ${deck.color}80` }}
          />
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
            style={{ color: deck.color, backgroundColor: deck.color + '15' }}
          >
            {deck.level}
          </span>
        </div>
        <span className="text-xs text-slate-400">{deck.cardCount} thẻ</span>
      </div>

      {/* Title & description */}
      <div>
        <h3 className="text-lg font-bold text-white mb-1">{deck.name}</h3>
        <p className="text-sm text-slate-400 leading-relaxed">{deck.description}</p>
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">Tiến độ</span>
          <span className="text-xs font-bold" style={{ color: deck.color }}>
            {deck.progress}%
          </span>
        </div>
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${deck.progress}%`,
              background: `linear-gradient(90deg, ${deck.color}80, ${deck.color})`,
              boxShadow: `0 0 8px ${deck.color}60`,
            }}
          />
        </div>
      </div>

      {/* Due & CTA */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
          <span className="text-xs text-slate-400">
            <span className="font-bold text-orange-400">{deck.dueCount}</span> cần ôn
          </span>
        </div>
        <button
          className="text-xs font-bold px-4 py-2 rounded-xl transition-all hover:scale-105 active:scale-95"
          style={{
            backgroundColor: deck.color + '20',
            color: deck.color,
            border: `1px solid ${deck.color}40`,
          }}
          onClick={(e) => { e.stopPropagation(); onStart(); }}
        >
          Bắt đầu ôn
        </button>
      </div>
    </div>
  );
}

// ─── Review Mode ──────────────────────────────────────────────────────────────

function ReviewMode({ deck, onBack }: { deck: Deck; onBack: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [sessionProgress, setSessionProgress] = useState(0);
  const [mascotMsg, setMascotMsg] = useState<string>();

  const totalCards = deck.cards.length;
  const currentCard = deck.cards[currentIndex];
  const streakDays = 7;
  const dueToday = deck.dueCount;
  const progressPercent = Math.round(((currentIndex + (completed ? 1 : 0)) / totalCards) * 100);

  const handleRating = useCallback((rating: Rating) => {
    setMascotMsg(RATING_CONFIG[rating].label === 'Lại' ? 'Đừng nản! Thử lại nhé!' : 'Tuyệt vời! Học tiếp nào!');
    setIsRevealed(false);

    if (currentIndex < totalCards - 1) {
      setCurrentIndex((i) => i + 1);
      setSessionProgress(Math.round(((currentIndex + 1) / totalCards) * 100));
    } else {
      setCompleted(true);
    }
  }, [currentIndex, totalCards]);

  if (completed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 animate-fade-in">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{ backgroundColor: deck.color + '20', border: `2px solid ${deck.color}40` }}
        >
          <CheckCircleOutlined style={{ fontSize: 48, color: deck.color }} />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-white">Hoàn thành!</h2>
          <p className="text-slate-400">Bạn đã ôn xong {totalCards} thẻ từ {deck.name}.</p>
        </div>
        <div className="flex gap-3">
          <Button
            size="large"
            onClick={() => { setCurrentIndex(0); setCompleted(false); setIsRevealed(false); setSessionProgress(0); }}
            icon={<ReloadOutlined />}
            className="!bg-white/5 !text-white !border !border-white/10 !font-bold !rounded-xl hover:!bg-white/10 transition-all"
          >
            Ôn lại
          </Button>
          <Button
            size="large"
            type="primary"
            onClick={onBack}
            className="!font-bold !rounded-xl"
          >
            Chọn bộ thẻ khác
          </Button>
        </div>
        <KMateMascot message="Chúc mừng bạn! Tuyệt vời lắm! 🎉" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 pb-8 animate-fade-in">
      {/* Review header */}
      <div className="w-full flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium !bg-transparent border-0 cursor-pointer"
        >
          <ArrowLeftOutlined />
          <span>Quay lại</span>
        </button>

        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <span
            className="text-xs font-bold uppercase px-2 py-0.5 rounded"
            style={{ color: deck.color, backgroundColor: deck.color + '15' }}
          >
            {deck.level}
          </span>
          {deck.name}
        </h2>

        {/* Streak badge */}
        <div className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-full">
          <FireOutlined className="text-orange-400 text-sm" style={{ color: '#f97316' }} />
          <span className="text-xs font-bold text-orange-400">{streakDays} Ngày liên tiếp!</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-lg space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Tiến độ hôm nay</span>
          <span className="font-bold text-white">
            {currentIndex + 1} / {totalCards} từ
          </span>
        </div>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progressPercent}%`,
              background: 'linear-gradient(90deg, #7C4DFF, #00e5ff)',
              boxShadow: '0 0 10px rgba(124,77,255,0.5)',
            }}
          />
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">{dueToday} thẻ cần ôn hôm nay</span>
          <span className="text-primary font-bold">{progressPercent}%</span>
        </div>
      </div>

      {/* Flashcard */}
      <FlashcardDisplay
        card={currentCard}
        isRevealed={isRevealed}
        onReveal={() => setIsRevealed(true)}
      />

      {/* Rating buttons (shown after reveal) */}
      <div
        className={`w-full max-w-lg flex gap-3 overflow-hidden transition-all duration-500 ease-in-out ${isRevealed ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        {(['again', 'hard', 'good', 'easy'] as Rating[]).map((rating) => (
          <RatingButton key={rating} rating={rating} onClick={() => handleRating(rating)} />
        ))}
      </div>

      {/* Mascot */}
      <KMateMascot message={mascotMsg} />
    </div>
  );
}

// ─── Deck List View ────────────────────────────────────────────────────────────

function DeckListView({ onSelectDeck }: { onSelectDeck: (deck: Deck) => void }) {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl lg:text-4xl font-extrabold text-white">
          Flashcard{' '}
          <span className="text-primary">Ôn tập</span>
        </h1>
        <p className="text-slate-400 text-sm">
          Chọn bộ thẻ phù hợp với trình độ của bạn để bắt đầu ôn tập từ vựng.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="user-glass-card p-4 flex flex-col items-center gap-1">
          <span className="text-2xl font-extrabold text-white">3</span>
          <span className="text-xs text-slate-400">Bộ thẻ</span>
        </div>
        <div className="user-glass-card p-4 flex flex-col items-center gap-1">
          <span className="text-2xl font-extrabold text-orange-400">25</span>
          <span className="text-xs text-slate-400">Cần ôn hôm nay</span>
        </div>
        <div className="user-glass-card p-4 flex flex-col items-center gap-1">
          <span className="text-2xl font-extrabold text-cyan-400">7</span>
          <span className="text-xs text-slate-400">Ngày liên tiếp 🔥</span>
        </div>
      </div>

      {/* Deck grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DECKS.map((deck) => (
          <DeckCard
            key={deck.id}
            deck={deck}
            onStart={() => onSelectDeck(deck)}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────────

export default function UserFlashcardPage() {
  const [activeDeck, setActiveDeck] = useState<Deck | null>(null);

  return (
    <div className="p-6 lg:p-10 min-h-full bg-gradient-cyber">
      {activeDeck ? (
        <ReviewMode deck={activeDeck} onBack={() => setActiveDeck(null)} />
      ) : (
        <DeckListView onSelectDeck={setActiveDeck} />
      )}
    </div>
  );
}
