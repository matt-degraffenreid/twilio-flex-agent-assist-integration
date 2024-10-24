import * as Flex from '@twilio/flex-ui';

import { GenerativeKnowleadgeAssist } from '../../custom-components/GenerativeKnowleadgeAssist/GenerativeKnowleadgeAssist';
import { AgentCoaching } from '../../custom-components/AgentCoaching/AgentCoaching';
import { FlexActionEvent } from '../../../../types/feature-loader';
import { StringTemplates } from '../strings/AgentAssist';

export const actionEvent = FlexActionEvent.before;
export const actionName = 'LoadCRMContainerTabs';
export const actionHook = function addAgentAssistContainerToEnhancedCRM(flex: typeof Flex, manager: Flex.Manager) {
    flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload) => {
        if (
            !payload.task ||
            !Flex.TaskHelper.isChatBasedTask(payload.task) ||
            Flex.TaskHelper.isInWrapupMode(payload.task)
        ) {
            return;
        }

        payload.components = [
            ...payload.components,
            {
                title: (manager.strings as any)[StringTemplates.GenerativeKnowleadgeAssist],
                order: 0,
                component: <GenerativeKnowleadgeAssist key="agent-assist-generative-knowleadge-assist" />,
            },
            {
                title: (manager.strings as any)[StringTemplates.AgentCoaching],
                order: 0,
                component: <AgentCoaching key="agent-assist-agent-coaching" />,
            }
        ];
    });
};