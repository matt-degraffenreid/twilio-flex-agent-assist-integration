export interface Transcription {
  enabled: boolean;
  version: {
    live_transcription: boolean;
    intermediate_transcription: boolean;
  }
}

export interface KnowleadgeAssist {
  enabled: boolean;
  version: {
    generative_knowleadge_assist: boolean;
    proactive_generative_knowleadge_assist: boolean;
  }
}

export default interface AgentAssistConfig {
  enabled: boolean;
  custom_api_endpoint: string;
  conversation_profile: string;
  conversation_summary: boolean;
  agent_coaching: boolean;
  knowleadge_assist: KnowleadgeAssist;
  smart_reply: boolean;
  enable_voice: boolean;
  notifier_server_endpoint: string;
  transcription: Transcription;
  debug: boolean;
}