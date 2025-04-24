FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock* ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Build the application
RUN yarn build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set the correct permission for prerender cache
RUN mkdir -p .next
RUN chown nextjs:nodejs .next

# Copy necessary files from builder
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/next.config.js ./
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Copy .next folder - handle both standalone and non-standalone modes
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next

# Create a simple server.js file if standalone mode is not available
RUN if [ ! -d ".next/standalone" ]; then \
    echo "Standalone directory not found, using regular Next.js server" && \
    echo "const { createServer } = require('http');" > server.js && \
    echo "const { parse } = require('url');" >> server.js && \
    echo "const next = require('next');" >> server.js && \
    echo "const app = next({ dev: false });" >> server.js && \
    echo "const handle = app.getRequestHandler();" >> server.js && \
    echo "const port = process.env.PORT || 3001;" >> server.js && \
    echo "app.prepare().then(() => {" >> server.js && \
    echo "  createServer((req, res) => {" >> server.js && \
    echo "    const parsedUrl = parse(req.url, true);" >> server.js && \
    echo "    handle(req, res, parsedUrl);" >> server.js && \
    echo "  }).listen(port, '0.0.0.0', (err) => {" >> server.js && \
    echo "    if (err) throw err;" >> server.js && \
    echo "    console.log(\`> Ready on http://0.0.0.0:\${port}\`);" >> server.js && \
    echo "  });" >> server.js && \
    echo "});" >> server.js; \
else \
    echo "Using standalone mode" && \
    cp -r .next/standalone/* ./ && \
    cp -r .next/static ./.next/static; \
fi

# Switch to non-root user
USER nextjs

EXPOSE 3001

ENV PORT 3001
ENV HOSTNAME "0.0.0.0"

# Start the application
CMD ["node", "server.js"]
