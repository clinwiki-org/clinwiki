#!/bin/bash

# This script is to create the db schema and
# seed it with data.
#
# NOTE:
# Run "docker-compose up" before running this script.
# The postgres instance in the container must be started first.
#
echo "Unzipping seed db"
gunzip seed-db.sql.zip
echo "Importing into docker db..."
Docker cp seed-db.sql clinwiki-db:/
docker exec -it clinwiki-db psql -U clinwiki clinwiki -f seed-db.sql
echo "Done."