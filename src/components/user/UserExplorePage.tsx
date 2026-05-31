'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  PlayCircleOutlined,
  PlusOutlined,
  DownOutlined,
  SwapOutlined,
  DollarOutlined,
  StarOutlined,
  RiseOutlined,
  FireOutlined,
  ClockCircleOutlined,
  BarChartOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { Select } from 'antd';

const toSlug = (title: string) =>
  title.toLowerCase()
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim().replace(/\s+/g, '-');

const FEATURED_SLIDES = [
  {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD457f65iYhctZr1qUQoHj2TzLm-C6BRkb3Hzc67pBTfLNPO6mtHh_e0-MxYykO5NVcVr6_BBmY_uZ7OUFoNEm1WYvj1FIGxoovjb-BreV_9tc9jrz-0X6OKzQQFJVZtMKfCDJkQ0l2W8X_6QZ7ygIkksw4rDNO0qqyXXt0bNFTNFCG2Lpk9ReVcp4lDa0GYRJ-ePQF5XNJnHPgcx3tV8-JBBHyHkDHfHxPbA7E4pDgByE4A1H5iz4FMvc8GEbT5SoHs5xHm63IRhNL',
    title: 'Hạ Cánh Nơi Anh (Crash Landing on You)',
    slug: 'ha-canh-noi-anh',
    description: 'Học cách giao tiếp tự nhiên trong các tình huống lãng mạn qua phân cảnh kinh điển tại nhà hàng Thụy Sĩ.',
    level: 'Trung cấp (Level 3)',
    duration: '12:45 phút',
    badge: 'Hot Trending',
    category: 'K-Drama',
  },
  {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIpTdpWzG5l20JisAtVPnlK_M4ObymfNogrClEwrpt72a2Ag1vfHeBUsTv9ycDMgqdbvKIET9AhV3Ra4YFKWhtdZ4VEVAf_vf0bx1boOT47mknC4NTBmoDIBpTq34ZuZrBnpKmZ51QsYUgizSm61ak1cZbxcXARzWn8SMWLsw3uUVOCW_7mkhmaS4FRDMp1-ZqauKF4odYekceSFrL1TpA3BGVX54HKD_XkkHBpTE-qIhDTIrJbyt9DxeiFiJ44VHpar1xe6kuUJi2',
    title: 'Kính ngữ và giao tiếp nơi công sở Hàn Quốc',
    slug: 'kinh-ngu-va-giao-tiep-noi-cong-so-han-quoc',
    description: 'Nắm vững các mẫu câu văn phòng chuẩn nhưng tự nhiên, phù hợp cho môi trường doanh nghiệp.',
    level: 'Cao cấp (Level 4)',
    duration: '10:20 phút',
    badge: 'Mới nhất',
    category: 'K-Drama',
  },
  {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFs8THUbcJ4Ua_hBHavOB2uyca35MLZA_u8E0NusUfQAMhEUhV7HOvJJUPZF3LE8_jlDoljDeKrX4DJUFJYaQNyOWmEIRgoFk2kctrKdjtPIcdXiCuto9SXzMFyXAH-SZT7bT1GTmRXR03JeD77Sg7C-8qXVw__n9gNfGXCxM2cpU2FdjSnM9sXZyCcICzB_vftoG7RhY-C9UCrmUd4HZWq3euSGT79O6dIXVlsjSLmDmFK3iWz1NdAK8NX1B21_welqQHdCiEEHYE',
    title: 'Học tiếng Hàn qua Lyrics: NewJeans - "Ditto"',
    slug: 'hoc-tieng-han-qua-o3ics-newjeans-ditto',
    description: 'Phân tích o3ic bài hát viral nhất để học từ vựng và cách phát âm chuẩn từ ca sĩ.',
    level: 'Sơ cấp (Level 1)',
    duration: '04:30 phút',
    badge: 'Miễn phí',
    category: 'K-Pop',
  },
  {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTigJyLfcl-U-eFwIkSIB0tgsPx3Qs2MqFYBG8gG7Gsk6TtpfGuq4BIlB45Q1AljdeSIvhYL_YlD1gSQFTB-TU4z1yBNaAXrb9cd73UJrrcaS7oCJVDTqqFlmO3oe5sPzVWOXoJKUs1NAVSiZfWmgN91vLPFWvz35mwqtOnrr1HXNkTDhtw4n35fJjowOLnZQiWk-Y3ET6H3godqBdSWwE4nr1eRqj3S9rJDeQCkArWqHuE-hUgSq_mXKMR1CI-HcvSCv19G8wqpeW',
    title: 'Seoul Vlog: Hỏi đường và mua sắm tại Myeongdong',
    slug: 'seoul-vlog-hoi-duong-va-mua-sam-tai-myeongdong',
    description: 'Học cách hỏi đường, tính tiền và mặc cả khi mua sắm tại khu phố nổi tiếng nhất Seoul.',
    level: 'Sơ cấp (Level 2)',
    duration: '15:50 phút',
    badge: 'Phổ biến',
    category: 'Vlog',
  },
  {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBv87KNqEE5xXyc9SVueGGuwglXr5-nuafp6M4fhLQefkkE7mGxGASukLQe2xStOOaP52CfHS6GgA3mZRMXvFlt1gVrt3MsXatAsfdcUU9-_cVY9nzajoYSvJ_hES8reuDVZQDkNBkSR9FdC7ZV8kmbzt5t-5MmZ3Sbl0vE4Pp8TQcwuLyat0gbRhuNxnh_K4LrhfymSn-F-FOGgkpkvw8f6jnj-qs_Q3BoB-An6-Tvf7Qn3j_jOEb21MaWF5JztVtCmeqSR9PhA4pU',
    title: 'Cách gọi món tại nhà hàng truyền thống Hàn Quốc',
    slug: 'cach-goi-mon-tai-nha-hang-truyen-thong-han-quoc',
    description: 'Tự tin gọi món tại BBQ, KFC hay nhà hàng truyền thống với các mẫu câu thực tế.',
    level: 'Trung cấp (Level 3)',
    duration: '08:15 phút',
    badge: 'HOT',
    category: 'Văn hóa',
  },
];

