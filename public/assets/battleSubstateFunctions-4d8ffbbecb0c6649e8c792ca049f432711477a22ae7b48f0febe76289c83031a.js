function selectMainActionEnter() {
    
    this.mainActionsDisplay.resetSelection();
    this.mainActionsDisplay.selectionDisplay.visible = true;
            
    this.showMessage("Select an action");
};

function selectMainActionExit() {
    
    this.mainActionsDisplay.selectionDisplay.visible = false;
    this.hideMessage();
};

function selectMainActionKeyDown(key) {
    
    actionDisplayKeyDown(key, this.mainActionsDisplay, true);
    
    //execute the action the user has chosen
    if(key.keyCode == Phaser.Keyboard.ENTER) {
        
        //we would like to return to the main map if player selected run
        if(this.mainActionsDisplay.getSelectedActionConfiguration().text == "Run") {
            
            this.stateManager.changeState("playerRunAway");
        }
        
        if(this.mainActionsDisplay.getSelectedActionConfiguration().text == "Items") {
            
            this.stateManager.changeState("selectItemAction");
        }
        
        if(this.mainActionsDisplay.getSelectedActionConfiguration().text == "Fight") {
            
            this.stateManager.changeState("selectFightAction");
        }
        
        globalSfx.selectOption.play();
    }
};

function selectMainActionUpdate() {
    
    this.mainActionsDisplay.highlightSelectedAction();
};

function selectFightActionEnter() {
    
    this.fightActionsDisplay.resetSelection();
    this.fightActionsDisplay.background.visible = true;
            
    this.showMessage("Select an action");
};

function selectFightActionExit() {
    
    this.fightActionsDisplay.background.visible = false;
    this.hideMessage();
};

function selectFightActionKeyDown(key) {
    
    actionDisplayKeyDown(key, this.fightActionsDisplay, true);
        
    if(key.keyCode == Phaser.Keyboard.ENTER) {
        
        //we would like to return to the main map if player selected run
        if(this.fightActionsDisplay.getSelectedActionConfiguration().text == "Cancel") {
            
            this.stateManager.changeState("selectMainAction");
            globalSfx.cancel.play();
            return;
        }
        
        if(this.fightActionsDisplay.getSelectedActionConfiguration().text == "Attack" && this.monsters.length > 0) {
            
            player.lastUsedAttack = player.basicAttack;
            this.stateManager.changeState("playerSelectTarget");
        }
        
        if(this.fightActionsDisplay.getSelectedActionConfiguration().text == "Skills" && this.monsters.length > 0) {
            
            this.stateManager.changeState("selectSkill");
        }
        
        globalSfx.selectOption.play();
    }
    
    if(key.keyCode == Phaser.Keyboard.ESC) {
        
        this.stateManager.changeState("selectMainAction");
        globalSfx.cancel.play();
    }
};

function selectFightActionUpdate() {
    
    this.fightActionsDisplay.highlightSelectedAction();
};

function selectSkillEnter() {
    
    this.skillsDisplay.background.visible = true;
    this.skillsDisplay.resetSelection();
    
}

function selectSkillExit() {
    
    this.skillsDisplay.background.visible = false;
    this.hideMessage();
    
    if(typeof this.displayMessageEvent !== "undefined") {
        
        this.displayMessageEvent.timer.stop();
    }
}

function selectSkillKeyDown(key) {
    
    //check if user cancled
    if(key.keyCode == Phaser.Keyboard.ESC) {
        
        this.stateManager.changeState("selectFightAction");
        globalSfx.cancel.play();
    }
    
    actionDisplayKeyDown(key, this.skillsDisplay, true);
    
    if(key.keyCode == Phaser.Keyboard.ENTER) {
        
        if(this.skillsDisplay.getSelectedActionConfiguration().attributeName === "Cancel") {
            
            this.stateManager.changeState("selectFightAction");
            
            globalSfx.cancel.play();
            return;
        }
        
        //player tried ot use a skill
        //if player doesn't have enough mana, tell him he needs more mana
        //otherwise use the skill and let player select targets
        var skillName = this.skillsDisplay.getSelectedActionConfiguration().attributeName;
        
        if(player.mana < game.cache.getJSON("skillData")[skillName].manaCost ) {
            
            globalSfx.invalidSelection.play();
            
            //tell player he doesn't have enough manga
            //auto hide the message after a few seconds
            this.showMessage("Not Enough Mana.");
            
            //if we already have a message hide event, erase it and create a new oen
            if(typeof this.displayMessageEvent === "undefined") {
                
                this.displayMessageEvent = game.time.events.add(2000, this.hideMessage, this);
            }
            
            this.displayMessageEvent.timer.stop();
            this.displayMessageEvent.timer.add(2000, this.hideMessage, this);
            this.displayMessageEvent.timer.start();
            
            return;
        }
        
        //player has enough mana, use skill
        player.lastUsedAttack = game.cache.getJSON("skillData")[skillName];
        this.stateManager.changeState("playerSelectTarget");
        globalSfx.selectOption.play();
    }
}

