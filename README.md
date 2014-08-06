# Report Card

This project serves as a way to
aggregate information about how the
members of an organization
interact with the open source community.
It currently examines information
from Github, Open Source Report Card, Lanyrd, and Stack Overflow.
An example of what the project can offer
is at [http://groupon.github.io](groupon.github.io).


## Setup

This project is written in Javascript
and backed by NodeJS.

```
npm install
```

You may run into API limiting
if your organization is large.
If you do,
you can supply a Github access token
in the configuration.


## Configuration

Because the project pulls from
many data sources,
some configuration is required.
The configuration file, `config/default.json`,
demonstrates the complete
list of configuration options
that you can provide.

```javascript
{
  "organization": {
    "name": "YOUR ORG NAME"
  },
  "github_token": "GITHUB API TOKEN",
  "stack_overflow": {
    // configure your filters using the api site
    // and copy them here:
    // http://api.stackexchange.com/docs/answers-on-users
    "answers_filter": "!bJDus)chijNCh3",
    "badges_filter": "!Ln3laVm*nneRQDAXXp0nfS"
  }
}
```


## Tasks

#### User Mapping

In order to collect data about
the members of an organization,
the user mapping needs to be generated.
This can be done using the
following example:

```
$ node tasks/generate-user-mapping
```

#### Retrieve users from Github

You can pull the members of an organization
straight from Github to make user population
a little easier.

```
$ node tasks/github
```

#### Aggregating the data

You will need to aggregate all of the data available
so that the render task can complete properly.

```
$ node tasks/aggregate
```

#### Rendering the html

Finally, in order to render the html,
you can use the render task:

```
$ node tasks/render
```

## Testing

You can run the tests with:

```
npm test
```

## Contributing

Please read the
[Code of Conduct](CODE_OF_CONDUCT.md)
and
[Contributing Guide](CONTRIBUTING.md)
before contributing.

## License

[BSD-3-Clause](LICENSE)

