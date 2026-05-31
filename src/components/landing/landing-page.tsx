'use client';

import Link from 'next/link';
import Image from 'next/image';
import imgKMATELOGO from '../../../assets/img/branding/KMATELOGO.png';
import imgBlackpink from '../../../assets/img/landing/blackpink.jpg';
import imgBts from '../../../assets/img/landing/bts.jpg';
import imgDescendants from '../../../assets/img/landing/Descendants_of_the_Sun.jpg';
import imgQueen from '../../../assets/img/landing/queen of tears.jpg';
import imgSnow from '../../../assets/img/landing/snow drop.jpeg';
import {
  Typography,
  Button,
  Row,
  Col,
  Layout,
  Avatar,
  Tag,
  Divider,
  Drawer,
} from 'antd';
import {
  ThunderboltOutlined,
  PlayCircleOutlined,
  SearchOutlined,
  BulbOutlined,
  FileTextOutlined,
  MessageOutlined,
  RocketOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
  StarFilled,
  GlobalOutlined,
  RobotOutlined,
  ClockCircleOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  FireOutlined,
  AimOutlined,
  BulbFilled,
  YoutubeOutlined,
  InstagramOutlined,
  TikTokOutlined,
  MenuOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import ReactSimplyCarousel from 'react-simply-carousel';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
const heroSlides = [
  {
    src: imgBts,
    alt: 'BTS - K-Pop',
    label: 'BTS',
    sublabel: 'K-POP IDOL',
  },
  {
    src: imgDescendants,
    alt: 'Descendants of the Sun',
    label: 'HẬU DUỆ MẶT TRỜI',
    sublabel: 'K-DRAMA',
  },
  {
    src: imgBlackpink,
    alt: 'BLACKPINK',
    label: 'BLACKPINK',
    sublabel: 'K-POP IDOL',
  },
  {
    src: imgQueen,
    alt: 'Queen of Tears',
    label: 'QUEEN OF TEARS',
    sublabel: 'K-DRAMA',
  },
  {
    src: imgSnow,
    alt: 'Snowdrop',
    label: 'SNOWDROP',
    sublabel: 'K-DRAMA',
  },
];

// ===== SLIDER COMPONENT =====
function HeroSlider({ onSlideChange }: { onSlideChange?: (idx: number) => void }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev: number) => {
        const next = (prev + 1) % heroSlides.length;
        onSlideChange?.(next);
        return next;
      });
    }, 5000);
    return () => clearInterval(timer);
  }, [onSlideChange]);

  const handleClick = (idx: number) => {
    setCurrent(idx);
    onSlideChange?.(idx);
  };

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden">
      {/* Main image — full bleed, sharp */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={heroSlides[current].src}
            alt={heroSlides[current].alt}
            fill
            className="object-cover"
            priority
          />
          {/* Subtle bottom gradient for text readability */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, rgba(11,11,15,0.15) 0%, transparent 30%, rgba(11,11,15,0.6) 100%)',
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Top-left label */}
      <motion.div
        key={`label-${current}`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="absolute top-5 left-5"
      >
        <div
          className="flex items-center gap-3 px-4 py-2 rounded-2xl"
          style={{ background: 'rgba(11,11,15,0.55)', border: '1px solid rgba(124,77,255,0.35)', backdropFilter: 'blur(16px)' }}
        >
          <span className="w-2 h-2 rounded-full" style={{ background: '#7C4DFF', boxShadow: '0 0 8px #7C4DFF' }} />
          <span className="text-white text-[10px] font-bold tracking-widest uppercase">
            {heroSlides[current].label}
          </span>
          <span style={{ color: 'rgba(124,77,255,0.5)' }}>·</span>
          <span className="text-white/50 text-[10px] tracking-wider">
            {heroSlides[current].sublabel}
          </span>
        </div>
      </motion.div>

      {/* Bottom-right dots */}
      <div className="absolute bottom-5 right-5 flex items-center gap-1.5">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className="transition-all duration-500 rounded-full"
            style={{
              width: i === current ? 28 : 6,
              height: 6,
              background: i === current ? '#7C4DFF' : 'rgba(255,255,255,0.3)',
              boxShadow: i === current ? '0 0 12px rgba(124,77,255,0.7)' : 'none',
              border: 'none',
              cursor: 'pointer',
            }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

const { Title, Text, Paragraph } = Typography;
const { Content, Footer } = Layout;

// ===== DATA =====
const howItWorksSteps = [
  {
    icon: <SearchOutlined />,
    title: 'Tìm Nội Dung',
    desc: 'Tìm kiếm & lựa chọn nội dung yêu thích từ K-Drama, K-Pop, Talk Show Hàn Quốc.',
  },
  {
    icon: <FileTextOutlined />,
    title: 'Phụ Đề AI',
    desc: 'Phụ đề thông minh tự động dịch, chú thích từ vựng & ngữ pháp trực tiếp.',
  },
  {
    icon: <BulbOutlined />,
    title: 'Tư Duy Thông Minh',
    desc: 'Phát âm chuẩn, ghi nhớ từ vựng qua ôn tập ngắt quãng & phản xạ nhanh.',
  },
  {
    icon: <RocketOutlined />,
    title: 'Thư Viện Đa Dạng',
    desc: 'Thư viện K-Drama, K-Pop, Travel Vlog. Cập nhật liên tục mỗi ngày.',
  },
];

const features = [
  {
    icon: <BulbFilled />,
    title: 'Tư Duy Thông Minh',
    desc: 'Phát triển tư duy ngôn ngữ tự nhiên, hiểu sâu ngữ cảnh & văn hóa Hàn.',
    tag: 'AI-POWERED',
  },
  {
    icon: <AimOutlined />,
    title: 'Phụ Đề Chính Xác',
    desc: 'Phụ đề tự động sinh, chú thích từ vựng, phân tích ngữ pháp trên từng câu.',
    tag: '98% ACCURATE',
  },
  {
    icon: <MessageOutlined />,
    title: 'Giao Tiếp Tự Tin',
    desc: 'Tự tin giao tiếp tiếng Hàn qua bài tập phản xạ, nghe và nói theo ngữ cảnh thực tế.',
    tag: 'SPEAK FLUENT',
  },
  {
    icon: <ClockCircleOutlined />,
    title: 'Mẹo Học Nhanh',
    desc: 'Mẹo và thủ thuật học nhanh, ghi nhớ từ vựng hiệu quả với chi phí thấp.',
    tag: '3X FASTER',
  },
  {
    icon: <FireOutlined />,
    title: 'Phản Xạ Nhanh',
    desc: 'Rèn luyện phản xạ ngôn ngữ tự nhiên, nâng cao khả năng nghe & hiểu nhanh.',
    tag: 'FAST TRACK',
  },
  {
    icon: <TrophyOutlined />,
    title: 'Tự Chuẩn Hóa',
    desc: 'Hệ thống tự đánh giá năng lực, lộ trình học cá nhân hóa theo trình độ.',
    tag: 'SMART SRS',
  },
];

const pricingPlans = [
  {
    name: 'Cơ Bản',
    price: '0',
    unit: 'VNĐ',
    period: '/vĩnh viễn',
    features: ['3 video mỗi ngày', 'Phụ đề tiêu chuẩn'],
    cta: 'Tìm Hiểu Ngay',
    highlight: false,
  },
  {
    name: 'Nạp Xu',
    price: '5k',
    unit: 'VNĐ',
    period: '/xu',
    features: ['1 xu / 1 giờ video', 'Đầy đủ tính năng AI'],
    cta: 'Tìm Hiểu Ngay',
    highlight: false,
  },
  {
    name: 'Tiêu Chuẩn',
    price: '49k',
    unit: 'VNĐ',
    period: '/15 xu',
    features: ['Tốt nhất cuối tuần', 'Không giới hạn thời gian'],
    cta: 'Tìm Hiểu Ngay',
    highlight: false,
  },
  {
    name: 'Premium',
    price: '99k',
    unit: 'VNĐ',
    period: '/35 xu',
    features: ['Gói Học Chuyên Sâu', 'Hỗ trợ AI ưu tiên', 'Chế độ ngoại tuyến'],
    cta: 'Tìm Hiểu Ngay',
    highlight: true,
  },
];

const testimonials = [
  {
    name: 'Mai Anh',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCu3xCnUNMgNAZWkHMH3Bues4ASHkrJ3s6vO43jcLyxjq10Ceax3jK1eqBQsI91nqBhjQpHIb0J_2F1zZEc9reD4zD_VijxH0mqAEUSQv-e_SEKWkJQC8ONp6Q85fgSoHAasliEELNrP_Tj3wQM9_MuKr2s2-VhNaGVxyXW6hwMZRYzZG_dcLSCgGdUSChRLmUVn_96W2wD5KW-cRkNCf9QdiBDtca-IzXsKe6j_G0bcD2u4AYGiRLiB_D0nKXvgWTaTGvCIyInOLeq',
    review: 'Cuối cùng tôi đã có thể xem phim của IU mà không cần chờ vietsub và thực sự học được điều gì đó!',
    role: 'Designer',
  },
  {
    name: 'Hoàng Nam',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnSds5ZRpvc1Ao6SOk7rQruK4pjJww2UX2LQDjPu93XSEzaaR64GMuhnnsJ-Z7fUZC5ieH5UjYmhPTW99I5CUJQNWu3ixuRKm0XmhKf2b6VHVcN2fA36CcpXKdk05gS1aXdSrPyQ9c7fNihV5B9jielrqoXsEFEIGr02HA2iVZ0-Q5efrpmxqZDpOjQlLzHdSGvm19a-92b-dmIWwXfYsvJwfknzmgnuxuL4e6ZzJ0sKpwzM0eQY7GaW-hE7n9Wq1sG_Za9oFZoBDd',
    review: 'Hệ thống flashcard rất gây nghiện. Tôi đã học được 500 từ trong một tháng chỉ bằng cách xem Running Man.',
    role: 'Developer',
  },
  {
    name: 'Lan Hương',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAiBMz7kBQqi7m_FVxnoMdBJ-ltjL3P-PL7cnT4V94XbE_yvfuDPtmdCe6tmNRQAkxsfwZ8jYO1ljYIEU1M49RC55HAtLRobbIVuJ1jlYR-qyv-OobM0T5cK1ilnb2DbMEcN9_nyt4yeV-cmQm--Qs7OAViYa-CT5ncwrcPu5MFSOZ6J4c3CuF4PgqS9xAo_WGeQ05T-bk48KFIBlCBG4ibqmmlhr0GV2aK523ieyoEfi6iljWpNGXOTz8svgTbEzLxNJn0j8Ick65S',
    review: 'Phụ đề AI cực kỳ chính xác. Ngay cả tiếng lóng và các trò đùa văn hóa cũng được giải thích hoàn hảo.',
    role: 'Content Creator',
  },
  {
    name: 'Minh Tuấn',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCu3xCnUNMgNAZWkHMH3Bues4ASHkrJ3s6vO43jcLyxjq10Ceax3jK1eqBQsI91nqBhjQpHIb0J_2F1zZEc9reD4zD_VijxH0mqAEUSQv-e_SEKWkJQC8ONp6Q85fgSoHAasliEELNrP_Tj3wQM9_MuKr2s2-VhNaGVxyXW6hwMZRYzZG_dcLSCgGdUSChRLmUVn_96W2wD5KW-cRkNCf9QdiBDtca-IzXsKe6j_G0bcD2u4AYGiRLiB_D0nKXvgWTaTGvCIyInOLeq',
    review: 'Tôi đã ghiền K-Drama từ lâu, giờ học tiếng Hàn mà không cảm thấy như đang học. Siêu thích!',
    role: 'Marketing',
  },
  {
    name: 'Thu Hà',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAiBMz7kBQqi7m_FVxnoMdBJ-ltjL3P-PL7cnT4V94XbE_yvfuDPtmdCe6tmNRQAkxsfwZ8jYO1ljYIEU1M49RC55HAtLRobbIVuJ1jlYR-qyv-OobM0T5cK1ilnb2DbMEcN9_nyt4yeV-cmQm--Qs7OAViYa-CT5ncwrcPu5MFSOZ6J4c3CuF4PgqS9xAo_WGeQ05T-bk48KFIBlCBG4ibqmmlhr0GV2aK523ieyoEfi6iljWpNGXOTz8svgTbEzLxNJn0j8Ick65S',
    review: 'Chế độ học chuyên sâu giúp tôi cải thiện kỹ năng nghe từng ngày. Kết quả ngoài mong đợi!',
    role: 'Giáo Viên',
  },
  {
    name: 'Đức Minh',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnSds5ZRpvc1Ao6SOk7rQruK4pjJww2UX2LQDjPu93XSEzaaR64GMuhnnsJ-Z7fUZC5ieH5UjYmhPTW99I5CUJQNWu3ixuRKm0XmhKf2b6VHVcN2fA36CcpXKdk05gS1aXdSrPyQ9c7fNihV5B9jielrqoXsEFEIGr02HA2iVZ0-Q5efrpmxqZDpOjQlLzHdSGvm19a-92b-dmIWwXfYsvJwfknzmgnuxuL4e6ZzJ0sKpwzM0eQY7GaW-hE7n9Wq1sG_Za9oFZoBDd',
    review: 'Kho video đa dạng từ K-Pop đến tin tức Hàn Quốc. Tôi học được cả từ vựng lẫn văn hóa.',
    role: 'Sinh Viên',
  },
  {
    name: 'Phương Linh',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCu3xCnUNMgNAZWkHMH3Bues4ASHkrJ3s6vO43jcLyxjq10Ceax3jK1eqBQsI91nqBhjQpHIb0J_2F1zZEc9reD4zD_VijxH0mqAEUSQv-e_SEKWkJQC8ONp6Q85fgSoHAasliEELNrP_Tj3wQM9_MuKr2s2-VhNaGVxyXW6hwMZRYzZG_dcLSCgGdUSChRLmUVn_96W2wD5KW-cRkNCf9QdiBDtca-IzXsKe6j_G0bcD2u4AYGiRLiB_D0nKXvgWTaTGvCIyInOLeq',
    review: 'Nạp Xu rất linh hoạt, tôi có thể học theo tốc độ riêng mà không bị giới hạn. App rất mượt.',
    role: 'Freelancer',
  },
  {
    name: 'Văn Bảo',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAiBMz7kBQqi7m_FVxnoMdBJ-ltjL3P-PL7cnT4V94XbE_yvfuDPtmdCe6tmNRQAkxsfwZ8jYO1ljYIEU1M49RC55HAtLRobbIVuJ1jlYR-qyv-OobM0T5cK1ilnb2DbMEcN9_nyt4yeV-cmQm--Qs7OAViYa-CT5ncwrcPu5MFSOZ6J4c3CuF4PgqS9xAo_WGeQ05T-bk48KFIBlCBG4ibqmmlhr0GV2aK523ieyoEfi6iljWpNGXOTz8svgTbEzLxNJn0j8Ick65S',
    review: 'Mỗi ngày tôi xem 3 video mới, sau 2 tháng vốn từ vựng tăng vượt bậc. Khuyên thật lòng!',
    role: 'Kế Toán',
  },
  {
    name: 'Khánh Vy',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnSds5ZRpvc1Ao6SOk7rQruK4pjJww2UX2LQDjPu93XSEzaaR64GMuhnnsJ-Z7fUZC5ieH5UjYmhPTW99I5CUJQNWu3ixuRKm0XmhKf2b6VHVcN2fA36CcpXKdk05gS1aXdSrPyQ9c7fNihV5B9jielrqoXsEFEIGr02HA2iVZ0-Q5efrpmxqZDpOjQlLzHdSGvm19a-92b-dmIWwXfYsvJwfknzmgnuxuL4e6ZzJ0sKpwzM0eQY7GaW-hE7n9Wq1sG_Za9oFZoBDd',
    review: 'Flashcard thông minh giúp tôi ghi nhớ từ vựng hiệu quả hơn bất kỳ app nào tôi từng dùng.',
    role: 'Nhân Viên',
  },
  {
    name: 'Quang Hùng',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCu3xCnUNMgNAZWkHMH3Bues4ASHkrJ3s6vO43jcLyxjq10Ceax3jK1eqBQsI91nqBhjQpHIb0J_2F1zZEc9reD4zD_VijxH0mqAEUSQv-e_SEKWkJQC8ONp6Q85fgSoHAasliEELNrP_Tj3wQM9_MuKr2s2-VhNaGVxyXW6hwMZRYzZG_dcLSCgGdUSChRLmUVn_96W2wD5KW-cRkNCf9QdiBDtca-IzXsKe6j_G0bcD2u4AYGiRLiB_D0nKXvgWTaTGvCIyInOLeq',
    review: 'Gói Premium hoàn toàn xứng đáng. AI ưu tiên phản hồi nhanh, hỗ trợ từng bước rất tận tâm.',
    role: 'Founder',
  },
];

// ===== HELPERS =====
function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 mb-5">
      <div className="h-px w-8 rounded-full" style={{ background: 'linear-gradient(90deg, #7C4DFF, transparent)' }} />
      <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#7C4DFF' }}>
        {children}
      </span>
    </div>
  );
}

