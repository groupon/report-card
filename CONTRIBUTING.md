# Contribution Guide

Groupon welcomes new contributors!

Please reference this guide
to determine the best way to contribute.

## Code of Conduct

All contributors are expected to follow
this project's [Code of Conduct](CODE_OF_CONDUCT.md).

## Reporting a Bug

Before reporting a bug,
make sure you are using
the latest version of this project.

All reports should provide a minimal test case.
This can be a gist,
inline in the description,
or in the form of a pull request
that includes a failing test.

If you are contributing a bug fix,
make sure it has a passing test
in your pull request.

### Code

Please adhere to the project's code style.
Several of these can be handled for you
if you use [editorconfig](http://editorconfig.org).

* Names of identifiers should always be descriptive and concise.

* Indent with exactly two spaces.

* Long lines should be broken up by
  (1) using line breaks and continuations,
  (2) extracting variables, or
  (3) extracting functions.

* Lines should have no trailing whitespace.

* Lines should end with unix-style (LF) line endings.

* When documenting APIs and/or source code,
  don't make assumptions or
  make implications about
  race, gender, religion, political orientation
  or anything else that isn't relevant to the project.

### Rebase

Use `git rebase` (not `git merge`)
to update your local workspace
with the latest changes.

```
git fetch upstream
git rebase upstream/master
```

