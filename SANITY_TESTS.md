# MCP Server Sanity Tests

Manual test plan covering all 26 tools. Tests are grouped into phases that build on each other — run them in order so that resources created in earlier steps are available for later ones.

`sanity-test-runner.mjs` automates every phase below.

## Prerequisites

Start the server with header collection enabled:

```bash
CLOUDINARY_COLLECT_HEADERS=true \
  node bin/mcp-server.js start --transport sse --log-level debug
```

Then run:

```bash
node sanity-test-runner.mjs              # SSE
```

For streamable HTTP, start the server with `node bin/mcp-server.js serve` instead and run `node sanity-test-runner.mjs --streamable`.

Phases 4 and 5 consume add-on quota and need existing assets. They are skipped unless these are set:

| Variable | Used by |
|----------|---------|
| `SANITY_IMAGE_ASSET_ID` | Phase 4 — `asset_id` of an image to animate |
| `SANITY_VIDEO_ASSET_ID` | Phase 5 — `asset_id` of a video to analyze |

---

## Phase 0: Tool list + hook verification

### 0.1 Tool list

`tools/list` returns 26 tools, and no tool input schema contains `cloud_name` (the cloud name comes from `CLOUDINARY_CLOUD_NAME` / `--cloud-name`).

### 0.2 Response header collection

Call `list-live-streams` and check the `_headers` key is present in the response.

### 0.3 User-Agent string

Inspect the server debug logs. Expect the outgoing `User-Agent` header to match:

```
Cloudinary/VideoMcp MCP/<sdkVersion> Gen/<genVersion> Schema/<openapiDocVersion> (Node.js <ver>; <platform> <arch>)
```

If the SDK was constructed with a caller User-Agent (e.g. by a remote MCP service), the string should also contain `; origin <callerUA>`.

---

## Phase 1: Read-only tools

| Test | Call | Expect |
|------|------|--------|
| 1.1 | `list-live-streams` | `data` array |
| 1.2 | `list-image-to-video-prompts` | `data` array |
| 1.3 | `list-canvas-applets` | `data` array |

## Phase 2: Live streams

| Test | Call | Expect |
|------|------|--------|
| 2.1 | `create-live-stream  request={"name": "sanity-stream", "input": {"type": "rtmp"}, "idle_timeout_sec": 60, "max_runtime_sec": 600}` | `data.id` |
| 2.2 | `get-live-stream  liveStreamId=<id>` | `data.name` = `sanity-stream` |
| 2.3 | `update-live-stream  liveStreamId=<id>  LiveStreamUpdatePayload={"name": "sanity-stream-renamed"}` | renamed |
| 2.4 | `create-live-stream-output  liveStreamId=<id>  LiveStreamOutputCreatePayload={"name": "sanity-output", "type": "simulcast", "uri": "rtmp://a.rtmp.youtube.com/live2", "stream_key": "<key>"}` | `data.id` |
| 2.5 | `list-live-stream-outputs  liveStreamId=<id>` | contains output from 2.4 |
| 2.6 | `get-live-stream-output  liveStreamId=<id>  liveStreamOutputId=<output_id>` | output from 2.4 |
| 2.7 | `update-live-stream-output  liveStreamId=<id>  liveStreamOutputId=<output_id>  LiveStreamOutputUpdatePayload={"name": "sanity-output-renamed"}` | renamed |
| 2.8 | `activate-live-stream  liveStreamId=<id>` | success message |
| 2.9 | `idle-live-stream  liveStreamId=<id>` | success message |

## Phase 3: Image-to-video prompts

| Test | Call | Expect |
|------|------|--------|
| 3.1 | `create-image-to-video-prompt  request={"display_name": "sanity-prompt", "prompt": "Slow camera pan from left to right"}` | `data.id` |
| 3.2 | `get-image-to-video-prompt  promptId=<id>` | `data.display_name` = `sanity-prompt` |
| 3.3 | `update-image-to-video-prompt  promptId=<id>  ImageToVideoPromptUpdatePayload={"display_name": "sanity-prompt-renamed"}` | renamed |

## Phase 4: Image-to-video generation

| Test | Call | Expect |
|------|------|--------|
| 4.1 | `generate-video-from-image  request={"image_asset_id": "<asset_id>", "prompt": "Slow camera pan from left to right", "duration": 4, "resolution": "720p"}` | `data.job_id`, `status: pending` |
| 4.2 | `get-video-generation-job  jobId=<job_id>` (poll) | `status: completed`, `data.url` |

## Phase 5: AI Video Analysis

| Test | Call | Expect |
|------|------|--------|
| 5.1 | `analyze-video  request={"video_asset_id": "<asset_id>"}` | `data.job_id`, `status: pending` |
| 5.2 | `get-video-analysis-job  jobId=<job_id>` (poll) | `status: completed`, `data.visual_transcription.url` |

## Phase 6: Video Canvas applets

| Test | Call | Expect |
|------|------|--------|
| 6.1 | `create-canvas-applet  request={"name": "sanity-applet", "description": "sanity test", "blocks": []}` | `data.id` |
| 6.2 | `get-canvas-applet  appletId=<id>` | `data.named_transformation` set |
| 6.3 | `replace-canvas-applet  appletId=<id>  VideoCanvasAppletContentPayload={"name": "sanity-applet-renamed", "blocks": []}` | renamed |

## Phase 7: Cleanup (destructive)

| Test | Call |
|------|------|
| 7.1 | `delete-canvas-applet  appletId=<id>` |
| 7.2 | `delete-image-to-video-prompt  promptId=<id>` |
| 7.3 | `delete-live-stream-output  liveStreamId=<id>  liveStreamOutputId=<output_id>` |
| 7.4 | `delete-live-stream  liveStreamId=<id>` |
| 7.5 | List streams, prompts, and applets — no `sanity-*` leftovers |

Deleting an applet does not delete its backing named transformation; remove it separately if needed.

---

## Checklist

- [ ] `tools/list` returns 26 tools with no `cloud_name` argument
- [ ] All read-only tools return valid responses
- [ ] `_headers` present in JSON responses (when `CLOUDINARY_COLLECT_HEADERS` is set)
- [ ] User-Agent string follows expected format (check debug logs)
- [ ] All mutating operations succeed with basic auth
- [ ] Async jobs (video generation, AI analysis) reach `completed`
- [ ] Cleanup removes all test artifacts
- [ ] Server handles cancellation gracefully (disconnect mid-request)
