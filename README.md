# Report Card

This project serves as a way to aggregate information about how the
members of an organization interact with the open source community. It
currently examines information from Github, Open Source Report Card,
Lanyrd, and Stack Overflow. An example of what the project can offer
is at http://groupon.github.io.

## Setup

This project is written in Javascript and backed by nodejs. To get it
runnning you need to have node and npm installed. Once you do you can
fetch the dependencies using npm.

You may run into API limiting if your organization is large. If you do
you can supply a Github access token via the `GITHUB_TOKEN`
environment variable.

```
npm install
```

## Tasks

#### User Mapping

In order to collect data about the members of an organization, the
user mapping needs to be generated. This can be done using the
following example:

```
$ node tasks/generate-user-mapping
```

#### Retrieve users from Github

You can pull the members of an organization straight from Github to make user population a little easier.

```
$ node tasks/github
```

#### Aggregating the data

You will need to aggregate all of the data available so that the render task can complete properly.

```
$ node tasks/aggregate
```

#### Rendering the html

Finally, in order to render the html you can use the render task:

```
$ node tasks/render
```
