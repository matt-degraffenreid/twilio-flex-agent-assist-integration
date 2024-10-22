import React, { useEffect } from 'react';
import { Flex as PasteFlexComponent } from '@twilio-paste/core/flex';
import { IconButton, templates } from '@twilio/flex-ui';
import * as Flex from '@twilio/flex-ui';
import { AgentAssistIcon } from '../../flex-hooks/icons/AgentAssistIcon.jsx';
import { AppState } from '../../../../types/manager';
import { reduxNamespace } from '../../../../utils/state';
import { useDispatch, useSelector } from 'react-redux';
import { AgentAssistState } from '../../flex-hooks/states/AgentAssist';
import AgentAssistUtils from '../../utils/agentAssist/AgentAssistUtils';
import { isVoiceEnabled, getConversationProfile, getCustomApiEndpoint, getNotifierServerEndpoint } from '../../config';
import { updateAgentAssistState } from '../../flex-hooks/states/AgentAssist';
import { Tooltip } from '@twilio-paste/core/tooltip';
import { StringTemplates } from '../../flex-hooks/strings/AgentAssist';

export const AgentAssistAlertButton = () => {
  const dispatch = useDispatch();

  const { status } = useSelector(
    (state: AppState) => state[reduxNamespace].agentAssist as AgentAssistState,
  );
  const isAvailable = Flex.useFlexSelector((state: AppState) => state.flex.worker.activity.available);
  const agentToken = Flex.useFlexSelector((state: AppState) => state.flex.session.ssoTokenPayload.token);

  useEffect(() => {
    const agentAssistUtils = AgentAssistUtils.instance
    const fetchAuthToken = async () => {
      return await agentAssistUtils.getAgentAssistAuthToken(agentToken);
    }
    if(isAvailable){
      fetchAuthToken().then((authToken) => {
        const connectorConfig = {
          channel: isVoiceEnabled() ? 'voice' : 'chat',
          agentDesktop: 'Custom',
          conversationProfileName: getConversationProfile(),
          apiConfig: {
            authToken,
            customApiEndpoint: getCustomApiEndpoint(),
          },
          eventBasedConfig: {
            transport: 'websocket',
            library: 'SocketIo',
            notifierServerEndpoint: getNotifierServerEndpoint(),
          }
        }
        agentAssistUtils.initializeUiConnector(connectorConfig);
        dispatch(updateAgentAssistState({
          status: 'connected',
          authToken
        }))
      });
    }
  }, []);

  return (
    <PasteFlexComponent vAlignContent="center">
      <Tooltip
        text={
          status === 'connected'
            ? templates[StringTemplates.AgentAssistConnected]()
            : templates[StringTemplates.AgentAssistDisconnected]()
        }
        placement="left"
      >
        <IconButton
          disabled={status === 'connected' ? false : true}
          icon={<AgentAssistIcon />}
          size="small"
          style={{ backgroundColor: 'transparent'}}
        />
      </Tooltip>
      
    </PasteFlexComponent>
  );
};
