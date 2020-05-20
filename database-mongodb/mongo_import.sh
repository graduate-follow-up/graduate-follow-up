#!/bin/sh
mongoimport --db "$IMPORT_DB" --collection "$IMPORT_COLLECTION" --jsonArray --file=/tmp/data.json
