
// describe("Player", function() {
//   sqlManager = require ('../../src/sqlManager')
//   sqlManager = new sqlManager("questions", "test")
//   var tables = ['addMedication','userDetails','timeTaken','questions','watchInfo' ]
//   for (var i = 0 ; i < tables.length; i ++) {
//       sqlManager.createTable(tables[i])
//   }
//   sqlManager.db.close();
  // beforeEach(function() {
  //   player = new Player();
  //   song = new Song();
  // });

  // it("Setup questions database", function() {
  //   sqlManager = new sqlManager("questions","test")
  //   sqlManager.createTable()
  //   player.play(song);

  //   sqlManager.db.serialize(function() {
  //     sqlManager.db.each("SELECT name FROM questions WHERE type='table' AND name='questions';", function(err, row) {
  //         console.log(row.id + ": " + row.info);
  //     });
  //   });
     
  //   sqlManager.db.close();
  //   //demonstrates use of custom matcher
  //   // expect(player).toBePlaying(song);
  // });

  // describe("when song has been paused", function() {
  //   beforeEach(function() {
  //     player.play(song);
  //     player.pause();
  //   });

  //   it("should indicate that the song is currently paused", function() {
  //     expect(player.isPlaying).toBeFalsy();

  //     // demonstrates use of 'not' with a custom matcher
  //     expect(player).not.toBePlaying(song);
  //   });

  //   it("should be possible to resume", function() {
  //     player.resume();
  //     expect(player.isPlaying).toBeTruthy();
  //     expect(player.currentlyPlayingSong).toEqual(song);
  //   });
  // });

  // // demonstrates use of spies to intercept and test method calls
  // it("tells the current song if the user has made it a favorite", function() {
  //   spyOn(song, 'persistFavoriteStatus');

  //   player.play(song);
  //   player.makeFavorite();

  //   expect(song.persistFavoriteStatus).toHaveBeenCalledWith(true);
  // });

  // //demonstrates use of expected exceptions
  // describe("#resume", function() {
  //   it("should throw an exception if song is already playing", function() {
  //     player.play(song);

  //     expect(function() {
  //       player.resume();
  //     }).toThrowError("song is already playing");
  //   });
  // });
});
