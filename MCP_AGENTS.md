# Svelte MCP Server - Agent Guide

This project uses the Svelte MCP (Model Context Protocol) server to provide AI agents with comprehensive Svelte 5 and SvelteKit documentation.

## Configuration

The MCP server is configured in `.mcp.json` for local usage with Cursor IDE:

```json
{
  "mcpServers": {
    "svelte": {
      "type": "stdio",
      "command": "npx",
      "env": {},
      "args": ["-y", "@sveltejs/mcp"]
    }
  }
}
```

## Available MCP Tools

### 1. `list-sections`
Lists all available Svelte 5 and SvelteKit documentation sections with titles, use cases, and paths.

**When to use:** At the start of any Svelte-related task to discover relevant documentation.

**Example:**
```bash
npx -y @sveltejs/mcp list-sections
```

### 2. `get-documentation`
Retrieves full documentation content for specific sections (comma-separated).

**When to use:** After identifying relevant sections from `list-sections`, fetch the detailed documentation.

**Critical:** Always analyze the `use_cases` field from `list-sections` results, then fetch ALL relevant sections for the user's task.

**Example:**
```bash
npx -y @sveltejs/mcp get-documentation "runes,$state,$derived"
```

### 3. `svelte-autofixer`
Analyzes Svelte code and returns issues and suggestions.

**When to use:** MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling until no issues or suggestions are returned.

**Example:**
```bash
npx -y @sveltejs/mcp svelte-autofixer --code="<script>let count = \$state(0)</script>"
```

## Workflow for Agents

1. **Start with `list-sections`** - Discover available documentation
2. **Analyze use cases** - Review the `use_cases` field for each section
3. **Fetch relevant docs** - Use `get-documentation` to get ALL relevant sections
4. **Write code** - Implement the solution using Svelte 5 best practices
5. **Validate with `svelte-autofixer`** - Check for issues before submitting
6. **Iterate** - Keep running autofixer until clean

## Project Context

- **Svelte Version:** 5.49.1 (Svelte 5 with runes)
- **SvelteKit Version:** 2.50.1
- **GSAP Version:** 3.14.2 (latest Jan 2026)
- **Package Manager:** npm with `--legacy-peer-deps`
- **TypeScript:** Enabled with strict checking

## Key Svelte 5 Patterns Used

- `$state()` - Reactive state
- `$derived()` - Derived values
- `$effect()` - Side effects
- `$props()` - Component props
- `{#each}` with keyed blocks
- Event handlers with `onclick`, `onmount`, etc.

## Important Notes

- Always use Svelte 5 runes syntax (not Svelte 4 stores)
- GSAP animations should be cleaned up with `gsap.killTweensOf()` in cleanup functions
- Use `onMount` return function for cleanup
- Prefer reactive patterns over imperative DOM manipulation
- Add proper TypeScript types for all props and state

## Testing Commands

```bash
npm run check      # Type check
npm run build      # Production build
npm run dev        # Development server
npm run lint       # Linting
```

## Temporary URLs Note

This project uses temporary/dynamic URLs for development and testing. Always verify URL configurations in environment variables and avoid hardcoding URLs in the codebase.
