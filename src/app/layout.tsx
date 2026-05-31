import type { Metadata } from 'next';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
import { QueryProvider } from '@/lib/query-provider';
import { SocketProvider } from '@/lib/socket-provider';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'K-MATE | Học Tiếng Hàn Cùng AI',
  description:
    'Học tiếng Hàn thực chiến qua K-Drama, K-Pop và AI thông minh. Trải nghiệm phương pháp học nhập vai đỉnh cao ngay hôm nay.',
  keywords: ['học tiếng Hàn', 'K-Drama', 'K-Pop', 'AI', 'phụ đề song ngữ', 'flashcard', 'SRS'],
};

const theme = {
  token: {
    colorPrimary: '#7C4DFF',
    colorBgBase: '#0B0B0F',
    colorTextBase: '#ffffff',
    colorBgContainer: '#151c2a',
    borderRadius: 8,
    fontFamily: 'Inter, system-ui, sans-serif',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background-dark text-white font-display antialiased">
        <AntdRegistry>
          <ConfigProvider theme={theme}>
            <QueryProvider>
              <SocketProvider>
                {children}
              </SocketProvider>
            </QueryProvider>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
