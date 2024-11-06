import { getFeatureFlags } from '../../utils/configuration';
import AgentAssistConfig from './types/ServiceConfiguration';

const {
  enabled = false,
  custom_api_endpoint = '',
  conversation_profile = '',
  conversation_summary = true,
  agent_coaching = true,
  knowleadge_assist = {
    enabled: true,
    version: {
        generative_knowleadge_assist: false,
        proactive_generative_knowleadge_assist: true
    }
  },
  smart_reply = true,
  enable_voice = false,
  notifier_server_endpoint = '',
  transcription = {
    enabled: true,
    version: {
        live_transcription: true,
        intermediate_transcription: false
    }
  },
  debug = false,
} = (getFeatureFlags()?.features?.agent_assist as AgentAssistConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const getCustomApiEndpoint = () => {
  return custom_api_endpoint;
};

export const getConversationProfile = () => {
  return conversation_profile;
};

export const isConversationSummaryEnabled = () => {
  return isFeatureEnabled() && conversation_summary;
};

export const isAgentCoachingEnabled = () => {
  return isFeatureEnabled() && agent_coaching;
};

export const isKnowleadgeAssistEnabled = () => {
  return isFeatureEnabled() && knowleadge_assist.enabled 
}

export const isGKAEnabled = () => {
  return isKnowleadgeAssistEnabled() && knowleadge_assist.version.generative_knowleadge_assist;
};

export const isPGKAEnabled = () => {
  return isKnowleadgeAssistEnabled() && knowleadge_assist.version.proactive_generative_knowleadge_assist;
};

export const isSmartReplyEnabled = () => {
  return smart_reply;
};

export const isVoiceEnabled = () => {
  return isFeatureEnabled() && enable_voice;
};

export const getNotifierServerEndpoint = () => {
  return notifier_server_endpoint;
};

export const isTranscriptionEnabled = () => {
  return  isVoiceEnabled() && transcription.enabled;
}

export const isLiveTranscriptionEnabled = () => {
  return isTranscriptionEnabled() && transcription.version.live_transcription;
};

export const isIntermediateTranscriptionEnabled = () => {
  return isTranscriptionEnabled() && transcription.version.intermediate_transcription;
};

export const isDebugEnabled = () => {
  return debug;
};
