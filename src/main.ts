function main() {
  const ScriptProperties = PropertiesService.getScriptProperties();
  const TOKEN = ScriptProperties.getProperty('TOKEN');
  const CHANNEL_ID = ScriptProperties.getProperty('CHANNEL_ID');
  const LEAVE_DAY_PERIOD = parseInt(
    ScriptProperties.getProperty('LEAVE_DAY_PERIOD')
  );

  const latestTs =
    new Date().setDate(new Date().getDate() - LEAVE_DAY_PERIOD) / 1000;
  const messages = fetchMessages(TOKEN, CHANNEL_ID, String(latestTs));
  let count = 0;
  messages.forEach(message => {
    const success = deleteMessage(TOKEN, CHANNEL_ID, message.ts);
    if (success) count++;
    Utilities.sleep(1500);
  });
  postMessage(TOKEN, CHANNEL_ID, `Successfully deleted ${count} messages`);
}

type Message = {
  type: string;
  text?: string;
  ts: string;
};

const fetchMessages = (
  token: string,
  channelId: string,
  latest = 'now',
  oldest = '0'
): Message[] => {
  const url = `https://slack.com/api/channels.history?token=${token}&channel=${channelId}&latest=${latest}&oldest=${oldest}`;
  const response = UrlFetchApp.fetch(url);
  const json = JSON.parse(response.getContentText());
  if (!json.ok) {
    Logger.log(`Failed to fetch messages: ${json.error}`);
    throw new Error(`Failed to fetch messages: ${json.error}`);
  }
  return json.messages;
};

const deleteMessage = (
  token: string,
  channelId: string,
  ts: string
): boolean => {
  const url = 'https://slack.com/api/chat.delete';
  const formData = {
    token,
    channel: channelId,
    ts,
  };
  const options = {
    method: 'post' as const,
    payload: formData,
  };
  const response = UrlFetchApp.fetch(url, options);
  const json = JSON.parse(response.getContentText());
  if (!json.ok) {
    Logger.log(`Failed to delete message: ${json.error}`);
    return false;
  }
  return true;
};

const postMessage = (token: string, channelId: string, text: string) => {
  const url = 'https://slack.com/api/chat.postMessage';
  const formData = {
    token,
    channel: channelId,
    text,
  };
  const options = {
    method: 'post' as const,
    payload: formData,
  };
  const response = UrlFetchApp.fetch(url, options);
  const json = JSON.parse(response.getContentText());
  if (!json.ok) {
    Logger.log(`Failed to post message: ${json.error}`);
  }
};
