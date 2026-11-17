// Auto-generated at build time
export const toolNames: Array<{ name: string; description: string }>= [
  {
    "name": "list-canvas-applets",
    "description": "List applets\n\nReturns the account's saved Video Canvas applets as summaries, without their inputs, blocks, connections, or outputs."
  },
  {
    "name": "create-canvas-applet",
    "description": "Create an applet\n\nCreates an applet from its content (inputs, blocks, connections, and outputs). Cloudinary compiles the action blocks to validate them and returns the stored applet. For a derived applet, the compiled blocks are also saved as a named transformation."
  },
  {
    "name": "get-canvas-applet",
    "description": "Get an applet\n\nReturns a single applet with its full content, including its inputs, blocks, connections, and outputs."
  },
  {
    "name": "replace-canvas-applet",
    "description": "Replace an applet's content\n\nReplaces the full content of an existing applet and recompiles its action blocks to validate them. For a derived applet, its backing named transformation is also updated."
  },
  {
    "name": "delete-canvas-applet",
    "description": "Delete an applet\n\nDeletes an applet and its stored content. For a derived applet, the named transformation that backs it isn't deleted, so delivery URLs and SDK calls that reference it keep working. To stop delivering the transformation, delete the named transformation separately."
  },
  {
    "name": "list-live-streams",
    "description": "Get a list of live streams"
  },
  {
    "name": "create-live-stream",
    "description": "Create a new live stream"
  },
  {
    "name": "get-live-stream",
    "description": "Get a single live stream"
  },
  {
    "name": "update-live-stream",
    "description": "Update a live stream"
  },
  {
    "name": "delete-live-stream",
    "description": "Delete a live stream"
  },
  {
    "name": "activate-live-stream",
    "description": "Manually activate a live stream"
  },
  {
    "name": "idle-live-stream",
    "description": "Manually idle a live stream"
  },
  {
    "name": "list-live-stream-outputs",
    "description": "Get a list of live stream outputs"
  },
  {
    "name": "create-live-stream-output",
    "description": "Create a new live stream output"
  },
  {
    "name": "get-live-stream-output",
    "description": "Get a single live stream output"
  },
  {
    "name": "update-live-stream-output",
    "description": "Update a live stream output"
  },
  {
    "name": "delete-live-stream-output",
    "description": "Delete a live stream output"
  },
  {
    "name": "generate-video-from-image",
    "description": "Create a video generation job\n\nSubmits an image and prompt for video generation and returns a job you can poll for the result."
  },
  {
    "name": "get-video-generation-job",
    "description": "Poll a video generation job\n\nReturns the current status of a generation job. When the status is `completed`, the response includes the generated video's asset details and delivery URL."
  },
  {
    "name": "list-image-to-video-prompts",
    "description": "Get a list of image to video prompts\n\nReturns all saved image-to-video prompts for your product environment."
  },
  {
    "name": "create-image-to-video-prompt",
    "description": "Create an image to video prompt\n\nSaves a reusable prompt with a display name so you can apply it to future generations."
  },
  {
    "name": "get-image-to-video-prompt",
    "description": "Get an image to video prompt\n\nReturns a single saved prompt by its ID."
  },
  {
    "name": "update-image-to-video-prompt",
    "description": "Update an image to video prompt\n\nUpdates the display name and/or prompt text of a saved prompt."
  },
  {
    "name": "delete-image-to-video-prompt",
    "description": "Delete an image to video prompt\n\nPermanently deletes a saved prompt by its ID."
  },
  {
    "name": "analyze-video",
    "description": "Create an AI Video Analysis job\n\nSubmits a stored video asset for visual analysis and returns a job you can poll for the result."
  },
  {
    "name": "get-video-analysis-job",
    "description": "Poll an AI Video Analysis job\n\nReturns the current status of an analysis job. When the status is `completed`, the response includes the generated visual transcript file's asset details and delivery URL."
  }
];
