import { createEventAdapter } from '@slack/events-api';
import CONFIG from '../../config/bot.json';
import { SlackMessageProcess } from './SlackMessageProcess';

const slackEvents = createEventAdapter(CONFIG.SIGNING_SECRET);

// 메시지 이벤트 구독하기
slackEvents.on('message', async (event) => {
  console.log((event));

  if (event.type == 'message') {
    switch(event.subtype) {
      case 'message_changed':
        await SlackMessageProcess.processMessageChanged(event);
        break;
      case 'message_deleted':
        await SlackMessageProcess.processMessageDeleted(event);
        break;
      default:
        await SlackMessageProcess.processNewMessage(event);
    }
  }

});

export default slackEvents;
