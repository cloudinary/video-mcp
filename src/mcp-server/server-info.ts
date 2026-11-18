/*
 * Server metadata and instructions returned in the MCP initialize response.
 */

import type { Implementation } from "@modelcontextprotocol/sdk/types.js";

const ICON_BASE =
  "https://cloudinary-res.cloudinary.com/image/upload/docsite/brand-assets";

export const serverInfo: Omit<Implementation, "name" | "version"> = {
  title: "Cloudinary Video",
  description:
    "Stream live video, generate video from images, get visual transcripts, and build video pipelines.",
  websiteUrl: "https://cloudinary.com/documentation/cloudinary_llm_mcp",
  icons: [32, 96, 192].map((size) => ({
    src: `${ICON_BASE}/cloudinary_favicon_${size}x${size}.png`,
    mimeType: "image/png",
    sizes: [`${size}x${size}`],
  })),
};

export const instructions =
  `Cloudinary Video: stream, generate, analyze and transform video in the user's Cloudinary account.

- Live streams: create-live-stream creates an RTMP live stream; activate-live-stream and idle-live-stream switch it manually. Each stream's outputs are managed with the *-live-stream-output tools. Guide: https://cloudinary.com/documentation/video_live_streaming.md
- Image to video (Beta, add-on): generate-video-from-image starts an asynchronous job; poll get-video-generation-job until it finishes. Reusable prompts are managed with the *-image-to-video-prompt tools. Guide: https://cloudinary.com/documentation/image_to_video_addon.md
- Video analysis (Beta): analyze-video starts an asynchronous job that produces a timestamped visual transcript; poll get-video-analysis-job for the result. Guide: https://cloudinary.com/documentation/ai_video_analysis.md
- Video Canvas: applets are node-based transformation pipelines saved as named transformations. replace-canvas-applet overwrites the whole applet, so read it with get-canvas-applet first. Guide: https://cloudinary.com/documentation/video_canvas.md
- Deletes: delete-live-stream, delete-live-stream-output, delete-canvas-applet and delete-image-to-video-prompt are permanent. Confirm with the user first.
- Docs: https://cloudinary.com/documentation/llms.txt indexes all Cloudinary docs; append .md to a documentation URL for Markdown.`;
