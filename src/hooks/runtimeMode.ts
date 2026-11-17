/**
 * Runtime mode detection shared across hooks.
 */

/**
 * Whether this process is serving as a remote/hosted MCP server rather than a
 * local (stdio) one.
 */
export function isRemoteMCP(): boolean {
    const process = (globalThis as any)?.process;
    return process?.env?.["OAUTH_WRAPPER_ORIGIN"] !== undefined;
}