const VIDEO_CARDS = [
  {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFs8THUbcJ4Ua_hBHavOB2uyca35MLZA_u8E0NusUfQAMhEUhV7HOvJJUPZF3LE8_jlDoljDeKrX4DJUFJYaQNyOWmEIRgoFk2kctrKdjtPIcdXiCuto9SXzMFyXAH-SZT7bT1GTmRXR03JeD77Sg7C-8qXVw__n9gNfGXCxM2cpU2FdjSnM9sXZyCcICzB_vftoG7RhY-C9UCrmUd4HZWq3euSGT79O6dIXVlsjSLmDmFK3iWz1NdAK8NX1B21_welqQHdCiEEHYE',
    title: 'Học tiếng Hàn qua Lyrics: NewJeans - "Ditto"',
    slug: 'hoc-tieng-han-qua-o3ics-newjeans-ditto',
    level: 'Sơ cấp',
    views: '12k lượt xem',
    duration: '04:30',
    price: 'FREE',
    priceType: 'free',
  },
  {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBv87KNqEE5xXyc9SVueGGuwglXr5-nuafp6M4fhLQefkkE7mGxGASukLQe2xStOOaP52CfHS6GgA3mZRMXvFlt1gVrt3MsXatAsfdcUU9-_cVY9nzajoYSvJ_hES8reuDVZQDkNBkSR9FdC7ZV8kmbzt5t-5MmZ3Sbl0vE4Pp8TQcwuLyat0gbRhuNxnh_K4LrhfymSn-F-FOGgkpkvw8f6jnj-qs_Q3BoB-An6-Tvf7Qn3j_jOEb21MaWF5JztVtCmeqSR9PhA4pU',
    title: 'Cách gọi món tại nhà hàng truyền thống Hàn Quốc',
    slug: 'cach-goi-mon-tai-nha-hang-truyen-thong-han-quoc',
    level: 'Trung cấp',
    views: '5.4k lượt xem',
    duration: '08:15',
    price: '1',
    priceType: 'coin',
  },
  {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTigJyLfcl-U-eFwIkSIB0tgsPx3Qs2MqFYBG8gG7Gsk6TtpfGuq4BIlB45Q1AljdeSIvhYL_YlD1gSQFTB-TU4z1yBNaAXrb9cd73UJrrcaS7oCJVDTqqFlmO3oe5sPzVWOXoJKUs1NAVSiZfWmgN91vLPFWvz35mwqtOnrr1HXNkTDhtw4n35fJjowOLnZQiWk-Y3ET6H3godqBdSWwE4nr1eRqj3S9rJDeQCkArWqHuE-hUgSq_mXKMR1CI-HcvSCv19G8wqpeW',
    title: 'Seoul Vlog: Hỏi đường và mua sắm tại Myeongdong',
    slug: 'seoul-vlog-hoi-duong-va-mua-sam-tai-myeongdong',
    level: 'Sơ cấp',
    views: '22k lượt xem',
    duration: '15:50',
    price: 'FREE',
    priceType: 'free',
  },
  {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIpTdpWzG5l20JisAtVPnlK_M4ObymfNogrClEwrpt72a2Ag1vfHeBUsTv9ycDMgqdbvKIET9AhV3Ra4YFKWhtdZ4VEVAf_vf0bx1boOT47mknC4NTBmoDIBpTq34ZuZrBnpKmZ51QsYUgizSm61ak1cZbxcXARzWn8SMWLsw3uUVOCW_7mkhmaS4FRDMp1-ZqauKF4odYekceSFrL1TpA3BGVX54HKD_XkkHBpTE-qIhDTIrJbyt9DxeiFiJ44VHpar1xe6kuUJi2',
    title: 'Kính ngữ và giao tiếp nơi công sở Hàn Quốc',
    slug: 'kinh-ngu-va-giao-tiep-noi-cong-so-han-quoc',
    level: 'Cao cấp',
    views: '1.2k lượt xem',
    duration: '10:20',
    price: '2',
    priceType: 'coin',
  },
];

