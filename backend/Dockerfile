# Use a lightweight Python base image
FROM python:3.11-slim

# Set working directory for the application
WORKDIR /app

# Install system dependencies if needed (e.g., for scikit-learn/pandas)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file first to optimize Docker layer caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire backend source code into the container
COPY . .

# Expose the default Hugging Face Space port
EXPOSE 7860

# Set environment variables (can be overridden at runtime)
ENV PORT=7860
ENV FRONTEND_URL=http://localhost:3000

# Start the application using uvicorn
# Note: Host must be 0.0.0.0 for it to be accessible inside the container
CMD ["python", "main.py"]
