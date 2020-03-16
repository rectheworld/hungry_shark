window.onload = function() {	
	/// Global varaible Zoo 
    var fishies;
    var collisionHandler;
    var shark;
    var startClick;
    var fishies_eaten = 0; 
    
    
	var game = new Phaser.Game(500, 500);
    
     var preloadAssets = function(game){}
     preloadAssets.prototype = {
          preload: function(){     
//			game.load.image('background_spr', "assets/backdrop_spr.png")
//            game.load.spritesheet('shark_sprsht',"assets/sharkSpritesheet.png", 64 * 2, 64, 2)
		game.load.atlasJSONHash('spritesheet', 'assets/spritesheet.png', 'assets/spritesheet.json');
        game.load.bitmapFont('font', 'assets/fonts/font/font.png', 'assets/fonts/font/font.fnt');  
          
          },
          create: function(){

               game.state.start('TitleScreen')
          }
     } /// end of preload prototype 
     
	var titleScreen = function(game){}
	titleScreen.prototype = {
        startClick: function(){
          game.state.start('PlayGame')  
        },
        create: function(){
            game.stage.backgroundColor = "#4488AA";
            
            text = game.add.bitmapText(game.world.centerX, game.world.centerY, 'font','Feed The Shark!', game.world.width / 10);
            text.anchor.setTo(0.5,0.5);
            text.inputEnabled = true;
            
            text.events.onInputUp.add(this.startClick, this);
        }
	} /// End od title screen prototype 

     
	var playGame = function(game){}
	playGame.prototype = {
		/// Variable Zoo
		create: function(){
            
            /// Start the physics engin
            game.physics.startSystem(Phaser.Physics.ARCADE);
            game.physics.arcade.gravity.y = 20;  ///250
            
            // Add he background
			game.add.sprite(0,0, 'spritesheet' ,'backdrop_spr.png');
            
            /// place Shark
            shark = game.add.sprite(100,100, 'spritesheet', 'shark_frame1.png');
            shark.anchor.setTo(0.5,0.5);
            
            game.physics.arcade.enable(shark);
            shark.enableBody =true;
            
            shark.body.collideWorldBounds = true;
            shark.body.bounce.x = 0.05;
            shark.body.bounce.y = 0.05;
//            shark.body.gravity.y = 100;
            
            shark.body.allowGravity = true;
            
            // Create the shark animations 
            shark.animations.add("swim_left", ['shark_frame1.png','shark_frame2.png'], 2, true)
            shark.animations.play("swim_left")
                                  
            /// Sharks eat with their mouths (duh) so need to make a hitbox at their mouth 
            shark.body.setSize(25,25,0, 25)
            
            // mmm yummy fishes 
            fish_range_x = [0,500 - 32]
            fish_range_y = [50,500 - 32]
            
            /// Group of fishys 
            fishies = game.add.physicsGroup(Phaser.Physics.ARCADE);
            
            // num of yummy fish 
            num_fish = 10; 
            
            for(i = 1; i <= num_fish; i++){
                
                // What kinda fishy should we make?
                what_fish = Math.floor(Math.random() * 3)
                
                if(what_fish == 0){
                    fishy_name = 'goldfish'
                }else if(what_fish == 1){
                    fishy_name = 'greenfish'
                }else if(what_fish == 2){
                    fishy_name = 'shrimp'
                }
                
                /// Where should we put the fishy?
                this_fishy_x = Math.floor((Math.random() * fish_range_x[1]))
                this_fishy_y = Math.floor((Math.random() * fish_range_y[1]) - 64) + 80 

                var fishy = fishies.create(this_fishy_x, this_fishy_y, 'spritesheet', fishy_name + "_frame1.png")
                

                game.physics.arcade.enable(fishy);
                fishy.enableBody =true;
                fishy.body.allowGravity = false;
                
                /// Add animation
                fishy.animations.add("swim", [fishy_name + "_frame1.png",fishy_name + "_frame2.png"], 2, true)
                fishy.animations.play("swim")
                
                
                
            }
            goldfish = game.add.sprite()
            
            
            /// Map some keys mofo
            cursors = game.input.keyboard.createCursorKeys(); 
            
		}, /// End of Create Function 
        
        collisionHandler: function(shark, fish){
            fishies_eaten += 1;
            fish.kill()
        },
        
        update: function(){
            /// Set velocity to zero
//            shark.body.velocity.x = 0;
            
            
            if (cursors.left.isDown)
            {
                /// flip the spirte 
                shark.scale.x = 1;
                /// flio the hitbox to the now mouth of the shark
                shark.body.setSize(25,25,0, 25)
                shark.body.velocity.x = -70;
                
                if (cursors.up.isDown)
                {
                    shark.body.velocity.y = -70;

                }
                else if (cursors.down.isDown)
                {
                    shark.body.velocity.y = 70;

                }

            }
            else if (cursors.right.isDown)
            {
                /// flip the spirte 
                shark.scale.x = -1;
                /// flio the hitbox to the now mouth of the shark
                shark.body.setSize(25,25, 0, 25)
                
                shark.body.velocity.x = 70;
                
                if (cursors.up.isDown)
                {
                    shark.body.velocity.y = -70;

                }
                else if (cursors.down.isDown)
                {
                    shark.body.velocity.y = 70;

                }

            }
            
            
            /// Eat fishes 
            game.physics.arcade.collide(shark, fishies, collideCallback = this.collisionHandler, null, this)


            /// Check if weve eaten all the fishies 
            if(fishies_eaten === num_fish){
                fishies_eaten = 0;
                
                game.state.start('GameOver')
            }
            
        },// end of updatae function 
        

        
        render: function(){
//            game.debug.body(shark);
//            fishies.forEachExists(function(fishy) {
//
//               game.debug.body(fishy);  
//                });

        }// End of Render function 

        
	} // /End of play game protottype 
    
    

    
	var gameOver = function(game){}
	gameOver.prototype = {
        
        startClick: function(){
          game.state.start('PlayGame')  
        },
        create: function(){
            game.stage.backgroundColor = "#4488AA";
            
            text1 = game.add.bitmapText(game.world.centerX, game.world.centerY - 50, 'font','Shark is Full!', 30);
            text1.anchor.setTo(0.5,0.5);
            
            text2 = game.add.bitmapText(game.world.centerX, game.world.centerY + 50, 'font','Feed The Shark Again!', 30);
            text2.anchor.setTo(0.5,0.5);
            text2.inputEnabled = true;
            
            text2.events.onInputUp.add(this.startClick, this);
        }
		
	} // End of gameOVer prototype 
    
    
     game.state.add("PreloadAssets", preloadAssets); 
	game.state.add("TitleScreen", titleScreen);
	game.state.add("PlayGame", playGame);
	game.state.add("GameOver", gameOver);
//     highScore = localStorage.getItem(localStorageName) == null ? 0 : localStorage.getItem(localStorageName);
	game.state.start("PreloadAssets");	
} // End of onload function 