function NeonGlow({ children, size = 12 }: { children: React.ReactNode; size?: number }) {
  return (
    <span style={{ color: '#7C4DFF', filter: `drop-shadow(0 0 ${size}px rgba(124,77,255,0.35))` }}>
      {children}
    </span>
  );
}

function TagBadge({ text }: { text: string }) {
  return (
    <span
      className="text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-sm"
      style={{
        color: '#7C4DFF',
        border: '1px solid rgba(124,77,255,0.3)',
        background: 'rgba(124,77,255,0.06)',
      }}
    >
      {text}
    </span>
  );
}

// ===== PRICING CARD =====
function PricingCard({ plan }: { plan: (typeof pricingPlans)[0] }) {
  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.25 }} className="h-full relative flex">
      {plan.highlight && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, #7C4DFF, #6d28d9)',
            opacity: 0.06,
            filter: 'blur(20px)',
          }}
        />
      )}
      <div
        className="relative h-full rounded-2xl p-6 flex flex-col w-full"
        style={{
          background: plan.highlight ? 'rgba(11,11,15,0.95)' : 'rgba(255,255,255,0.03)',
          border: `1px solid ${plan.highlight ? 'rgba(124,77,255,0.5)' : 'rgba(124,77,255,0.12)'}`,
          boxShadow: plan.highlight ? '0 0 30px rgba(124,77,255,0.15), 0 0 60px rgba(124,77,255,0.05)' : 'none',
        }}
      >
        {plan.highlight && (
          <Tag
            color="#7C4DFF"
            className="absolute -top-3 left-1/2 -translate-x-1/2 !font-bold !text-[10px] !tracking-widest uppercase !border-0 !rounded-full !px-3 !py-0.5"
          >
            Giá Tốt Nhất
          </Tag>
        )}

        <div
          className="text-xs font-bold tracking-widest uppercase mb-3"
          style={{ color: '#7C4DFF' }}
        >
          {plan.name}
        </div>

        <div className="mb-6">
          <span className="text-4xl font-black text-white">{plan.price}</span>
          <span className="text-slate-500 text-sm ml-1">{plan.unit}</span>
          <div className="text-[11px] text-slate-500 mt-0.5">{plan.period}</div>
        </div>

        <div
          className="h-px w-full mb-6 rounded-full"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(124,77,255,0.4), transparent)' }}
        />

        <ul className="space-y-2.5 mb-7 flex-1">
          {plan.features.map((f, i) => (
            <li key={i} className="flex items-center gap-2.5 text-sm text-slate-300">
              <CheckCircleOutlined className="!text-xs flex-shrink-0 !text-primary" />
              {f}
            </li>
          ))}
        </ul>

        <Link href="/register">
          <Button
            size="large"
            block
            type={plan.highlight ? 'primary' : 'default'}
            className="!font-bold"
          >
            {plan.cta}
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}

