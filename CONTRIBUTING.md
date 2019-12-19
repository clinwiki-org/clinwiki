# Contributing to ClinWiki

## Found a bug?

Bug reports are welcome. Please try to be as specific as possible so we can reproduce the problem. 

- Search the existing issues to make sure your bug has not already been reported. If it has consider adding more information in a comment instead of opening a new bug.

- If you are unable to find an existing issue create a new one.  Be sure to include a **title and clear description** and as much relevant information as possible. When possible include a link to the specific page that shows the issue.

- Do not open a bug if study data is wrong. Instead consider _using_ the wiki features to correct or annotate the study.


## Local Development

Ready to fix a bug or add a feature? This section will get a development copy of ClinWiki running on your local Windows/Mac/Linux system in a snap.

The easiest way to start ClinWiki on your own system is to use [docker-compose](https://docs.docker.com/compose/). 

- Clone the clinwiki repository
- Install Docker
    - Windows and Mac users install [Docker Desktop](https://www.docker.com/products/docker-desktop)
    - Linux users follow the [official install instructions for Docker for your distribution](https://docs.docker.com/install/#supported-platforms)
- `docker-compose build`
- `docker-compose up` or `docker-compose up -d` to run as daemon in background
- `compose/bin/search_bootstrap`
- Now you should have the ClinWiki server running on http://localhost:3000
- Extras
    - Logs: `docker-compose logs -f clinwiki`
    - Console: `docker-compose exec clinwiki bundle exec rails c`
    - Run and build: `docker-compose up -d --build`
  The front end is not built yet so you will only    see the rails start page but you can browse to http://localhost:3000/graphiql to send graphql queries.
- cd /front
    - yarn install
    - yarn start
    - This will build the ClinWiki front end and serve it on http://localhost:3001
    - Changes to local .ts/.tsx files will be automatically applied to the running system


## Branch Strategy

```
master ◀ staging ◀ feature 1
                 ◀ feature 2
                 ◀ feature 3 
```

The master branch is always in a ready to deploy state and matches what is running on https://www.clinwiki.org.  

Weekly completed feature branches are merged to the staging branch and then staging is deployed to https://staging.clinwiki.org and manual tests are run to ensure no regressions from the previous version.  The only time it makes sense to commit directly to the staging branch is to fix small bugs found during this testing phase.  Once testing is complete staging gets pulled to master and deployed.

To contribute a new feature or bug fix create a new branch off of the current staging (or master) and implement the feature.  Then open a pull request to the staging branch.  

- If the pull request is only for review but not quite ready yet prepend "WIP" or "work in progress" to the front of the title so it doesn't get accidently merged on merge day.
- Add a new entry to ReleaseNotes/index.tsx describing your change or bugfix.  Don't worry too much about having the "right" version as we will fix it up when it merges to staging.


# Testing

ClinWiki doesn't currently have any automated tests (feel free to contribute some).  Instead we have a manual checklist maintained in the Wiki that we will run though after features are merged to staging.  [See it here](https://github.com/clinwiki-org/clinwiki/wiki/Testing-Guide)


