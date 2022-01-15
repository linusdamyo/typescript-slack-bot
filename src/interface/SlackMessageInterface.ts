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

export interface SlackMessageNewInterface extends SlackEventInterface, SlackMessageInterface {
}

export interface SlackMessageChangedInterface extends SlackEventInterface {
  message: SlackMessageInterface
}

export interface SlackMessageDeletedInterface extends SlackEventInterface {
  previous_message: SlackMessageInterface
}

export interface SlackMessageChannelJoinInterface extends SlackEventInterface {
  user: string;
}
