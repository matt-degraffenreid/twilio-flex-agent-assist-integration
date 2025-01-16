import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface AgentAssistAdminState {
  conversationProfile: string;
  customApiEndpoint: string;
  agentCoaching: boolean;
  conversationSummary: boolean;
  knowledgeAssist: boolean;
  smartReply: boolean;
  enableVoice: boolean;
  notifierServerEndpoint: string;
  transcription: {
    enabled: boolean;
    version: {
      live_transcription: boolean;
      intermediate_transcription: boolean;
    };
  };
  debug: boolean;
  hasError: boolean;
}

const initialState = {
  conversationProfile: '',
  customApiEndpoint: '',
  agentCoaching: false,
  conversationSummary: false,
  knowledgeAssist: false,
  smartReply: false,
  enableVoice: false,
  notifierServerEndpoint: '',
  transcription: {
    enabled: false,
    version: {
      live_transcription: true,
      intermediate_transcription: false,
    },
  },
  debug: false,
  hasError: false,
} as AgentAssistAdminState;

const agentAssistAdminSlice = createSlice({
  name: 'agentAssistAdmin',
  initialState,
  reducers: {
    updateAgentAssistAdminState(state, action: PayloadAction<Partial<AgentAssistAdminState>>) {
      return { ...state, ...action.payload };
    },
  },
});
export const { updateAgentAssistAdminState } = agentAssistAdminSlice.actions;
export const reducerHook = () => ({ agentAssistAdmin: agentAssistAdminSlice.reducer });
export default agentAssistAdminSlice.reducer;
