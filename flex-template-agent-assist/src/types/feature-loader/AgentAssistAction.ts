// @ts-nocheck
export enum AgentAssistAction {
   analyzeContentRequest = 'analyze-content-requested',
   activeConversationSelected= 'active-conversation-selected'
}

export const invokeAgentAssistAction = (name: AgentAssistAction, payload: any) => {
    dispatchAgentAssistEvent(name, {
        detail: {
            ...payload
        },
    });
}