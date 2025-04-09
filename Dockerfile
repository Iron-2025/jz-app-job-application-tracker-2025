# Build stage
FROM node:20-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create symbolic links for compatibility
RUN mkdir -p /etc/nginx/html && \
    ln -sf /usr/share/nginx/html/assets /etc/nginx/html/assets && \
    ln -sf /usr/share/nginx/html/favicon.ico /etc/nginx/html/favicon.ico && \
    mkdir -p /etc/nginx/html/tools/job-application-tracker && \
    ln -sf /usr/share/nginx/html/assets /etc/nginx/html/tools/job-application-tracker/assets && \
    ln -sf /usr/share/nginx/html/favicon.ico /etc/nginx/html/tools/job-application-tracker/favicon.ico

# Expose port 80
EXPOSE 8900

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
