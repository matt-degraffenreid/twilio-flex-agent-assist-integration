// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  ConnectingToCustomApiEndpointError = 'CCAIConnectingToCustomApiEndpointError',
  ConnectingToCustomApiEndpointSuccess = 'CCAIConnectingToCustomApiEndpointSuccess',
  ConnectingToNotifierServerEndpointError = 'CCAIConnectingToNotifierServerEndpointError',
  ConnectingToNotifierServerEndpointSuccess = 'CCAIConnectingToNotifierServerEndpointSuccess',
  ConversationProfileErrorText = 'CCAIConversationProfileErrorText',
  TestConnectionCTA = 'CCAITestConnectionCTA',
  AgentCoachingHelperText = 'CCAIAgentCoachingHelperText',
  ConversationSummarizationHelperText = 'CCAIConversationSummarizationHelperText', 
  GenerativeKnowledgeAssistHelperText = 'CCAIGenerativeKnowledgeAssistHelperText', 
  ProactiveGenerativeKnowledgeAssistHelperText = 'CCAIProactiveGenerativeKnowledgeAssistHelperText', 
  SmartReplyHelperText = 'CCAISmartReplyHelperText',
  LiveTranscriptionHelperText = 'CCAILiveTranscriptionHelperText',
  IntermediateTranscriptionHelperText = 'CCAIIntermediateTranscriptionHelperText',
}

export const stringHook = () => ({
  'en-US': {
    [StringTemplates.ConnectingToCustomApiEndpointError]: 'Error establishing connection to the custom api endpoint.',
    [StringTemplates.ConnectingToCustomApiEndpointSuccess]: 'Connection to the custom api endpoint successful.',
    [StringTemplates.ConnectingToNotifierServerEndpointError]: 'Error establishing connection to the notifier server endpoint.',
    [StringTemplates.ConnectingToNotifierServerEndpointSuccess]: 'Connection to the notifier server endpoint successful.',
    [StringTemplates.ConversationProfileErrorText]: 'Enter a conversation profile with the format projects/PROJECT_ID/locations/LOCATION/conversationProfiles/PROFILE_ID',
    [StringTemplates.TestConnectionCTA]: 'Test Connection',
    [StringTemplates.AgentCoachingHelperText]: 'Provide agents with suggestions for how they should respond during a customer service conversation.',
    [StringTemplates.ConversationSummarizationHelperText]: 'Provide summaries to your agents during a conversation.',
    [StringTemplates.GenerativeKnowledgeAssistHelperText]: 'Allow agents to search your knowledge base for articles or FAQ documents.',
    [StringTemplates.ProactiveGenerativeKnowledgeAssistHelperText]: 'Provides answers to your agents questions based on information in documents you provide.',
    [StringTemplates.SmartReplyHelperText]: 'Provide agents with suggested responses are calculated by a custom model that has been trained on your own conversation data.',
    [StringTemplates.LiveTranscriptionHelperText]: 'Support transcription after a user is done speaking.',
    [StringTemplates.IntermediateTranscriptionHelperText]: 'Supports transcription as a user is speaking.',
  },
});