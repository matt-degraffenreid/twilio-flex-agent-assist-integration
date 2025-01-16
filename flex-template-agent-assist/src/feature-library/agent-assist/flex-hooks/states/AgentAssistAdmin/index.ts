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
}

const initialState = {
  conversationProfile: '',
  customApiEndpoint: '',
  agentCoaching: false,
  conversationSummary: false,
  knowledgeAssist: false,
  smartReply: false,
} as AgentAssistAdminState;

const agentAssistSlice = createSlice({
  name: 'agentAssistAdmin',
  initialState,
  reducers: {
    updateAgentAssistAdminState(state, action: PayloadAction<Partial<AgentAssistAdminState>>) {
      return { ...state, ...action.payload };
    },
  },
});
export const { updateAgentAssistAdminState } = agentAssistSlice.actions;
export const reducerHook = () => ({ agentAssist: agentAssistSlice.reducer });
export default agentAssistSlice.reducer;