// ===== TESTIMONIAL CAROUSEL =====
function TestimonialCard({ t }: { t: (typeof testimonials)[0] }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex-shrink-0 rounded-2xl p-6 mx-3"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(124,77,255,0.15)',
        width: 'w-[340px] sm:w-[380px]',
      }}
    >
      <div className="flex items-center gap-4 mb-5">
        <div className="relative flex-shrink-0">
          <Avatar src={t.avatar} size={48} className="rounded-full" />
          <div
            className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
            style={{ background: '#0B0B0F', border: '1px solid rgba(124,77,255,0.3)' }}
          >
            <CheckCircleOutlined style={{ color: '#7C4DFF', fontSize: 10 }} />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-white mb-0.5 truncate">{t.name}</h4>
          <span className="text-[10px] font-medium" style={{ color: 'rgba(124,77,255,0.6)' }}>{t.role}</span>
        </div>
      </div>
      <div className="flex gap-0.5 mb-4">
        {[...Array(5)].map((_, idx) => (
          <StarFilled key={idx} className="text-xs" style={{ color: '#7C4DFF', filter: 'drop-shadow(0 0 4px rgba(124,77,255,0.4))' }} />
        ))}
      </div>
      <p className="text-slate-400 text-sm italic leading-relaxed mb-0 line-clamp-3">
        &ldquo;{t.review}&rdquo;
      </p>
    </motion.div>
  );
}

function TestimonialCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  const prev = () => setActiveIndex((p) => Math.max(0, p - 1));
  const next = () => setActiveIndex((p) => Math.min(testimonials.length - 1, p + 1));

  return (
    <div className="relative">
      <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 snap-x snap-mandatory">
        <ReactSimplyCarousel
          autoplay
          autoplayDelay={2000}
          autoplayDirection="forward"
          updateOnItemClick
          onAfterChange={(idx) => setActiveIndex(idx)}
          onRequestChange={setActiveIndex}
          containerProps={{
            style: { overflow: 'visible' },
          }}
          itemsToShow={3}
          itemsToScroll={1}
          speed={400}
          easing="ease-in-out"
          activeSlideIndex={activeIndex}
          activeSlideProps={{}}
          responsiveProps={[
            { itemsToShow: 1, minWidth: 0, maxWidth: 640 },
            { itemsToShow: 2, minWidth: 641, maxWidth: 1024 },
            { itemsToShow: 3, minWidth: 1025, maxWidth: Infinity },
          ]}
        >
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} t={t} />
          ))}
        </ReactSimplyCarousel>
      </div>

      {/* Controls */}
      <div className="flex justify-center items-center gap-6 mt-8">
        <button
          onClick={prev}
          className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(124,77,255,0.3)', color: '#7C4DFF' }}
        >
          <ArrowLeftOutlined />
        </button>

        <div className="flex gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className="h-2 rounded-full transition-all duration-300"
              style={{ width: i === activeIndex ? 24 : 8, background: i === activeIndex ? '#7C4DFF' : 'rgba(124,77,255,0.3)' }}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(124,77,255,0.3)', color: '#7C4DFF' }}
        >
          <ArrowRightOutlined />
        </button>
      </div>
    </div>
  );
}

