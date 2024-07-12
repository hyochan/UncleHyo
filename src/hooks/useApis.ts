import useSWRMutation from 'swr/mutation';

const sendMessage = (
  url: string,
  {
    arg,
  }: {
    arg: {
      message: string;
      histories: {}[];
      sysMessage?: string;
      timestamp?: number;
    };
  },
): Promise<{message: string}> =>
  fetch(`${url}?timestamp=${arg.timestamp}`, {
    headers: {'Content-Type': 'application/json'},
    method: 'POST',
    body: JSON.stringify(arg),
  }).then((res) => res.json());

export function useChatApi(): {
  triggerSendMessage: (arg: {
    message: string;
    histories: {}[];
    sysMessage?: string;
  }) => Promise<{message: string}>;
  isMutatingSendMessage: boolean;
} {
  const {trigger: triggerSendMessage, isMutating: isMutatingSendMessage} =
    useSWRMutation(
      'https://unclehyo-gpt.dooboolab.com/api/chat',
      sendMessage,
      {},
    );

  return {
    triggerSendMessage: (arg) =>
      triggerSendMessage({
        ...arg,
        timestamp: Date.now(),
      }),
    isMutatingSendMessage,
  };
}