function selectSkillUpdate() {
    
    this.skillsDisplay.highlightSelectedAction();
}

function selectItemActionEnter() {
    
    this.itemsDisplay.resetSelection();
    this.itemsDisplay.background.visible = true;
    
    //items might change every turn if player uses an item
    //so we gotta repopulate the item list
    this.itemsDisplay.clearActions();
    
    for(item in player.items) {
        
        if(!player.items[item].usable) {
            
            continue;
        }
        
        var config = {attributeName: item, attributeValue: "x" + player.items[item].quantity};
        this.itemsDisplay.addAction(config);
    }
    
    //now add a cancel option
    this.itemsDisplay.addAction({attributeName: "Cancel"});
}

function selectItemActionExit() {
    
    this.itemsDisplay.background.visible = false;
    this.hideMessage();
}

function selectItemActionKeyDown(key) {
    
    //check if user cancled
    if(key.keyCode == Phaser.Keyboard.ESC) {
        
        this.stateManager.changeState("selectMainAction");
        globalSfx.cancel.play();
    }
    
    actionDisplayKeyDown(key, this.itemsDisplay, true);
    
    if(key.keyCode == Phaser.Keyboard.ENTER) {
        
        if(this.itemsDisplay.getSelectedActionConfiguration().attributeName === "Cancel") {
            
            this.stateManager.changeState("selectMainAction");
            globalSfx.cancel.play();
            return;
            
        }
        
        globalSfx.useItem.play();
        
        //player chooses to use an item
        this.stateManager.changeState("playerUseItem");
        
    }
}

function selectItemActionUpdate() {
    
    this.itemsDisplay.highlightSelectedAction();
    
    //get the currentlly selected item and create a message that displays the items effects
    var selectedAction = this.itemsDisplay.getSelectedActionConfiguration().attributeName;
    
    if(selectedAction == "") {
        
        return;
    }
    
    if(selectedAction == "Cancel") {
        
        this.showMessage("Cancel");
        return;
    }
    
    this.showMessage(player.items[selectedAction].battleDescription);
}

function playerRunAwayEnter() {
    
    globalBgm.activeBgm.fadeOut(1250);
    globalSfx.escapeBattle.play();
    
    //make player face away and run
    player.sprite.animations.play("right");
    
    var tween = game.add.tween(player.sprite.position);
    tween.onComplete.add(function(){this.stateManager.changeState("outro");}, this);
    tween.to({x: game.scale.width + 100}, 400);
    tween.start();
};

function playerSelectTargetEnter() {
    
    this.monsterSelector.startSelectionProcess(this.monsters, player.lastUsedAttack.targetsHit);
    this.showMessage("Select " + player.lastUsedAttack.targetsHit.toString() + " monster(s) to attack");
};

function playerSelectTargetExit() {

    this.monsterSelector.highlighter.hideHighlights();
    this.hideMessage();
};

function playerSelectTargetKeyDown(key) {
    
    if(key.keyCode == Phaser.Keyboard.ESC) {
        
        this.stateManager.changeState("selectFightAction");
        globalSfx.cancel.play();
        return;
    }
    
    if(key.keyCode == Phaser.Keyboard.UP) {
        
        this.monsterSelector.selectPrevious(this.monsters, 1);
    }
    
    if(key.keyCode == Phaser.Keyboard.DOWN) {
        
        this.monsterSelector.selectNext(this.monsters, 1);
    }
    
    if(key.keyCode == Phaser.Keyboard.LEFT) {
        
        this.monsterSelector.selectPrevious(this.monsters, 2);
    }
    
    if(key.keyCode == Phaser.Keyboard.RIGHT) {
        
        this.monsterSelector.selectNext(this.monsters, 2);
    }
    
    if(key.keyCode == Phaser.Keyboard.ENTER) {
        
        this.monsterSelector.addCurrentSelection(this.monsters);
    }
    
    if(this.monsterSelector.isSelectionFinished()) {
                
        this.stateManager.changeState("playerAttack");
    }
};

