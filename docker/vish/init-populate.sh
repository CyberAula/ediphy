#!/bin/bash

echo "ENTRYPOINT"
until nc -z -v -w30 db 5432 > /dev/null 2>&1
do
	echo "Waiting for db connection..."
	sleep 2
done
echo "SUCCESS CONNECTING TO DATABASE"
pwd
echo "EXECUTING exec rake db:schema:load"
bundle exec rake db:schema:load
bundle exec rake db:migrate

bundle exec rake ts:index
bundle exec rake ts:config
bundle exec rake db:install
echo "BBDD DONE"
