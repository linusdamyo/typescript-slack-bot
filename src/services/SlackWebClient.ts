import { WebClient } from '@slack/web-api';

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

  public static async sendMessageAttended(user: string, message: string): Promise<void> {
    await this.webClient.chat.postMessage({
      channel: user,
      text: message,
    })
  }

  public static async sendError(error: any): Promise<void> {
    await this.webClient.chat.postMessage({
      channel: 'U02CLSBF280',
      text: `${error.toString()}\n${error.stack}`,
    })
  }

}