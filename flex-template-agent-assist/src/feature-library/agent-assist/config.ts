import { getFeatureFlags } from '../../utils/configuration';
import AgentAssistConfig from './types/ServiceConfiguration';

const { 
  enabled = false,
  custom_api_endpoint = '',
  conversation_profile = '',
  conversation_summary =  true,
  agent_coaching =  true,
  proactive_general_knowleadge_assist =  true,
  smart_reply =  true,
  enable_voice =  false,
  notifier_server_endpoint = '',
  transcription =  false,
  intermediate_transcription =  false,
  debug =  false,
} = (getFeatureFlags()?.features?.agent_assist as AgentAssistConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const getCustomApiEndpoint = () => {
  return custom_api_endpoint;
}

export const getConversationProfile = () => {
  return conversation_profile;
}

export const isConversationSummaryEnabled = () => {
  return conversation_summary;
}

export const isAgentCoachingEnabled = () => {
  return agent_coaching;
}

export const isPGKAEnabled = () => {
  return proactive_general_knowleadge_assist;
}

export const isSmartReplyEnabled = () => {
  return smart_reply;
}

export const isVoiceEnabled = () => {
  return enable_voice;
}

export const getNotifierServerEndpoint = () => {
  return notifier_server_endpoint;
}

export const isTranscriptionEnabled = () => {
  return transcription;
}

export const isIntermediateTranscriptionEnabled = () => {
  return intermediate_transcription;
}

export const isDebugEnabled = () => {
  return debug;
}