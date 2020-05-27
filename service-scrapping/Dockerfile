FROM python:3.6-alpine3.7

# update apk repo
RUN echo "http://dl-4.alpinelinux.org/alpine/v3.7/main" >> /etc/apk/repositories && \
    echo "http://dl-4.alpinelinux.org/alpine/v3.7/community" >> /etc/apk/repositories

# install chromedriver
RUN apk update
RUN apk add chromium chromium-chromedriver
RUN apk add libexif udev


# upgrade pip
RUN pip install --upgrade pip

# install selenium and parsel
RUN pip install selenium
RUN pip install flask

# copy scrapping script
COPY scrapping_script.py /

ENTRYPOINT ["python", "scrapping_script.py"]
