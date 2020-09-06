# ClinWiki

This application allows you to rate clinical trials.
You can retrieve trials to rank by searching for NCT ID or MeSH Term

## Setup

You can use one of the following options to start ClinWiki on your own system:

- [Docker Compose](#docker-compose) (easiest method)
- [Locally in development mode](#run-locally)
- [Locally in production mode](#run-locally-in-production-mode)

### Docker Compose

1. Clone the ClinWiki repository

1. Create a `.env` file in the project's root directory (use `.example.env` for inspiration)

1. Install Docker

    - Windows and Mac users install [Docker Desktop](https://www.docker.com/products/docker-desktop)

    - Linux users follow the [official install instructions for Docker for your distribution](https://docs.docker.com/install/#supported-platforms)

1. **Only for macOS:** Install and start `docker-sync`
    - Bring up a separate terminal
    - Install `docker-sync` via `gem install docker-sync`
    - Run `docker-sync start --config=docker-sync.yml`
  
    > This will fix file mounting issues in OS X and Docker that create significant performance problems using the default config. Additionally, you will want to run the `docker-compose` commands with additional arguments (included below for each step).

1. Build images

    `docker-compose build`

    > **macOS:** `docker-compose -f docker-compose.yml -f docker-compose-osx.yml build`

1. Run ClinWiki server on <http://localhost:3000>

    `docker-compose up` or `docker-compose up -d` to run as daemon in background

    > **macOS:** `docker-compose -f docker-compose.yml -f docker-compose-osx.yml up` or `docker-compose -f docker-compose.yml -f docker-compose-osx.yml up -d`

1. Bootstrap search

    `compose/bin/search_bootstrap`

1. Open a bash shell inside the `clinwiki` Docker container

    `docker-compose exec clinwiki bash`

1. Seed the database

    `rake db:seed`

1. Start Rails console (still inside Docker container)

    `rails c`

1. Create new user

    `User.create!(first_name: "CHANGEME", last_name: "CHANGEME", email: "CHANGEME", password: "CHANGEME", password_confirmation: "CHANGEME")`

1. To access the sub-site config and bulk update admin features, add admin role after creating a user

    `User.find_by(email: "CHANGEME").add_role(:admin)`

1. Exit Rails console

    `exit`

1. Exit Docker container

    `exit`

1. Build and serve frontend (on <http://localhost:3001>):

    - `cd /front`
    - `yarn install`
    - `yarn start`

    > **NOTE:** Changes to local .ts/.tsx files will be automatically applied to the running system

1. Go to <http://localhost:3001> and sign in using the user email and password created in the Rails console

1. Create the default site by clicking on `Sites` under the profile dropdown on the top right hand side. Then click create site, fill out the form and click save.

    > Sites can be accessed locally by navigating to a subdomain against your localhost. By default, `http://mysite.localhost:3001` and `http://test.localhost:3001` are white-listed for CORS requests. This means you can configure a site with the subdomain `mysite` and a site with the subdomain `test` without additional CORS configuration.

- Extras
  - Logs: `docker-compose logs -f clinwiki`
  - Console: `docker-compose exec clinwiki bundle exec rails c`
  - Run and build: `docker-compose up -d --build`
    The front end is not built yet so you will only see the rails start page but you can browse to <http://localhost:3000/graphiql> to send graphql queries.

#### CW_MODE

You can use the `CW_MODE` environment variable to configure how docker-compose starts ClinWiki.

- `CW_MODE=PROD` - the default, builds the front end and runs rails
- `CW_MODE=FAST` - runs rails *without* building the front end for a quicker startup
- `CW_MODE=DEV` - starts the 'clinwiki' container without running rails so you can start/restart it manually during development
- `CW_MODE=WORKER` - runs the sidekiq process instead of rails

To specify the variable changes the command line a little bit depending on if you're on Windows or Linux/Mac:

_Linux/Mac:_

```bash
CW_MODE=FAST docker-compose up -d
```

_Windows:_

```bash
set CW_MODE=FAST
docker-compose up -d
```

### Run Locally

You are encouraged to use [rvm](https://rvm.io/) for Ruby version
and gemset management. Once RVM is installed, switch to the correct
Ruby and gemset as follows:

```bash
rvm use ruby-2.5.3@clinwiki --install --create
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

#### **Environment Variables**

We use a handful of environment variables to run the server.
You can expose these when running locally by creating a `.env`
file in the project root level directory. Here's an example:

```bash
# Needed to connect to AACT
AACT_DATABASE_URL=postgres://aact:aact@aact-db.ctti-clinicaltrials.org:5432/aact
REDIS_URL=redis://127.0.0.1:6379/0
DATABASE_URL=postgres://postgres@localhost:5432/clinwiki

# Optional

JWT_EXPIRATION_TIME_SECS=86400 # JWT expiration time
```

**NOTE:** The use of the `DATABASE_URL` environment variable should prevent
the need for a `database.yml` file in when running the server in development
mode.

### Run Locally in Production Mode

1. Create a .env file in root with the following contents

    ```bash
    AACT_DATABASE_URL=postgres://$AACT_USER:$AACT_PASS@aact-db.ctti-clinicaltrials.org:5432/aact
    MAILGUN_API_KEY=""
    MAILGUN_DOMAIN="localhost:3000"
    CW_HOST="localhost:3000"
    CLINWIKI_DOMAIN="localhost:3000"
    SECRET_KEY_BASE="lkdfjgldgjkdflgjlkdfjgldfkjg"
    ```

1. Precompile assets

    ```bash
    export $(cat .env | xargs) && RAILS_ENV=production rake assets:precompile
    ```

1. Start server

    ```bash
    export $(cat .env | xargs) && RAILS_ENV=production rails s
    ```

## Data Access

### Databases

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

### Elasticsearch

We use [searchkick](https://github.com/ankane/searchkick) to enable search.

Follow the instructions in the searchkick docs for setting up Elasticsearch locally.

#### **Indexing**

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

To disable Auto indexing set env variables for sidekiq process:

```bash
AUTO_INDEX_LAST_DAYS=0
```

A full reindex can be performed by running:

```bash
bundle exec rake search:index
```

A development environments can bootstrap a subset of search results as follows:

```bash
bundle exec rake search:bootstrap_dev
```

#### **Searching**

Searching for studies is handled by Searchkick through
the Studies model. Results are directly brokered through
the Elasticsearch index, which brokers data from
the annotation database along with the AACT database.

#### **Running Imports**

1. Generate your CSV

    CSVs expect a header with the following format:

    `nct_id,Type,Value,Action`

    We support `Tag` as a type, with `Add` or `Remove` as an action.
    For crowd values, there are two types of crowd values and both can use the 'Add' and 'Remove' options.
    For native fields that are crowd overwriteable, `Add` will add or overwrite a crowd
    definition for that field, and `Remove` will remove the crowd definition.
    For crowd values that produce custom facets, the "Type" in the csv ("label" value in the UI) will be the name of the facet. The "Value" in the csv ("description" in the UI) is the value(s) in the facet. For multiple values of the crowd facet, enter as multiple lines or separated on a single line by '|' (example Type = "Karnofsky Score Allowed", Value = "100|90|80|70")

1. Commit your CSV to the appropriate subfolder

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

1. Run the CSV import Rake task

    ```bash
    # if your file is in imports/foo.csv, $MY_FILE should be foo.csv
    heroku run -a clinwiki-prod rake import:csv["$MY_FILE"]
    ```

#### **Running Exports**

```bash
heroku run -a clinwiki-prod rake export:front_matter_csv > my-front-matter.csv
```

#### **Additional Data Seeding**

When using the standard seeding of AACT data and clinwiki data, we are still working to establish a more complete development seeded database. Some functionality for workflows, crowd values and bulk update will not be available until at least a few studies have crowd keys and values.
To complete set-up, add at least the following keys and values spread across at least 5 studies. Having any values for crowd key/values seeds this funcitnoality in the application. Having any keys labeled "WF_" ensures workflows function. Having at least one study with WF_bulk key enables configuration of the bulk update functionality. [this fuctionality will be replaced with alternative seed files and functionality]

- tags
- - Organization 1
- - Organization 2
- - Organization 3
- WF_bulk
- - Needs Review
- WF_TestA
- - TestA Value 1
- - TestA Value 2
- WF_TestB
- - TestB Value 1
- - TestB Value 2
- - TestB Value 3
