//see battleSubstateFunctions for explanation on substate functions
function exploreEnter() {
    
    //currently nothing to be done
    //start music
    globalBgm.overworld.play('', 0, globalBgm.volume, true, false);
};

function exploreExit() {
    
    //currently nothing to be done
    //stop player moving 
    player.sprite.animations.stop(null, true);
    player.sprite.body.velocity.setTo(0, 0);
};

function exploreUpdate() {
    
    //NORMALLY we do input handling before all physics and collision
    //but phaser saves some data in the collision handling that we sometimes need in the input handling
    //so when working with phaser, we will do collision handling first
    
    //this funciton tells phaser to collide two objects, or two groups of objects
    //i haven't created a group of objects explicitly, but the tile map layer is a group of objects generated by phaser
    //this is why we need a seperate layer for background and solid, i only want my player to collide with fenses or houses
    //not the grass
    game.physics.arcade.collide(player.sprite, tilemap.solid);
    
    //now we want to see if the player randomly encountered an monster, this will send us to the battle state
    //we only want to check if player encounterd an monster if he moved
    //for now its commentd out since I didn't create the battle state
    //basically if hte player travels a certain distance, we check if he should battle an monster
    /*if(player.sprite.body.deltaABSX() >= THRESHOLD || player.sprite.body.deltaABSY() >= THRESHOLD) {
        
        game.state.start('battle');
    }*/
};

function exploreKeystates() {
    
    //first we make player move and animate according to where he is moving
    //isDown is a bool value, that is true if the key is pressed down, and false otherwise
    //Checking if a key is pressed down or not is called checking a key state
    //Keystates only tell you if a button is pressed or not, 
    //it DOESN'T LET YOU HANDLE KEY PRESS EVENTS
    //this means if you want the player to attack when they press the attack button
    //if you check for keystate the game will make the player attack non stop, because you're not checking if the player pressed the attack button
    //you're only checking if the button is presed down
    //this might be confusing, but it'll make more sense with practice
    
    //for now disable diagnoal movement since i have no animation for diagnoal movement
    if((this.cursors.left.isDown || this.cursors.right.isDown) && (this.cursors.up.isDown || this.cursors.down.isDown)) {
        
        return;
    }
    
    if(this.cursors.left.isDown) {
    
        //move left, the sprite has a variable called body
        //this variable is a physics object that represents the object in the physics engine
        //by setting its velocity we can make it move
        player.sprite.body.velocity.x = -200;
        
        //run an animation, we created this animation already
        player.sprite.animations.play('left');
        
    } else if(this.cursors.right.isDown) {
        
        player.sprite.body.velocity.x = 200;
        player.sprite.animations.play('right');
        
    } else {
        
        //player isn't moving left or right, we have to set his velocity to 0 since the physcis engine isn't going to know when to stop moving
        player.sprite.body.velocity.x = 0;
        
        //only stop animation if the player is moving left or right
        //this is important because we don't want to stop animation when the player is moving up or down
        //because the player will never animate then
        if(player.sprite.animations.name == 'left' || player.sprite.animations.name == 'right') {
            
            //we stop the animation
            //the first argument is the name of the animtion yo uwant to stop
            //by setting to null, we stop the current animation
            //second argument tells phaser we want to stop the animation and start drawing the first frame of the animation
            //this way if player is standing still, he will face left or right, adn we won't have to determine which way he is facing
            player.sprite.animations.stop(null, true);
        }
    }
    
    if(this.cursors.up.isDown) {
        
        //IMPORTANT: IN COMPUTER GRAPHICS, THE POSTIIVE Y AXIS GOES DOWN, THE NEGATIVE Y AXIS GOES UP
        //THIS MEANS THAT UPWARDS IS NEGATIVE
        player.sprite.body.velocity.y = -200;
        player.sprite.animations.play('up');
        
    } else if(this.cursors.down.isDown) {
        
        player.sprite.body.velocity.y = 200;
        player.sprite.animations.play('down');
        
    } else {
        
        player.sprite.body.velocity.y = 0;
        
        if(player.sprite.animations.name == "up" || player.sprite.animations.name == 'down') {
            
            player.sprite.animations.stop(null, true);
        }
    }
};

function exploreKeyDown(key) {
    
    //if user presses the enter key we will enter the battle state
    if(key.keyCode == Phaser.Keyboard.ENTER) {
        
        game.state.start('pauseMenu');
    }
    
    if(key.keyCode == Phaser.Keyboard.SPACEBAR) {
        
        this.stateManager.changeState("enterBattle");
    }
};

function startGameEnter() {
    
    //create a fade in effect
    this.fadeFromBlack = new fadeFromBlack(1000);
    this.fadeFromBlack.setOnExit(function(){this.fadeFromBlack.finishedTransition = true}, this);
    this.fadeFromBlack.start();
    
    //put player in spawn position
    player.sprite.x = tilemap.spawnPoint.x;
    player.sprite.y = tilemap.spawnPoint.y;
};

function startGameExit() {
    
    //get rid of the black screen so it doesn't cover the whole screen
    //object not created until you enter the startgame state, so don't delete if its nonexistant
    if(typeof this.fadeFromBlack !== "undefined") {
        
        this.fadeFromBlack.cover.graphics.destroy();
        delete this.fadeFromBlack;
    }
};

function startGameUpdate() {
    
    if(typeof this.fadeFromBlack !== "undefined" && this.fadeFromBlack.finishedTransition) {
        
        this.stateManager.changeState("explore");
    }
}

function exitBattleEnter() {
    
    //target a circle onto the player
    var mask = game.add.graphics(player.sprite.x + player.sprite.width / 2, player.sprite.y + player.sprite.height / 2);
    
    mask.beginFill(0xffffff);
    mask.drawCircle(0, 0, game.scale.width * 2);
    game.world.mask = mask;
    
    var maskInTween = game.add.tween(mask.scale);
    maskInTween.from({x: 0, y: 0}, 600, null, true);
    maskInTween.onComplete.add(function(){this.stateManager.changeState("explore"); game.world.mask.destroy();}, this);
};

function enterBattleEnter() {
    
    //target a circle onto the player
    var mask = game.add.graphics(player.sprite.x + player.sprite.width / 2, player.sprite.y + player.sprite.height / 2);
    
    mask.beginFill(0xffffff);
    mask.drawCircle(0, 0, game.scale.width * 2);
    game.world.mask = mask;
    
    var maskInTween = game.add.tween(mask.scale);
    maskInTween.to({x: 0, y: 0}, 600, null, true);
    maskInTween.onComplete.add(function(){globalBgm.overworld.stop(); game.state.start("battle"); game.world.mask.destroy} );
}