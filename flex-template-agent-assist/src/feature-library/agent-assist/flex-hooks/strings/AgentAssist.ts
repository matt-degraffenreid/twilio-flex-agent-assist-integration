// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  AgentAssist = 'CCAIAgentAssist',
  ErrorFetching = 'CCAIAgentAssistErrorFetching',
  AgentAssistConnected = 'CCAIAgentAssistConnected',
  AgentAssistDisconnected = 'CCAIAgentAssistDisconnected',
}

export const stringHook = () => ({
  'en-US': {
    [StringTemplates.AgentAssist]: 'Google CCAI Agent Assist',
    [StringTemplates.ErrorFetching]: 'There was an error starting Agent Assist. Please reload the page.',
    [StringTemplates.AgentAssistConnected]: 'Google CCAI Agent Assist connected',
    [StringTemplates.AgentAssistDisconnected]: 'Google CCAI Agent Assist disconnected',
  },
});