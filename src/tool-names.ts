// Auto-generated at build time
export const toolNames: Array<{ name: string; description: string }>= [
  {
    "name": "video-canvas-list-video-canvas-applets",
    "description": "List applets\n\nReturns the account's saved Video Canvas applets as summaries, without their inputs, blocks, connections, or outputs."
  },
  {
    "name": "video-canvas-create-video-canvas-applet",
    "description": "Create an applet\n\nCreates an applet from its content (inputs, blocks, connections, and outputs). Cloudinary compiles the action blocks into a named transformation and returns the stored applet."
  },
  {
    "name": "video-canvas-get-video-canvas-applet",
    "description": "Get an applet\n\nReturns a single applet with its full content, including its inputs, blocks, connections, and outputs."
  },
  {
    "name": "video-canvas-update-video-canvas-applet",
    "description": "Replace an applet's content\n\nReplaces the full content of an existing applet and recompiles its backing named transformation."
  },
  {
    "name": "video-canvas-delete-video-canvas-applet",
    "description": "Delete an applet\n\nDeletes an applet and its stored content. The named transformation that backs the applet isn't deleted, so delivery URLs and SDK calls that reference it keep working. To stop delivering the transformation, delete the named transformation separately."
  },
  {
    "name": "live-stream-get-live-streams",
    "description": "Get a list of live streams"
  },
  {
    "name": "live-stream-create-live-stream",
    "description": "Create a new live stream"
  },
  {
    "name": "live-stream-get-live-stream",
    "description": "Get a single live stream"
  },
  {
    "name": "live-stream-update-live-stream",
    "description": "Update a live stream"
  },
  {
    "name": "live-stream-delete-live-stream",
    "description": "Delete a live stream"
  },
  {
    "name": "live-stream-activate-live-stream",
    "description": "Manually activate a live stream"
  },
  {
    "name": "live-stream-idle-live-stream",
    "description": "Manually idle a live stream"
  },
  {
    "name": "live-stream-get-live-stream-outputs",
    "description": "Get a list of live stream outputs"
  },
  {
    "name": "live-stream-create-live-stream-output",
    "description": "Create a new live stream output"
  },
  {
    "name": "live-stream-get-live-stream-output",
    "description": "Get a single live stream output"
  },
  {
    "name": "live-stream-update-live-stream-output",
    "description": "Update a live stream output"
  },
  {
    "name": "live-stream-delete-live-stream-output",
    "description": "Delete a live stream output"
  },
  {
    "name": "video-generate-create-video-generate-job",
    "description": "Create a video generation job\n\nSubmits an image and prompt for video generation and returns a job you can poll for the result."
  },
  {
    "name": "video-generate-get-video-generate-job-status",
    "description": "Poll a video generation job\n\nReturns the current status of a generation job. When the status is `completed`, the response includes the generated video's asset details and delivery URL."
  },
  {
    "name": "image-to-video-prompts-get-image-to-video-prompts",
    "description": "Get a list of image to video prompts\n\nReturns all saved image-to-video prompts for your product environment."
  },
  {
    "name": "image-to-video-prompts-create-image-to-video-prompt",
    "description": "Create an image to video prompt\n\nSaves a reusable prompt with a display name so you can apply it to future generations."
  },
  {
    "name": "image-to-video-prompts-get-image-to-video-prompt",
    "description": "Get an image to video prompt\n\nReturns a single saved prompt by its ID."
  },
  {
    "name": "image-to-video-prompts-update-image-to-video-prompt",
    "description": "Update an image to video prompt\n\nUpdates the display name and/or prompt text of a saved prompt."
  },
  {
    "name": "image-to-video-prompts-delete-image-to-video-prompt",
    "description": "Delete an image to video prompt\n\nPermanently deletes a saved prompt by its ID."
  },
  {
    "name": "AI-video-analysis-create-AI-video-analysis-job",
    "description": "Create an AI Video Analysis job\n\nSubmits a stored video asset for visual analysis and returns a job you can poll for the result."
  },
  {
    "name": "AI-video-analysis-get-AI-video-analysis-job-status",
    "description": "Poll an AI Video Analysis job\n\nReturns the current status of an analysis job. When the status is `completed`, the response includes the generated visual transcript file's asset details and delivery URL."
  }
];
