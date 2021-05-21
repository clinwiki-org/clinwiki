#!/bin/bash

# This script is to create and user.
#
# NOTE:
# Run "docker-compose up" before running this script.
# The postgres instance in the container must be started first.
#

echo "Creating db..."
Docker cp create-db.sql clinwiki-db:/
docker exec -it clinwiki-db psql -U clinwiki -f create-db.sql
echo "Done."