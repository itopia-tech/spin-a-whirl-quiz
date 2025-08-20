import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Zap, Star } from 'lucide-react';

interface ScoreboardProps {
  score: number;
  questionsAnswered: number;
  questionsSkipped: number;
  streak: number;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({
  score,
  questionsAnswered,
  questionsSkipped,
  streak
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 50) return 'text-wheel-gold';
    if (score >= 25) return 'text-wheel-emerald';
    if (score >= 10) return 'text-wheel-sapphire';
    return 'text-foreground';
  };

  const getScoreTitle = (score: number) => {
    if (score >= 100) return 'Misfortune Master';
    if (score >= 50) return 'Truth Seeker';
    if (score >= 25) return 'Brave Soul';
    if (score >= 10) return 'Getting Started';
    return 'Rookie';
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-muted border-2 border-primary/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Trophy className="w-6 h-6 text-primary" />
          Scoreboard
        </h2>
        <Badge variant="outline" className="text-lg px-4 py-1 border-primary text-primary">
          {getScoreTitle(score)}
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
          <div className={`text-3xl font-bold ${getScoreColor(score)} flex items-center justify-center gap-1`}>
            <Star className="w-6 h-6" />
            {score}
          </div>
          <p className="text-sm text-muted-foreground mt-1">Total Score</p>
        </div>

        <div className="text-center p-4 rounded-lg bg-gradient-to-br from-wheel-emerald/10 to-wheel-emerald/5 border border-wheel-emerald/20">
          <div className="text-3xl font-bold text-wheel-emerald flex items-center justify-center gap-1">
            <Target className="w-6 h-6" />
            {questionsAnswered}
          </div>
          <p className="text-sm text-muted-foreground mt-1">Answered</p>
        </div>

        <div className="text-center p-4 rounded-lg bg-gradient-to-br from-wheel-ruby/10 to-wheel-ruby/5 border border-wheel-ruby/20">
          <div className="text-3xl font-bold text-wheel-ruby">
            {questionsSkipped}
          </div>
          <p className="text-sm text-muted-foreground mt-1">Skipped</p>
        </div>

        <div className="text-center p-4 rounded-lg bg-gradient-to-br from-wheel-orange/10 to-wheel-orange/5 border border-wheel-orange/20">
          <div className="text-3xl font-bold text-wheel-orange flex items-center justify-center gap-1">
            <Zap className="w-6 h-6" />
            {streak}
          </div>
          <p className="text-sm text-muted-foreground mt-1">Streak</p>
        </div>
      </div>

      {score > 0 && (
        <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-wheel-gold/10 border border-primary/20">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Progress to next level:</span>
            <span className="text-sm text-muted-foreground">
              {score}/ {Math.ceil((score + 25) / 25) * 25}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 mt-2">
            <div
              className="bg-gradient-to-r from-primary to-wheel-gold h-2 rounded-full transition-all duration-500"
              style={{
                width: `${((score % 25) / 25) * 100}%`
              }}
            />
          </div>
        </div>
      )}
    </Card>
  );
};