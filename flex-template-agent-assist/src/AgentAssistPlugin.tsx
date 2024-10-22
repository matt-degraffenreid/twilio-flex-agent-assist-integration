import * as Flex from '@twilio/flex-ui';
import { FlexPlugin, loadJS } from '@twilio/flex-plugin';

import { initFeatures } from './utils/feature-loader';

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
    loadJS('https://www.gstatic.com/agent-assist-ui-modules/common.js');
    loadJS('https://www.gstatic.com/agent-assist-ui-modules/v1/summarization.js');
    initFeatures(flex, manager);
  }
}