const AI_RECOMMENDATIONS = [
  {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfTl9h9fQJZnOv1hfv-q3W_E152IJ1VSJi5rK1DQahcDud9CquqpwqcuT6hTkppqaZwknc01rmK9QAubYYm4VpARWXAfAI4YH8bsf0DrbOODd0BRfON-tYRt2tYR_dyBrLECotZBU_rIrqEQJ8RNJhsmWeToGPjULUn6nQMB_Gh2pIV11UP1r2hsrx_rU8ILIrYe2gsnbPILF0loMvubD30kGXNTgr3OJXJ66ad7DSWt5uehloG1mCkrNHQkmUnOCXAM8-2ofyPu3x',
    title: "Cấu trúc câu 'Vì... nên...' trong K-Drama",
    slug: 'cau-truc-cau-vi-nen-trong-kdrama',
    description: 'Bạn đã học 5 từ vựng về cảm xúc hôm qua. Video này sẽ giúp bạn áp dụng chúng.',
    match: 98,
    duration: '06:40',
  },
  {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWzdwdewXabwxuTO6vgWFnPjGOJQq1x9Lq-JxeeYWKHyxnivJz4_LQaV6Q6pqp2gGolZDA8MmPa80w3mt7-xpT8frE7LZ_X64wUfXaCuekdp-XA0h5W5HQCOJ4vv1JvSKtvuv76TZPJi11gC1DcI1A5ZVhx3EBY7mAP-UpqaqskyEBba_FdIC9t5LsW5nUH6uLo7O7xVyUKDW2HUA-XUJqAvxPjulXUFvkhSpOihovf5OsFxMdms_dWeY4msuZaxaP8A3TXEQoXKQv',
    title: 'Tiếng lóng của giới trẻ Hàn Quốc 2026',
    slug: 'tieng-long-cua-gioi-tre-han-quoc-2026',
    description: 'Nâng cấp kỹ năng nói tiếng Hàn tự nhiên hơn với 10 cụm từ hot nhất hiện nay.',
    match: 92,
    duration: '09:15',
  },
];

const TRENDING_ITEMS = [
  {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATW7tc3cnADwYAvKXzxt5QfFiW8ncJFrcTyeMi4BcFeiu9ZAjPJnX-sZED-dlLvyTuujzh56Mo4nbxyv84chP0JaMQgrH6G58wG2Rpnre1nvetb_OhWTFh6KWCNTJ5fe-kNQrwB4UVUCDo8LVgN9KIIb5rnzPQnDIc9QfONOOzPZvAwOWz_B263Xo0qn_b8kJ3HOhJ5ngX_fPesYhCFLiCtbONlzeN_MOpiQK8TDVYdD6oYOgKE5pltwxh-W9thONp-VL2bPw1sH5f',
    category: 'Ẩm thực',
    title: 'Review Mukbang & Vocabulary',
    slug: 'review-mukbang-vocabulary',
  },
  {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCy9Pkb4kTD6jsdH9Mvurm35vYgKjwpjSGiVsBQ8rptt8rGOLs0vQvnjXa3X2kEUruISGr2--NgFcAOU_aBRKE1Bggby0vOdVDl9Go5C9KhPN_lFxmyAqdKIo6DZWbE-PJapYgrq5BoSEwrhOCMjR6SA_vbcgMMgaISbj_y40QECzSt6BfLFfbN_iENGXfsEvVE5PB13QNlS5oWyreNRgMcoETzPkQSa0he4M_vDrduXk2GmL8x6RkCeB0wWu7MvkPkujkXLLELbG1a',
    category: 'Du lịch',
    title: 'Lễ hội pháo hoa quốc tế Seoul',
    slug: 'le-hoi-phao-hoa-quoc-te-seoul',
  },
  {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSoJkS3tSqnBj5Ei4pSgRM9DF_4ktncmlJum0QRalHYEfystykYrIuUez8X_gL0vV4M1vrHc0LwNesUQ7dFpFWy9Tuc5SDzEAga218Ky8ix-lXgK8hBC05jmLwoFcqxcKW2MRevWD7W2NjsP9co2FixTZn6p2HEsrL5s8w3ty095WBEPvXZ1zzDpzrZt9YOwaPZPRPwoW5drPdbdFsDMSj2sKEkZaAMqHSWm7r7zp4IorsussMLG9ks-5DASnY6ZkNNkzjzBLouJjV',
    category: 'K-Pop',
    title: 'BTS RM - Phỏng vấn nghệ thuật',
    slug: 'bts-rm-phong-van-nghe-thuat',
  },
  {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrPAWRPitP491P8cRMXbsNNjSep7C476XItEVvgXwVdR63ipwQe7XGQiXnkRRh6MUIUDdRVe9xgt0w31XKek4fnd_nf-FwNuPK9UNHBkIyJEepX4RFH_HjkBP8Llnvyf-6kmqhnMWufb4fptpNMZmKttIxaRZmGf_pBgMNBZa-GSor-Su05itWxeIRcsiXbUzUAN_JXNinChEWKbmOGllvPw8LUgKbZOLb_66gbOC74wO0uPIOpa2n8iCG9xHXXMrwZ9bhrT7whsSN',
    category: 'Văn hóa',
    title: 'Trải nghiệm Hanbok tại Gyeongbokgung',
    slug: 'trai-nghiem-hanbok-tai-gyeongbokgung',
  },
];

