/**
 * Full sanity test runner — all phases including destructive operations.
 *
 * Optional env:
 *   SANITY_IMAGE_ASSET_ID  image asset_id for image-to-video generation (Phase 4)
 *   SANITY_VIDEO_ASSET_ID  video asset_id for AI Video Analysis (Phase 5)
 */
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const BASE = "http://localhost:2718";
const USE_STREAMABLE = process.argv.includes("--streamable");
const IMAGE_ASSET_ID = process.env.SANITY_IMAGE_ASSET_ID;
const VIDEO_ASSET_ID = process.env.SANITY_VIDEO_ASSET_ID;
let passed = 0, failed = 0, skipped = 0;

function log(label, ok, detail) {
  const mark = ok ? "PASS" : "FAIL";
  console.log(`[${mark}] ${label}${detail ? " — " + detail : ""}`);
  ok ? passed++ : failed++;
}

function skip(label, reason) {
  console.log(`[SKIP] ${label} — ${reason}`);
  skipped++;
}

async function callTool(client, name, args = {}) {
  const res = await client.callTool({ name, arguments: args });
  const text = res.content?.filter((c) => c.type === "text").map((c) => c.text).join("\n");
  let json;
  try { json = JSON.parse(text); } catch { json = null; }
  return { text, json, isError: res.isError };
}

async function pollJob(client, tool, jobId, { attempts = 30, delayMs = 10000 } = {}) {
  let last;
  for (let i = 0; i < attempts; i++) {
    last = await callTool(client, tool, { jobId });
    const status = last.json?.data?.status;
    if (last.isError || status === "completed" || status === "failed") return last;
    await new Promise((r) => setTimeout(r, delayMs));
  }
  return last;
}

