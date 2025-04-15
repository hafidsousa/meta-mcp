# Meta MCP Developer Guide

This document contains instructions for developers who want to work with the Meta MCP library locally, contribute to the project, or understand its internal structure.

## Project Structure

```
meta-mcp/
├── src/                 # Core library code
│   ├── client.ts        # FacebookMarketingClient implementation
│   ├── config.ts        # Default configurations
│   ├── errors.ts        # Error handling
│   ├── handlers.ts      # MCP request handlers
│   ├── index.ts         # Library exports
│   ├── server.ts        # MCP server implementation
│   ├── tools.ts         # Tool definitions
│   ├── types.ts         # Type definitions
│   ├── operations/      # API operations organized by entity
│   ├── scripts/         # CLI scripts and utilities
│   │   ├── create-adset.ts          # Create ad set script
│   │   ├── create-campaign.ts       # Create campaign script
│   │   ├── generate-docs.ts         # Documentation generator
│   │   ├── generate-token-url.ts    # Token URL generator
│   │   ├── list-accounts.ts         # List accounts script
│   │   └── list-campaigns.ts        # List campaigns script
│   ├── types/           # Additional type definitions
│   └── utils/           # Utility functions
│       └── docgen.ts    # Documentation generation utility
├── docs/                # Generated documentation
│   ├── ad.md            # Ad documentation
│   ├── ad-account.md    # Ad account documentation
│   ├── ad-campaign.md   # Campaign documentation
│   ├── ad-set.md        # Ad set documentation
│   └── tools.json       # Generated tool definitions
├── .env.example         # Environment variable template
├── package.json         # Package configuration
├── README.md            # Main README for MCP clients
└── DEVELOPER.md         # This file
```

## Local Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/hafidsousa/meta-mcp.git
   cd meta-mcp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your Facebook API credentials.

4. Build the project:
   ```bash
   npm run build
   ```

5. Run tests:
   ```bash
   npm test
   ```

## Using the Development Tools

### List Facebook Ad Accounts

```bash
npm run list-accounts
```

### List Facebook Campaigns

```bash
npm run list-campaigns
```

### Generate a Facebook API Token URL

```bash
npm run generate-token-url
```

### Create a Complete Ad Campaign

We've included an example script for creating a complete ad campaign:

```bash
npx ts-node src/create-campaign.ts
```

This will create:
1. A campaign with conversion objective
2. An ad set with targeting and budget
3. An ad with creative content

All items are created in PAUSED state for safety.

## Testing Locally Before Publishing

Before publishing your changes to npm, it's good practice to test the package locally:

1. Build the package:
   ```bash
   npm run build
   ```

2. Pack the package into a tarball:
   ```bash
   npm pack
   ```
   This creates a file like `meta-mcp-1.1.0.tgz` in your current directory.

3. Install the package globally from the local tarball:
   ```bash
   npm install -g ./meta-mcp-1.1.0.tgz
   ```

4. Test the CLI command:
   ```bash
   meta-mcp
   ```

5. Or test with npx:
   ```bash
   npx ./meta-mcp-1.1.0.tgz
   ```

This local testing process helps identify issues with the package binaries, executables, and overall structure before publishing to npm.

## Library Architecture

### Core Components

1. **FacebookMarketingClient**: The main client class that handles all API interactions. It provides methods for creating and managing campaigns, ad sets, and ads.

2. **Types**: All type definitions for the client, configurations, and responses are defined in `src/types.ts`.

3. **Error Handling**: Custom error handling is implemented in `src/errors.ts`.

4. **Config**: Default configurations for campaigns, ad sets, and ads are defined in `src/config.ts`.

### Implementation Details

The implementation uses the Facebook Graph API directly without relying on the Facebook SDK. This makes the package lighter and easier to maintain. Key features include:

- **Error Handling**: All API requests include proper error handling with detailed error messages.
- **Type Safety**: TypeScript is used throughout the codebase for type safety.
- **Configuration Merging**: The library intelligently merges default configurations with user-provided ones.
- **Validation**: Input validation is performed to ensure that required fields are provided before making API requests.

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request

### Development Guidelines

- Follow the existing code style
- Add appropriate comments and documentation
- Write tests for new features
- Update type definitions as needed
- Keep the library light and focused

## Building and Publishing

### Building the Package

To build the package:

```bash
npm run build
```

The compiled output will be in the `dist/` directory.

### Publishing to npm

When you're ready to publish:

1. Update the version in package.json:
   ```bash
   npm version patch  # Increases patch version (1.0.0 -> 1.0.1)
   # or
   npm version minor  # Increases minor version (1.0.0 -> 1.1.0)
   # or
   npm version major  # Increases major version (1.0.0 -> 2.0.0)
   ```

2. Publish to npm:
   ```bash
   npm publish
   ```

This will run the `prepublishOnly` script to build the package and then publish it to the npm registry.

## License

MIT License - See LICENSE file for details.

## Documentation Generation

The project includes a documentation generation system that creates standardized tool definitions from TypeScript types. This helps keep documentation in sync with the actual code.

### Generate Tool Documentation

To generate documentation:

```bash
# Output to console
npm run generate-docs

# Output to docs/tools.json file
npm run generate-docs -- --file
```

### How Docgen Works

The documentation generator (`src/utils/docgen.ts`) performs the following functions:

1. Reads TypeScript types and interfaces from the codebase
2. Generates standardized tool definitions with proper schemas
3. Creates documentation in JSON format that can be used by MCP clients

The `generateToolFromType` function creates tool definitions from TypeScript types, ensuring that parameters, types, and descriptions are accurate.

### Updating Documentation

When making changes to the API:

1. Update the relevant TypeScript types in `src/types/`
2. Run the documentation generator to update `docs/tools.json`
3. If necessary, update the Markdown files in the `docs/` directory

### Best Practices

- Always keep documentation in sync with code changes
- When adding new parameters or tools, include detailed descriptions
- Use JSDoc comments in your code to improve the generated documentation
- Run the documentation generator before committing changes 