import { WebClient } from '@slack/web-api';
import CONFIG from '../../config/bot.json';

export class SlackWebClient {
  private static webClient = new WebClient(CONFIG.BOT_USER_OAUTH_ACCESS_TOKEN);

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

  // if (event.text == '!인증') {
  //   try {
  //     const response = await webClient.chat.postMessage({
  //       text: '인증완료!',
  //       channel: event.channel,
  //     });
  //     console.log(response)
  //   } catch(error) {
  //     console.log(error)
  //     console.log(error.stack)
  //   }
  // }
  // if (event.text == '#영화') {
  //   try {
  //     const response = await webClient.chat.postMessage({
  //       text: '#영화 채널에 등록!',
  //       channel: event.channel,
  //     });
  //     console.log(response)
  //   } catch(error) {
  //     console.log(error)
  //     console.log(error.stack)
  //   }
  // }
}