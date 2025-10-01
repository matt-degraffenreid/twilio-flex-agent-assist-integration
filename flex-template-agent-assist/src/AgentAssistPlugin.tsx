/* eslint-disable dot-notation */
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
    const source = getScriptSources();
    const scriptSources = Object.values(getScriptSources());
    console.log('[Agent-Assist] loading scripts', scriptSources);
    loadjs(
      [source['common'] as string, source['container'] as string, source['transcript'] as string] as string[],
      'agent-assist',
    );

    loadjs.ready('agent-assist', function () {
      initAgentAssistFeatures(flex, manager);
    });
    initFeatures(flex, manager);
  }
}
