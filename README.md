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

## Environment Variables

We use a handful of environment variables to run the server.
You can expose these when running locally by creating a `.env`
file in the project root level directory. Here's an example:

```bash
# needed to connect to aact
AACT_DATABASE_URL=postgres://aact:aact@aact-db.ctti-clinicaltrials.org:5432/aact
REDIS_URL=redis://127.0.0.1:6379/0
DATABASE_URL=postgres://postgres@localhost:5432/clinwiki
```

**NOTE:** The use of the `DATABASE_URL` environment variable should prevent
the need for a `database.yml` file in when running the server in development
mode.

# Data Access

## Databases
The [AACT Clinical Trials Database](http://aact.ctti-clinicaltrials.org/])
provides data the data we use for clinical trials.

While the database is available online,
you are encouraged to download a copy of the database for ease of access.

We maintain a separate postgres database for data related to users.
Please refer to the Installation section for additional info.

If you don't have postgres installed locally, you can do so using
[homebrew](https://brew.sh/):

```bash
brew install postgres
```

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

A development environments can bootstrap a subset of search results as follows:
```bash
bundle exec rake search:bootstrap_dev
```

### Searching
Searching for studies is handled by Searchkick through
the Studies model. Results are directly brokered through
the Elasticsearch index, which brokers data from
the annotation database along with the AACT database.


### Running Imports

#### 1) Generate your CSV

CSVs expect a header with the following format:
`nct_id,Type,Value,Action`

We support `Tags` as a type, with `Add` or `Remove` as an action.
For crowd values, we only presently support native fields that are
crowd overwriteable. In this case, `Add` will add or overwrite a crowd
definition for that field, and `Remove` will remove the crowd definition.

#### 2) Commit your CSV to the appropriate subfolder
The CSV should be exported to the `imports/` within the root project folder.

You can commit the CSV with the following workflow, which assumes
you have set up heroku's command line tools, and that the `heroku`
remote points to the `clinwiki-prod` project:

```bash
git add imports
git commit -m 'Added import file'  # you can write any comment you'd like
git push origin master  # add to clinwiki-org/clinwiki
git push heroku master  # add to heroku -- this should kick off a deploy
```

#### 3) Run the CSV import Rake task

```bash
# if your file is in imports/foo.csv, $MY_FILE should be foo.csv
heroku run -a clinwiki-prod rake import:csv["$MY_FILE"]  
```

### Running Exports

```bash
heroku run -a clinwiki-prod rake export:front_matter_csv > my-front-matter.csv
```


## Working with Vagrant

Make sure you have a copy of `cw-app` located as a sibling of the root project
directory.

You can once you've installed [vagrant](https://www.vagrantup.com/),
you can install the vagrant VM by running `vagrant up` from the project
root directory.

You can access the vagrant instance via `vagrant ssh`.

The following scripts are available

| Script | Function |
| ------ | -------- |
| `./scripts/vagrant/server` | runs the server through vagrant, serving the API at port 3000 |
| `./scripts/vagrant/worker` | runs the worker within the vagrant server |
| `./scripts/vagrant/frontend` | runs a hot-reloading version of the frontend |

### Initializing Data

We have already enqueued several tasks for the worker to run while
provisioning Vagrant, but you will need to make sure to run the worker
for those jobs to be handled.


### Running the Server

In one vagrant SSH session, you will want to run the following:

```bash
cd /clinwki
./scripts/server
```

This will expose `localhost:3000` to API requests.

From another session, run the following:

```bash
cd /cw-app
yarn start
```

This will run a hot-reloading session of the cw-app frontend.

To make sure reindexing and the like are handled on save,
make sure to run `./scripts/worker` in a separate session as well.
