export interface Transcription {
  enabled: boolean;
  version: {
    live_transcription: boolean;
    intermediate_transcription: boolean;
  }
}

export interface KnowledgeAssist {
  enabled: boolean;
  version: {
    generative_knowledge_assist: boolean;
    proactive_generative_knowledge_assist: boolean;
  }
}

export default interface AgentAssistConfig {
  enabled: boolean;
  custom_api_endpoint: string;
  conversation_profile: string;
  conversation_summary: boolean;
  agent_coaching: boolean;
  knowledge_assist: KnowledgeAssist;
  smart_reply: boolean;
  enable_voice: boolean;
  notifier_server_endpoint: string;
  transcription: Transcription;
  debug: boolean;
}