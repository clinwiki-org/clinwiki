# Application:  clinwiki

This application allows you to rate clinical trials.
You can retrieve trials to rank by searching for NCT ID or MeSH Term

# Installation / Running
You are encouraged to use [rvm](https://rvm.io/) for Ruby version
and gemset management. Once RVM is installed, switch to the correct
Ruby and gemset as follows:

```bash
rvm use ruby-2.2.3@clinwiki --install --create
```

Then, from the project root directory:

```bash
bundle install
bundle exec rake db:create
bundle exec rake db:migrate
```

Once the dependencies are installed and the database is initialized,
you can run the server with:

```bash
bundle exec rails s
```

Note that we are using [dotenv](https://github.com/bkeepers/dotenv)
to make the handling of database variables easier.

# Data Access

## Databases
The [AACT Clinical Trials Database](http://aact.ctti-clinicaltrials.org/)
provides data the data we use for clinical trials.

While the database is available online,
you are encouraged to download a copy of the database for ease of access.

We maintain a separate postgres database for data related to users.
Please refer to the Installation section for additional info.

## Elasticsearch
We use [searchkick](https://github.com/ankane/searchkick) to enable search.

Follow the instructions in the searchkick docs for setting up Elasticsearch locally.

### Indexing
Indexing is performed in the background by Sidekiq. You can run Sidekiq as follows:

```bash
bundle exec sidekiq -C config/sidekiq.yml
```

Note that with about 32 concurrent workers, it should take roughly 8 hours to
fully reindex.

It's also worth noting that we run a background job every ten seconds to
handle batch reindexing. This is important because it optimizes queries using
ActiveRecord's `includes` functionality. Refer to the Study model's
`search_import` scope for more details.

Scheduled jobs can be configured in `./config/schedule.yml`.

A full reindex can be performed by running:

```bash
bundle exec rake search:index
```

### Searching
Searching for studies is handled by Searchkick through
the Studies model. Results are directly brokered through
the Elasticsearch index, which brokers data from
the annotation database along with the AACT database.
