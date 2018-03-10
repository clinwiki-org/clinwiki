# cw-app

This is a React app built on top of
[React Boilerplate](https://github.com/react-boilerplate/react-boilerplate).

## Building
For convenience, we're presently building production JS
and committing it directly to the
[Clinwiki Rails project code](https://github.com/clinwiki-org/clinwiki).

```bash
./scripts/build
```

## Tests
```bash
yarn test
```

## Note on Dependencies

We've ported the [react-signup-login-component](https://www.npmjs.com/package/react-signup-login-component)
over to this codebase because of problems related to Babel transpilation
during testing. This lives in `app/components/ReactSignupLoginComponent`.
