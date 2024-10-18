export default interface AgentAssistConfig {
  enabled: boolean;
  custom_api_endpoint: string;
  conversation_profile: string;
  conversation_summary: boolean;
  agent_coaching: boolean;
  proactive_general_knowleadge_assist: boolean;
  smart_reply: boolean;
  enable_voice: boolean;
  notifier_server_endpoint: string;
  transcription: boolean;
  intermediate_transcription: boolean;
  debug: boolean;
}