function playerSelectTargetUpdate() {
    
    
};

function playerAttackEnter() {

    this.showMessage(player.lastUsedAttack.playerUseMessage);
    
    player.useAttack(this.monsterSelector.getSelectedMonsters(this.monsters), player.lastUsedAttack);
    this.updatePlayerStatDisplay();
};

function playerAttackExit() {
    
    this.hideMessage();
};

function playerAttackUpdate() {
    
    //move onto the next state when the player's last used attack has finished
    if(player.lastUsedAttack.isFinished) {
        
        this.stateManager.changeState("playerAttackResults");
    }
};

function playerAttackResultsEnter() {
    
    //damage all the monsters
    var indicesDamagedMonsters = this.monsterSelector.selectedMonstersIndices;
    
    for(var i = 0; i < indicesDamagedMonsters.length; ++i) {
        
        var damage = this.determineAttackResults(player.lastUsedAttack, this.monsters[indicesDamagedMonsters[i]]);
    
        //get damage received by this entity
        this.damageTexts.push(this.createDamageText(this.monsters[indicesDamagedMonsters[i]], damage, damageStyle) );
    }
};

function playerAttackResultsExit() {
    
    this.clearDamageTexts();
    this.hideMessage();
};

function playerAttackResultsUpdate() {
    
    var moveToNextState = this.finishedDisplayingResults();
    
    if(moveToNextState) {
        
        this.stateManager.changeState("cullDeadMonsters");
    }
};

function cullDeadMonstersEnter() {
    
    this.startMonsterDeathAnimation();
    this.storePlayerRewards();
};

function cullDeadMonstersExit() {
    
    this.hideMessage();
};

function cullDeadMonstersUpdate() {
    
    //before deleting dead entites store the rewards the monsters give to the player
    var removedAllMarkedEntites = this.deleteMarkedEntities(this.monsters);
            
    if(removedAllMarkedEntites && this.monsters.length == 0) {
        
        //go to victory
        this.stateManager.changeState("victory");
    }
    
    if(removedAllMarkedEntites && this.monsters.length > 0) {
        
        //monster turn start
        this.currentMonster = 0;
        this.stateManager.changeState("monsterTurn");
    }
};

function playerUseItemEnter() {
    
    this.finishedItemUseAnimation = false;
    
    //apply item effect to player and show some kind of animation and message
    var nameOfItemUsed = this.itemsDisplay.getSelectedActionConfiguration().attributeName;
    this.showMessage("You use " + nameOfItemUsed);
    
    //apply effect depending on what type of item was used
    if(player.items[nameOfItemUsed].effect === "restoreStats") {
        
        useItem(player, nameOfItemUsed);
        game.time.events.add(1700, function(){this.finishedItemUseAnimation = true}, this);
    }
    
    this.updatePlayerStatDisplay();
}

function playerUseItemExit() {
    
    this.hideMessage();
}

function playerUseItemUpdate() {
    
    var moveToNextState = this.finishedItemUseAnimation;
    
    if(moveToNextState) {
        
        this.stateManager.changeState("cullDeadMonsters");
    }
}

function monsterTurnEnter() {
    
    //randomly determine what the monster should do
    //weigthed random based on monster's stats
    var rangeMin = 0;
    var rangeMax = this.monsters[this.currentMonster].strength + this.monsters[this.currentMonster].magicPower;
    var num = getRandomInt(rangeMin, rangeMax);
    
    var attackName = "Basic Attack";
    
    if(num > this.monsters[this.currentMonster].strength && this.monsters[this.currentMonster].skills.length > 0) {
        
        //magic attack, get random magic attack from monster
        var magicAttackId = getRandomInt(0, this.monsters[this.currentMonster].skills.length - 1);
        
        var skillName = this.monsters[this.currentMonster].skills[magicAttackId];
        var skillCost = game.cache.getJSON("skillData")[skillName].manaCost;
        
        attackName = this.monsters[this.currentMonster].mana >= skillCost ? skillName : attackName;
    }
    
    this.monsters[this.currentMonster].useAttack([player], game.cache.getJSON("skillData")[attackName]);
  
    this.showMessage(this.monsters[this.currentMonster].name + this.monsters[this.currentMonster].lastUsedAttack.monsterUseMessage);
};

function monsterTurnExit() {

    this.hideMessage();
};

