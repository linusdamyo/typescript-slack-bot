import { WebClient } from '@slack/web-api';
import axios from 'axios';

export class SlackWebClient {
  private static webClient = new WebClient(process.env.BOT_USER_OAUTH_ACCESS_TOKEN);

  public static async getUserName(user: string): Promise<string> {
    const response = await this.webClient.users.info({
      user,
    });
    const userName = response?.user?.real_name || response?.user?.profile?.display_name || ''
    console.log(userName)
    return userName
  }

  public static async getChannelName(channel: string): Promise<string> {
    const response = await this.webClient.conversations.info({
      channel,
    })
    const channelName = response?.channel?.name
    console.log(channelName)
    return channelName
  }

  public static async sendMessageAttended(message: string): Promise<void> {
    await this.webClient.chat.postMessage({
      channel: process.env.LIMNI,
      text: message,
    })
  }

  public static async sendError(error: any): Promise<void> {
    await axios({
      url: process.env.NODE_ENV === 'production'
        ? 'https://hooks.slack.com/services/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'
        : 'https://hooks.slack.com/services/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',
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