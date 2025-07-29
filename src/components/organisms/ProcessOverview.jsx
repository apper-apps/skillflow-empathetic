import { motion } from "framer-motion";
import StepCard from "@/components/molecules/StepCard";

const ProcessOverview = () => {
  const steps = [
    {
      step: "01",
      title: "강점 찾기",
      description: "개인의 독특한 강점과 전문성을 발견하고, 글쓰기에 활용할 수 있는 핵심 역량을 파악합니다.",
      iconName: "Search"
    },
    {
      step: "02", 
      title: "콘셉트 설계",
      description: "발견한 강점을 바탕으로 독자에게 가치를 전달할 수 있는 명확한 콘셉트와 방향성을 설계합니다.",
      iconName: "Lightbulb"
    },
    {
      step: "03",
      title: "글 시나리오",
      description: "체계적인 글쓰기 프레임워크를 활용하여 독자의 관심을 끌고 행동을 유도하는 시나리오를 작성합니다.",
      iconName: "FileText"
    },
    {
      step: "04",
      title: "수익화 실행",
      description: "완성된 콘텐츠를 다양한 플랫폼에 배치하고, 지속 가능한 수익 구조를 만들어 실제 수익을 창출합니다.",
      iconName: "DollarSign"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-surface dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            <span className="gradient-text">4단계 체계적 학습</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            검증된 프로세스를 통해 글쓰기 강점을 수익으로 전환하는 체계적인 학습 과정을 제공합니다.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <StepCard
              key={step.step}
              step={step.step}
              title={step.title}
              description={step.description}
              iconName={step.iconName}
              index={index}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 border border-primary/20 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              평균 3개월 내 첫 수익 창출
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              체계적인 4단계 프로세스를 통해 학습자의 89%가 3개월 내 첫 글쓰기 수익을 달성했습니다.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text mb-2">89%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">3개월 내 수익 창출</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text mb-2">평균 47만원</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">첫 달 수익</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text mb-2">4.9/5</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">학습자 만족도</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProcessOverview;