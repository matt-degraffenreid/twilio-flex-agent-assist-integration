// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  AgentAssist = 'CCAIAgentAssist',
  ErrorFetching = 'CCAIAgentAssistErrorFetching',
  AgentAssistConnected = 'CCAIAgentAssistConnected',
  AgentAssistDisconnected = 'CCAIAgentAssistDisconnected',
  ConversationSummarization = 'CCAIConversationSummarizationTab',
  KnowledgeAssist = 'CCAIKnowledgeAssist',
  GenerativeKnowledgeAssist = 'CCAIGenerativeKnowledgeAssist',
  ProactiveGenerativeKnowledgeAssist = 'CCAIProactiveGenerativeKnowledgeAssist',
  Transcription = 'CCAITranscription',
  LiveTranscription = 'CCAILiveTranscription',
  IntermediateTranscription = 'CCAIIntermediateTranscription',
  AgentCoaching = 'CCAIAgentCoaching',
  SmartReply = 'CCAISmartReply',
  ConversationProfile = 'CCAIConversationProfile',
  CustomApiEndpoint = 'CCAICustomApiEndpoint',
  NotiferServerEnpoint = 'CCAINotifierServerEndpoint'
}

export const stringHook = () => ({
  'en-US': {
    [StringTemplates.AgentAssist]: 'Google CCAI Agent Assist',
    [StringTemplates.ErrorFetching]: 'There was an error starting Agent Assist. Please reload the page.',
    [StringTemplates.AgentAssistConnected]: 'Google CCAI Agent Assist connected',
    [StringTemplates.AgentAssistDisconnected]: 'Google CCAI Agent Assist disconnected',
    [StringTemplates.ConversationSummarization]: 'Conversation Summarization',
    [StringTemplates.KnowledgeAssist]: 'Knowledge Assist',
    [StringTemplates.GenerativeKnowledgeAssist]: 'Generative Knowledge Assist',
    [StringTemplates.ProactiveGenerativeKnowledgeAssist]: 'Proactive Generative Knowledge Assist',
    [StringTemplates.Transcription]: 'Transcription',
    [StringTemplates.LiveTranscription]: 'Live Transcription',
    [StringTemplates.IntermediateTranscription]: 'Intermediate Transcription',
    [StringTemplates.AgentCoaching]: 'Agent Coaching',
    [StringTemplates.ConversationProfile]: 'Conversation Profile',
    [StringTemplates.SmartReply]: 'Smart Reply',
    [StringTemplates.CustomApiEndpoint]: 'Custom API Endpoint',
    [StringTemplates.NotiferServerEnpoint]: 'Notifier Server Endpoint',    

  },
});