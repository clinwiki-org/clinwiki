export DEBIAN_FRONTEND=noninteractive

apt-get update --fix-missing

# utf-8 everything
sudo locale-gen en_US.UTF-8

# install java8
sudo apt-get install -y default-jre


sudo cat - > /etc/default/locale <<EOF
LANG=en_US.UTF-8
LANGUAGE=
LC_CTYPE="en_US.UTF-8"
LC_NUMERIC="en_US.UTF-8"
LC_TIME="en_US.UTF-8"
LC_COLLATE="en_US.UTF-8"
LC_MONETARY="en_US.UTF-8"
LC_MESSAGES="en_US.UTF-8"
LC_PAPER="en_US.UTF-8"
LC_NAME="en_US.UTF-8"
LC_ADDRESS="en_US.UTF-8"
LC_TELEPHONE="en_US.UTF-8"
LC_MEASUREMENT="en_US.UTF-8"
LC_IDENTIFICATION="en_US.UTF-8"
LC_ALL=en_US.UTF-8
EOF

apt-get install -y redis-server postgresql postgresql gnupg2 curl libpq-dev

# postgres passwordless
cp /clinwiki/vagrant_conf/pg_hba.conf /etc/postgresql/9.6/main/pg_hba.conf && sudo service postgresql restart

psql -Upostgres -c "update pg_database set datistemplate=false where datname='template1';"
psql -Upostgres -c "drop database Template1;"
psql -Upostgres -c "create database template1 with owner=postgres encoding='UTF-8' lc_collate='en_US.utf8' lc_ctype='en_US.utf8' template template0;"
psql -Upostgres -c "update pg_database set datistemplate=true where datname='template1';"

# install elasticsearch https://www.elastic.co/guide/en/elasticsearch/reference/current/deb.html
wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
sudo apt-get install -y apt-transport-https
echo "deb https://artifacts.elastic.co/packages/5.x/apt stable main" | sudo tee -a /etc/apt/sources.list.d/elastic-5.x.list
sudo apt-get update && sudo apt-get install -y elasticsearch

# install yarn
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update && sudo apt-get install -y --force-yes yarn
