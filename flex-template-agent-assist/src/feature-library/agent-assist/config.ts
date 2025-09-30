import { object } from 'prop-types';

import { getFeatureFlags } from '../../utils/configuration';
import AgentAssistConfig from './types/ServiceConfiguration';

const {
  enabled = false,
  custom_api_endpoint = 'https://ui-connector-195821190183.us-central1.run.app',
  conversation_profile = '',
  conversation_summary = true,
  agent_coaching = true,
  knowledge_assist = true,
  smart_reply = true,
  enable_voice = false,
  notifier_server_endpoint = 'https://ui-connector-195821190183.us-central1.run.app',
  transcription = {
    enabled: false,
    version: {
      live_transcription: true,
      intermediate_transcription: false,
    },
  },
  script_sources = {
    prod: {
      common: 'https://www.gstatic.com/agent-assist-ui-modules/common.js',
      container: 'https://www.gstatic.com/agent-assist-ui-modules/v2/container.js',
      transcript: 'https://www.gstatic.com/agent-assist-ui-modules/transcript.js',
    },
  },
  ui_module_version = 'prod',
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

export const isKnowledgeAssistEnabled = () => {
  return isFeatureEnabled() && knowledge_assist;
};

export const isSmartReplyEnabled = () => {
  return isFeatureEnabled() && smart_reply;
};

export const isVoiceEnabled = () => {
  return isFeatureEnabled() && enable_voice;
};

export const getNotifierServerEndpoint = () => {
  return notifier_server_endpoint;
};

export const isTranscriptionEnabled = () => {
  return isVoiceEnabled() && transcription.enabled;
};

export const isLiveTranscriptionEnabled = () => {
  return isTranscriptionEnabled() && transcription.version.live_transcription;
};

export const isIntermediateTranscriptionEnabled = () => {
  return isTranscriptionEnabled() && transcription.version.intermediate_transcription;
};

export const getScriptSources = () => {
  return script_sources[ui_module_version];
};

export const getEnabledFeatureList = () => {
  const features = {
    CONVERSATION_SUMMARIZATION: conversation_summary,
    SMART_REPLY: smart_reply,
    KNOWLEDGE_ASSIST_V2: knowledge_assist,
    AGENT_COACHING: agent_coaching,
  };
  const filteredFeatures = Object.fromEntries(Object.entries(features).filter(([key, value]) => value === true));
  return Object.keys(filteredFeatures).join(',');
};

export const isDebugEnabled = () => {
  return debug;
};
