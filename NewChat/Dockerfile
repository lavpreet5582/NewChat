# Use an official Python runtime as a parent image
FROM python:3.12-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements.txt to the container
COPY requirements.txt /app/requirements.txt

# Install any dependencies
RUN pip install --upgrade pip && pip install -r /app/requirements.txt

COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh


# Copy the current directory contents into the container at /app
COPY . /app/

# Expose port 8000 for the web service
EXPOSE 8000

# Run Daphne to serve the app
CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "config.asgi:application"]
