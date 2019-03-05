# MobileHealthCare-Server
Chat example hosted on gcloud server
* socket io needs to be ^1.7.4
35.246.29.217:65080/
* use `sudo npm start`
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

# Installation issues
I was trying to install better-sqlite3 but kept getting errors about not finding VCBuild and MSBuild.

I initally tried npm install -g node-gyp by itself but then got different errors.

I then tried to use npm install -g windows-build-tools which installed Visual Studio 2017 and did NOT include the v140 toolset and was getting and error about this.

But Visual Studio 2015 does includes the v140 toolset...
You can force windows-build-tools to install VS2015 instead of VS2017 with this:
npm install --vs2015 -g windows-build-tools

better-sqlite3 installed fine after this.

https://github.com/nodejs/node-gyp/issues/1486