/**
 * Application state management using React Context.
 * Manages document, analysis, comparison, and UI state.
 */
'use client';

import React, { createContext, useContext, useReducer, type ReactNode } from 'react';
import type {
  ParsedDocument,
  DocumentAnalysis,
  ComparisonResult,
  ActionPlan,
  LawyerBrief,
  QAMessage,
  UserNote,
} from '@/types/document';

export type AppView = 'landing' | 'workspace' | 'compare';
export type WorkspaceTab = 'overview' | 'clarity' | 'risks' | 'questions' | 'actions' | 'timeline';

interface AppState {
  view: AppView;
  workspaceTab: WorkspaceTab;
  document: ParsedDocument | null;
  analysis: DocumentAnalysis | null;
  comparisonDocA: ParsedDocument | null;
  comparisonDocB: ParsedDocument | null;
  comparisonResult: ComparisonResult | null;
  actionPlan: ActionPlan | null;
  lawyerBrief: LawyerBrief | null;
  messages: QAMessage[];
  notes: UserNote[];
  isAnalyzing: boolean;
  isComparing: boolean;
  analysisStage: string;
  error: string | null;
  plainLanguageMode: boolean;
  selectedClauseId: string | null;
  searchQuery: string;
  commandPaletteOpen: boolean;
  isDemo: boolean;
}

type AppAction =
  | { type: 'SET_VIEW'; payload: AppView }
  | { type: 'SET_WORKSPACE_TAB'; payload: WorkspaceTab }
  | { type: 'SET_DOCUMENT'; payload: ParsedDocument }
  | { type: 'SET_ANALYSIS'; payload: DocumentAnalysis }
  | { type: 'SET_COMPARISON_DOCS'; payload: { docA: ParsedDocument; docB: ParsedDocument } }
  | { type: 'SET_COMPARISON_RESULT'; payload: ComparisonResult }
  | { type: 'SET_ACTION_PLAN'; payload: ActionPlan }
  | { type: 'SET_LAWYER_BRIEF'; payload: LawyerBrief }
  | { type: 'ADD_MESSAGE'; payload: QAMessage }
  | { type: 'ADD_NOTE'; payload: UserNote }
  | { type: 'REMOVE_NOTE'; payload: string }
  | { type: 'SET_ANALYZING'; payload: boolean }
  | { type: 'SET_COMPARING'; payload: boolean }
  | { type: 'SET_ANALYSIS_STAGE'; payload: string }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'TOGGLE_PLAIN_LANGUAGE' }
  | { type: 'SELECT_CLAUSE'; payload: string | null }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'TOGGLE_COMMAND_PALETTE' }
  | { type: 'SET_IS_DEMO'; payload: boolean }
  | { type: 'RESET' };

const initialState: AppState = {
  view: 'landing',
  workspaceTab: 'overview',
  document: null,
  analysis: null,
  comparisonDocA: null,
  comparisonDocB: null,
  comparisonResult: null,
  actionPlan: null,
  lawyerBrief: null,
  messages: [],
  notes: [],
  isAnalyzing: false,
  isComparing: false,
  analysisStage: '',
  error: null,
  plainLanguageMode: false,
  selectedClauseId: null,
  searchQuery: '',
  commandPaletteOpen: false,
  isDemo: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, view: action.payload, error: null };
    case 'SET_WORKSPACE_TAB':
      return { ...state, workspaceTab: action.payload };
    case 'SET_DOCUMENT':
      return { ...state, document: action.payload, view: 'workspace' };
    case 'SET_ANALYSIS':
      return { ...state, analysis: action.payload, isAnalyzing: false, analysisStage: '' };
    case 'SET_COMPARISON_DOCS':
      return { ...state, comparisonDocA: action.payload.docA, comparisonDocB: action.payload.docB };
    case 'SET_COMPARISON_RESULT':
      return { ...state, comparisonResult: action.payload, isComparing: false };
    case 'SET_ACTION_PLAN':
      return { ...state, actionPlan: action.payload };
    case 'SET_LAWYER_BRIEF':
      return { ...state, lawyerBrief: action.payload };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'ADD_NOTE':
      return { ...state, notes: [...state.notes, action.payload] };
    case 'REMOVE_NOTE':
      return { ...state, notes: state.notes.filter(n => n.id !== action.payload) };
    case 'SET_ANALYZING':
      return { ...state, isAnalyzing: action.payload };
    case 'SET_COMPARING':
      return { ...state, isComparing: action.payload };
    case 'SET_ANALYSIS_STAGE':
      return { ...state, analysisStage: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isAnalyzing: false, isComparing: false };
    case 'TOGGLE_PLAIN_LANGUAGE':
      return { ...state, plainLanguageMode: !state.plainLanguageMode };
    case 'SELECT_CLAUSE':
      return { ...state, selectedClauseId: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'TOGGLE_COMMAND_PALETTE':
      return { ...state, commandPaletteOpen: !state.commandPaletteOpen };
    case 'SET_IS_DEMO':
      return { ...state, isDemo: action.payload };
    case 'RESET':
      return { ...initialState };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
