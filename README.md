# MobileHealthCare-Server
Chat example hosted on gcloud server
* socket io needs to be ^1.7.4
35.246.29.217:65080/
# Pi interface

* Recieve from PI - [0,1,1,1,1,1,1] - 6 values in a list
e.g. 
slot_lid 000000
pill_presence 100000

* Send to PI - digit representing which box to open
e.g. 1 or 2 or 3
# Test object

* display csv command line 
````
column -s, -t < resources/questions.csv | less -#2 -N -S
```
```js
{
  type: "userDetails",
  data: {
    Username: "testUser",
    Password: "testPassword",
  }
}
```