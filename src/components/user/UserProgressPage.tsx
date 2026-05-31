'use client';

import { Button } from 'antd';
import {
  FireOutlined,
  ThunderboltOutlined,
  TranslationOutlined,
  PlayCircleOutlined,
  ShareAltOutlined,
  BarChartOutlined,
  StarOutlined,
  AimOutlined,
  PlaySquareOutlined,
  BulbOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';

// ─── Types ────────────────────────────────────────────────────────────────────

interface StatCard {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  shadowClass: string;
  progress?: number;
  progressColor?: string;
}

interface Achievement {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  borderColor: string;
  iconBgColor: string;
  iconColor: string;
  daysAgo?: string;
}

// ─── Weekly Chart Data ────────────────────────────────────────────────────────

const WEEKLY_DATA = [
  { day: 'Mon', words: 30, videos: 1 },
  { day: 'Tue', words: 45, videos: 0 },
  { day: 'Wed', words: 20, videos: 2 },
  { day: 'Thu', words: 60, videos: 1 },
  { day: 'Fri', words: 35, videos: 1 },
  { day: 'Sat', words: 50, videos: 2 },
  { day: 'Sun', words: 40, videos: 1 },
];

const CHART_WIDTH = 560;
const CHART_HEIGHT = 180;
const PADDING = { top: 20, right: 20, bottom: 30, left: 10 };

function buildAreaPath(data: number[], maxVal: number): string {
  const w = CHART_WIDTH - PADDING.left - PADDING.right;
  const h = CHART_HEIGHT - PADDING.top - PADDING.bottom;
  const stepX = w / (data.length - 1);

  const points = data.map((v, i) => ({
    x: PADDING.left + i * stepX,
    y: PADDING.top + h - (v / maxVal) * h,
  }));

  const linePath = points
    .map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`))
    .join(' ');

  const areaPath =
    linePath +
    ` L ${points[points.length - 1].x},${CHART_HEIGHT - PADDING.bottom}` +
    ` L ${PADDING.left},${CHART_HEIGHT - PADDING.bottom} Z`;

  return areaPath;
}

function WeeklyChart() {
  const wordsData = WEEKLY_DATA.map((d) => d.words);
  const videosData = WEEKLY_DATA.map((d) => d.videos * 20); // scale videos to words space
  const maxVal = Math.max(...wordsData, ...videosData) * 1.2;

  const wordsArea = buildAreaPath(wordsData, maxVal);
  const videosPath = (() => {
    const w = CHART_WIDTH - PADDING.left - PADDING.right;
    const h = CHART_HEIGHT - PADDING.top - PADDING.bottom;
    const stepX = w / (WEEKLY_DATA.length - 1);
    return videosData
      .map((v, i) => ({
        x: PADDING.left + i * stepX,
        y: PADDING.top + h - (v / maxVal) * h,
      }))
      .map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`))
      .join(' ');
  })();

  // Dot positions for words line
  const wordDots = wordsData.map((v, i) => {
    const w = CHART_WIDTH - PADDING.left - PADDING.right;
    const h = CHART_HEIGHT - PADDING.top - PADDING.bottom;
    const stepX = w / (wordsData.length - 1);
    return {
      x: PADDING.left + i * stepX,
      y: PADDING.top + h - (v / maxVal) * h,
    };
  });

  return (
    <div className="relative w-full overflow-hidden">
      <svg
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        className="w-full h-56"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="gradient-words" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#00e5ff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="gradient-videos" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7c4dff" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#7c4dff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map((frac) => {
          const y = PADDING.top + (CHART_HEIGHT - PADDING.top - PADDING.bottom) * (1 - frac);
          return (
            <line
              key={frac}
              x1={PADDING.left}
              y1={y}
              x2={CHART_WIDTH - PADDING.right}
              y2={y}
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="1"
            />
          );
        })}

        {/* Words area fill */}
        <path d={wordsArea} fill="url(#gradient-words)" />

        {/* Videos area fill */}
        <path
          d={
            videosPath +
            ` L ${CHART_WIDTH - PADDING.right},${CHART_HEIGHT - PADDING.bottom}` +
            ` L ${PADDING.left},${CHART_HEIGHT - PADDING.bottom} Z`
          }
          fill="url(#gradient-videos)"
        />

        {/* Videos line (dashed) */}
        <path
          d={videosPath}
          fill="none"
          stroke="#7c4dff"
          strokeWidth="2"
          strokeDasharray="6,4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Words line */}
        <path
          d={wordsData
            .map((v, i) => {
              const w = CHART_WIDTH - PADDING.left - PADDING.right;
              const h = CHART_HEIGHT - PADDING.top - PADDING.bottom;
              const stepX = w / (wordsData.length - 1);
              const x = PADDING.left + i * stepX;
              const y = PADDING.top + h - (v / maxVal) * h;
              return i === 0 ? `M ${x},${y}` : `L ${x},${y}`;
            })
            .join(' ')}
          fill="none"
          stroke="#00e5ff"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Word dots */}
        {wordDots.map((dot, i) => (
          <circle
            key={i}
            cx={dot.x}
            cy={dot.y}
            r="4"
            fill="#00e5ff"
            stroke="#0B0B0F"
            strokeWidth="2"
          />
        ))}

        {/* X-axis labels */}
        {WEEKLY_DATA.map((d, i) => {
          const w = CHART_WIDTH - PADDING.left - PADDING.right;
          const stepX = w / (WEEKLY_DATA.length - 1);
          const x = PADDING.left + i * stepX;
          return (
            <text
              key={d.day}
              x={x}
              y={CHART_HEIGHT - 4}
              textAnchor="middle"
              fill="#64748b"
              fontSize="10"
              fontWeight="bold"
              className="uppercase"
            >
              {d.day}
            </text>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-3 px-1">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-primary" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Words</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-secondary" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Videos</span>
        </div>
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ stat, index }: { stat: StatCard; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className={`user-glass-card relative group overflow-hidden rounded-2xl p-6 hover:border-primary/40 transition-all cursor-default ${stat.shadowClass}`}
      style={{ borderColor: stat.borderColor }}
    >
      <div
        className="absolute top-0 right-0 w-24 h-24 opacity-10 blur-2xl rounded-full"
        style={{ backgroundColor: stat.color }}
      />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">{stat.label}</p>
          <p className="text-3xl font-black text-white mt-1">{stat.value}</p>
          {stat.progress !== undefined && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs font-bold" style={{ color: stat.color }}>
                +{stat.sub}
              </span>
              <div className="h-1 flex-1 rounded-full bg-white/5 overflow-hidden max-w-[80px]">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${stat.progress}%`, backgroundColor: stat.color }}
                />
              </div>
            </div>
          )}
        </div>
        <div
          className="rounded-xl p-2"
          style={{ backgroundColor: stat.bgColor, color: stat.color }}
        >
          {stat.icon}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Achievement Card ─────────────────────────────────────────────────────────

function AchievementCard({ achievement, index }: { achievement: Achievement; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 + index * 0.08, duration: 0.4 }}
      className="flex items-center gap-4 rounded-2xl user-glass-card p-4 border-l-4"
      style={{ borderLeftColor: achievement.borderColor }}
    >
      <div
        className="flex h-12 w-12 items-center justify-center rounded-full"
        style={{ backgroundColor: achievement.iconBgColor, color: achievement.iconColor }}
      >
        {achievement.icon}
      </div>
      <div>
        <h4 className="text-sm font-bold text-white">{achievement.title}</h4>
        <p className="text-[11px] text-slate-500">{achievement.daysAgo}</p>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function UserProgressPage() {
  const stats: StatCard[] = [
    {
      label: 'Chuỗi ngày',
      value: '15 Ngày',
      sub: '+2 hôm nay',
      icon: <FireOutlined style={{ fontSize: 28 }} />,
      color: '#00e5ff',
      bgColor: 'rgba(0, 229, 255, 0.2)',
      borderColor: 'rgba(0, 229, 255, 0.4)',
      shadowClass: 'user-neon-blue',
      progress: 75,
      progressColor: '#00e5ff',
    },
    {
      label: 'XP Tích lũy',
      value: '2,450',
      sub: 'Cấp 12',
      icon: <ThunderboltOutlined style={{ fontSize: 28 }} />,
      color: '#7c4dff',
      bgColor: 'rgba(124, 77, 255, 0.2)',
      borderColor: 'rgba(124, 77, 255, 0.4)',
      shadowClass: 'user-neon-purple',
      progress: 45,
      progressColor: '#7c4dff',
    },
    {
      label: 'Từ đã học',
      value: '420',
      sub: '65% tới HSK 2',
      icon: <TranslationOutlined style={{ fontSize: 28 }} />,
      color: '#00e5ff',
      bgColor: 'rgba(0, 229, 255, 0.2)',
      borderColor: 'rgba(0, 229, 255, 0.4)',
      shadowClass: '',
      progress: 65,
      progressColor: '#00e5ff',
    },
    {
      label: 'Video đã xem',
      value: '12',
      sub: '4.5 giờ đã xem',
      icon: <PlayCircleOutlined style={{ fontSize: 28 }} />,
      color: '#7c4dff',
      bgColor: 'rgba(124, 77, 255, 0.2)',
      borderColor: 'rgba(124, 77, 255, 0.4)',
      shadowClass: '',
      progress: 40,
      progressColor: '#7c4dff',
    },
  ];

  const achievements: Achievement[] = [
    {
      id: 'streak-7',
      icon: <StarOutlined style={{ fontSize: 20 }} />,
      title: '7 Day Streak',
      subtitle: 'Unlocked 2 days ago',
      daysAgo: 'Unlocked 2 ngày trước',
      borderColor: '#7c4dff',
      iconBgColor: 'rgba(124, 77, 255, 0.2)',
      iconColor: '#7c4dff',
    },
    {
      id: 'words-100',
      icon: <AimOutlined style={{ fontSize: 20 }} />,
      title: '100 Words Learned',
      subtitle: 'Unlocked 1 week ago',
      daysAgo: 'Unlocked 1 tuần trước',
      borderColor: '#00e5ff',
      iconBgColor: 'rgba(0, 229, 255, 0.2)',
      iconColor: '#00e5ff',
    },
    {
      id: 'videos-10',
      icon: <PlaySquareOutlined style={{ fontSize: 20 }} />,
      title: '10 Videos Completed',
      subtitle: 'Unlocked yesterday',
      daysAgo: 'Unlocked hôm qua',
      borderColor: '#7c4dff',
      iconBgColor: 'rgba(124, 77, 255, 0.2)',
      iconColor: '#7c4dff',
    },
  ];

  return (
    <div className="p-6 lg:p-10 min-h-full bg-gradient-cyber space-y-10">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white">
            Tiến độ{' '}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Học tập
            </span>
          </h1>
          <p className="mt-2 text-slate-400 text-sm">
            Theo dõi hành trình học tiếng Hàn của bạn qua tất cả các module.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            icon={<ShareAltOutlined />}
            className="!bg-white/5 !text-white !border !border-white/10 !font-bold !rounded-xl hover:!bg-white/10 transition-all !text-sm !flex !items-center !gap-2"
          >
            Chia sẻ
          </Button>
          <Button
            type="primary"
            icon={<BarChartOutlined />}
            className="!font-bold !rounded-xl !text-sm !flex !items-center !gap-2"
          >
            Tạo Báo cáo
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <StatCard key={stat.label} stat={stat} index={i} />
        ))}
      </div>

      {/* Chart & Vocabulary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="lg:col-span-2 rounded-2xl user-glass-card p-6 border border-white/5 relative overflow-hidden"
        >
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Hoạt động học tập tuần này</h3>
          </div>
          <WeeklyChart />
        </motion.div>

        {/* Right column: Vocabulary + Mate Tip */}
        <div className="flex flex-col gap-6">
          {/* Vocabulary Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="rounded-2xl user-glass-card p-6 relative overflow-hidden"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-primary">
                  <path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white uppercase tracking-tight">Từ vựng</h3>
            </div>

            <div className="mb-3 flex items-end justify-between">
              <span className="text-4xl font-black text-white">120</span>
              <span className="text-sm font-medium text-slate-400">Words Mastered</span>
            </div>

            <div className="h-2 w-full rounded-full bg-white/5 mb-4 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: '28%',
                  background: 'linear-gradient(90deg, #00e5ff, #7c4dff)',
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-white/5 p-3">
                <p className="text-[10px] font-bold text-slate-500 uppercase">Cần ôn</p>
                <p className="text-lg font-bold text-white">45</p>
              </div>
              <div className="rounded-xl bg-white/5 p-3">
                <p className="text-[10px] font-bold text-slate-500 uppercase">Đang học</p>
                <p className="text-lg font-bold text-white">255</p>
              </div>
            </div>
          </motion.div>

          {/* Mate Tip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 p-5 relative border border-white/10 group overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-40 group-hover:scale-125 transition-transform">
              <BulbOutlined style={{ fontSize: 32, color: '#00e5ff' }} />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">MATE Tip</h4>
            <p className="text-xs text-slate-300 leading-relaxed pr-8">
              Học từ vựng chủ đề &quot;Gyeolhon&quot; hôm nay? Bạn đã học 8 từ liên quan rồi đấy!
            </p>
          </motion.div>
        </div>
      </div>

      {/* Achievements Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-2xl font-black text-white tracking-tight">
            Thành tựu{' '}
            <span className="text-secondary tracking-widest uppercase text-lg font-bold">Gần đây</span>
          </h3>
          <button className="text-sm font-bold text-primary hover:underline !bg-transparent border-0 cursor-pointer">
            Xem tất cả
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((a, i) => (
            <AchievementCard key={a.id} achievement={a} index={i} />
          ))}
        </div>
      </motion.div>

      {/* Decorative floating blobs */}
      <div className="pointer-events-none fixed -bottom-20 -right-20 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
      <div className="pointer-events-none fixed -top-20 -left-20 h-[500px] w-[500px] rounded-full bg-secondary/5 blur-[120px]" />
    </div>
  );
}