// ===== MAIN =====
export function LandingPage() {
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Trang Chủ', href: '#' },
    { label: 'Tính Năng', href: '#features' },
    { label: 'Bảng Giá', href: '#pricing' },
    { label: 'Cộng Đồng', href: '#community' },
    { label: 'Blog', href: '#blog' },
  ];

  return (
    <Layout className="!bg-[#0B0B0F] min-h-screen">
      <Content>
        {/* ===== NAVBAR ===== */}
        <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
          <div className="max-w-7xl mx-auto">
            <div className="neo-nav rounded-2xl px-4 md:px-5 py-3 flex items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2.5">
                <Image
                  src={imgKMATELOGO}
                  alt="K-MATE Logo"
                  width={120}
                  height={30}
                  className="h-7 md:h-9 w-auto object-contain"
                />
              </Link>

              {/* Desktop Nav */}
              <nav className="hidden md:flex items-center gap-8">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="nav-link"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>

              {/* Desktop Auth */}
              <div className="hidden md:flex items-center gap-2">
                <Link href="/login">
                  <Button type="text" className="!text-white/70 !font-semibold !text-sm !px-3 hover:!text-white">
                    Đăng Nhập
                  </Button>
                </Link>
                <Link href="/register">
                  <Button type="primary" className="!font-bold !text-sm !h-9 !px-5 !rounded-xl">
                    Bắt Đầu Miễn Phí
                  </Button>
                </Link>
              </div>

              {/* Mobile Hamburger */}
              <button
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(124,77,255,0.2)', color: '#7C4DFF' }}
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Mở menu"
              >
                <MenuOutlined />
              </button>
            </div>
          </div>
        </header>

        {/* Mobile Drawer */}
        <Drawer
          title={
            <div className="flex items-center gap-2">
              <Image src={imgKMATELOGO} alt="K-MATE" width={100} height={24} className="h-6 w-auto object-contain" />
            </div>
          }
          placement="right"
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          closeIcon={<CloseOutlined style={{ color: '#fff' }} />}
          styles={{
            header: { background: '#0B0B0F', borderBottom: '1px solid rgba(124,77,255,0.1)' },
            body: { background: '#0B0B0F', padding: '24px 20px' },
            mask: { backdropFilter: 'blur(4px)' },
          }}
          width={280}
        >
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-nav-link"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="mt-8 flex flex-col gap-3">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button block size="large" className="!font-semibold !h-11 !rounded-xl !border-white/10 !text-white/70 !bg-white/5 hover:!bg-white/10">
                Đăng Nhập
              </Button>
            </Link>
            <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
              <Button
                type="primary"
                block
                size="large"
                icon={<ThunderboltOutlined />}
                className="!font-bold !h-11 !rounded-xl"
                style={{ background: 'linear-gradient(135deg, #ef4444, #7C4DFF)' }}
              >
                Bắt Đầu Miễn Phí
              </Button>
            </Link>
          </div>
        </Drawer>

        {/* ===== HERO ===== */}
        <section className="relative min-h-screen flex items-center pt-28 pb-20 overflow-hidden">
          {/* Background image — full screen, blurred, synced with slider */}
          <div className="absolute inset-0 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={`bg-${currentHeroSlide}`}
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-[-5%]"
              >
                <Image
                  src={heroSlides[currentHeroSlide].src}
                  alt=""
                  fill
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>
            {/* Full-screen dark overlay */}
            <div className="absolute inset-0" style={{ background: 'rgba(11,11,15,0.72)' }} />
            {/* Purple tint */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(124,77,255,0.08) 0%, transparent 60%)' }} />
          </div>

          {/* Ambient glows */}
          <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] rounded-full pointer-events-none hidden md:block" style={{ background: 'radial-gradient(circle, rgba(124,77,255,0.18) 0%, transparent 70%)' }} />
          <div className="absolute bottom-[15%] right-[-5%] w-[700px] h-[700px] rounded-full pointer-events-none hidden md:block" style={{ background: 'radial-gradient(circle, rgba(124,77,255,0.12) 0%, transparent 70%)' }} />
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full pointer-events-none hidden md:block" style={{ background: 'radial-gradient(circle, rgba(124,77,255,0.08) 0%, transparent 70%)' }} />

          <div className="max-w-7xl mx-auto px-4 md:px-6 w-full relative z-10">
            {/* ====== MOBILE: full-width content, no slider ====== */}
            <div className="pt-28 md:pt-0 lg:hidden">
              {/* Hero content - mobile first */}
              <div className="space-y-5">
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
                  style={{ border: '1px solid rgba(124,77,255,0.25)', background: 'rgba(124,77,255,0.06)' }}
                >
                  <motion.span
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.3, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: '#7C4DFF', boxShadow: '0 0 5px rgba(124,77,255,0.4)' }}
                  />
                  <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: '#7C4DFF' }}>
                    Học Ngôn Ngữ Thế Hệ Mới
                  </span>
                </motion.div>

                {/* Headline */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <h1 className="text-3xl md:text-4xl font-black text-white leading-tight tracking-tight">
                    Học Tiếng Hàn.{' '}
                    <span style={{ color: '#7C4DFF', filter: 'drop-shadow(0 0 8px rgba(124,77,255,0.4))' }}>Cảm Nhận Nhịp Điệu.</span>
                    <br />
                    <span className="font-korean">한국어</span>{' '}
                    <span style={{ color: '#7C4DFF', filter: 'drop-shadow(0 0 8px rgba(124,77,255,0.4))' }}>Sống Cùng Văn Hóa.</span>
                  </h1>
                </motion.div>

                {/* Sub */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Paragraph className="!text-slate-400 !text-sm !mb-0 leading-relaxed">
                    Học tiếng Hàn thực chiến qua K-Drama, K-Pop và AI thông minh.
                  </Paragraph>
                </motion.div>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.25 }}
                  className="flex gap-5"
                >
                  {[
                    { num: '10K+', label: 'Học Viên' },
                    { num: '50K+', label: 'Video' },
                    { num: '98%', label: 'AI Accuracy' },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center gap-1.5">
                      <span className="text-lg font-black" style={{ color: '#7C4DFF' }}>{s.num}</span>
                      <span className="text-slate-500 text-[10px]">{s.label}</span>
                    </div>
                  ))}
                </motion.div>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="flex flex-col gap-3"
                >
                  <Link href="/register">
                    <Button
                      type="primary"
                      size="large"
                      icon={<ThunderboltOutlined />}
                      block
                      className="!font-bold !h-12 !rounded-xl"
                      style={{ background: 'linear-gradient(135deg, #ef4444, #7C4DFF)' }}
                    >
                      Bắt Đầu Học Ngay
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button
                      size="large"
                      icon={<PlayCircleOutlined />}
                      block
                      className="!h-12 !rounded-xl !font-semibold !bg-white/5 !border-white/10 !text-white"
                    >
                      Tìm Hiểu Ngay
                    </Button>
                  </Link>
                </motion.div>

                {/* Mini hero slider on mobile */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-4 rounded-2xl overflow-hidden"
                  style={{ height: 200, boxShadow: '0 0 40px rgba(124,77,255,0.15), 0 20px 40px rgba(0,0,0,0.5)' }}
                >
                  <HeroSlider onSlideChange={setCurrentHeroSlide} />
                </motion.div>
              </div>
            </div>

            {/* ====== DESKTOP: split layout with slider ====== */}
            <Row gutter={[60, 40]} align="middle" className="hidden lg:flex">
              {/* LEFT - Content */}
              <Col xs={24} lg={10}>
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full"
                  style={{ border: '1px solid rgba(124,77,255,0.25)', background: 'rgba(124,77,255,0.06)' }}
                >
                  <motion.span
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.3, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: '#7C4DFF', boxShadow: '0 0 5px rgba(124,77,255,0.4)' }}
                  />
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#7C4DFF' }}>
                    Học Ngôn Ngữ Thế Hệ Mới
                  </span>
                </motion.div>

                {/* Headline */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <h1 className="text-[42px] xl:text-[60px] 2xl:text-[72px] font-black text-white leading-[1.06] tracking-tight">
                    Học Tiếng Hàn.{' '}
                    <NeonGlow>Cảm Nhận Nhịp Điệu.</NeonGlow>
                    <br />
                    <span className="font-korean">한국어</span>{' '}
                    <NeonGlow>Sống Cùng Văn Hóa.</NeonGlow>
                  </h1>
                </motion.div>

                {/* Sub */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Paragraph className="!text-slate-400 !max-w-lg !text-base !mb-0 leading-relaxed">
                    Học tiếng Hàn thực chiến qua K-Drama, K-Pop và AI thông minh. Phương pháp học nhập vai đỉnh cao — từ thụ động xem phim đến chủ động làm chủ ngôn ngữ.
                  </Paragraph>
                </motion.div>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.25 }}
                  className="flex flex-wrap gap-8 pt-2"
                >
                  {[
                    { num: '10K+', label: 'Học Viên' },
                    { num: '50K+', label: 'Video Content' },
                    { num: '98%', label: 'AI Accuracy' },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center gap-2">
                      <span className="text-xl font-black" style={{ color: '#7C4DFF' }}>{s.num}</span>
                      <span className="text-slate-500 text-xs">{s.label}</span>
                    </div>
                  ))}
                </motion.div>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="flex flex-wrap gap-3"
                >
                  <Link href="/register">
                    <Button
                      type="primary"
                      size="large"
                      icon={<ThunderboltOutlined />}
                      className="!font-bold !h-12 !px-8 !rounded-xl glow-btn"
                    >
                      Bắt Đầu Học Ngay
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button
                      size="large"
                      icon={<PlayCircleOutlined />}
                      className="!h-12 !px-8 !rounded-xl !font-semibold !bg-white/5 !border-white/10 !text-white hover:!bg-primary/10 hover:!border-primary/30"
                    >
                      Tìm Hiểu Ngay
                    </Button>
                  </Link>
                </motion.div>
              </Col>

              {/* RIGHT - K-Drama Slider */}
              <Col xs={24} lg={14} className="hidden lg:flex items-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="relative w-full"
                >
                  {/* Glow behind slider */}
                  <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(124,77,255,0.18) 0%, transparent 70%)', filter: 'blur(40px)', transform: 'scale(1.1)' }} />

                  {/* Floating floating cards */}
                  <motion.div
                    animate={{ y: [0, -18, 0], rotate: [0, 4, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -top-7 -right-7 z-20 w-20 h-20 rounded-2xl flex items-center justify-center"
                    style={{ background: 'rgba(11,11,15,0.7)', border: '1px solid rgba(124,77,255,0.35)', backdropFilter: 'blur(16px)' }}
                  >
                    <RobotOutlined className="text-2xl" style={{ color: '#7C4DFF' }} />
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, -12, 0], rotate: [0, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                    className="absolute -bottom-7 -left-7 z-20 w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(11,11,15,0.7)', border: '1px solid rgba(124,77,255,0.3)', backdropFilter: 'blur(16px)' }}
                  >
                    <FileTextOutlined className="text-xl" style={{ color: '#7C4DFF' }} />
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, -10, 0], rotate: [0, 6, 0] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
                    className="absolute top-[40%] -right-10 z-20 w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(11,11,15,0.7)', border: '1px solid rgba(124,77,255,0.25)', backdropFilter: 'blur(16px)' }}
                  >
                    <BulbOutlined className="text-lg" style={{ color: '#7C4DFF' }} />
                  </motion.div>

                  {/* Slider container */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <div
                      className="relative rounded-2xl overflow-hidden"
                      style={{ height: 520, boxShadow: '0 0 80px rgba(124,77,255,0.15), 0 40px 80px rgba(0,0,0,0.6)' }}
                    >
                      <HeroSlider onSlideChange={setCurrentHeroSlide} />
                    </div>
                  </motion.div>
                </motion.div>
              </Col>
            </Row>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="hidden md:flex justify-center mt-16"
            >
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="flex flex-col items-center gap-2"
              >
                <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: 'rgba(124,77,255,0.4)' }}>Scroll</span>
                <div className="w-px h-10 rounded-full" style={{ background: 'linear-gradient(180deg, rgba(124,77,255,0.4), transparent)' }} />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ===== HOW IT WORKS ===== */}
        <section className="py-16 md:py-24 lg:py-32" style={{ background: 'rgba(11,11,15,0.5)' }}>
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <FadeUp className="text-center mb-16">
              <SectionLabel>Cách Thức Hoạt Động</SectionLabel>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">
                4 Bước Làm Chủ <NeonGlow>Tiếng Hàn</NeonGlow>
              </h2>
              <div className="h-1 w-16 mx-auto rounded-full" style={{ background: 'linear-gradient(90deg, #7C4DFF, rgba(124,77,255,0.3))' }} />
            </FadeUp>

            {/* How It Works */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
              {howItWorksSteps.map((step, i) => (
                <FadeUp key={i} delay={i * 0.1} className="flex flex-col">
                  <div
                    className="step-card flex flex-col flex-1"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(124,77,255,0.12)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      borderRadius: '16px',
                      padding: '20px',
                      transition: 'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
                    }}
                  >
                    {/* Top line */}
                    <div
                      className="mb-5"
                      style={{
                        height: '1px',
                        background: 'linear-gradient(90deg, rgba(124,77,255,0.5), rgba(124,77,255,0.1))',
                        transition: 'all 0.25s ease',
                        borderRadius: '1px',
                      }}
                    />

                    {/* Icon */}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4"
                      style={{
                        background: 'rgba(124,77,255,0.08)',
                        border: '1px solid rgba(124,77,255,0.15)',
                        color: '#7C4DFF',
                      }}
                    >
                      {step.icon}
                    </div>

                    {/* Title */}
                    <h3 className="text-sm md:text-base font-bold text-white mb-3">{step.title}</h3>

                    {/* Description */}
                    <p className="text-slate-400 text-xs md:text-sm leading-relaxed mb-5">{step.desc}</p>

                    {/* Step number */}
                    <span
                      className="text-[10px] font-black tracking-widest uppercase"
                      style={{ color: 'rgba(124,77,255,0.5)' }}
                    >
                      STEP {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FEATURES ===== */}
        <section className="py-16 md:py-24 lg:py-32 relative" id="features">
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(124,77,255,0.07) 0%, transparent 60%)' }} />
          <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
            <FadeUp className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 md:mb-16 gap-6">
              <div className="max-w-2xl">
                <SectionLabel>Tính Năng AI</SectionLabel>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">
                  Làm Chủ Tiếng Hàn Với{' '}
                  <NeonGlow>AI Đỉnh Cao</NeonGlow>
                </h2>
                <p className="text-slate-400 text-sm md:text-base">
                  Chuyển đổi việc xem thụ động thành học tập chủ động với công nghệ AI tiên tiến nhất.
                </p>
              </div>
              <Button
                type="link"
                className="!text-primary !p-0 !h-auto !text-sm !font-semibold self-start lg:self-auto"
                icon={<ArrowRightOutlined />}
                iconPosition="end"
              >
                Xem tất cả
              </Button>
            </FadeUp>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 items-stretch">
              {features.map((f, i) => (
                <FadeUp key={i} delay={i * 0.07} className="flex flex-col">
                  <div
                    className="feature-card flex flex-col flex-1"
                    style={{
                      background: 'rgba(124,77,255,0.03)',
                      border: '1px solid rgba(124,77,255,0.1)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      borderRadius: '16px',
                      padding: '20px',
                      transition: 'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
                    }}
                  >
                    {/* Top line */}
                    <div
                      className="mb-5"
                      style={{
                        height: '1px',
                        background: 'linear-gradient(90deg, rgba(124,77,255,0.5), rgba(124,77,255,0.1))',
                        transition: 'all 0.25s ease',
                        borderRadius: '1px',
                      }}
                    />

                    {/* Header: icon + tag */}
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                        style={{ background: 'rgba(124,77,255,0.08)', border: '1px solid rgba(124,77,255,0.15)' }}
                      >
                        <span style={{ color: '#7C4DFF' }}>{f.icon}</span>
                      </div>
                      <TagBadge text={f.tag} />
                    </div>

                    {/* Title */}
                    <h3 className="text-sm md:text-base font-bold text-white mb-3">{f.title}</h3>

                    {/* Description */}
                    <p className="text-slate-400 text-xs md:text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ===== PRICING ===== */}
        <section className="py-16 md:py-24 lg:py-32" style={{ background: 'rgba(11,11,15,0.5)' }} id="pricing">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <FadeUp className="text-center mb-6">
              <SectionLabel>Bảng Giá</SectionLabel>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">
                Chọn Lộ Trình <NeonGlow>Của Bạn</NeonGlow>
              </h2>
              <p className="text-slate-400 max-w-lg mx-auto text-sm md:text-base">
                Từ người học ngẫu hứng đến bậc thầy K-Drama, chúng tôi có gói phù hợp cho mọi người.
              </p>
            </FadeUp>

            <Row gutter={[16, 16]} justify="center" align="stretch">
              {pricingPlans.map((plan, i) => (
                <Col xs={24} sm={12} lg={6} key={i} className="!flex">
                  <FadeUp delay={i * 0.08}>
                    <PricingCard plan={plan} />
                  </FadeUp>
                </Col>
              ))}
            </Row>
          </div>
        </section>

        {/* ===== TESTIMONIALS ===== */}
        <section className="py-16 md:py-24 lg:py-32" id="community">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <FadeUp className="text-center mb-12 md:mb-16">
              <SectionLabel>Cộng Đồng</SectionLabel>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">
                Được Tin Dùng Bởi <NeonGlow>10,000+</NeonGlow> Học Viên
              </h2>
              <div className="h-1 w-16 mx-auto rounded-full" style={{ background: 'linear-gradient(90deg, #7C4DFF, rgba(124,77,255,0.3))' }} />
            </FadeUp>

            <TestimonialCarousel />
          </div>
        </section>

        {/* ===== CTA BANNER ===== */}
        <section className="relative py-16 md:py-20 lg:py-28 overflow-hidden">
          {/* Background image with overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1538485399081-7191377e8241?w=1920&h=600&fit=crop)',
            }}
          />
          {/* Gradient overlays */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, rgba(11,11,15,0.92) 0%, rgba(11,11,15,0.75) 40%, rgba(11,11,15,0.88) 100%)',
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(124,77,255,0.15) 0%, transparent 70%)',
            }}
          />

          {/* Animated floating decorations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute text-4xl opacity-20 hidden md:block"
              style={{ top: '15%', left: '8%' }}
              animate={{ y: [-8, 8, -8], rotate: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              🎵
            </motion.div>
            <motion.div
              className="absolute text-3xl opacity-15 hidden md:block"
              style={{ top: '60%', left: '15%' }}
              animate={{ y: [8, -8, 8], rotate: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              🎬
            </motion.div>
            <motion.div
              className="absolute text-4xl opacity-20 hidden md:block"
              style={{ top: '25%', right: '10%' }}
              animate={{ y: [-6, 10, -6], rotate: [0, -12, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            >
              ✨
            </motion.div>
            <motion.div
              className="absolute text-3xl opacity-15 hidden md:block"
              style={{ top: '70%', right: '18%' }}
              animate={{ y: [10, -6, 10], rotate: [0, 8, 0] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            >
              🌟
            </motion.div>
            <motion.div
              className="absolute text-2xl opacity-10 hidden md:block"
              style={{ top: '40%', left: '25%' }}
              animate={{ y: [-4, 6, -4], x: [0, 4, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            >
              💜
            </motion.div>
          </div>

          {/* Glow orbs */}
          <motion.div
            className="absolute w-72 h-72 rounded-full pointer-events-none"
            style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'radial-gradient(circle, rgba(124,77,255,0.2) 0%, transparent 70%)', filter: 'blur(40px)' }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Main content */}
          <FadeUp className="relative max-w-4xl mx-auto px-4 md:px-6 text-center">
            {/* Top badge */}
            <motion.div
              className="inline-flex items-center gap-2 mb-6 md:mb-8 px-4 py-2 rounded-full"
              style={{ background: 'rgba(124,77,255,0.12)', border: '1px solid rgba(124,77,255,0.25)' }}
              whileHover={{ scale: 1.05 }}
            >
              <span className="w-2 h-2 rounded-full" style={{ background: '#7C4DFF', boxShadow: '0 0 8px #7C4DFF' }} />
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest" style={{ color: '#7C4DFF' }}>Miễn Phí — Không Cần Thẻ Tín Dụng</span>
            </motion.div>

            <h2 className="text-3xl md:text-5xl lg:text-7xl font-black text-white mb-4 md:mb-6 leading-tight">
              Sẵn Sàng Học{' '}
              <span style={{ color: '#7C4DFF', filter: 'drop-shadow(0 0 20px rgba(124,77,255,0.5))' }}>Tiếng Hàn</span>
              {' '}Ngay Hôm Nay?
            </h2>

            <p className="text-slate-300 text-base md:text-lg max-w-lg mx-auto mb-8 md:mb-10 leading-relaxed">
              Hơn 10,000+ học viên đang học mỗi ngày. Đăng ký hôm nay và bắt đầu hành trình K-Language của bạn.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
              <Link href="/register">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(124,77,255,0.4)' }}
                  whileTap={{ scale: 0.97 }}
                  className="relative px-6 md:px-10 py-3 md:py-4 rounded-2xl font-bold text-sm md:text-base text-white overflow-hidden w-full sm:w-auto"
                  style={{ background: 'linear-gradient(135deg, #7C4DFF, #6d28d9)', boxShadow: '0 0 20px rgba(124,77,255,0.3)' }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Tham Gia Miễn Phí
                    <ArrowRightOutlined />
                  </span>
                </motion.button>
              </Link>
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-6 md:px-10 py-3 md:py-4 rounded-2xl font-bold text-sm md:text-base text-white w-full sm:w-auto"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)' }}
                >
                  Đã Có Tài Khoản
                </motion.button>
              </Link>
            </div>

            {/* Stats row */}
            <div className="flex items-center justify-center gap-6 md:gap-10 mt-10 md:mt-14">
              {[
                { value: '10,000+', label: 'Học Viên' },
                { value: '50,000+', label: 'Video Học' },
                { value: '4.9★', label: 'Đánh Giá' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-lg md:text-2xl font-black text-white">{stat.value}</div>
                  <div className="text-[10px] md:text-xs font-medium" style={{ color: 'rgba(124,77,255,0.7)' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </FadeUp>
        </section>
      </Content>

      {/* ===== FOOTER ===== */}
      <Footer className="!bg-transparent !border-t !border-primary/10 !py-10 md:!py-14 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <Row gutter={[32, 40]}>
            <Col xs={24} lg={8}>
              <div className="flex items-center gap-2.5 mb-5">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, rgba(124,77,255,0.15), rgba(124,77,255,0.05))', border: '1px solid rgba(124,77,255,0.2)' }}
                >
                  <GlobalOutlined style={{ color: '#7C4DFF', fontSize: 15 }} />
                </div>
                <span className="text-base font-black text-white tracking-tight">K-MATE</span>
              </div>
              <Paragraph className="!text-slate-500 !max-w-xs !mb-7 !text-sm">
                Trao quyền cho người học làm chủ tiếng Hàn thông qua sức mạnh của văn hóa K và công nghệ AI.
              </Paragraph>
              <div className="flex gap-3">
                {[
                  { icon: <TikTokOutlined style={{ fontSize: 14 }} />, label: 'TikTok' },
                  { icon: <YoutubeOutlined style={{ fontSize: 14 }} />, label: 'YouTube' },
                  { icon: <InstagramOutlined style={{ fontSize: 14 }} />, label: 'Instagram' },
                ].map((s) => (
                  <a key={s.label} href="#" aria-label={s.label} className="social-icon">
                    {s.icon}
                  </a>
                ))}
              </div>
            </Col>

            <Col xs={12} sm={6} lg={4}>
              <h5 className="text-[10px] font-bold tracking-widest uppercase mb-5" style={{ color: '#7C4DFF' }}>Sản Phẩm</h5>
              <ul className="space-y-3 !list-none !p-0 !m-0">
                {['Trang Chủ', 'Tính Năng AI', 'Bộ Từ Vựng', 'Bảng Giá'].map((item) => (
                  <li key={item}>
                    <a href="#" className="footer-link">{item}</a>
                  </li>
                ))}
              </ul>
            </Col>

            <Col xs={12} sm={6} lg={4}>
              <h5 className="text-[10px] font-bold tracking-widest uppercase mb-5" style={{ color: '#7C4DFF' }}>Công Ty</h5>
              <ul className="space-y-3 !list-none !p-0 !m-0">
                {['Về Chúng Tôi', 'Blog', 'Liên Hệ', 'Chính Sách', 'Điều Khoản'].map((item) => (
                  <li key={item}>
                    <a href="#" className="footer-link">{item}</a>
                  </li>
                ))}
              </ul>
            </Col>

            <Col xs={12} sm={6} lg={4}>
              <h5 className="text-[10px] font-bold tracking-widest uppercase mb-5" style={{ color: '#7C4DFF' }}>Cộng Đồng</h5>
              <ul className="space-y-3 !list-none !p-0 !m-0">
                {['Cộng Đồng', 'Hỗ Trợ', 'FAQ', 'Tuyển Dụng'].map((item) => (
                  <li key={item}>
                    <a href="#" className="footer-link">{item}</a>
                  </li>
                ))}
              </ul>
            </Col>

            <Col xs={12} sm={6} lg={4}>
              <h5 className="text-[10px] font-bold tracking-widest uppercase mb-5" style={{ color: '#7C4DFF' }}>Kết Nối</h5>
              <ul className="space-y-3 !list-none !p-0 !m-0">
                {['Discord', 'Telegram', 'Facebook', 'Twitter/X'].map((item) => (
                  <li key={item}>
                    <a href="#" className="footer-link">{item}</a>
                  </li>
                ))}
              </ul>
            </Col>
          </Row>

          <Divider style={{ borderColor: 'rgba(124,77,255,0.1)' }} className="!my-6 md:!my-8" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Text className="text-slate-600 text-xs text-center md:text-left">
              © 2026 K-MATE. Made with ❤️ for K-Culture learners.
            </Text>
            <Text className="text-slate-600 text-[10px] font-mono">
              SYS.ONLINE // K-MATE v2.0.0
            </Text>
          </div>
        </div>
      </Footer>

      {/* ===== STYLES ===== */}
      <style jsx global>{`
        body {
          font-family: 'Inter', system-ui, sans-serif;
          background-color: #0B0B0F;
          color: white;
          -webkit-font-smoothing: antialiased;
        }

        .font-korean { font-family: 'Noto Sans KR', sans-serif; }

        /* Nav */
        .neo-nav {
          background: rgba(11, 11, 15, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(124, 77, 255, 0.15);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4), 0 0 1px rgba(124, 77, 255, 0.08);
        }

        .nav-link {
          color: rgba(255, 255, 255, 0.55);
          font-size: 13px;
          font-weight: 500;
          text-decoration: none;
          transition: color 0.2s ease;
          position: relative;
        }
        .nav-link:hover {
          color: #7C4DFF;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          right: 0;
          height: 1.5px;
          background: #7C4DFF;
          transform: scaleX(0);
          transition: transform 0.2s ease;
          box-shadow: 0 0 4px rgba(124, 77, 255, 0.35);
          border-radius: 1px;
        }
        .nav-link:hover::after { transform: scaleX(1); }

        /* Mobile nav link */
        .mobile-nav-link {
          color: rgba(255, 255, 255, 0.7);
          font-size: 15px;
          font-weight: 500;
          text-decoration: none;
          padding: 12px 16px;
          border-radius: 10px;
          transition: all 0.2s ease;
          display: block;
        }
        .mobile-nav-link:hover {
          color: #7C4DFF;
          background: rgba(124, 77, 255, 0.08);
        }

        /* Glass card */
        .glass-card {
          background: rgba(255, 255, 255, 0.03) !important;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(124, 77, 255, 0.1) !important;
          border-radius: 16px !important;
          transition: border-color 0.25s ease, transform 0.25s ease !important;
        }
        /* Step card */
        .step-card {
          transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease !important;
        }
        .step-card:hover {
          border-color: rgba(124, 77, 255, 0.4) !important;
          box-shadow: 0 0 30px rgba(124, 77, 255, 0.15), 0 8px 32px rgba(0, 0, 0, 0.3);
          transform: translateY(-4px);
        }

        /* Feature card */
        .feature-card {
          transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease !important;
        }
        .feature-card:hover {
          border-color: rgba(124, 77, 255, 0.4) !important;
          box-shadow: 0 0 30px rgba(124, 77, 255, 0.15), 0 8px 32px rgba(0, 0, 0, 0.3);
          transform: translateY(-4px);
        }

        /* Glow button */
        .glow-btn {
          box-shadow: 0 0 15px rgba(124, 77, 255, 0.2), 0 4px 12px rgba(0, 0, 0, 0.3) !important;
          transition: all 0.25s ease !important;
        }
        .glow-btn:hover {
          box-shadow: 0 0 25px rgba(124, 77, 255, 0.3), 0 6px 18px rgba(0, 0, 0, 0.4) !important;
          transform: translateY(-1px);
        }

        /* Floating cards */
        .float-card {
          background: rgba(11, 11, 15, 0.85) !important;
          backdrop-filter: blur(12px);
          border: 1px solid rgba(124, 77, 255, 0.15) !important;
          box-shadow: 0 0 15px rgba(124, 77, 255, 0.08) !important;
        }
        .float-card-2 {
          background: rgba(11, 11, 15, 0.85) !important;
          backdrop-filter: blur(12px);
          border: 1px solid rgba(124, 77, 255, 0.1) !important;
          box-shadow: 0 0 10px rgba(124, 77, 255, 0.06) !important;
        }
        .float-card-3 {
          background: rgba(11, 11, 15, 0.85) !important;
          backdrop-filter: blur(12px);
          border: 1px solid rgba(124, 77, 255, 0.1) !important;
          box-shadow: 0 0 10px rgba(124, 77, 255, 0.06) !important;
        }

        /* Social icon */
        .social-icon {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          background: rgba(124, 77, 255, 0.05);
          border: 1px solid rgba(124, 77, 255, 0.12);
          color: rgba(255, 255, 255, 0.5);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          cursor: pointer;
          text-decoration: none;
        }
        .social-icon:hover {
          border-color: rgba(124, 77, 255, 0.4);
          color: #7C4DFF;
          background: rgba(124, 77, 255, 0.1);
          box-shadow: 0 0 12px rgba(124, 77, 255, 0.15);
          transform: translateY(-2px);
        }

        /* Footer link */
        .footer-link {
          color: rgba(255, 255, 255, 0.4);
          font-size: 13px;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .footer-link:hover {
          color: #7C4DFF;
        }

        /* Scrollbar hide for testimonials */
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        /* Ant overrides */
        .ant-layout { background: transparent !important; }
        .ant-card { background: transparent !important; }
        .ant-btn-default {
          background: transparent !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
          color: rgba(255, 255, 255, 0.7) !important;
        }
        .ant-btn-default:hover {
          border-color: rgba(124, 77, 255, 0.4) !important;
          color: white !important;
        }
      `}</style>
    </Layout>
  );
}
