FROM python:3.10

WORKDIR /app

RUN apt-get update && apt-get install -y build-essential python3-dev python3-pip libffi-dev libssl-dev libblas-dev liblapack-dev libatlas-base-dev gfortran
RUN pip install --upgrade pip
RUN pip install tensorflow==2.18.0 flask pillow numpy
# Copy toàn bộ source code
COPY . .
EXPOSE 5000

CMD ["python", "main.py"]