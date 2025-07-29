import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const PricingSection = () => {
  const plans = [
    {
      name: "Free User",
      role: "Free_User",
      price: "무료",
      period: "",
      description: "글쓰기 기초와 핵심 강의 맛보기",
      features: [
        "기초 강의 3개 무료 수강",
        "커뮤니티 참여",
        "학습 진도 추적",
        "기본 글쓰기 템플릿"
      ],
      buttonText: "무료 시작",
      buttonVariant: "outline",
      popular: false
    },
    {
      name: "Premium",
      role: "Premium", 
      price: "29,000원",
      period: "/월",
      description: "체계적 학습과 실전 콘텐츠 제작",
      features: [
        "모든 강의 무제한 수강",
        "1:1 피드백 월 2회",
        "프리미엄 템플릿 100+",
        "수익화 전략 가이드",
        "전문가 Q&A 참여",
        "수료증 발급"
      ],
      buttonText: "프리미엄 시작",
      buttonVariant: "primary",
      popular: true
    },
    {
      name: "Master",
      role: "Master",
      price: "89,000원", 
      period: "/월",
      description: "개인 맞춤 코칭과 수익 최적화",
      features: [
        "Premium 모든 혜택",
        "1:1 개인 코칭 월 4회",
        "맞춤형 수익화 전략",
        "직접 첨삭 서비스",
        "마스터 전용 커뮤니티",
        "수익 분석 리포트",
        "우선 지원 서비스"
      ],
      buttonText: "마스터 시작",
      buttonVariant: "accent",
      popular: false
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-white via-surface to-gray-100 dark:from-gray-800 dark:via-gray-900 dark:to-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            <span className="gradient-text">학습 단계별 멤버십</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            글쓰기 수준과 목표에 맞는 최적의 학습 환경을 제공합니다.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.role}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Card className={`h-full hover-lift border-0 shadow-card hover:shadow-elevated relative overflow-hidden ${
                plan.popular 
                  ? "bg-gradient-to-br from-primary/5 via-white to-accent/5 dark:from-primary/10 dark:via-gray-800 dark:to-accent/10 ring-2 ring-primary/20" 
                  : "bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900"
              }`}>
                {plan.popular && (
                  <div className="absolute -top-px left-1/2 transform -translate-x-1/2">
                    <Badge variant="primary" className="shadow-lg">
                      가장 인기
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </CardTitle>
                  <div className="mb-4">
                    <span className="text-3xl font-bold gradient-text">{plan.price}</span>
                    <span className="text-gray-600 dark:text-gray-400">{plan.period}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {plan.description}
                  </p>
                </CardHeader>

                <CardContent className="px-6 pb-6">
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-5 h-5 bg-gradient-to-r from-success to-green-600 rounded-full flex items-center justify-center mt-0.5">
                          <ApperIcon name="Check" className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={plan.buttonVariant}
                    className="w-full hover-glow"
                    size="lg"
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 max-w-2xl mx-auto">
            <ApperIcon name="Shield" className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              30일 무조건 환불 보장
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              학습이 만족스럽지 않다면 30일 내 100% 환불해드립니다. 위험 부담 없이 시작해보세요.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;