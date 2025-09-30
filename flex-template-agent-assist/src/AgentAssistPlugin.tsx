import * as Flex from '@twilio/flex-ui';
import { FlexPlugin } from '@twilio/flex-plugin';
import loadjs from 'loadjs';

import logger from './utils/logger';
import { getScriptSources } from './feature-library/agent-assist/config';
import { initFeatures, initAgentAssistFeatures } from './utils/feature-loader';

const PLUGIN_NAME = 'AgentAssist';

export default class AgentAssist extends FlexPlugin {
  // eslint-disable-next-line no-restricted-syntax
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof Flex }
   * @param manager { Flex.Manager }
   */
  init(flex: typeof Flex, manager: Flex.Manager) {
    console.log('[Agent-Assist] loading scripts', getScriptSources());
    const scriptSources = Object.values(getScriptSources());
    console.log('[Agent-Assist] loading scripts', scriptSources);
    loadjs(scriptSources as string[], function () {
      console.log('[Agent-Assist] Agent marked as available on page load. Initing Events');
      logger.info('[Agent-Assist] Agent marked as available on page load. Initing Events');
      initAgentAssistFeatures(flex, manager);
    });

    loadjs.ready('agent-assist', function () {
      console.log('[Agent-Assist] Agent marked as available on page load. Initing Events');
      logger.info('[Agent-Assist] Agent marked as available on page load. Initing Events');
      initAgentAssistFeatures(flex, manager);
    });
    initFeatures(flex, manager);
  }
}
