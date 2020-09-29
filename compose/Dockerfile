FROM ruby:2.6.6

RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get update -qq && \
   DEBIAN_FRONTEND=noninteractive apt-get install -y nodejs postgresql-client htop curl make sudo screen vim && \
   apt-get clean
RUN npm install -g yarn

RUN mkdir /clinwiki
WORKDIR /clinwiki
COPY Gemfile /clinwiki/
COPY Gemfile.lock /clinwiki/
RUN bundle install

# Add a script to be executed with the container starts
COPY compose/entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["/usr/bin/entrypoint.sh"]

EXPOSE 3000

CMD ["bundle","exec","rails","server","-b", "0.0.0.0"]
