import React, { useState } from 'react';
import { WheelOfFortune } from '@/components/WheelOfFortune';
import { QuestionModal } from '@/components/QuestionModal';
import { Scoreboard } from '@/components/Scoreboard';
import { ExcelUpload } from '@/components/ExcelUpload';
import { Card } from '@/components/ui/card';
import { Sparkles, Crown } from 'lucide-react';

const Index = () => {
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [questionsSkipped, setQuestionsSkipped] = useState(0);
  const [streak, setStreak] = useState(0);
  const [customQuestions, setCustomQuestions] = useState<string[]>([]);

  const handleQuestionSelected = (question: string) => {
    setCurrentQuestion(question);
    setIsQuestionModalOpen(true);
  };

  const handleAnswer = (answer: string, points: number) => {
    setScore(prev => prev + points);
    setQuestionsAnswered(prev => prev + 1);
    setStreak(prev => prev + 1);
    setIsQuestionModalOpen(false);
  };

  const handleSkip = () => {
    setQuestionsSkipped(prev => prev + 1);
    setStreak(0); // Reset streak on skip
    setIsQuestionModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsQuestionModalOpen(false);
    setCurrentQuestion('');
  };

  const handleQuestionsLoaded = (questions: string[]) => {
    setCustomQuestions(questions);
  };

  const handleClearQuestions = () => {
    setCustomQuestions([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, hsl(var(--primary)) 2px, transparent 2px),
                           radial-gradient(circle at 75% 75%, hsl(var(--wheel-emerald)) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Crown className="w-8 h-8 text-primary animate-glow" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-wheel-ruby to-wheel-purple bg-clip-text text-transparent">
              Wheel of Misfortune
            </h1>
            <Crown className="w-8 h-8 text-primary animate-glow" />
          </div>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Spin the wheel and face questions that will test your courage! 
            <br />
            <span className="text-primary font-semibold">Answer honestly to earn points and build your streak!</span>
          </p>
        </div>

        {/* Excel Upload */}
        <div className="max-w-2xl mx-auto mb-4">
          <ExcelUpload
            onQuestionsLoaded={handleQuestionsLoaded}
            onClear={handleClearQuestions}
            questionCount={customQuestions.length}
          />
        </div>

        {/* Game Layout */}
        <div className="max-w-7xl mx-auto">
          {/* Scoreboard */}
          {/* <div className="lg:col-span-1 order-2 lg:order-1">
            <Scoreboard
              score={score}
              questionsAnswered={questionsAnswered}
              questionsSkipped={questionsSkipped}
              streak={streak}
            />
          </div> */}

          {/* Wheel */}
          <div>
            <Card className="p-4 bg-gradient-to-br from-card to-muted border-2 border-primary/20">
              <div className="flex flex-col items-center">
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-lg font-semibold text-center">
                    <Sparkles className="w-5 h-5 text-primary" />
                    {isSpinning ? (
                      <span className="text-primary animate-pulse">
                        The wheel decides your fate...
                      </span>
                    ) : (
                      <span className="text-muted-foreground">
                        Ready to test your courage?
                      </span>
                    )}
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                </div>

                <WheelOfFortune
                  onQuestionSelected={handleQuestionSelected}
                  isSpinning={isSpinning}
                  setIsSpinning={setIsSpinning}
                  customQuestions={customQuestions}
                />

                {!isSpinning && (
                  <div className="mt-8 text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      Each slice contains a different question of misfortune
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      <div className="w-4 h-4 bg-wheel-gold rounded-full"></div>
                      <div className="w-4 h-4 bg-wheel-emerald rounded-full"></div>
                      <div className="w-4 h-4 bg-wheel-sapphire rounded-full"></div>
                      <div className="w-4 h-4 bg-wheel-ruby rounded-full"></div>
                      <div className="w-4 h-4 bg-wheel-purple rounded-full"></div>
                      <div className="w-4 h-4 bg-wheel-orange rounded-full"></div>
                      <div className="w-4 h-4 bg-wheel-teal rounded-full"></div>
                      <div className="w-4 h-4 bg-wheel-magenta rounded-full"></div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Game Rules */}
        {/* <Card className="mt-8 p-6 bg-gradient-to-r from-muted/50 to-card/50 border border-primary/10">
          <h3 className="text-lg font-semibold mb-3 text-center">How to Play</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div className="text-center">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold mx-auto mb-2">1</div>
              <p><strong>Spin</strong> the wheel to get a random question</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-wheel-emerald rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2">2</div>
              <p><strong>Answer</strong> honestly to earn points (longer = more points)</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-wheel-ruby rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2">3</div>
              <p><strong>Build</strong> your streak and unlock achievements</p>
            </div>
          </div>
        </Card> */}
      </div>

      {/* Question Modal */}
      <QuestionModal
        isOpen={isQuestionModalOpen}
        question={currentQuestion}
        onAnswer={handleAnswer}
        onSkip={handleSkip}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Index;
