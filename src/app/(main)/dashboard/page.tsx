'use client';

import { Card, Typography, Row, Col, Statistic } from 'antd';
import { 
  PlayCircleOutlined, 
  BookOutlined, 
  TrophyOutlined, 
  FireOutlined 
} from '@ant-design/icons';
import { ContinueWatching, RecentlyWatched } from '@/components/player';

const { Title, Text } = Typography;

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <Title level={2} className="!text-white !mb-2">Welcome back!</Title>
        <Text className="text-gray-400">Continue your Korean learning journey</Text>
      </div>

      {/* Stats */}
      <Row gutter={16}>
        <Col xs={12} sm={12} md={6}>
          <Card className="!bg-dark-300 !border-dark-100">
            <Statistic
              title={<span className="text-gray-400">Videos Watched</span>}
              value={12}
              prefix={<PlayCircleOutlined className="text-primary-400" />}
              valueStyle={{ color: '#ffffff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card className="!bg-dark-300 !border-dark-100">
            <Statistic
              title={<span className="text-gray-400">Flashcards</span>}
              value={156}
              prefix={<BookOutlined className="text-accent-400" />}
              valueStyle={{ color: '#ffffff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card className="!bg-dark-300 !border-dark-100">
            <Statistic
              title={<span className="text-gray-400">Day Streak</span>}
              value={7}
              prefix={<FireOutlined className="text-orange-400" />}
              valueStyle={{ color: '#ffffff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card className="!bg-dark-300 !border-dark-100">
            <Statistic
              title={<span className="text-gray-400">Achievements</span>}
              value={5}
              prefix={<TrophyOutlined className="text-yellow-400" />}
              valueStyle={{ color: '#ffffff' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Continue Watching */}
      <ContinueWatching limit={6} />

      {/* Recently Watched */}
      <RecentlyWatched limit={8} />

      {/* Due Flashcards */}
      <Card 
        title={<span className="text-white">Flashcards Due</span>}
        className="!bg-dark-300 !border-dark-100"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Text className="text-gray-400">You have</Text>
            <Text className="text-primary-400 text-2xl font-bold">15</Text>
            <Text className="text-gray-400">cards to review</Text>
          </div>
          <button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors">
            Start Review
          </button>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card 
        title={<span className="text-white">Quick Actions</span>}
        className="!bg-dark-300 !border-dark-100"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a href="/dashboard" className="block p-4 bg-dark-200 rounded-lg hover:bg-dark-100 transition-colors text-center">
            <PlayCircleOutlined className="text-3xl text-primary-400 mb-2" />
            <Text className="text-white block">Browse Videos</Text>
          </a>
          <a href="/flashcards" className="block p-4 bg-dark-200 rounded-lg hover:bg-dark-100 transition-colors text-center">
            <BookOutlined className="text-3xl text-accent-400 mb-2" />
            <Text className="text-white block">Flashcards</Text>
          </a>
          <a href="/library" className="block p-4 bg-dark-200 rounded-lg hover:bg-dark-100 transition-colors text-center">
            <PlayCircleOutlined className="text-3xl text-purple-400 mb-2" />
            <Text className="text-white block">My Library</Text>
          </a>
          <a href="/vocabulary" className="block p-4 bg-dark-200 rounded-lg hover:bg-dark-100 transition-colors text-center">
            <BookOutlined className="text-3xl text-yellow-400 mb-2" />
            <Text className="text-white block">Vocabulary</Text>
          </a>
        </div>
      </Card>
    </div>
  );
}
