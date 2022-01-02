export interface SlackEventInterface {
  type: string;
  event_ts: string;
  channel: string;
}

export interface SlackMessageInterface {
  client_msg_id: string;
  text: string;
  user: string;
}

export interface SlackNewMessageInterface extends SlackEventInterface, SlackMessageInterface {
}

export interface SlackMessageChangedInterface extends SlackEventInterface {
  message: SlackMessageInterface
}

export interface SlackMessageDeletedInterface extends SlackEventInterface {
  previous_message: SlackMessageInterface
}

// {
//   type: 'message',
//   subtype: 'message_changed',
//   hidden: true,
//   message: {
//     client_msg_id: 'd7f334ec-923d-4980-b640-791833cf4f2b',
//     type: 'message',
//     text: '겨울잠 ㄷㄹㄷㄹ',
//     user: 'U02CLSBF280',
//     team: 'T02BU77TG13',
//     edited: { user: 'U02CLSBF280', ts: '1640880210.000000' },
//     blocks: [ [Object] ],
//     ts: '1640880149.000200',
//     source_team: 'T02BU77TG13',
//     user_team: 'T02BU77TG13'
//   },
//   channel: 'C02RZGX24R2',
//   previous_message: {
//     client_msg_id: 'd7f334ec-923d-4980-b640-791833cf4f2b',
//     type: 'message',
//     text: '겨울잠',
//     user: 'U02CLSBF280',
//     ts: '1640880149.000200',
//     team: 'T02BU77TG13',
//     blocks: [ [Object] ]
//   },
//   event_ts: '1640880210.000300',
//   ts: '1640880210.000300',
//   channel_type: 'channel'
// }

// {
//   type: 'message',
//   subtype: 'message_deleted',
//   hidden: true,
//   deleted_ts: '1640880149.000200',
//   channel: 'C02RZGX24R2',
//   previous_message: {
//     client_msg_id: 'd7f334ec-923d-4980-b640-791833cf4f2b',
//     type: 'message',
//     text: '겨울잠 ㄷㄹㄷㄹ',
//     user: 'U02CLSBF280',
//     ts: '1640880149.000200',
//     team: 'T02BU77TG13',
//     edited: { user: 'U02CLSBF280', ts: '1640880210.000000' },
//     blocks: [ [Object] ]
//   },
//   event_ts: '1640880272.000400',
//   ts: '1640880272.000400',
//   channel_type: 'channel'
// }