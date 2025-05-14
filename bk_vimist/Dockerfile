# use a lightweight python image
FROM python:3.13-slim

# Environment variables to reduce noise and improve performance
# avoids writing .pyc files(compiled python files)
ENV PYTHONDONTWRITEBYTECODE=1
# logs appear instantly in the terminal(good for debugging)
ENV PYTHONUNBUFFERED=1

# Set the working directory in the container, all commands will be run from here
# this is where the application code will be copied
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    python3-dev \
    default-libmysqlclient-dev \
    pkg-config \
    build-essential \
    && apt-get clean

# copy only the requirements file first for layer caching(fast building)
COPY requirements.txt .

# install dependencies
RUN pip install --upgrade pip && pip install -r requirements.txt

# copy the rest of the application code into /app
COPY . .

# Default command to run the server
# using gunicorn as the WSGI server: production ready
CMD ["gunicorn", "bk_vimist.wsgi:application", "--bind", "0.0.0.0:8000"]