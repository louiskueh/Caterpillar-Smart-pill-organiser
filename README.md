
# About
* Utilises Socket IO with websockets (NodeJS + Javascript)
* Can be hosted locally or on the cloud
* Uses SQLITE3 to store data 
* npm for dependencies 
# To Start
* Run `npm install in the root folder`
* If any errors (usually on Windows) run `npm install --vs2015 -g windows-build-tools`
* Run `npm start` to start the server 
* The server should be started at `localhost:65080`
* local host is your current ip address
* be sure to use HTTP instead of HTTPS

Our cloud server implementation is identicial, except that it is running on a Google Cloud VM instance
* 35.246.29.217:65080/ (most likely not running now)

# Pill
* get times for next pill 
* when time reaches, emit indicator to pillbox as to which box to open next
* once pill is taken record time taken

# Responsibilities of the server 
* save relevant data to SQL database (resources/storage.db)
* repond to query from app/raspberry PI to database (e.g. medication details)
* Process the pillbox state machine to determine which pill to open next



# Example object

* Saving user details to the SQL database
* Send this JSOn object over SocketIO to the server

```js
{
  type: "userDetails",
  data: {
    Username: "testUser",
    Password: "testPassword",
  }
}
```

