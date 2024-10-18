import { getFeatureFlags } from '../../utils/configuration';
import AgentAssistConfig from './types/ServiceConfiguration';

const { enabled = false } = (getFeatureFlags()?.features?.agent_assist as AgentAssistConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};
