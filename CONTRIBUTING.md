# Contributing to ClinWiki

## Reporting Bugs

Bug reports are welcome. Please try to be as specific as possible so we can reproduce the problem.

- Search the existing issues to make sure your bug has not already been reported. If it has consider adding more information in a comment instead of opening a new bug.

- If you are unable to find an existing issue create a new one. Be sure to include a **title and clear description** and as much relevant information as possible. When possible include a link to the specific page that shows the issue.

- Do not open a bug if study data is wrong. Instead consider _using_ the wiki features to correct or annotate the study.

Ready to fix a bug or add a feature? [This](README.md#setup) section will get a development copy of ClinWiki running on your local Windows/Mac/Linux system in a snap.

## Branch Strategy

```bash
master ◀ staging ◀ feature 1
                 ◀ feature 2
                 ◀ feature 3
```

The master branch is always in a ready to deploy state and matches what is running on <https://www.clinwiki.org>.

Weekly completed feature branches are merged to the staging branch and then staging is deployed to <https://staging.clinwiki.org> and manual tests are run to ensure no regressions from the previous version. The only time it makes sense to commit directly to the staging branch is to fix small bugs found during this testing phase. Once testing is complete staging gets pulled to master and deployed.

To contribute a new feature or bug fix create a new branch off of the current staging (or master) and implement the feature. Then open a pull request to the staging branch.

- If the pull request is only for review but not quite ready yet prepend "WIP" or "work in progress" to the front of the title so it doesn't get accidently merged on merge day.
- Add a new entry to ReleaseNotes/index.tsx describing your change or bugfix. Don't worry too much about having the "right" version as we will fix it up when it merges to staging.

## Admin

To access the sub-site config and bulk update admin features, add admin role after creating a user
In rails console, User.find_by(email: "[email of the user]").add_role(:admin)

## Working with Sites

Sites can be accessed locally by navigating to a subdomain against your localhost.
By default, `http://mysite.localhost:3001` and `http://test.localhost:3001` are
white-listed for CORS requests. This means you can configure a site with the subdomain
`mysite` and a site with the subdomain `test` without additional CORS configuration.

## Testing

ClinWiki is working on increasing unit test coverage.

We have a manual checklist maintained in the Wiki that
we will run though after features are merged to staging.
[See it here](https://github.com/clinwiki-org/clinwiki/wiki/Testing-Guide)

## Running Ruby Tests

```bash
# ensure your test database exists.
# you should only need to run this once.
# you'll want to re-migrate the test database
# when new migrations appear
RAILS_ENV=test bundle exec rake db:create db:migrate

bundle exec rspec spec
```

The test database is automatically configured
in `config/environments/test.rb'

## AWS

We use AWS for storing CSV exports in S3.
You will need the following in your .env to develop against this locally:

```bash
AWS_ACCESS_KEY_ID=(ask for this)
AWS_SECRET_ACCESS_KEY_ID=(ask for this)
```