export default function UserExplorePage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % FEATURED_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = FEATURED_SLIDES[currentSlide];

  return (
    <div className="min-h-screen">
      <main className="pb-12 px-6 lg:px-10">
        {/* Hero Featured Section - Carousel */}
        <section className="mb-12 pt-4">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-3xl lg:text-4xl font-black text-white mb-2 tracking-tight">
                Khám phá video học tiếng Hàn
              </h2>
              <p className="text-slate-400 text-sm">
                Học tiếng Hàn qua phim, nhạc, văn hóa và cuộc sống thường nhật
              </p>
            </div>
            <div className="hidden lg:flex items-center gap-2">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                {currentSlide + 1} / {FEATURED_SLIDES.length}
              </span>
            </div>
          </div>

          {/* Hero Banner */}
          <div className="relative rounded-3xl overflow-hidden h-[460px] lg:h-[520px]">
            <img
              alt={slide.title}
              src={slide.image}
              className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-lg bg-primary/90 text-background-dark text-[10px] font-black uppercase tracking-wider">
                  {slide.category}
                </span>
                <span className="px-3 py-1 rounded-lg bg-secondary/90 text-white text-[10px] font-black uppercase tracking-wider">
                  {slide.badge}
                </span>
              </div>
              <h3 className="text-3xl lg:text-5xl font-black text-white mb-4 leading-tight">
                {slide.title}
              </h3>
              <p className="text-slate-300 text-base lg:text-lg mb-6 lg:mb-8 line-clamp-2">
                {slide.description}
              </p>
              <div className="flex items-center gap-6 mb-6 lg:mb-8 flex-wrap">
                <div className="flex items-center gap-2">
                  <BarChartOutlined style={{ color: '#00e5ff', fontSize: 20 }} />
                  <span className="text-sm text-slate-300">{slide.level}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ClockCircleOutlined style={{ color: '#00e5ff', fontSize: 20 }} />
                  <span className="text-sm text-slate-300">{slide.duration}</span>
                </div>
              </div>
              <div className="flex gap-4 flex-wrap">
                <button
                  onClick={() => router.push(`/learn/${slide.slug}`)}
                  className="bg-primary hover:bg-primary/90 text-background-dark font-bold px-6 lg:px-8 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
                >
                  <PlayCircleOutlined style={{ fontSize: 20 }} />
                  Xem Ngay
                </button>
                <button className="glass hover:bg-white/10 text-white font-bold px-6 lg:px-8 py-3 rounded-xl flex items-center gap-2 transition-all">
                  <PlusOutlined style={{ fontSize: 18 }} />
                  Lưu Danh Sách
                </button>
              </div>
            </div>

            {/* Navigation arrows */}
            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + FEATURED_SLIDES.length) % FEATURED_SLIDES.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
            >
              <LeftOutlined style={{ color: 'white', fontSize: 16 }} />
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % FEATURED_SLIDES.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
            >
              <RightOutlined style={{ color: 'white', fontSize: 16 }} />
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2">
              {FEATURED_SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`rounded-full transition-all cursor-pointer ${i === currentSlide ? 'w-6 h-2 bg-primary' : 'w-2 h-2 bg-white/40 hover:bg-white/60'}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Filter Bar */}
        <section className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Select
              placeholder="Thể loại"
              allowClear
              className="!min-w-[130px]"
              popupClassName="!bg-dark-400 !border !border-white/10"
              options={[
                { value: 'kdrama', label: 'K-Drama' },
                { value: 'kpop', label: 'K-Pop' },
                { value: 'vlog', label: 'Vlog' },
                { value: 'variety', label: 'Variety Show' },
                { value: 'culture', label: 'Văn hóa' },
                { value: 'food', label: 'Ẩm thực' },
              ]}
            />
            <Select
              placeholder="Độ khó"
              allowClear
              className="!min-w-[120px]"
              popupClassName="!bg-dark-400 !border !border-white/10"
              options={[
                { value: 'beginner', label: 'Sơ cấp (Level 1-2)' },
                { value: 'intermediate', label: 'Trung cấp (Level 3-4)' },
                { value: 'advanced', label: 'Cao cấp (Level 5+)' },
              ]}
            />
            <Select
              placeholder="Thời lượng"
              allowClear
              className="!min-w-[130px]"
              popupClassName="!bg-dark-400 !border !border-white/10"
              options={[
                { value: 'short', label: 'Ngắn (< 5 phút)' },
                { value: 'medium', label: 'Trung bình (5-15 phút)' },
                { value: 'long', label: 'Dài (> 15 phút)' },
              ]}
            />
            <div className="h-6 w-px bg-white/10 mx-2 hidden sm:block" />
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider hidden sm:block">Lọc nhanh:</span>
            <div className="flex gap-2 flex-wrap">
              <span className="px-3 py-1.5 rounded-lg bg-secondary/10 text-secondary border border-secondary/20 text-xs font-bold cursor-pointer">
                K-Pop
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-white/5 text-slate-400 border border-white/10 text-xs font-bold hover:text-white cursor-pointer transition-colors">
                Variety Show
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-white/5 text-slate-400 border border-white/10 text-xs font-bold hover:text-white cursor-pointer transition-colors">
                Vlog
              </span>
            </div>
          </div>
          <Select
            defaultValue="popular"
            className="!min-w-[180px]"
            popupClassName="!bg-dark-400 !border !border-white/10"
            options={[
              { value: 'popular', label: 'Phổ biến nhất' },
              { value: 'newest', label: 'Mới nhất' },
              { value: 'rating', label: 'Đánh giá cao' },
              { value: 'duration-asc', label: 'Thời lượng: Ngắn → Dài' },
              { value: 'duration-desc', label: 'Thời lượng: Dài → Ngắn' },
            ]}
            suffixIcon={<SwapOutlined style={{ color: '#94a3b8' }} />}
          />
        </section>

        {/* Video Grid */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-black text-white">Khám phá video</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VIDEO_CARDS.map((video) => (
              <div
                key={video.title}
                className="group cursor-pointer"
                onClick={() => router.push(`/learn/${video.slug}`)}
              >
                <div className="relative aspect-video rounded-2xl overflow-hidden mb-3 border border-white/5">
                  <img
                    alt={video.title}
                    src={video.image}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                  {video.priceType === 'free' ? (
                    <div className="absolute top-2 right-2 bg-primary/90 text-background-dark font-black text-[10px] px-2 py-0.5 rounded uppercase">
                      FREE
                    </div>
                  ) : (
                    <div className="absolute top-2 right-2 bg-secondary text-white font-black text-[10px] px-2 py-0.5 rounded flex items-center gap-0.5">
                      <DollarOutlined style={{ fontSize: 12 }} />
                      {video.price} COIN
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 glass text-white text-[10px] px-2 py-0.5 rounded font-bold">
                    {video.duration}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/40">
                      <PlayCircleOutlined style={{ color: '#0B0B0F', fontSize: 28 }} />
                    </div>
                  </div>
                </div>
                <h4 className="text-white font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2 text-sm">
                  {video.title}
                </h4>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] text-slate-400 font-bold px-1.5 py-0.5 rounded bg-white/5 border border-white/10 uppercase">
                    {video.level}
                  </span>
                  <span className="text-[10px] text-slate-500">•</span>
                  <span className="text-[10px] text-slate-500">{video.views}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* AI Recommendations Section */}
        <section className="relative mb-16">
          <div className="absolute -left-4 top-0 w-1 h-8 bg-secondary rounded-full" />
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <StarOutlined style={{ color: '#7c4dff', fontSize: 22 }} />
            <h3 className="text-2xl font-black text-white">AI Gợi ý cho bạn</h3>
            <span className="text-xs text-slate-500 font-medium">Dựa trên tiến độ học tập gần đây</span>
          </div>
          <div className="space-y-4">
            {AI_RECOMMENDATIONS.map((rec) => (
              <div
                key={rec.title}
                className="glass p-6 rounded-3xl flex gap-6 group hover:border-primary/30 transition-all cursor-pointer"
                onClick={() => router.push(`/learn/${rec.slug}`)}
              >
                <div className="w-1/3 aspect-video rounded-xl overflow-hidden shrink-0 relative">
                  <img alt={rec.title} src={rec.image} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all">
                    <PlayCircleOutlined style={{ color: 'white', fontSize: 32 }} />
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <h4 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">
                    {rec.title}
                  </h4>
                  <p className="text-sm text-slate-400 mb-4 line-clamp-2">{rec.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <ClockCircleOutlined style={{ color: '#94a3b8', fontSize: 16 }} />
                        <span className="text-sm text-slate-400">{rec.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-secondary/10 border border-secondary/20">
                        <FireOutlined style={{ color: '#7c4dff', fontSize: 14 }} />
                        <span className="text-sm font-bold text-secondary">{rec.match}% phù hợp</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-bold text-primary">
                      Học ngay
                      <RiseOutlined style={{ fontSize: 14 }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Trending Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-orange-400 to-red-500 rounded-full" />
              <h3 className="text-2xl font-black text-white">Xu hướng tuần này</h3>
            </div>
            <a className="text-sm font-bold text-primary hover:underline" href="#">
              Xem tất cả
            </a>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
            {TRENDING_ITEMS.map((item) => (
              <div
                key={item.title}
                className="min-w-[280px] group cursor-pointer shrink-0"
                onClick={() => router.push(`/learn/${item.slug}`)}
              >
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-3">
                  <img
                    alt={item.title}
                    src={item.image}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-all" />
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <span className="px-2 py-1 rounded-lg bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase">
                      {item.category}
                    </span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <PlayCircleOutlined style={{ color: '#0B0B0F', fontSize: 22 }} />
                    </div>
                  </div>
                </div>
                <h4 className="text-white font-bold text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2">
                  {item.title}
                </h4>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Stats */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {[
            { icon: <PlayCircleOutlined />, label: 'Video đã học', value: '24' },
            { icon: <ClockCircleOutlined />, label: 'Giờ học', value: '12.5h' },
            { icon: <StarOutlined />, label: 'Từ vựng mới', value: '186' },
            { icon: <FireOutlined />, label: 'Ngày học liên tiếp', value: '7' },
          ].map((stat, i) => (
            <div key={i} className="glass p-6 rounded-2xl flex flex-col items-center gap-3 text-center">
              <span style={{ color: '#00e5ff' }} className="text-3xl">{stat.icon}</span>
              <span className="text-3xl font-black text-white">{stat.value}</span>
              <span className="text-xs text-slate-500 font-medium">{stat.label}</span>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
