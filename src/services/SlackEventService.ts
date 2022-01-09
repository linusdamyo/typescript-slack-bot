import { createEventAdapter } from '@slack/events-api';
import { SlackMessageProcess } from './SlackMessageProcess';
import { SlackWebClient } from './SlackWebClient';

const slackEvents = createEventAdapter(process.env.SIGNING_SECRET);

// 메시지 이벤트 구독하기
slackEvents.on('message', async (event) => {
  console.log((event));

  try {
    if (event.type == 'message' && event.channel_type == 'channel') {
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
  } catch(error) {
    console.log(error);
    console.log(error.stack);
    await SlackWebClient.sendError(error);
  }

});

export default slackEvents;
