import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/components/ui/cn";
import { getPathForScreen } from "@/utils/navigation";

type AiResponseType = "create" | "details" | "cluster";

interface AiMessage {
  id: string;
  role: "bot" | "user" | "thinking";
  tag?: string;
  content: ReactNode;
}

const INITIAL_MESSAGES: AiMessage[] = [
  {
    id: "welcome",
    role: "bot",
    tag: "✦ VidyutRaksha AI",
    content: (
      <>
        Good morning, Rajiv. I&apos;ve completed the overnight batch analysis of{" "}
        <strong>15,00,000 meters</strong> across 5 DISCOMs. Here&apos;s what I
        found:
        <br />
        <br />
        🔴 <strong>851 new high-risk meters</strong> detected
        <br />
        🟡 <strong>DT-0445 has 94% loading</strong> — overload risk
        <br />
        🟢 Your team&apos;s hit rate improved to <strong>57%</strong>
        <br />
        <br />
        Would you like me to create cases for the new high-risk meters?
      </>
    ),
  },
  {
    id: "pattern-alert",
    role: "bot",
    tag: "✦ Pattern alert",
    content: (
      <>
        I&apos;ve detected a <strong>cluster of 12 meters in DT-0445</strong>{" "}
        (Gomti Nagar, Feeder-14) showing coordinated consumption drops in the
        last 2 weeks. This pattern suggests <strong>organized theft</strong>,
        not individual tampering.
        <br />
        <br />
        <span className="inline-flex items-center gap-1 rounded-[10px] bg-ai-purple-light px-2 py-0.75 text-[10px] font-semibold text-ai-purple">
          Confidence: 89%
          <span className="inline-block h-1 w-10 rounded-sm bg-[rgba(124,58,237,0.15)] align-middle">
            <span
              className="block h-full rounded-sm bg-ai-purple"
              style={{ width: "89%" }}
            />
          </span>
        </span>
      </>
    ),
  },
];

const AI_RESPONSES: Record<AiResponseType, ReactNode> = {
  create: (
    <>
      Done — I&apos;ve created <strong>47 new cases</strong> and auto-assigned
      them to the nearest available inspectors based on division and workload.
      Rajesh Kumar got 12, Sunita Verma got 11, and the rest are split among 4
      other officers.
    </>
  ),
  details: (
    <>
      Here&apos;s the breakdown of today&apos;s{" "}
      <strong>47 new high-risk flags:</strong>
      <br />• 18 earth loading patterns
      <br />• 12 consumption drops &gt; 50%
      <br />• 9 zero-consumption anomalies
      <br />• 5 reverse energy detections
      <br />• 3 tariff misuse patterns
      <br />
      <br />
      The highest-risk meter is <strong>#1849966 (score: 94)</strong>.
    </>
  ),
  cluster: (
    <>
      The DT-0445 cluster shows 12 meters with{" "}
      <strong>synchronized 40-60% consumption drops</strong> starting 2 weeks
      ago. All are domestic consumers within a 200m radius. This coordinated
      timing strongly suggests{" "}
      <strong>organized theft with a local accomplice</strong>. I recommend a
      surprise raid rather than individual inspections.
    </>
  ),
};

let messageId = 0;

function nextMessageId(): string {
  messageId += 1;
  return `ai-msg-${messageId}`;
}

function ThinkingDots() {
  return (
    <div className="[&_span]:mx-0.5 [&_span]:inline-block [&_span]:size-1.5 [&_span]:animate-blink [&_span]:rounded-full [&_span]:bg-ai-purple [&_span:nth-child(2)]:[animation-delay:0.2s] [&_span:nth-child(3)]:[animation-delay:0.4s]">
      <span />
      <span />
      <span />
    </div>
  );
}

