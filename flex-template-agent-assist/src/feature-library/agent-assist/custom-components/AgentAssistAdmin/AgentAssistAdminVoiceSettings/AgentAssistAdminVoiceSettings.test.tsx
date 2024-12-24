import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as Flex from '@twilio/flex-ui';
import { io, mockSocket } from 'socket.io-client';

import { AgentAssistAdminVoiceSettings } from './AgentAssistAdminVoiceSettings';
import axe from '../../../../../../test-utils/axe-helper';
import {
  setServiceConfiguration,
  getMockedServiceConfiguration,
} from '../../../../../../test-utils/flex-service-configuration';
import { StringTemplates as AgentAssistStringTemplates } from '../../../flex-hooks/strings/AgentAssist';
import defaultConfigurationValues from '../../../../../../../flex-config/ui_attributes.common.json';

describe('AgentAssistAdminVoiceSettings', () => {
  let ownProps;

  describe('When configuration values are stored in the configuration service', () => {
    beforeEach(() => {
      ownProps = {
        feature: 'mockFeature',
        initialConfig: { ...getMockedServiceConfiguration().ui_attributes.custom_data.features.agent_assist },
        setModifiedConfig: jest.fn(),
        setAllowSave: jest.fn(),
      };
    });
    it('should display the saved config value for notifier server endpoint', async () => {
      const { custom_data } = Flex.Manager.getInstance().configuration;
      const { notifier_server_endpoint } = custom_data.features.agent_assist;

      render(<AgentAssistAdminVoiceSettings {...ownProps} />);

      const input = await screen.findByTestId('notifier-server-endpoint-input');

      expect(input).toHaveProperty('value', notifier_server_endpoint);
    });

    it('should display the saved config value for voice toggle', async () => {
      const { custom_data } = Flex.Manager.getInstance().configuration;
      const { enable_voice } = custom_data.features.agent_assist;

      render(<AgentAssistAdminVoiceSettings {...ownProps} />);

      const voiceSwitch = await screen.findByTestId('enable-voice-switch');
      expect(voiceSwitch).toHaveProperty('checked', enable_voice);
    });

    it('should display the saved config value for transcription toggle', async () => {
      const { custom_data } = Flex.Manager.getInstance().configuration;
      const { transcription } = custom_data.features.agent_assist;

      render(<AgentAssistAdminVoiceSettings {...ownProps} />);

      const transcriptionSwitch = await screen.findByTestId(
        `enable-${AgentAssistStringTemplates.Transcription}-switch`,
      );

      expect(transcriptionSwitch).toHaveProperty('checked', transcription.enabled);
    });

    it('should display the saved config value for live transcription', async () => {
      const { custom_data } = Flex.Manager.getInstance().configuration;
      const { transcription } = custom_data.features.agent_assist;

      render(<AgentAssistAdminVoiceSettings {...ownProps} />);

      const radioButton = await screen.getByRole('radio', { name: AgentAssistStringTemplates.LiveTranscription });
      expect(radioButton).toHaveProperty('checked', transcription.version.live_transcription);
    });

    it('should display the saved config value for intermediate transcription', async () => {
      const { custom_data } = Flex.Manager.getInstance().configuration;
      const { transcription } = custom_data.features.agent_assist;

      render(<AgentAssistAdminVoiceSettings {...ownProps} />);

      const radioButton = await screen.getByRole('radio', {
        name: AgentAssistStringTemplates.IntermediateTranscription,
      });
      expect(radioButton).toHaveProperty('checked', transcription.version.intermediate_transcription);
    });
  });

  describe('When no configuation values are stored in the configation server', () => {
    beforeEach(async () => {
      setServiceConfiguration({ ui_attributes: { ...defaultConfigurationValues } }, null);
      ownProps = {
        feature: 'mockFeature',
        initialConfig: { ...getMockedServiceConfiguration().ui_attributes.custom_data.features.agent_assist },
        setModifiedConfig: jest.fn(),
        setAllowSave: jest.fn(),
      };
    });

    it('should display the default config value for notifier server endpoint', async () => {
      const { custom_data } = Flex.Manager.getInstance().configuration;
      const { notifier_server_endpoint } = custom_data.features.agent_assist;
      console.log(custom_data);
      render(<AgentAssistAdminVoiceSettings {...ownProps} />);

      const input = await screen.findByTestId('notifier-server-endpoint-input');

      expect(input).toHaveProperty('value', notifier_server_endpoint);
    });

    it('should display the default config value for voice toggle', async () => {
      const { custom_data } = Flex.Manager.getInstance().configuration;
      const { enable_voice } = custom_data.features.agent_assist;

      render(<AgentAssistAdminVoiceSettings {...ownProps} />);

      const voiceSwitch = await screen.findByTestId('enable-voice-switch');
      expect(voiceSwitch).toHaveProperty('checked', enable_voice);
    });

    it('should display the default config value for transcription toggle', async () => {
      const { custom_data } = Flex.Manager.getInstance().configuration;
      const { transcription } = custom_data.features.agent_assist;

      render(<AgentAssistAdminVoiceSettings {...ownProps} />);

      const transcriptionSwitch = await screen.findByTestId(
        `enable-${AgentAssistStringTemplates.Transcription}-switch`,
      );

      expect(transcriptionSwitch).toHaveProperty('checked', transcription.enabled);
    });

    it('should display the default config value for live transcription', async () => {
      const { custom_data } = Flex.Manager.getInstance().configuration;
      const { transcription } = custom_data.features.agent_assist;

      render(<AgentAssistAdminVoiceSettings {...ownProps} />);

      const radioButton = await screen.getByRole('radio', { name: AgentAssistStringTemplates.LiveTranscription });
      expect(radioButton).toHaveProperty('checked', transcription.version.live_transcription);
    });

    it('should display the default config value for intermediate transcription', async () => {
      const { custom_data } = Flex.Manager.getInstance().configuration;
      const { transcription } = custom_data.features.agent_assist;

      render(<AgentAssistAdminVoiceSettings {...ownProps} />);

      const radioButton = await screen.getByRole('radio', {
        name: AgentAssistStringTemplates.IntermediateTranscription,
      });
      expect(radioButton).toHaveProperty('checked', transcription.version.intermediate_transcription);
    });
  });

  describe('When the user edits values in admin panel', () => {
    it('should disable all voice settings if voice is not enabled', async () => {
      setServiceConfiguration({ ui_attributes: { ...defaultConfigurationValues } }, null);
      ownProps = {
        feature: 'mockFeature',
        initialConfig: { ...getMockedServiceConfiguration().ui_attributes.custom_data.features.agent_assist },
        setModifiedConfig: jest.fn(),
        setAllowSave: jest.fn(),
      };

      render(<AgentAssistAdminVoiceSettings {...ownProps} />);

      const voiceSwitch = await screen.findByTestId('enable-voice-switch');
      const notifierServerEndpointInput = await screen.findByTestId('notifier-server-endpoint-input');
      const transciptionSwitch = await screen.findByTestId(`enable-${AgentAssistStringTemplates.Transcription}-switch`);
      const intermediateTranscriptionRadio = await screen.getByRole('radio', {
        name: AgentAssistStringTemplates.IntermediateTranscription,
      });
      const liveTranscriptionRadio = await screen.getByRole('radio', {
        name: AgentAssistStringTemplates.LiveTranscription,
      });

      expect(voiceSwitch).toHaveProperty('checked', false);
      expect(notifierServerEndpointInput).toHaveProperty('disabled', true);
      expect(transciptionSwitch).toHaveProperty('disabled', true);
      expect(intermediateTranscriptionRadio).toHaveProperty('disabled', true);
      expect(liveTranscriptionRadio).toHaveProperty('disabled', true);
    });

    it('should allow the user to input a notifier server endpoint when voice is enabled', async () => {
      const configValues = {
        custom_data: {
          features: {
            agent_assist: {
              enable_voice: true,
              notifier_server_endpoint: '',
            },
          },
        },
      };
      setServiceConfiguration({ ui_attributes: { ...configValues } }, null);
      ownProps = {
        feature: 'mockFeature',
        initialConfig: { ...getMockedServiceConfiguration().ui_attributes.custom_data.features.agent_assist },
        setModifiedConfig: jest.fn(),
        setAllowSave: jest.fn(),
      };

      const notifierServerEndpoint = 'mockNotifierServerEnpoint';

      render(<AgentAssistAdminVoiceSettings {...ownProps} />);

      const input = await screen.findByTestId('notifier-server-endpoint-input');
      await userEvent.type(input, notifierServerEndpoint);

      expect(input).toHaveProperty('value', notifierServerEndpoint);
    });

    it('should allow the user to enable transcription when voice is enabled', async () => {
      const configValues = {
        custom_data: {
          features: {
            agent_assist: {
              enable_voice: true,
              notifier_server_endpoint: '',
              transcription: {
                enabled: false,
                version: {
                  live_transcription: true,
                  intermediate_transcription: false,
                },
              },
            },
          },
        },
      };
      setServiceConfiguration({ ui_attributes: { ...configValues } }, null);
      ownProps = {
        feature: 'mockFeature',
        initialConfig: { ...getMockedServiceConfiguration().ui_attributes.custom_data.features.agent_assist },
        setModifiedConfig: jest.fn(),
        setAllowSave: jest.fn(),
      };

      render(<AgentAssistAdminVoiceSettings {...ownProps} />);

      const transcriptionSwitch = await screen.findByTestId(
        `enable-${AgentAssistStringTemplates.Transcription}-switch`,
      );

      expect(transcriptionSwitch).toHaveProperty('checked', false);

      await userEvent.click(transcriptionSwitch);

      expect(transcriptionSwitch).toHaveProperty('checked', true);
    });

    it('should allow the user to change the transcription version when voice and transcription are enabled', async () => {
      const configValues = {
        custom_data: {
          features: {
            agent_assist: {
              enable_voice: true,
              notifier_server_endpoint: '',
              transcription: {
                enabled: true,
                version: {
                  live_transcription: true,
                  intermediate_transcription: false,
                },
              },
            },
          },
        },
      };
      setServiceConfiguration({ ui_attributes: { ...configValues } }, null);
      ownProps = {
        feature: 'mockFeature',
        initialConfig: { ...getMockedServiceConfiguration().ui_attributes.custom_data.features.agent_assist },
        setModifiedConfig: jest.fn(),
        setAllowSave: jest.fn(),
      };

      render(<AgentAssistAdminVoiceSettings {...ownProps} />);

      const intermediateTranscriptionRadio = await screen.getByRole('radio', {
        name: AgentAssistStringTemplates.IntermediateTranscription,
      });
      expect(intermediateTranscriptionRadio).toHaveProperty('checked', false);

      await userEvent.click(intermediateTranscriptionRadio);

      expect(intermediateTranscriptionRadio).toHaveProperty('checked', true);
    });
  });

  it('should pass accessibility test', async () => {
    ownProps = {
      feature: 'mockFeature',
      initialConfig: { ...getMockedServiceConfiguration().ui_attributes.custom_data.features.agent_assist },
      setModifiedConfig: jest.fn(),
      setAllowSave: jest.fn(),
    };
    const { container } = render(<AgentAssistAdminVoiceSettings {...ownProps} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
