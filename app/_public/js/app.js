var app=angular.module("game",["ui.router"]);app.config(function($stateProvider,$urlRouterProvider,$locationProvider){$urlRouterProvider.otherwise("/");$stateProvider.state("home",{url:"/",templateUrl:"views/home.html"});$locationProvider.html5Mode(true);$locationProvider.hashPrefix("!")});app.run(function($http,$rootScope,$timeout,$state,$location){var effect="";$rootScope.$on("$stateChangeStart",function(event,toState,toParams,fromState,fromParams){});$rootScope.$on("$stateChangeSuccess",function(event,toState,toParams,fromState,fromParams){$("body").scrollTop(0)})});app.controller("AppCtrl",function($scope,Game,Cards,$timeout){$scope.allCards=Cards.getCards();$scope.game=Game.Config();$scope.reveal={status:false};var lockFlip=false;var Compare=[];var countTime;$scope.restartGame=function(){lockFlip=true;$scope.game.finish=false;$(".atom-card-container.complete").each(function(i,obj){var element=$(this);setTimeout(function(){element.removeClass("complete").removeClass("active")},100*i)});$timeout(function(){$(".organism-header").removeClass("playing");$(".molecule-cards").addClass("waiting-start").removeClass("in-play")},2500);$timeout(function(){lockFlip=false;$scope.allCards=Cards.getCards();$scope.game=Game.Config()},3500)};$scope.$watch("reveal",function(val){console.log("reveal",val)});$scope.selectMode=function(mode){$scope.allCards=Cards.getCards();$scope.game.mode=mode;$scope.game.status.remaning=20;countTime=setInterval(function(){$scope.$apply(function(){$scope.game.status.time++})},1e3);if($scope.reveal.status===true){lockFlip=true;$timeout(function(){$(".atom-card-container").each(function(i,obj){var element=$(this);setTimeout(function(){element.addClass("complete")},100*i)})},100);$timeout(function(){$(".atom-card-container.complete").each(function(i,obj){var element=$(this);setTimeout(function(){element.removeClass("complete")},100*i)});$timeout(function(){lockFlip=false},1e3)},1e4)}};$scope.flipCard=function(card){if(lockFlip===false){lockFlip=true;changeStatus({mode:$scope.game.mode,field:"moves",by:$scope.game.turn});var indexArray=card.index;$scope.allCards[indexArray].flip=true;Compare.push(card);if(Compare.length==2){result=Cards.compareCards(Compare);switch(result.status){case true:$scope.allCards[result.cardOne.index].complete=true;$scope.allCards[result.cardTwo.index].complete=true;lockFlip=false;for(var i=0;i<2;i++){$scope.game.status.remaning--;changeStatus({mode:$scope.game.mode,field:"score",by:$scope.game.turn})}break;case false:$timeout(function(){$scope.allCards[result.cardOne.index].flip=false;$scope.allCards[result.cardTwo.index].flip=false;changeStatus({mode:$scope.game.mode,field:"changePlayer",by:$scope.game.turn});lockFlip=false},1e3);break}Compare=[]}else{lockFlip=false}}};function changeStatus(update){if(update.mode==="singlePlayer"){switch(update.field){case"moves":$scope.game[update.mode].moves++;break;case"score":$scope.game[update.mode].score++;break}}if(update.mode==="multiPlayer"){switch(update.field){case"moves":$scope.game[update.mode][update.by].moves++;break;case"score":$scope.game[update.mode][update.by].score++;break;case"changePlayer":$scope.game.turn=$scope.game.turn==="playerOne"?"playerTwo":"playerOne";break}}}$scope.$watch("game.status.remaning",function(newData){if(newData<1){clearInterval(countTime);$scope.game.finish=true;if($scope.game.mode==="multiPlayer"){var playerOne=$scope.game.multiPlayer.playerOne;var playerTwo=$scope.game.multiPlayer.playerTwo;if(playerOne.score>playerTwo.score){$scope.game.multiPlayer.result="1º PLAYER WON"}else if(playerTwo.score>playerOne.score){$scope.game.multiPlayer.result="2º PLAYER WON"}else{if(playerOne.moves<playerTwo.moves){$scope.game.multiPlayer.result="1º PLAYER WON"}else if(playerTwo.moves<playerOne.moves){$scope.game.multiPlayer.result="2º PLAYER WON"}else{$scope.game.multiPlayer.result="DRAW"}}}}})});app.controller("InternalCtrl",function($scope,Metatags){});app.directive("card",function(){return{restrict:"E",replace:true,scope:{card:"=",onFlip:"&"},template:'<li class="atom-card-item">'+'<a href="#" class="atom-card-container" ng-click="onFlip()" ng-class=" { \'active\' : card.flip, \'complete\' : card.complete } ">'+'<div class="atom-card-flipper">'+'<div class="atom-card-front color-{{ card.color }}"></div>'+'<div class="atom-card-back"></div>'+"</div>"+"</a>"+"</li>"}});app.directive("startGame",function($timeout){return{restrict:"A",link:function(scope,element,attrs){element.on("click",function(event){$timeout(function(){$(".molecule-cards").toggleClass("waiting-start").toggleClass("in-play");$(".atom-card-container").removeClass("active").removeClass("complete");$(".organism-header").addClass("playing")},100)})}}});app.filter("secondsInHours",function(){return function(seconds){d=Number(seconds);var h=Math.floor(d/3600);var m=Math.floor(d%3600/60);var s=Math.floor(d%3600%60);return(h>0?h+":"+(m<10?"0":""):"")+m+":"+(s<10?"0":"")+s}});app.factory("Cards",function(){return{getCards:getCards,compareCards:compareCards};function getCards(){var colors=["red","blue","beige","orange","yellow","green","pink","black","brown","purple"];var cards=$.merge(colors,colors);cards=$.shuffle(cards);var arrCards=[];var index=0;cards.forEach(function(color){card={color:color,index:index,flip:false,complete:false};arrCards.push(card);index++});return arrCards}function compareCards(arrCompare){var cardOne=arrCompare[0],cardTwo=arrCompare[1];return{cardOne:cardOne,cardTwo:cardTwo,status:cardOne.color===cardTwo.color&&cardOne.index!==cardTwo.index}}});app.factory("Game",function(){return{Config:Config};function Config(){return{mode:null,turn:"playerOne",finish:false,status:{time:0,remaning:20},singlePlayer:{score:0,moves:0},multiPlayer:{playerOne:{score:0,moves:0},playerTwo:{score:0,moves:0},result:null}}}});
//# sourceMappingURL=app.js.map