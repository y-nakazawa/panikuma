enchant(); // おまじない

var LIMIT_TIME = 50;        // 無敵時間
var ITEM_NUN = 10;          // アイテム数
//    var ITEM_NUN = 1;          // アイテム数

var PLAYER_X = 100;         // Player X
var PLAYER_Y = 120;         // Player Y
var ITEM_START_FRAME = 64;  // アイテムのスタートフレーム数
var POWERUP_ITEM_START_FRAME = 30;  // パワーアップアイテムの対象フレームNo
var SIZEUP_ITEM_START_FRAME = 12;   // サイズアップアイテムの対象フレームNo

var POWERUP_COUNTER = 10 + 1;
var STAGE_NUM = 10;         // 10ステージ
//var STAGE_NUM = 1;         // 3ステージ // 産業フェア版は3面まで

//var GAME_SIZE_X = 300;
var GAME_SIZE_X = 340;
//    var GAME_SIZE_Y = 320;
var GAME_SIZE_Y = 420;
var START_Y_POS = 60;
var SPRITE_SCALE = 1.5;

var _score = 0;
var _stage = 1; 
var _getItemNum = 0;
var _powerUpDisp = 0;        
var _playerMode = 0;
var _powerupCounter = 0;
var _frameCounter = 0;
var _clearFlg = 0;
var _sec = 0;

var _score_label;
var _mode_label;