function monsterTurnUpdate() {
    
    //move onto the results when this monster's last attack finishes displaying
    if(this.monsters[this.currentMonster].lastUsedAttack.isFinished) {
        
        this.monsters[this.currentMonster].sprite.animations.play("stand");
        this.stateManager.changeState("monsterAttackResults");
    }
};

function monsterAttackResultsEnter() {
    
    var damage = this.determineAttackResults(this.monsters[this.currentMonster].lastUsedAttack, player);
    this.damageTexts.push(this.createDamageText(player, damage, damageStyle) );
    
    this.playerStatDisplay.playerHealthBar.setValue(player.health);
    
    this.updatePlayerStatDisplay();
};

function monsterAttackResultsExit() {
    
    playerAttackResultsExit.call(this);
};

function monsterAttackResultsUpdate() {
    
    var moveToNextState = this.finishedDisplayingResults();
    
    if(!moveToNextState) {
        
        return;
    }
    
    //if player died, move to player death animation
    if(player.health == 0) {
        
        //for now move straight to defeat screen
        this.stateManager.changeState("playerDying");
        return;
    }
    
    this.currentMonster += 1;
    
    //no more monsters, move back to player's turn
    if(this.currentMonster >= this.monsters.length) {
    
        this.stateManager.changeState("selectMainAction");
        return;
    }
    
    //monster left, start his turn
    this.stateManager.changeState("monsterTurn");
};

function playerDyingEnter() {
    
    player.sprite.animations.getAnimation("dying").onComplete.addOnce(function(){this.stateManager.changeState("defeat");}, this);
    player.sprite.animations.play("dying");
    globalSfx.entityKilled.play();
    player.deaths += 1;
}

function victoryEnter() {
    
    globalBgm.activeBgm.fadeOut(1500);
    globalSfx.winBattle.play();
    
    //player won a match, create a message box at the center of the screen
    //show player all the rewards he received
    this.createRewardsText();
    
    this.applyRewardsToPlayer();
    
    //let quest manager know that player killed monsters
    for(name in this.defeatedMonsters) {
        
        questManager.onKillMonster(name, this.defeatedMonsters[name]);
    }
    
    //delete the defeated boss
    if(fightingBoss) {
        
        removeBoss(bossName);
    }
};

function victoryKeyDown(key) {
    
    if(key.keyCode == Phaser.Keyboard.ENTER) {
        
        globalSfx.selectOption.play();
        if(this.rewardsTextbox.isShowingLastPageOfText()) {
            
            this.stateManager.changeState("outro");
            return;
        }
        
        //show next page of text
        this.rewardsTextbox.showNextPage();
    }
}

function defeatEnter() {
    
    globalBgm.activeBgm.fadeOut(1250);
    globalSfx.loseBattle.play();
    
    //create a transition so we fade to a black screen
    this.fadeToBlack = new fadeToBlack(700);
    
    //add message to display when screen fades to black
    //can't use the message box because the black screen draws ontop of it, since it was created after the message box
    this.deathMessage = new textBox({x: game.scale.width / 2, y: game.scale.height / 2, width: game.scale.width / 3, height: 30, centerToPoint: true, horizontalAlign: "center", verticalAlign: "center", showPressEnterMessage: true});
    this.deathMessage.hide();
    this.deathMessage.setText("You have died.");
    
    this.fadeToBlack.setOnExit(function(){this.fadeToBlack.finishedTransition = true; this.deathMessage.show();}, this);
    this.fadeToBlack.start();
}

function defeatExit() {
    
}

function defeatKeyDown(key) {
    
    if(this.fadeToBlack.finishedTransition && key.keyCode == Phaser.Keyboard.ENTER) {
        
        //now make the screen fade to black, and then go back to the overworld
        this.stateManager.changeState("outro");
        globalSfx.selectOption.play();
    }
}

function introEnter() {
    
    //fade in from a black screen
    var fadeIn = new fadeFromBlack(350);
    fadeIn.setOnExit(this.moveMonstersToPosition, this);
    fadeIn.start();
}

function introUpdate() {
    
    for(var i = 0; i < this.monsters.length; ++i) {
        
        if(typeof this.monsters[i].finishedPositioning !== "undefined" && !this.monsters[i].finishedPositioning) {
            
            return;
        }
    }
    
    //all monsters have moved into position, begin battle
    this.stateManager.changeState("selectMainAction");
}

function outroEnter() {
    
    questManager.onInventoryCheck();
    var fade = new fadeToBlack(450);
    
    fade.setOnExit(function(){game.state.start("overworld")});
    fade.start();
}
