# osrc-for-orgs

## resources

- [Planning Document](https://docs.google.com/a/groupon.com/document/d/1B5kyv6f597gW-NvOLWdxha24z8CuA7YTTqYRUSFROm8/edit?usp=sharing)
- [Github API](https://developer.github.com/v3)


## tasks

### generate user mapping

To update the user mapping,
first update the raw information
from the
[google doc](https://docs.google.com/a/groupon.com/spreadsheets/d/1eo82T6zl2ObtouyhG6cdBaDcw3bGhHT77x9cUW6HFSY/edit?usp=sharing)
by pasting it over "/data/stub/user-map-raw.csv".

Then run: `node tasks/generate-user-mapping.js`

Now "/data/user-map.json"
shouldhave the full mapping.

### generating data

1. Make sure you have the user mapping generated from above.
2. Make sure you have grouponthecat github user's token set as `GROUPONTHECAT_TOKEN` environment variable.
3. Run `node tasks/aggregate`
