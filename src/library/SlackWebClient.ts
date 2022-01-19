import { WebClient } from '@slack/web-api';
import axios from 'axios';

export class SlackWebClient {
  private static webClient = new WebClient(process.env.BOT_USER_OAUTH_ACCESS_TOKEN);

  public static async getUserInfo(user: string): Promise<[string, string]> {
    const response = await this.webClient.users.info({ user });
    if (response?.user?.is_bot) return null;

    const userName = response?.user?.profile?.display_name || response?.user?.real_name || ''
    const userEmail = response?.user?.profile?.email || ''
    console.log(`userName: ${userName}, userEmail: ${userEmail}`)
    return [userName, userEmail]
  }

  public static async getChannelName(channel: string): Promise<[string, string]> {
    const response = await this.webClient.conversations.info({ channel })
    const channelName = response?.channel?.name || ''
    const crewName = channelName?.split('_').shift() || ''
    console.log(`channelName: ${channelName}, ${crewName}`)
    return [channelName, crewName]
  }

  public static async sendMessageAttended(message: string): Promise<void> {
    await this.webClient.chat.postMessage({
      channel: process.env.LIMNI,
      text: message,
    })
  }

  public static async sendError(error: any): Promise<void> {
    await axios({
      url: process.env.SLACK_WEBHOOK_ERROR,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        attachments: [
          {
            color: '#ff0000',
            fallback: error.toString(),
            text: error.stack,
          }
        ]
      }
    })
  }

}