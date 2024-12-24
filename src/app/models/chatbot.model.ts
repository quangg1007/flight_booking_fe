


export interface Choice {
  name: string;
  request: {
    type: string;
    payload: {
      label: string;
    };
  };
}

export interface ChatResponse {
  time: number;
  type: string;
  payload: {
    slate: {
      id: string;
      content: Array<{
        children?: Array<{
          text: string;
        }>;
      }>;
      messageDelayMilliseconds: number;
    };
    message: string;
    delay: number;

    // Choice type payload
    buttons?: Array<{
      name: string;
      request: {
        type: string;
        payload: {
          label: string;
        };
      };
    }>;
  };
}

export interface MessageChat {
  type: string;
  isUser: boolean;
  payload?: {
    choices?: Choice[];
    message?: string;
  };
}
