# Cloudinary Video MCP Server

<!-- mcp-name: com.cloudinary/video-mcp -->

<!-- Start Summary [summary] -->
## Summary

Cloudinary Video API: The Video API enables you to stream, generate, analyze, and transform video in your product environment. Broadcast **live streams** over RTMP, generate videos from images with **Image to Video**, produce timestamped visual transcripts with **AI Video Analysis**, and build node-based transformation pipelines as **Video Canvas** applets.

The API uses **Basic Authentication** over HTTPS with your **API Key** and **API Secret** from the [Cloudinary Console](https://console.cloudinary.com/app/settings/api-keys), or **OAuth 2.0** with the `video` scope.

Key capabilities:
* Create and manage RTMP live streams and their outputs, and start or stop a stream manually. See the [live streaming guide](https://cloudinary.com/documentation/video_live_streaming).
* Generate a video from a source image and a text prompt describing the motion or scene, and manage reusable prompts. See the [Image to Video add-on](https://cloudinary.com/documentation/image_to_video_addon) guide.
* Generate a visual transcript of a stored video: timestamped, natural-language descriptions of what's visible on screen, optionally guided by a prompt. See the [AI Video Analysis](https://cloudinary.com/documentation/ai_video_analysis) guide.
* Create applets that Cloudinary compiles into a [named transformation](https://cloudinary.com/documentation/video_named_transformations) you can deliver like any other transformation. See the [Video Canvas](https://cloudinary.com/documentation/video_canvas) guide.

Image to Video and AI Video Analysis requests run as asynchronous jobs: you submit a request, then poll the job until the result is ready.

**Note**: Image to Video and AI Video Analysis are currently in **Beta**. There may be minor changes to parameter names or other implementation details before the general access release. We invite you to try them out, and would appreciate any feedback via our [support team](https://support.cloudinary.com/hc/en-us/requests/new).
<!-- End Summary [summary] -->

<!-- Start Table of Contents [toc] -->
## Table of Contents
<!-- $toc-max-depth=2 -->
* [Cloudinary Video MCP Server](#cloudinary-video-mcp-server)
  * [Installation](#installation)
  * [Configuration](#configuration)
  * [Authentication](#authentication)
  * [Available Tools](#available-tools)
  * [Progressive Discovery](#progressive-discovery)
* [Development](#development)
  * [Building from Source](#building-from-source)
  * [Contributions](#contributions)

<!-- End Table of Contents [toc] -->

<!-- Start Installation [installation] -->
## Installation

The MCP server requires Node.js 20.19.0 or later.
<details>
<summary>Claude Desktop</summary>

Install the MCP server as a Desktop Extension using the pre-built [`mcp-server.mcpb`](./mcp-server.mcpb) file:

Simply drag and drop the [`mcp-server.mcpb`](./mcp-server.mcpb) file onto Claude Desktop to install the extension.

The MCP bundle package includes the MCP server and all necessary configuration. Once installed, the server will be available without additional setup.

> [!NOTE]
> MCP bundles provide a streamlined way to package and distribute MCP servers. Learn more about [Desktop Extensions](https://www.anthropic.com/engineering/desktop-extensions).

</details>

<details>
<summary>Cursor</summary>

[![Install MCP Server](https://cursor.com/deeplink/mcp-install-dark.svg)](cursor://anysphere.cursor-deeplink/mcp/install?name=CloudinaryVideo&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyJAY2xvdWRpbmFyeS92aWRlby1tY3AiLCJzdGFydCIsIi0tYXBpLWtleSIsIiIsIi0tYXBpLXNlY3JldCIsIiIsIi0tY2xvdWQtbmFtZSIsIiJdfQ==)

Or manually:

1. Open Cursor Settings
2. Select Tools and Integrations
3. Select New MCP Server
4. If the configuration file is empty paste the following JSON into the MCP Server Configuration:

```json
{
  "command": "npx",
  "args": [
    "@cloudinary/video-mcp",
    "start",
    "--api-key",
    "",
    "--api-secret",
    "",
    "--cloud-name",
    ""
  ]
}
```

</details>

<details>
<summary>Claude Code CLI</summary>

```bash
claude mcp add CloudinaryVideo -- npx -y @cloudinary/video-mcp start --api-key  --api-secret  --cloud-name 
```

</details>
<details>
<summary>Gemini</summary>

```bash
gemini mcp add CloudinaryVideo -- npx -y @cloudinary/video-mcp start --api-key  --api-secret  --cloud-name 
```

</details>
<details>
<summary>Windsurf</summary>

Refer to [Official Windsurf documentation](https://docs.windsurf.com/windsurf/cascade/mcp#adding-a-new-mcp-plugin) for latest information

1. Open Windsurf Settings
2. Select Cascade on left side menu
3. Click on `Manage MCPs`. (To Manage MCPs you should be signed in with a Windsurf Account)
4. Click on `View raw config` to open up the mcp configuration file.
5. If the configuration file is empty paste the full json

```bash
{
  "command": "npx",
  "args": [
    "@cloudinary/video-mcp",
    "start",
    "--api-key",
    "",
    "--api-secret",
    "",
    "--cloud-name",
    ""
  ]
}
```
</details>
<details>
<summary>VS Code</summary>

[![Install in VS Code](https://img.shields.io/badge/VS_Code-VS_Code?style=flat-square&label=Install%20CloudinaryVideo%20MCP&color=0098FF)](vscode://ms-vscode.vscode-mcp/install?name=CloudinaryVideo&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyJAY2xvdWRpbmFyeS92aWRlby1tY3AiLCJzdGFydCIsIi0tYXBpLWtleSIsIiIsIi0tYXBpLXNlY3JldCIsIiIsIi0tY2xvdWQtbmFtZSIsIiJdfQ==)

Or manually:

Refer to [Official VS Code documentation](https://code.visualstudio.com/api/extension-guides/ai/mcp) for latest information

1. Open [Command Palette](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette)
1. Search and open `MCP: Open User Configuration`. This should open mcp.json file
2. If the configuration file is empty paste the full json

```bash
{
  "command": "npx",
  "args": [
    "@cloudinary/video-mcp",
    "start",
    "--api-key",
    "",
    "--api-secret",
    "",
    "--cloud-name",
    ""
  ]
}
```

</details>
<details>
<summary> Stdio installation via npm </summary>
To start the MCP server, run:

```bash
npx @cloudinary/video-mcp start --api-key  --api-secret  --cloud-name 
```

For a full list of server arguments, run:

```
npx @cloudinary/video-mcp --help
```

</details>
<!-- End Installation [installation] -->

## Configuration

### Environment Variables

The MCP server supports the following environment variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name | Yes |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key | Yes |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret | Yes |
| `CLOUDINARY_URL` | Complete Cloudinary URL (alternative to individual vars) | No |
| `CLOUDINARY_COLLECT_HEADERS` | Collect API response headers (see below) | No |

### CLOUDINARY_URL Format

You can use a single `CLOUDINARY_URL` instead of individual variables:

```bash
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
```

### Response Header Collection

You can configure the server to include Cloudinary API response headers (such as `x-request-id`) in tool output. This is useful for debugging and monitoring.

Set `CLOUDINARY_COLLECT_HEADERS` to control which headers are collected:

```bash
# Collect all response headers
CLOUDINARY_COLLECT_HEADERS=true

# Collect specific headers by exact name (comma-separated)
CLOUDINARY_COLLECT_HEADERS=x-request-id,x-featureratelimit-limit,x-featureratelimit-remaining

# Mix exact names, prefix matching, and regex matching
CLOUDINARY_COLLECT_HEADERS=x-request-id,prefix:x-featureratelimit-
```

#### Header matching specs

Each entry in the comma-separated list is matched against response header names:

| Format | Example | Behaviour |
|--------|---------|-----------|
| exact name | `x-request-id` | matches only `x-request-id` |
| `prefix:<value>` | `prefix:x-featureratelimit-` | matches any header starting with `x-featureratelimit-` |
| `regex:<pattern>` | `regex:ratelimit` | matches any header whose name contains `ratelimit` |

You can also set this via the `CLOUDINARY_URL` query parameter:

```bash
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME?collect_headers=true
```

When enabled, collected headers appear in an `_headers` field in the tool response. When not set, no headers are collected and responses are unchanged.

### Region and API Host

By default, requests go to `https://api.cloudinary.com`. Use `--region api-eu` or `--region api-ap` to target a regional endpoint, or `--server-index 1 --api-host <host>` to target a custom host.

## Authentication

The MCP server uses your Cloudinary API key and secret for authentication:

```json
{
  "env": {
    "CLOUDINARY_CLOUD_NAME": "demo",
    "CLOUDINARY_API_KEY": "123456789012345",
    "CLOUDINARY_API_SECRET": "abcdefghijklmnopqrstuvwxyz12"
  }
}
```

## Available Tools

The MCP server exposes Cloudinary's Video API as tools. Use your AI application to discover and invoke the available tools for live streaming, video generation, video analysis, and Video Canvas.

- **Live streams**: create, update, and delete RTMP live streams, and activate or idle them manually
- **Live stream outputs**: add, update, and remove a stream's outputs: HLS, archive, or simulcast to YouTube or Facebook
- **Video generation (Beta)**: generate a video from an image in your account and a prompt describing the motion or scene
- **Image to Video prompts**: save, update, and reuse prompts for video generation
- **AI Video Analysis (Beta)**: produce a timestamped visual transcript of a stored video, optionally guided by a prompt
- **Video Canvas**: create, inspect, replace, and delete applets that compile into named transformations

Video generation and AI Video Analysis run as asynchronous jobs: start the job, then poll it until the result is ready.

### Usage Examples

#### Example 1: Set Up a Live Stream

```yaml
1. Create a stream: "Create a live stream called 'product-launch'"
2. Add an output: "Add an RTMP output to live stream [live-stream-id] that restreams to rtmp://a.rtmp.youtube.com/live2 with stream key [key]"
3. Start it: "Activate live stream [live-stream-id]"
```

#### Example 2: Generate a Video from an Image

```yaml
1. Save a prompt: "Create an image to video prompt named 'slow-pan' with the text 'slow camera pan from left to right'"
2. Generate: "Generate a video from image 'products/shoe' using the 'slow-pan' prompt"
3. Poll: "Check the status of video generation job [job-id]"
```

#### Example 3: Analyze a Video

```yaml
1. Submit: "Run AI video analysis on video 'marketing/intro'"
2. Poll: "Check the status of AI video analysis job [job-id]"
```

#### Example 4: Manage Video Canvas Applets

```yaml
1. List: "List my Video Canvas applets"
2. Inspect: "Show the full content of applet [applet-id]"
3. Delete: "Delete applet [applet-id]"
```


<!-- Start Progressive Discovery [dynamic-mode] -->
## Progressive Discovery

MCP servers with many tools can bloat LLM context windows, leading to increased token usage and tool confusion. Dynamic mode solves this by exposing only a small set of meta-tools that let agents progressively discover and invoke tools on demand.

To enable dynamic mode, pass the `--mode dynamic` flag when starting your server:

```jsonc
{
  "mcpServers": {
    "CloudinaryVideo": {
      "command": "npx",
      "args": ["@cloudinary/video-mcp", "start", "--mode", "dynamic"],
      // ... other server arguments
    }
  }
}
```

In dynamic mode, the server registers only the following meta-tools instead of every individual tool:

- **`list_tools`**: Lists all available tools with their names and descriptions.
- **`describe_tool_input`**: Returns the input schema for one or more tools by name.
- **`execute_tool`**: Executes a tool by name with its arguments.

This approach significantly reduces the number of tokens sent to the LLM on each request, which is especially useful for servers with a large number of tools.
<!-- End Progressive Discovery [dynamic-mode] -->

<!-- Placeholder for Future Speakeasy SDK Sections -->

# Development

## Building from Source

### Prerequisites

- Node.js v20 or higher
- npm, pnpm, bun, or yarn

### Build Steps

```bash
# Clone the repository
git clone https://github.com/cloudinary/video-mcp.git
cd video-mcp

# Install dependencies
npm install

# Build the project
npm run build

# Run locally
node ./bin/mcp-server.js start --cloud-name <cloud_name> --api-key <api_key> --api-secret <api_secret>
```

To debug the MCP server locally, use the official MCP Inspector:

```bash
npx @modelcontextprotocol/inspector node ./bin/mcp-server.js start --cloud-name <cloud_name> --api-key <api_key> --api-secret <api_secret>
```

### Project Structure

```ini
video-mcp/
├── src/
│   ├── hooks/              # SDK hooks (manual)
│   │   ├── cloudConfig.ts          # CLOUDINARY_URL / env parsing
│   │   ├── cloudinaryAuthHook.ts   # OAuth2 / Basic auth
│   │   ├── customHeadersHook.ts    # Inject custom request headers
│   │   ├── responseHeadersHook.ts  # Collect response headers
│   │   ├── userAgentHook.ts        # Build User-Agent string
│   │   └── registration.ts         # Hook registration
│   ├── mcp-server/         # MCP server implementation
│   │   ├── server.ts             # Main server (auto-generated)
│   │   └── tools/                # Generated tool wrappers
│   ├── funcs/              # API function implementations
│   └── models/             # Type definitions
├── .github/
│   └── workflows/          # CI/CD workflows
└── .speakeasy/             # Speakeasy configuration
```

## Contributions

While we value contributions to this MCP Server, most of the code is generated programmatically from the Cloudinary API spec. Any manual changes to generated files will be overwritten on the next generation — please direct your changes to the manual extension points below.

**What you can contribute:**

- SDK hooks in `src/hooks/` (auth, custom headers, response headers, user agent)
- Documentation improvements (this README, JSDoc on manual files)
- Bug reports and feature requests

**Generated files (do not edit):**

- `src/mcp-server/server.ts`
- `src/mcp-server/tools/*.ts`
- `src/funcs/*.ts`
- `src/models/*.ts`

When touching generated files is unavoidable, prefer updating the upstream spec or Speakeasy configuration in `.speakeasy/` so the change survives regeneration.

We look forward to hearing your feedback. Feel free to open a PR or issue with a proof of concept and we'll do our best to include it in a future release.

---

### MCP Server Created by [Speakeasy](https://www.speakeasy.com/?utm_source=video-mcp&utm_campaign=mcp-typescript)
