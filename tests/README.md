# How to run the test

You'll need the application started with the proxy before doing any tests.
```sh
# Install the dependencies
npm install

# Launch the test
npm start
```

## Note
If you run this from inside a Docker container, you might need to reach your host computer's *localhost*.
```sh
docker run --network="host" <image>
```