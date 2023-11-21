


### SETUP

To run the database locally:
```
docker run --name book-db -p 5455:5432 -e POSTGRES_PASSWORD=book -e POSTGRES_USER=book -e POSTGRES_DB=book  -d postgres
```

To Migrate that DB to the latest version:
```
npm run migrate-to-latest
```

To run the webserver:
```
npm start
```
By default, it will start on port 9001


To connect to the locally running DB:
```
psql -h localhost -p 5455 -U book -d book
```