window.onload = function() {

    game = new Game(GAME_SIZE_X, GAME_SIZE_Y); // ゲーム本体を準備すると同時に、表示される領域の大きさを設定しています。
    game.fps = 12; // frames（フレーム）per（毎）second（秒）：ゲームの進行スピードを設定しています。
    game.preload('./img/avatarBg1.png','./img/title.png', './img/clear.png','./img/gameover.png', './img/startButton.png', './img/chara1.png','./img/chara6.png','./img/icon0.png','./sound/powerup.mp3'); // pre（前）-load（読み込み）：ゲームに使う素材をあらかじめ読み込んでおきます。


    game.onload = function() { //準備が整ったら
//        title_scene = new TitleScene();
        title_scene = new PlayScene();
        game.pushScene(title_scene); //タイトルシーンに遷移
    }

    //タイトルシーン
    TitleScene = Class.create(Scene, {
        initialize: function() {
            Scene.call(this);

            //背景画像
            background = new Sprite(GAME_SIZE_X, GAME_SIZE_Y); //ゲーム画面の大きさでスプライトを生成
            background.image = game.assets["./img/title.png"]; //タイトル画像を設定
            this.addChild(background); //シーンにスプライトを追加
            //スタートボタン
            startButton = new Sprite(160, 60); //ボタンの画像に合わせてスプライトを生成
            startButton.image = game.assets["./img/startButton.png"]; //スタートボタンの画像を設定
            this.addChild(startButton); //シーンにスプライトを追加
            //スタートボタンの座標設定
            startButton.x = 80;
            startButton.y = 260;

            //ここにコードを追加
            startButton.addEventListener('touchend', function() {
                play_scene = new PlayScene();
                game.replaceScene(play_scene); //ゲームシーンに遷移
            });
        }
    });

    //ゲームオーバーシーン
    GameOverScene = Class.create(Scene, {
        initialize: function() {
            Scene.call(this);

            _score_label.text = 'てんすう ' + ('   ' + _score).slice(-3)+ 'くま';
            _mode_label.visible = false;

            this.opacity = 0.5; 
            //背景画像
            var y = START_Y_POS;
            background = new Sprite(190, 100);
            background.image = game.assets["./img/gameover.png"]; //タイトル画像を設定
            background.x = get_obj_xpos(background);                        
            background.y = y ;
            this.addChild(background); //シーンにスプライトを追加

            // 称号
            title = judgment_title()
            var title_label = new Label();
            title_label.color = 'red';
            title_label.font = '20px "Arial"';
            title_label.text = title + 'くまー';
//            title_label.x = 20;
            title_label.x = get_obj_xpos(title_label);
            y = y + 120;
            title_label.y = y ;

            this.addChild(title_label); 

            //スタートボタン
            startButton = new Sprite(160, 60); //ボタンの画像に合わせてスプライトを生成
            startButton.image = game.assets["./img/startButton.png"]; //スタートボタンの画像を設定
            this.addChild(startButton); //シーンにスプライトを追加
            //スタートボタンの座標設定
            startButton.x = get_obj_xpos(startButton);
            startButton.y = y + 40;

            //ここにコードを追加
            startButton.addEventListener('touchend', function() {
                _stage = 1; 
                _score = 0;
                _getItemNum = 0;
                _powerUpDisp = 0;
                play_scene = new PlayScene();
                game.replaceScene(play_scene); //ゲームシーンに遷移
            });
        }
    });

    //ステージクリアシーン
    ClearScene = Class.create(Scene, {
        initialize: function() {
            Scene.call(this);

            _score_label.text = 'てんすう ' + ('   ' + _score).slice(-3)+ 'くま';
            _mode_label.visible = false;

            this.opacity = 0.5; 
            //背景画像
            var y = START_Y_POS;
            background = new Sprite(270, 50);
            background.image = game.assets["./img/clear.png"]; //タイトル画像を設定
            background.x = get_obj_xpos(background);
            background.y = START_Y_POS;
            this.addChild(background); //シーンにスプライトを追加

            //スタートボタン
            startButton = new Sprite(160, 60); //ボタンの画像に合わせてスプライトを生成
            startButton.image = game.assets["./img/startButton.png"]; //スタートボタンの画像を設定
            this.addChild(startButton); //シーンにスプライトを追加
            //スタートボタンの座標設定
            startButton.x = get_obj_xpos(startButton);            
            startButton.y = y + 80;

            startButton.addEventListener('touchend', function() {
                _getItemNum = 0;    // アイテム取得数をクリア
                play_scene = new PlayScene();
                game.replaceScene(play_scene); //ゲームシーンに遷移
            });
        }
    });

    //全ステージクリアシーン
    AllClearScene = Class.create(Scene, {
        initialize: function() {
            Scene.call(this);

            _score_label.text = 'てんすう ' + ('   ' + _score).slice(-3)+ 'くま';
            _mode_label.visible = false;

            this.opacity = 0.5; 
            //背景画像
            var y = START_Y_POS;
            background = new Sprite(270, 50);
            background.image = game.assets["./img/clear.png"]; //タイトル画像を設定
            background.x = get_obj_xpos(background);
            background.y = y;
            this.addChild(background); //シーンにスプライトを追加

            // 称号
            title = judgment_title()
            var title_label = new Label();
//            title_label.x = 10;
            get_obj_xpos(title_label); 
            y = y + 80;
            title_label.y = y;
            title_label.color = 'white';
            title_label.font = '20px "Arial"';
            title_label.text = title + 'くまー';
            this.addChild(title_label); 

            // おしらせ
            var info_label = new Label();
            info_label.x = 10;
            y = y + 30;
            info_label.y = y;
            info_label.color = 'white';
            info_label.font = '25px "Arial"';
            info_label.text = 'つづきはWebで！！くまー ';
//            this.addChild(info_label); 

            //スタートボタン
            startButton = new Sprite(160, 60); //ボタンの画像に合わせてスプライトを生成
            startButton.image = game.assets["./img/startButton.png"]; //スタートボタンの画像を設定
            this.addChild(startButton); //シーンにスプライトを追加
            //スタートボタンの座標設定
            startButton.x = get_obj_xpos(startButton);  
            startButton.y = y + 40;

            //ここにコードを追加
            startButton.addEventListener('touchend', function() {
                _stage = 1; 
                _score = 0;
                _getItemNum = 0;
                _powerUpDisp = 0;
                play_scene = new PlayScene();
                game.replaceScene(play_scene); //ゲームシーンに遷移
            });
        }
    });

    // メインゲーム
    PlayScene = Class.create(Scene, {       
        initialize: function() {
            Scene.call(this);
            this.backgroundColor  = '#7ecef4'; // ゲームの動作部分の背景色を設定しています。

            // シーンに「毎フレーム実行イベント」を追加します。
            this.addEventListener(Event.ENTER_FRAME, function() {
                _score_label.text = 'てんすう ' + ('   ' + _score).slice(-3)+ 'くま';
                stage_label.text = 'すてーじ ' + ('   ' + _stage).slice(-3) + ' /' + (' ' + STAGE_NUM).slice(-3);

                if (_powerUpItem ) {
                    //点滅
                    if(game.frame % 12 === 0){
                        _powerUpItem.opacity=0;
                    }else{
                        _powerUpItem.opacity=1;
                    }
                }

                _frameCounter++;
                if (_frameCounter >= game.fps) { // 1秒経過
                    _frameCounter = 0;
                    _sec++;

                    // パワーアップアイテム出現
                    if (_powerUpTiming == _sec ) {
                        for (var i = 0; i < 1; i++ ) {
                           _powerUpItem = new PowerUpItem(this, player, rand_range(15, GAME_SIZE_X-50),rand_range(15, GAME_SIZE_Y-50),rand_range(1,2));
                        }
                    }

                    // パワーアップ時間の監視
                    if (_powerupCounter > 0) {
                        _powerupCounter--;

                        var mode_txt;
                        if (_powerupCounter <= 3) {
                            _mode_label.color = 'red';
                            mode_txt = '     のこり  ' + (_powerupCounter);
                        } else {
                            if (_playerMode == 1 ) {
                                mode_txt = '   しろくまー  ' + (_powerupCounter);
                            } else if (_playerMode == 2 ){
                                mode_txt = 'きょだいくまー ' + (_powerupCounter);
                            }
                        }
                        mode_txt = mode_txt + '秒'

                        if (_playerMode > 0 ) {
                            _mode_label.visible = true;
                            if (_playerMode == 1 ) {
                                _mode_label.text = mode_txt;
                            } else if (_playerMode == 2 ){
                                _mode_label.text = mode_txt;
                            }
                        } 

                        if (_powerupCounter <= 0) {
                            if (_playerMode == 2 ) {
                                player.scale(0.3,0.3);
                            }
                            _playerMode = 0;
                            _powerUpTiming = rand(20);
                             _mode_label.visible = false;
                        }
                    }
                }
            });

            _powerUpTiming = rand(20);
            _sec = 0;
            _playerMode = 0;
            _powerUpItem = null;
            _clearFlg = 0;
            player = new Player(this, PLAYER_X, PLAYER_Y, _playerMode);


            // シーン「キーイベント」を追加
            this.addEventListener('enterframe', function(e) {
                if (game.input.left) player.x -= 10;
                if (game.input.right) player.x += 10;

                if (game.input.up) player.y -= 10;
                if (game.input.down) player.y += 10;
            });

            // シーンに「タッチイベント」を追加
            this.addEventListener(Event.TOUCH_END, function(e) {
                if (e.x > player.x) { // if (もしも) タッチした横位置が、くまの横位置よりも右側（座標の値として大きい）だったら
//                    console.log(' Xプラス方向 ' + e.x + '-' + e.localX + ' - ' + player.x);
                    if ( _playerMode == 0) {
                        player.x += 10;
                    } else {
                        player.x += 10;
                    }
                } else { // それ以外のときは
//                    console.log(' Xマイナス方向 ' + e.x + '-' + e.localX + '-' + player.x);
                    if ( _playerMode == 0) {
                        player.x -= 10;
                    } else {
                        player.x -= 10;
                    }
                }
                before_x = e.x;

                if (Math.floor(e.y) > player.y) { // if (もしも) タッチした横位置が、くまの横位置よりも右側（座標の値として大きい）だったら
//                    console.log(' Yプラス方向 ' + e.y + '-' + e.localY + '-' + player.y);
                    if ( _playerMode == 0) {
                        player.y += 10;
                    } else {
                        player.y += 10;
                    }
                } else { // それ以外のときは
                    if (Math.floor(e.y) != player.y) {
//                        console.log(' Yマイナス方向 ' + e.y + '-' + e.localY + '-' + player.y);
                    if ( _playerMode == 0) {
                        player.y -= 10;
                    } else {
                        player.y -= 10;
                    }
                    }
                }
            });

            // スコアlabel表示
            _score_label = new Label();
            _score_label.x = 0;
            _score_label.y = 0;
            _score_label.color = 'brack';
            _score_label.font = '18px "Arial"';
            this.addChild(_score_label); 

            // しろくまーもーどlabel表示
            _mode_label = new Label();
            _mode_label.x = 30;
            _mode_label.y = 150;
            _mode_label.color = 'white';
            _mode_label.font = '30px "Arial"';
            _mode_label.visible = false;
            this.addChild(_mode_label); 

            // ステージlabel表示
            var stage_label = new Label();
            stage_label.x = 190;
            stage_label.y = 0;
            stage_label.color = 'brack';
            stage_label.font = '18px "Arial"';
            this.addChild(stage_label); 
   
            // copywrite
            var copywrite_label = new Label();
            copywrite_label.x = 190;
            copywrite_label.y = GAME_SIZE_Y-20;
            copywrite_label.color = 'white';
            copywrite_label.font = '12px "Arial"';
            copywrite_label.text = 'powered by enchant.js';
            this.addChild(copywrite_label); 

            score = 0;

            // キャラクター配置
            var enemys = []

//            for (var i = 0; i < 10 * _stage; i++ ) { // ステージ数の応じて的が増える
            for (var i = 0; i < 10; i++ ) { // ステージ数の応じて的が増える
               x = rand_range(15, GAME_SIZE_X-50);
               y = rand_range(15, GAME_SIZE_Y-50);

               if ((( PLAYER_X < x ) && ( x < PLAYER_X + 16 )) 
                || (( PLAYER_Y < y ) && ( y < PLAYER_Y + 16 ))) {
                    continue;
               }

               enemys[i] = new Enemy(this, player, x,y);
            }

            var items = []
            for (var i = 0; i < ITEM_NUN; i++ ) {
               items[i] = new Item(this, player, rand_range(15, GAME_SIZE_X-50), rand_range(15, GAME_SIZE_Y-50));
            } 
        }
    });
    
    // プレイヤークラス
    Player = Class.create(Sprite, {
        initialize: function(scene, x, y, mode) {
            Sprite.call(this,32,32);
            this.x = x;                   
            this.y = y;
            this.image = game.assets['./img/chara1.png'];
            this.scale(SPRITE_SCALE, SPRITE_SCALE);

            // シーンに「タッチイベント」を追加します。
            this.addEventListener(Event.TOUCH_START, function(e) {
                console.log(' プラス方向 ' +e.x + ' - ' + this.x);
            });

            scene.addChild(this);
        },
        onenterframe: function() {
            if (_playerMode >= 1 ) {
                this.frame = this.age % 3 + 5;     // age:スプライトが動いてからのフレーム数
            } else {
                this.frame = this.age % 3;     // age:スプライトが動いてからのフレーム数
            }
        }
    });

    // エネミークラス
    Enemy = Class.create(Sprite, {
        initialize: function(scene, mysprite, x, y) {
            Sprite.call(this,32,32);
            this.x = x;                   
            this.y = y;
            this.frame = rand(5);
//            this.opacity = rand(100) / 100;
            this.image = game.assets['./img/chara6.png'];
            this.scale(SPRITE_SCALE, SPRITE_SCALE);

            this.on('enterframe', function() {
//                this.rotate(rand(10));    // エネミーは、回転せずに分かり易く！！
/*
                 if (this.scaleX > 3) {
                    this.scale(1.00,1.00); // フレーム毎に拡大
                 } else {
                    this.scale(1.01,1.01); // フレーム毎に拡大
                 }
*/
                 if (_playerMode != 2 ) {
                     // within(中心点で判定)
                     if (this.within(mysprite, 16)) {
                        if ((_playerMode == 0 ) && (_clearFlg == 0)) { // クリアと同時であれば無視
                            gameover_scene = new GameOverScene();
                            game.pushScene(gameover_scene); //ゲームオーバーに遷移
                        } else {
                            scene.removeChild(this);
                            _score += 10;    // パワーアップ中は、10pt
                        }
                     }
                } else {
                     // intersect(おおざっぱ)
                     if (this.intersect(mysprite)) {
                        if ((_playerMode == 0 ) && (_clearFlg == 0)) { // クリアと同時であれば無視
                            gameover_scene = new GameOverScene();
                            game.pushScene(gameover_scene); //ゲームオーバーに遷移
                        } else {
                            scene.removeChild(this);
                            _score += 10;    // パワーアップ中は、10pt
                        }
                     }
                }
            });
            scene.addChild(this);
        }
    });

    // アイテムクラス
    Item = Class.create(Sprite, {
       initialize: function(scene, mysprite, x, y) {
            Sprite.call(this,16,16);
            this.x = x;                   
            this.y = y;
            this.frame = ITEM_START_FRAME + rand(2);
//            this.opacity = rand(70) / 70;
            this.image = game.assets['./img/icon0.png'];
            this.scale(SPRITE_SCALE, SPRITE_SCALE);

            this.on('enterframe', function() {
                this.rotate(rand(10));
                 // within(中心点で判定)
//                if (this.within(mysprite, 10)) {
                if (this.intersect(mysprite)) {
                    scene.removeChild(this);
                    _getItemNum += 1;
                    if (_playerMode == 0 ) {
                        wait = this.frame - ITEM_START_FRAME + 1;
                        _score += 1 * wait;
                    } else {
                        _score += 3;    // パワーアップ中は、3pt
                    }

                    if (_getItemNum == ITEM_NUN ) {   // クリア条件に達した
                        _stage += 1; // 次のステージへ 
                        _clearFlg = 1;
                        if (_stage > STAGE_NUM) {
                            clear_scene = new AllClearScene();
                            game.pushScene(clear_scene); //全クリア画面に遷移
                        } else {
                            _playerMode = 0;
                            _powerupCounter = 0;
                            _frameCounter = 0;                   
                            clear_scene = new ClearScene();
                            game.pushScene(clear_scene); //クリア画面に遷移
                        }
                    }
                }
            });
            scene.addChild(this);
       }
    });

    // パワーアップアイテムクラス
    PowerUpItem = Class.create(Sprite, {
       initialize: function(scene, mysprite, x, y, type) {
//            Sprite.call(this,16,16);
            Sprite.call(this,16,16);
/*
            game.bgm = Sound.load('./sound/powerup.mp3');
            game.bgm.volume = 0.5;
            game.bgm.play();
*/
            this.x = x;                   
            this.y = y;
//            this.frame = POWERUP_ITEM_START_FRAME + rand(1);
            if (type == 1) {
                this.frame = SIZEUP_ITEM_START_FRAME;                
            } else if (type == 2) {
                this.frame = POWERUP_ITEM_START_FRAME;
            }
//            this.opacity = rand(100) / 100;
            this.image = game.assets['./img/icon0.png'];
            this.scale(SPRITE_SCALE, SPRITE_SCALE);
            var power_up_type = type;

            this.on('enterframe', function() {
                this.rotate(rand(10));
                if (this.intersect(mysprite)) {
                    scene.removeChild(this);
                    if (_playerMode == 0 ) {
                        _playerMode = power_up_type;
                        _frameCounter = 0;                   
                        _powerupCounter = POWERUP_COUNTER;
                        if (_playerMode == 2) {
                            mysprite.scale(SPRITE_SCALE*2,SPRITE_SCALE*2);
                        }
                    } 
                }
            });
            scene.addChild(this);
       }
    });

    var scale_h = window.innerHeight/GAME_SIZE_Y;
    var scale_w = window.innerWidth/GAME_SIZE_X;
    //
    if (scale_h >= scale_w){
        game.scale = scale_w;
    }
    else{
        game.scale = scale_h;
    }

    game.start(); // ゲームをスタートさせます
};

function rand(n) {
     return Math.floor(Math.random() * (n+1));
}

function rand_range(min,max) {
     return Math.floor(Math.random() * (max-min+1) + min);
}

function judgment_title() {
    if ((0 <= _score ) && (_score <= 50)) {
        return '           まだまだ';
    } else if ((51 <= _score ) && (_score <= 100)) {
        return '           がんばれ';
    } else if ((101 <= _score ) && (_score <= 150)) {
        return '             おしい';
    } else if ((151 <= _score ) && (_score <= 200)) {
        return '      やめちゃだめだ';
    } else if ((201 <= _score ) && (_score <= 250)) {
        return '    きみは、ひーろー';
    } else if ((251 <= _score ) && (_score <= 300)) {
        return '    きみは、ゆうしゃ';
    } else {
        return 'きみが、ちゃんぴおん';
    }
}

function get_obj_xpos(obj) {
    return game.width / 2 - (obj.width / 2);
}

function get_label_x_center(label_obj) {
    max_label=30;
    len = label_obj.text.length;
    max_label - len

    return game.width / 2 - (sprite_obj.width / 2);
}