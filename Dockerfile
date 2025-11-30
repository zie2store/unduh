# Base: Debian with Python + Node
FROM node:18-bullseye

# Install Python + pip
RUN apt-get update && apt-get install -y python3 python3-pip

# Install yt-dlp (Python version = most reliable)
RUN pip3 install --upgrade yt-dlp

# Create app directory
WORKDIR /app

# Copy only package.json first (better caching)
COPY package.json package-lock.json* ./

# Install Node dependencies
RUN npm install

# Copy source files
COPY . .

EXPOSE 8080

CMD ["npm", "start"]
