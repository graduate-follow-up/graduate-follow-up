FROM python:3.6-alpine3.7


# upgrade pip
RUN pip3 install --upgrade pip

# install packages
RUN pip3 install flask
RUN pip3 install sparqlwrapper
RUN pip3 install requests

# copy script
COPY info_entreprise.py info_entreprise.py

ENTRYPOINT ["python", "info_entreprise.py"]
