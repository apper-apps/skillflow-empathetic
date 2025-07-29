import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const SecondLandingPage = () => {
  const navigate = useNavigate();

  const handleAdditionalWait = () => {
    // Navigate to signup or another page as needed
    navigate('/signup');
  };

  const influencerAdvantages = [
    '✨ 개인 브랜드 구축으로 신뢰도 향상',
    '📈 지속적인 수익 창출 구조 마련', 
    '🎯 타겟 오디언스와의 깊은 연결',
    '💡 창작 활동을 통한 자아실현',
    '🚀 온라인 비즈니스 확장 기회',
    '📚 전문성 인정받는 콘텐츠 제작자',
    '🌟 영향력 있는 인플루언서로 성장',
    '💰 다양한 수익화 채널 개발'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-primary to-secondary">
      {/* Header/Navigation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 p-6"
      >
        <Button
          variant="ghost"
          onClick={() => navigate('/landing')}
          className="text-white hover:bg-white/10"
        >
          <ApperIcon name="ArrowLeft" className="w-5 h-5 mr-2" />
          돌아가기
        </Button>
      </motion.div>

      <div className="container mx-auto px-4 py-8">
        {/* Video Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
            <h1 className="text-3xl md:text-5xl font-bold text-white text-center mb-8">
              <span className="gradient-text">텍스트 인플루언서</span>
              <br />
              시작하기
            </h1>
            
            {/* Video Embed */}
            <div className="video-wrapper mb-8">
              {/* Placeholder for Adilo video embed - replace with actual embed code */}
              <iframe
                src="https://player.vimeo.com/video/placeholder"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title="Adilo Video"
                className="rounded-lg"
              ></iframe>
            </div>
            
            {/* Additional Wait Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-center"
            >
              <Button
                variant="accent"
                size="xl"
                onClick={handleAdditionalWait}
                className="text-lg px-12 py-4 hover-glow shadow-2xl"
              >
                <ApperIcon name="Clock" className="w-6 h-6 mr-3" />
                추가 대기하기
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Influencer Advantages Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">
              텍스트 인플루언서의 장점
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {influencerAdvantages.map((advantage, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + (index * 0.1), duration: 0.6 }}
                  className="flex items-center p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-200"
                >
                  <span className="text-white text-lg">{advantage}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SecondLandingPage;