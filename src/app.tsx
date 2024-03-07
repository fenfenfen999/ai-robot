import { Avatar, Card, Divider, message as Message } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Markdown from 'react-markdown';
import useWebSocket from 'react-use-websocket';
import remarkGfm from 'remark-gfm';

interface RobotProps {
  ws: string;
}
interface MessageItem {
  id?: string | number;
  questionId?: string | number | null;
  role: string;
  message: string;
  time: string | number;
  isTemporary?: boolean;
}

const Robot: React.FC<RobotProps> = (props) => {
  // const { token } = theme.useToken();
  // const { initialState } = useModel('@@initialState');
  const ws = props.ws || `ws://robotchat.ai.com/sophie`
  const initalMessage: MessageItem[] = [
    {
      id: 0,
      role: 'robot',
      message: 'hello',
      time: '2024-03-05',
    },
    {
      id: 0,
      role: 'sophie',
      message: '#### Hi, *Robot*!',
      time: '2024-03-05',
    },
  ];
  const [messageList, setMessageList] = useState<MessageItem[]>(initalMessage);
  const [message, setMessage] = useState('');
  const [disabled, setDisabled] = useState(false);
  // const [messageHistory, setMessageHistory] = useState([]);
  // const [questionList, setQuestionList] = useState([]);
  const didUnmount = useRef(false);
  const [socketUrl, setSocketUrl] = useState(ws);
  const { sendJsonMessage } = useWebSocket(socketUrl, {
    shouldReconnect: (/* closeEvent */) => {
      return didUnmount.current === false;
    },
    reconnectAttempts: 10,
    reconnectInterval: 3000,
    onMessage: (msg) => {
      const lastJsonMessage = JSON.parse(msg?.data);
      if (lastJsonMessage?.data && lastJsonMessage?.data?.answer === '<>') {
        // setQuestionList(lastJsonMessage?.data?.relative_questions);
        setDisabled(false);
        return;
      }
      if (lastJsonMessage !== null && lastJsonMessage?.data) {
        const msgList = [...messageList];
        const curIndex = msgList.findIndex((item) => item.isTemporary);
        if (curIndex > -1) {
          msgList.splice(curIndex, 1);
        }
        // 添加当前用户提交信息
        const hasQuestionId = msgList.some(
          (item) => item?.questionId === lastJsonMessage?.data?.question_id,
        );
        if (!hasQuestionId) {
          msgList.map((item) => {
            if (item.role === 'user' && !item.questionId) {
              item.questionId = lastJsonMessage?.data?.question_id;
            }
          });
          msgList.push({
            time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            role: 'robot',
            message: '',
            questionId: lastJsonMessage?.data?.question_id,
          });
        }
        setMessageList(msgList);
      }
    },
  });
  const handleSendMessage = useCallback(
    (msg: any) => {
      // setQuestionList([]);
      return sendJsonMessage({
        knowledge_base_id: 'ump',
        query: msg, // 用户提问内容；
        streaming: true, // 是否为流式输出格式；
      });
    },
    [sendJsonMessage],
  );
  const onSendMessage = () => {
    if (!message) return Message.error('请输入你的问题');
    setDisabled(true);
    const msgList = [...messageList];
    msgList.push({
      time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      message,
      role: 'user',
      questionId: null,
    });
    msgList.push({
      time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      message: `<div class='answer'>
                  <div>Robot正在回答中...</div>
                  <div class="loading">
                    <div></div>
                    <div></div>
                  </div>
                </div>`,
      role: 'robot',
      isTemporary: true,
      questionId: null,
    });
    setMessageList(msgList);
    handleSendMessage(message);
    setMessage('');
  };
  useEffect(() => {
    // setSocketUrl(ws)
    return () => {
      setSocketUrl('');
      didUnmount.current = true;
    };
  }, []);
  return (
    <Card
      style={{
        borderRadius: 8,
      }}
      title="欢迎使用 Robot"
    >
      <div
        style={{
          maxHeight: '600px',
          overflowY: 'auto',
          backgroundPosition: '100% -30%',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '274px auto',
          backgroundImage:
            "url('https://gw.alipayobjects.com/mdn/rms_a9745b/afts/img/A*BuFmQqsB2iAAAAAAAAAAAAAAARQnAQ')",
        }}
      >
        {/* exist message */}
        <div>
          {messageList?.map((item, index) => {
            const padding = item.role === 'robot' ? 'paddingLeft' : 'paddingRight';
            const margin = item.role === 'robot' ? 'marginLeft' : 'marginRight';
            const textAlign = item.role === 'robot' ? 'left' : 'right';
            const flexDirection = item.role === 'robot' ? 'row' : 'row-reverse';
            const alignSelf = item.role === 'robot' ? 'start' : 'end';
            return (
              <div
                style={{
                  display: 'flex',
                  flexDirection: flexDirection,
                  marginBottom: 10,
                  marginTop: 10,
                  [padding]: 10,
                }}
                key={item.id}
              >
                <Avatar
                  size={38}
                  style={{
                    width: 38,
                    backgroundColor: '#1890ff',
                    verticalAlign: 'middle',
                  }}
                >
                  {item.role === 'robot' ? 'R' : 'U'}
                </Avatar>
                <div
                  style={{
                    width: item.role === 'robot' ? '70%' : 'auto',
                    [margin]: 5,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <span
                    style={{
                      color: '#909399',
                      textAlign: textAlign,
                      width: '100%',
                      display: 'inline-block',
                    }}
                  >
                    {item.time}
                  </span>
                  {index === 0 || item?.isTemporary ? (
                    <div
                      style={{
                        background: '#f5f7fa',
                        padding: 10,
                        marginTop: 5,
                        borderRadius: 6,
                        textAlign,
                        lineHeight: 1.5,
                        wordWrap: 'break-word',
                        width: item.role === 'robot' ? '100%' : 'auto',
                        alignSelf,
                      }}
                      dangerouslySetInnerHTML={{
                        __html: item.message,
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        background: '#f5f7fa',
                        paddingLeft: 10,
                        paddingRight: 10,
                        marginTop: 5,
                        borderRadius: 6,
                        textAlign,
                        wordWrap: 'break-word',
                        width: item.role === 'robot' ? '100%' : 'auto',
                        alignSelf,
                      }}
                    >
                      <Markdown skipHtml={false} remarkPlugins={[remarkGfm]}>
                        {item.message}
                      </Markdown>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <Divider style={{ margin: 10 }} />
        {/* input area */}
        <div>
          <TextArea
            style={{
              borderColor: '#eee',
            }}
            placeholder="与robot交谈"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            allowClear
            onPressEnter={(e) => {
              if (e.code === 'Enter' && !disabled) {
                onSendMessage();
                e.preventDefault();
              }
            }}
          />
        </div>
      </div>
    </Card>
  );
};

export default Robot;
