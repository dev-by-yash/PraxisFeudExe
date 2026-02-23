export interface Player {
  id: string;
  name: string;
  teamId: string;
  isConnected: boolean;
}

export interface Team {
  id: string;
  name: string;
  score: number;
  players: Player[];
  strikes: number;
  gameCode?: string; // Optional - teams can be associated with specific games
}

export interface Answer {
  text: string;
  points: number;
  revealed: boolean;
}

export interface Question {
  id: string;
  text: string;
  answers: Answer[];
  currentAnswerIndex: number;
}

export interface Round {
  id: string;
  name: string;
  questions: Question[];
  currentQuestionIndex: number;
}

export interface Game {
  id: string;
  code: string;
  hostId: string;
  teams: Team[];
  rounds: Round[];
  currentRoundIndex: number;
  currentTeamTurn: string;
  gameState: 'waiting' | 'playing' | 'buzzer' | 'answering' | 'finished';
  buzzerPressed: {
    teamId: string;
    teamName: string;
    timestamp: number;
  } | null;
  questionVisible?: boolean; // Track if question is shown on display
  createdAt: Date;
  isActive: boolean;
}

export interface WSMessage {
  type: 'host_create' | 'player_join' | 'display_join' | 'leaderboard_join' | 'buzzer_press' | 'host_action' | 'game_update' | 'error' | 'game_created' | 'joined_game' | 'player_joined' | 'buzzer_pressed' | 'buzzer_enabled' | 'buzzer_reset' | 'buzzer_too_late' | 'team_manager_join' | 'team_management_action' | 'team_updated' | 'answer_revealed' | 'question_changed' | 'points_updated' | 'teams_loaded' | 'teams_selected' | 'player_joined_team' | 'load_all_teams' | 'question_visibility_changed' | 'game_ended' | 'used_questions_reset' | 'questions_loaded' | 'load_all_questions' | 'select_questions' | 'reset_used_questions';
  data: any;
  gameCode?: string;
  playerId?: string;
  teamId?: string;
}

export interface HostAction {
  type: 'reveal_answer' | 'next_question' | 'next_round' | 'reset_buzzer' | 'add_strike' | 'update_score' | 'manage_teams' | 'start_game' | 'enable_buzzer' | 'add_points' | 'create_team' | 'add_player_to_team' | 'remove_player_from_team' | 'show_question' | 'hide_question' | 'end_game';
  data?: any;
}