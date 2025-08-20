import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { AlertCircle, CheckCircle, SkipForward } from 'lucide-react';

interface QuestionModalProps {
  isOpen: boolean;
  question: string;
  onAnswer: (answer: string, points: number) => void;
  onSkip: () => void;
  onClose: () => void;
}

export const QuestionModal: React.FC<QuestionModalProps> = ({
  isOpen,
  question,
  onAnswer,
  onSkip,
  onClose
}) => {
  const [answer, setAnswer] = useState('');
  const [hasAnswered, setHasAnswered] = useState(false);

  const handleSubmit = () => {
    if (answer.trim()) {
      const points = calculatePoints(answer);
      onAnswer(answer, points);
      setHasAnswered(true);
      setTimeout(() => {
        handleClose();
      }, 2000);
    }
  };

  const handleSkip = () => {
    onSkip();
    handleClose();
  };

  const handleClose = () => {
    setAnswer('');
    setHasAnswered(false);
    onClose();
  };

  const calculatePoints = (answer: string): number => {
    const length = answer.trim().length;
    if (length < 10) return 1;
    if (length < 50) return 3;
    if (length < 100) return 5;
    return 10;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl animate-bounce-in">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-primary to-wheel-ruby bg-clip-text text-transparent">
            Question of Misfortune!
          </DialogTitle>
        </DialogHeader>
        
        <Card className="p-6 bg-gradient-to-br from-card to-muted border-2 border-primary/20">
          <div className="flex items-start gap-3 mb-6">
            <AlertCircle className="w-6 h-6 text-wheel-ruby flex-shrink-0 mt-1" />
            <p className="text-lg font-medium leading-relaxed">{question}</p>
          </div>

          {!hasAnswered ? (
            <div className="space-y-4">
              <Textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Share your thoughts... The more detailed, the more points you earn!"
                className="min-h-[120px] text-base border-2 border-primary/20 focus:border-primary"
                maxLength={500}
              />
              
              <div className="text-sm text-muted-foreground text-center">
                Points: {calculatePoints(answer)} | Characters: {answer.length}/500
              </div>

              <div className="flex gap-3 justify-center">
                <Button
                  onClick={handleSubmit}
                  disabled={!answer.trim()}
                  className="px-8 py-3 bg-gradient-to-r from-wheel-emerald to-accent hover:from-accent hover:to-wheel-emerald"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Submit Answer
                </Button>
                
                <Button
                  onClick={handleSkip}
                  variant="outline"
                  className="px-8 py-3 border-wheel-ruby text-wheel-ruby hover:bg-wheel-ruby hover:text-white"
                >
                  <SkipForward className="w-5 h-5 mr-2" />
                  Skip Question
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-wheel-emerald mx-auto mb-4 animate-bounce-in" />
              <h3 className="text-xl font-bold text-wheel-emerald mb-2">Answer Submitted!</h3>
              <p className="text-muted-foreground">Great job sharing your thoughts!</p>
            </div>
          )}
        </Card>
      </DialogContent>
    </Dialog>
  );
};