export function AiCopilotPanel() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem("ai-copilot-collapsed");
    return saved ? JSON.parse(saved) : false;
  });
  const [messages, setMessages] = useState<AiMessage[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem("ai-copilot-collapsed", JSON.stringify(collapsed));
  }, [collapsed]);

  const scrollToBottom = useCallback(() => {
    const body = bodyRef.current;
    if (body) {
      body.scrollTop = body.scrollHeight;
    }
  }, []);

  const appendThinkingAndRespond = useCallback(
    (response: ReactNode, tag = "✦ VidyutRaksha AI") => {
      const thinkingId = nextMessageId();
      setMessages((current) => [
        ...current,
        { id: thinkingId, role: "thinking", content: null },
      ]);
      window.setTimeout(() => {
        scrollToBottom();
      }, 0);

      window.setTimeout(() => {
        setMessages((current) =>
          current
            .filter((message) => message.id !== thinkingId)
            .concat({
              id: nextMessageId(),
              role: "bot",
              tag,
              content: response,
            }),
        );
        window.setTimeout(scrollToBottom, 0);
      }, 1200);
    },
    [scrollToBottom],
  );

  const handleAiRespond = useCallback(
    (type: AiResponseType) => {
      appendThinkingAndRespond(AI_RESPONSES[type]);
    },
    [appendThinkingAndRespond],
  );

  const handleSend = useCallback(() => {
    const msg = inputValue.trim();
    if (!msg) {
      return;
    }

    setMessages((current) => [
      ...current,
      { id: nextMessageId(), role: "user", content: msg },
    ]);
    setInputValue("");

    const thinkingId = nextMessageId();
    setMessages((current) => [
      ...current,
      { id: thinkingId, role: "thinking", content: null },
    ]);
    window.setTimeout(scrollToBottom, 0);

    window.setTimeout(() => {
      setMessages((current) =>
        current
          .filter((message) => message.id !== thinkingId)
          .concat({
            id: nextMessageId(),
            role: "bot",
            tag: "✦ VidyutRaksha AI",
            content: (
              <>
                I found <strong>23 meters</strong> matching your query in Chowk
                Division. The top result is Meter #1849966 with a risk score of
                94 and 50 earth loading events.
                <br />
                <br />
                Would you like me to create cases for these or show the full
                list?
                <div className="mt-1.5">
                  <button
                    type="button"
                    className="mt-1.5 mr-1 inline-block cursor-pointer rounded-xl border border-ai-purple bg-transparent px-2.5 py-1 font-sans text-[11px] font-medium text-ai-purple hover:bg-ai-purple hover:text-white"
                    onClick={() => navigate(getPathForScreen("meters"))}
                  >
                    Show full list
                  </button>
                  <button
                    type="button"
                    className="mt-1.5 mr-1 inline-block cursor-pointer rounded-xl border border-ai-purple bg-transparent px-2.5 py-1 font-sans text-[11px] font-medium text-ai-purple hover:bg-ai-purple hover:text-white"
                  >
                    Create cases
                  </button>
                </div>
              </>
            ),
          }),
      );
      window.setTimeout(scrollToBottom, 0);
    }, 1500);
  }, [inputValue, navigate, scrollToBottom]);

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div
      className={cn(
        "flex shrink-0 flex-col overflow-hidden border-l border-border bg-card transition-[width] duration-300",
        collapsed ? "w-14" : "w-75",
      )}
      id="aiPanel"
    >
      <div
        className={cn(
          "border-b border-border",
          collapsed
            ? "flex items-center justify-center py-3"
            : "flex items-center justify-between px-4 py-3.5",
        )}
      >
        {!collapsed && (
          <>
            <div className="flex items-center gap-2 font-display text-[13px] font-semibold tracking-tight">
              <span
                className="inline-flex size-6 items-center justify-center rounded-md shadow-[0_0_12px_rgba(124,58,237,0.25)]"
                style={{ background: "var(--ai-gradient)" }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2"
                >
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              </span>
              AI Copilot
            </div>

            <button
              type="button"
              onClick={() => setCollapsed(true)}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded text-base text-text-dim hover:bg-white/5"
            >
              ◀
            </button>
          </>
        )}

        {collapsed && (
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            className="flex flex-col items-center gap-3 py-2"
          >
            <span
              className="inline-flex size-7 items-center justify-center rounded-md shadow-[0_0_12px_rgba(124,58,237,0.25)]"
              style={{ background: "var(--ai-gradient)" }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2"
              >
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </span>

            <span className="[writing-mode:vertical-rl] rotate-180 text-[11px] font-semibold tracking-wider text-text-dim">
              AI Copilot
            </span>
          </button>
        )}
      </div>
      {!collapsed ? (
        <>
          <div
            className="ai-panel-scroll flex-1 overflow-y-auto p-3"
            id="aiPanelBody"
            ref={bodyRef}
          >
            {messages.map((message) => {
              if (message.role === "user") {
                return (
                  <div key={message.id} className="mb-3 max-w-[95%]">
                    <div className="ml-auto rounded-xl rounded-br-xs bg-navy p-2.5 px-3 text-xs leading-normal text-white">
                      {message.content}
                    </div>
                  </div>
                );
              }

              if (message.role === "thinking") {
                return (
                  <div key={message.id} className="mb-3 max-w-[95%]">
                    <div className="rounded-xl rounded-bl-xs border border-[rgba(124,58,237,0.1)] bg-ai-purple-light p-2.5 px-3 text-xs leading-relaxed text-text">
                      <ThinkingDots />
                    </div>
                  </div>
                );
              }

              return (
                <div key={message.id} className="mb-3 max-w-[95%]">
                  <div className="rounded-xl rounded-bl-xs border border-[rgba(124,58,237,0.1)] bg-ai-purple-light p-2.5 px-3 text-xs leading-relaxed text-text">
                    {message.tag ? (
                      <div className="mb-1 inline-flex items-center gap-1 text-[10px] font-semibold text-ai-purple">
                        {message.tag}
                      </div>
                    ) : null}
                    {message.content}
                    {message.id === "welcome" ? (
                      <div className="mt-2">
                        <button
                          type="button"
                          className="mt-1.5 mr-1 inline-block cursor-pointer rounded-xl border border-ai-purple bg-transparent px-2.5 py-1 font-sans text-[11px] font-medium text-ai-purple hover:bg-ai-purple hover:text-white"
                          onClick={() => handleAiRespond("create")}
                        >
                          ✦ Yes, create cases
                        </button>
                        <button
                          type="button"
                          className="mt-1.5 mr-1 inline-block cursor-pointer rounded-xl border border-ai-purple bg-transparent px-2.5 py-1 font-sans text-[11px] font-medium text-ai-purple hover:bg-ai-purple hover:text-white"
                          onClick={() => handleAiRespond("details")}
                        >
                          Show me details
                        </button>
                      </div>
                    ) : null}
                    {message.id === "pattern-alert" ? (
                      <div className="mt-2">
                        <button
                          type="button"
                          className="mt-1.5 mr-1 inline-block cursor-pointer rounded-xl border border-ai-purple bg-transparent px-2.5 py-1 font-sans text-[11px] font-medium text-ai-purple hover:bg-ai-purple hover:text-white"
                          onClick={() => handleAiRespond("cluster")}
                        >
                          Investigate cluster
                        </button>
                        <button
                          type="button"
                          className="mt-1.5 mr-1 inline-block cursor-pointer rounded-xl border border-ai-purple bg-transparent px-2.5 py-1 font-sans text-[11px] font-medium text-ai-purple hover:bg-ai-purple hover:text-white"
                        >
                          Add to priority
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex gap-2 border-t border-border p-3">
            <input
              id="aiInput"
              placeholder="Ask AI anything..."
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              onKeyDown={handleInputKeyDown}
              className="flex-1 rounded-[20px] border-[1.5px] border-border px-3 py-2 font-sans text-xs focus:border-ai-purple focus:outline-none"
            />
            <button
              type="button"
              onClick={handleSend}
              className="flex size-8.5 shrink-0 cursor-pointer items-center justify-center rounded-full border-none text-white"
              style={{ background: "var(--ai-gradient)" }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
