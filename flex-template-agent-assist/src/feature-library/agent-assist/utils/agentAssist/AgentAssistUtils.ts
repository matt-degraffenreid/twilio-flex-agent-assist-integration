// @ts-nocheck
import Cookies from 'js-cookie';
import { io } from 'socket.io-client';

import {
  ConnectorConfig,
  UiModuleConnector,
  UiModuleEventBasedConnector,
  agentAssistModules,
} from '../types/AgentAssist';
import { getCustomApiEndpoint, getConversationProfile } from '../../config';
import logger from '../../../../utils/logger';

class AgentAssistUtils {
  static #agentAssistUtils: AgentAssistUtils;

  static #connector: UiModuleConnector;

  /**
   * The Singleton's constructor should always be private to prevent direct
   * construction calls with the `new` operator.
   */
  private constructor() {}

  /**
   * The static getter that controls access to the singleton instance.
   *
   * This implementation allows you to extend the Singleton class while
   * keeping just one instance of each subclass around.
   */
  public static get instance(): AgentAssistUtils {
    if (!AgentAssistUtils.#agentAssistUtils) {
      AgentAssistUtils.#agentAssistUtils = new AgentAssistUtils();
    }
    return AgentAssistUtils.#agentAssistUtils;
  }

  public initializeUiConnector(config: ConnectorConfig) {
    if (!AgentAssistUtils.#connector) {
      AgentAssistUtils.#connector = new UiModulesConnector();
      window._uiModuleFlags = { debug: true };
    } else {
      logger.debug('[Agent-Assist] connector already instantiated');
    }
    AgentAssistUtils.#connector.init(config);
  }

  public async getAgentAssistAuthToken(token: string): string {
    const authToken = Cookies.get('CCAI_AGENT_ASSIST_AUTH_TOKEN');
    if (authToken) {
      logger.debug('[Agent-Assist] AuthToken retrieved from cookies');
      return authToken;
    }

    logger.debug('[Agent-Assist] Making request for Agent Assist auth token');
    return fetch(`${getCustomApiEndpoint()}/register`, {
      method: 'POST',
      headers: [['Authorization', token]],
    })
      .then(async (response) => {
        if (!response.ok) {
          // error coming back from server
          throw Error('could not fetch the data for that resource');
        }
        return response.json();
      })
      .then((data) => {
        logger.debug('[Agent-Assist] Saving auth token in cookie');
        Cookies.set('CCAI_AGENT_ASSIST_AUTH_TOKEN', data.token, { expires: 7 });
        return data.token;
      });
  }

  public getConversationName(conversationId: string): string {
    const [, projectLocation] =
      getConversationProfile().match(/(^projects\/[^/]+\/locations\/[^/]+)\/conversationProfiles\/[^/]+$/) || [];
    return `${projectLocation}/conversations/${conversationId}`;
  }

  public getConversationProfile(conversationProfile: string, customApiEndpoint?: string): string {
    const authToken = Cookies.get('CCAI_AGENT_ASSIST_AUTH_TOKEN');
    if (!authToken) {
      logger.debug('[Agent-Assist] No auth token stored, retrieve auth token before making CCAI request');
      return;
    }
    const endpoint = this.validateUrl(customApiEndpoint ? customApiEndpoint : getCustomApiEndpoint());
    return fetch(`${endpoint}/v2beta1/${conversationProfile}`, {
      method: 'GET',
      headers: [['Authorization', authToken]],
    })
      .then(async (response) => {
        if (!response.ok) {
          // error coming back from server
          throw Error('could not fetch the data for that resource');
        }
        return response.json();
      })
      .then((data) => {
        logger.debug('[Agent-Assist] Conversation profile retrived');
        return data.name;
      });
  }

  public getStatus(customApiEndpoint?: string): boolean {
    const endpoint = this.validateUrl(customApiEndpoint ? customApiEndpoint : getCustomApiEndpoint());
    return fetch(`${endpoint}/status`, {
      method: 'GET',
    }).then((response) => {
      if (!response.ok) {
        return false;
      }
      return true;
    });
  }

  public getWebsocketStatus(notifierServerEndpoint: string, onSuccess: any, onError: any): void {
    const endpoint = this.validateUrl(notifierServerEndpoint);
    const token = Cookies.get('CCAI_AGENT_ASSIST_AUTH_TOKEN');
    if (!token) {
      logger.debug('[Agent-Assist] No auth token stored, retrieve auth token before making CCAI request');
      return;
    }
    try {
      const socket = io(endpoint, {
        auth: {
          token,
        },
      });

      socket.on('connect_error', (err) => {
        console.log(`connect_error due to ${err.message}`);
        onError();
        socket.close();
      });

      socket.on('connect', () => {
        console.log('Websocket Success');
        onSuccess();
        socket.close();
      });

      socket.on('unauthenticated', () => {
        console.log('Websocket unauthenticated');
        onError();
        socket.close();
      });
    } catch (error) {
      console.log('Network Error');
      onError();
    }
  }

  private validateUrl(url: string): string {
    const protocalRegExp = new RegExp('^(http|https)://');
    const hasProtocal = protocalRegExp.test(url);
    return `${hasProtocal ? '' : 'https://'}${url}`;
  }

  static validateConversationProfile = (conversationProfile: string): boolean => {
    const regExp = new RegExp('(^projects/[^/]+/locations/[^/]+)/conversationProfiles/[^/]+$');
    return regExp.test(conversationProfile);
  };
}

export default AgentAssistUtils;
