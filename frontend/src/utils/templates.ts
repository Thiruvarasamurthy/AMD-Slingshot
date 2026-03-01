export const templates = [
  {
    id: "email_brief",
    name: "Email Brief",
    description: "Summarizes incoming emails and reads them aloud via TTS.",
    nodes: [
      { id: "node_1", type: "gmail_trigger", position: { x: 50, y: 150 }, data: { label: "Gmail Trigger", sublabel: "OAuth Polling", icon: "📧" } },
      { id: "node_2", type: "llama_summarize", position: { x: 350, y: 150 }, data: { label: "Llama Summarize", sublabel: "Llama-3.2-1B", icon: "🤖" } },
      { id: "node_3", type: "kokoro_tts", position: { x: 650, y: 150 }, data: { label: "Kokoro TTS", sublabel: "Voice: af_sky", icon: "🔊" } }
    ],
    edges: [
      { id: "edge_1_2", source: "node_1", target: "node_2" },
      { id: "edge_2_3", source: "node_2", target: "node_3" }
    ]
  },
  {
    id: "voice_jira",
    name: "Voice to Jira",
    description: "Transcribes voice commands and creates structured Jira tickets.",
    nodes: [
      { id: "node_1", type: "voice_trigger", position: { x: 50, y: 150 }, data: { label: "Voice Trigger", sublabel: "Whisper-V3", icon: "🎤" } },
      { id: "node_2", type: "entity_extract", position: { x: 350, y: 150 }, data: { label: "Entity Extract", sublabel: "JSON Output", icon: "📋" } },
      { id: "node_3", type: "jira_post", position: { x: 650, y: 150 }, data: { label: "Jira Task", sublabel: "REST API", icon: "📌" } }
    ],
    edges: [
      { id: "edge_1_2", source: "node_1", target: "node_2" },
      { id: "edge_2_3", source: "node_2", target: "node_3" }
    ]
  },
  {
    id: "file_router",
    name: "File Classifier",
    description: "Watches a folder and auto-routes files based on content.",
    nodes: [
      { id: "node_1", type: "file_watcher", position: { x: 50, y: 150 }, data: { label: "File Watcher", sublabel: "Auto-route", icon: "📁" } },
      { id: "node_2", type: "smart_file_router", position: { x: 350, y: 150 }, data: { label: "Smart Router", sublabel: "Classification", icon: "🗂️" } }
    ],
    edges: [
      { id: "edge_1_2", source: "node_1", target: "node_2" }
    ]
  }
];