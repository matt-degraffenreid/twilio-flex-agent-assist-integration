// @ts-nocheck

import * as Flex from '@twilio/flex-ui';

import { getEnabledFeatureList } from '../../config';

export const AgentAssistContainer = () => {
  const features = getEnabledFeatureList();
  console.log(`feature list: ${features}`);
  Flex.Actions.invokeAction('SetComponentState', {
    name: 'AgentTaskCanvasTabs',
    state: { selectedTabName: 'transcription' },
  });
  return <agent-assist-ui-modules-v2 style={{ minHeight: '100vh' }} features={getEnabledFeatureList()} />;
};
