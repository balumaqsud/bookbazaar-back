# Use Node.js 20.10.0 as base image
FROM node:20.10.0-alpine

# Set working directory
WORKDIR /usr/src/bookbazaar

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production

# Start the application
CMD ["npm", "run", "start:prod"]