async function main() {
  const RUN_ID = Date.now().toString(36);
  const PFX = `sanity-${RUN_ID}`;
  console.log(`\n=== MCP Full Sanity Test Runner (run ${RUN_ID}) ===\n`);

  const transport = USE_STREAMABLE
    ? new StreamableHTTPClientTransport(new URL("/mcp", BASE))
    : new SSEClientTransport(new URL("/sse", BASE));
  const client = new Client({ name: "sanity-test", version: "1.0.0" });
  await client.connect(transport);
  console.log(`Connected to MCP server (${USE_STREAMABLE ? "streamable HTTP" : "SSE"})\n`);

  // ─── Phase 0: Tool list + hook verification ───
  console.log("--- Phase 0: Tool list + hook verification ---\n");
  {
    const { tools } = await client.listTools();
    log("0.1 tools/list", tools.length === 26, `${tools.length} tool(s)`);
    const leaked = tools.filter((t) => JSON.stringify(t.inputSchema).includes("cloud_name"));
    log("0.1a cloud_name hidden from tool args", leaked.length === 0, leaked.map((t) => t.name).join(", "));
  }
  {
    const { json, isError } = await callTool(client, "list-live-streams");
    const hdrs = json?._headers;
    if (process.env.CLOUDINARY_COLLECT_HEADERS) {
      log("0.2 _headers present", !!hdrs && !isError, hdrs ? Object.keys(hdrs).join(", ") : "missing");
    } else {
      skip("0.2 _headers present", "server started without CLOUDINARY_COLLECT_HEADERS");
    }
  }

  // ─── Phase 1: Read-only ───
  console.log("\n--- Phase 1: Read-only tools ---\n");
  {
    const { json, isError } = await callTool(client, "list-live-streams");
    log("1.1 list-live-streams", !isError && Array.isArray(json?.data), `${json?.data?.length ?? 0} stream(s)`);
  }
  {
    const { json, isError } = await callTool(client, "list-image-to-video-prompts");
    log("1.2 list-image-to-video-prompts", !isError && Array.isArray(json?.data), `${json?.data?.length ?? 0} prompt(s)`);
  }
  {
    const { json, isError } = await callTool(client, "list-canvas-applets");
    log("1.3 list-canvas-applets", !isError && Array.isArray(json?.data), `${json?.data?.length ?? 0} applet(s)`);
  }

  // ─── Phase 2: Live streams ───
  console.log("\n--- Phase 2: Live streams ---\n");
  let streamId, outputId;
  {
    const { json, text, isError } = await callTool(client, "create-live-stream", {
      request: { name: `${PFX}-stream`, input: { type: "rtmp" }, idle_timeout_sec: 60, max_runtime_sec: 600 },
    });
    streamId = json?.data?.id;
    log("2.1 create-live-stream", !isError && !!streamId, streamId ?? text);
  }
  if (streamId) {
    {
      const { json, isError } = await callTool(client, "get-live-stream", { liveStreamId: streamId });
      log("2.2 get-live-stream", !isError && json?.data?.name === `${PFX}-stream`, `status=${json?.data?.status}`);
    }
    {
      const { json, isError } = await callTool(client, "update-live-stream", {
        liveStreamId: streamId,
        LiveStreamUpdatePayload: { name: `${PFX}-stream-renamed` },
      });
      log("2.3 update-live-stream", !isError && json?.data?.name === `${PFX}-stream-renamed`, json?.data?.name);
    }
    {
      const { json, text, isError } = await callTool(client, "create-live-stream-output", {
        liveStreamId: streamId,
        LiveStreamOutputCreatePayload: {
          name: `${PFX}-output`,
          type: "simulcast",
          uri: "rtmp://a.rtmp.youtube.com/live2",
          stream_key: `${PFX}-key`,
        },
      });
      outputId = json?.data?.id;
      log("2.4 create-live-stream-output", !isError && !!outputId, outputId ?? text);
    }
    {
      const { json, isError } = await callTool(client, "list-live-stream-outputs", { liveStreamId: streamId });
      log("2.5 list-live-stream-outputs", !isError && json?.data?.some((o) => o.id === outputId), `${json?.data?.length ?? 0} output(s)`);
    }
    if (outputId) {
      {
        const { json, isError } = await callTool(client, "get-live-stream-output", { liveStreamId: streamId, liveStreamOutputId: outputId });
        log("2.6 get-live-stream-output", !isError && json?.data?.id === outputId, json?.data?.type);
      }
      {
        const { json, isError } = await callTool(client, "update-live-stream-output", {
          liveStreamId: streamId,
          liveStreamOutputId: outputId,
          LiveStreamOutputUpdatePayload: { name: `${PFX}-output-renamed` },
        });
        log("2.7 update-live-stream-output", !isError && json?.data?.name === `${PFX}-output-renamed`, json?.data?.name);
      }
    } else {
      skip("2.6–2.7 output get/update", "no output id from 2.4");
    }
    {
      const { json, text, isError } = await callTool(client, "activate-live-stream", { liveStreamId: streamId });
      log("2.8 activate-live-stream", !isError, json?.data?.message ?? text);
    }
    {
      const { json, text, isError } = await callTool(client, "idle-live-stream", { liveStreamId: streamId });
      log("2.9 idle-live-stream", !isError, json?.data?.message ?? text);
    }
  } else {
    skip("2.2–2.9 live stream ops", "no stream id from 2.1");
  }

  // ─── Phase 3: Image-to-video prompts ───
  console.log("\n--- Phase 3: Image-to-video prompts ---\n");
  let promptId;
  {
    const { json, text, isError } = await callTool(client, "create-image-to-video-prompt", {
      request: { display_name: `${PFX}-prompt`, prompt: "Slow camera pan from left to right" },
    });
    promptId = json?.data?.id;
    log("3.1 create-image-to-video-prompt", !isError && !!promptId, promptId ?? text);
  }
  if (promptId) {
    {
      const { json, isError } = await callTool(client, "get-image-to-video-prompt", { promptId });
      log("3.2 get-image-to-video-prompt", !isError && json?.data?.display_name === `${PFX}-prompt`, json?.data?.display_name);
    }
    {
      const { json, isError } = await callTool(client, "update-image-to-video-prompt", {
        promptId,
        ImageToVideoPromptUpdatePayload: { display_name: `${PFX}-prompt-renamed` },
      });
      log("3.3 update-image-to-video-prompt", !isError && json?.data?.display_name === `${PFX}-prompt-renamed`, json?.data?.display_name);
    }
  } else {
    skip("3.2–3.3 prompt get/update", "no prompt id from 3.1");
  }

  // ─── Phase 4: Image-to-video generation (consumes add-on quota) ───
  console.log("\n--- Phase 4: Image-to-video generation ---\n");
  if (IMAGE_ASSET_ID) {
    let jobId;
    {
      const { json, text, isError } = await callTool(client, "generate-video-from-image", {
        request: { image_asset_id: IMAGE_ASSET_ID, prompt: "Slow camera pan from left to right", duration: 4, resolution: "720p" },
      });
      jobId = json?.data?.job_id;
      log("4.1 generate-video-from-image", !isError && !!jobId, jobId ?? text);
    }
    if (jobId) {
      const { json, isError } = await pollJob(client, "get-video-generation-job", jobId);
      log("4.2 get-video-generation-job", !isError && json?.data?.status === "completed", `status=${json?.data?.status} ${json?.data?.url ?? json?.data?.message ?? ""}`);
    }
  } else {
    skip("4.1–4.2 video generation", "SANITY_IMAGE_ASSET_ID not set");
  }

  // ─── Phase 5: AI Video Analysis (consumes add-on quota) ───
  console.log("\n--- Phase 5: AI Video Analysis ---\n");
  if (VIDEO_ASSET_ID) {
    let jobId;
    {
      const { json, text, isError } = await callTool(client, "analyze-video", {
        request: { video_asset_id: VIDEO_ASSET_ID },
      });
      jobId = json?.data?.job_id;
      log("5.1 analyze-video", !isError && !!jobId, jobId ?? text);
    }
    if (jobId) {
      const { json, isError } = await pollJob(client, "get-video-analysis-job", jobId);
      log("5.2 get-video-analysis-job", !isError && json?.data?.status === "completed", `status=${json?.data?.status} ${json?.data?.visual_transcription?.url ?? json?.data?.message ?? ""}`);
    }
  } else {
    skip("5.1–5.2 AI video analysis", "SANITY_VIDEO_ASSET_ID not set");
  }

  // ─── Phase 6: Video Canvas applets ───
  console.log("\n--- Phase 6: Video Canvas applets ---\n");
  let appletId;
  {
    const { json, text, isError } = await callTool(client, "create-canvas-applet", {
      request: { name: `${PFX}-applet`, description: "sanity test", blocks: [] },
    });
    appletId = json?.data?.id;
    log("6.1 create-canvas-applet", !isError && !!appletId, appletId ?? text);
  }
  if (appletId) {
    {
      const { json, isError } = await callTool(client, "get-canvas-applet", { appletId });
      log("6.2 get-canvas-applet", !isError && json?.data?.id === appletId, `named_transformation=${json?.data?.named_transformation}`);
    }
    {
      const { json, isError } = await callTool(client, "replace-canvas-applet", {
        appletId,
        VideoCanvasAppletContentPayload: { name: `${PFX}-applet-renamed`, blocks: [] },
      });
      log("6.3 replace-canvas-applet", !isError && json?.data?.name === `${PFX}-applet-renamed`, json?.data?.name);
    }
  } else {
    skip("6.2–6.3 applet get/update", "no applet id from 6.1");
  }

  // ─── Phase 7: Cleanup (destructive) ───
  console.log("\n--- Phase 7: Cleanup ---\n");
  if (appletId) {
    const { isError } = await callTool(client, "delete-canvas-applet", { appletId });
    log("7.1 delete-canvas-applet", !isError, appletId);
  }
  if (promptId) {
    const { isError } = await callTool(client, "delete-image-to-video-prompt", { promptId });
    log("7.2 delete-image-to-video-prompt", !isError, promptId);
  }
  if (streamId && outputId) {
    const { isError } = await callTool(client, "delete-live-stream-output", { liveStreamId: streamId, liveStreamOutputId: outputId });
    log("7.3 delete-live-stream-output", !isError, outputId);
  }
  if (streamId) {
    const { isError } = await callTool(client, "delete-live-stream", { liveStreamId: streamId });
    log("7.4 delete-live-stream", !isError, streamId);
  }
  {
    const streams = (await callTool(client, "list-live-streams")).json?.data ?? [];
    const prompts = (await callTool(client, "list-image-to-video-prompts")).json?.data ?? [];
    const applets = (await callTool(client, "list-canvas-applets")).json?.data ?? [];
    const left = [
      ...streams.filter((s) => s.name?.startsWith(PFX)),
      ...prompts.filter((p) => p.display_name?.startsWith(PFX)),
      ...applets.filter((a) => a.name?.startsWith(PFX)),
    ];
    log("7.5 final verification", left.length === 0, `${left.length} leftover(s)`);
  }

  // ─── Summary ───
  console.log(`\n=== Summary: ${passed + failed} run, ${passed} passed, ${failed} failed, ${skipped} skipped ===\n`);

  await client.close();
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => { console.error("Fatal:", err); process.exit(2); });
