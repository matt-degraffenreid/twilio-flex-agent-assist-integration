import { getFeatureFlags } from '../../utils/configuration';
import OrderManagementConfig from './types/ServiceConfiguration';

const { enabled = false } = (getFeatureFlags()?.features?.order_management as OrderManagementConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};
