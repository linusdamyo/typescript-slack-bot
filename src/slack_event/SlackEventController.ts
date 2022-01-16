import { createEventAdapter } from '@slack/events-api';
import { SlackEventService } from './SlackEventService';
import { SlackWebClient } from '../library/SlackWebClient';

const SlackEventController = createEventAdapter(process.env.SIGNING_SECRET);

// 메시지 이벤트 구독하기
SlackEventController.on('message', async (event) => {
  console.log((event));

  try {
    if (event.type == 'message' && event.channel_type == 'channel') {
      switch(event.subtype) {
        case 'message_changed':
          await SlackEventService.processMessageChanged(event);
          break;
        case 'message_deleted':
          await SlackEventService.processMessageDeleted(event);
          break;
        case 'channel_join':
          await SlackEventService.processChannelJoin(event);
          break;
        default:
          await SlackEventService.processMessageNew(event);
      }
    }
  } catch(error) {
    console.log(error);
    console.log(error.stack);
    await SlackWebClient.sendError(error);
  }

});

export default SlackEventController;
