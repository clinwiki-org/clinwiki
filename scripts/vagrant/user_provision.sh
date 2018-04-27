# kick elasticsearch
sudo service elasticsearch restart

# install rvm
gpg --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 7D2BAF1CF37B13E2069D6956105BD0E739499BDB
\curl -sSL https://get.rvm.io | bash -s stable --ruby
source /home/vagrant/.rvm/scripts/rvm

export GEM_HOME=~/.gem
export GEM_PATH=~/.gem

echo "export GEM_HOME=~/.gem" >> ~/.bashrc
echo "export GEM_PATH=~/.gem" >> ~/.bashrc

# initialize the correct ruby and gemset
rvm use ruby-2.4.1@clinwiki --install --create
gem install bundler
cd /clinwiki
bundle install

# initialize rails app
bundle exec rake db:create
bundle exec rake db:migrate
bundle exec rake search:bootstrap_dev


# install nvm
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

nvm install stable
nvm use stable

cd /cw-app
yarn install
