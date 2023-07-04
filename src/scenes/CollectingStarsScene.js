import Phaser from 'phaser'

export default class CollectingStartsScene extends Phaser.Scene
{
	constructor()
	{
		super('collecting-stars-scene')
	}

    init()
    {
        this.platforms= undefined
        this.player = undefined
        this.stars= undefined
        this.cursor = undefined
        this.scoreText = undefined
        this.score = 0
        this.bombs = undefined
    }

	preload()
    {
        this.load.image('ground', 'images/platform.png')
        this.load.image('star', 'images/star.png')
        this.load.image('sky', 'images/sky.png')
        this.load.image('bomb', 'images/bomb.png')
        this.load.spritesheet('dude', 'images/dude.png', {frameWidth:32, frameHeight:48})
    }

    // startDrag(pointer,targets){
    //     this.input.off('pointerdown',this.startDrag,this)
    //     this.dragObj=targets[0];
    //     this.input.on('pointermove',this.doDrag,this)
    //     this.input.on('pointerup',this.stopDrag,this)
    // }

    // doDrag(pointer){
    //     this.dragObj.x=pointer.x;
    //     this.dragObj.y=pointer.y;
    // }

    // stopDrag(){
    //     this.input.on('pointerdown',this.startDrag,this)
    //     this.input.off('pointermove',this.doDrag,this)
    //     this.input.off('pointerup',this.stopDrag,this) 
    //     this.player.x=this.dragObj.x;
    //     this.player.y=this.dragObj.y;       
    // }

    create()
    {
        this.add.image(400,300,'sky')
        this.platforms=this.physics.add.staticGroup()
        this.platforms.create(600,400,'ground')
        this.platforms.create(600,100,'ground')
        this.platforms.create(5,150,'ground')
        this.platforms.create(75,300,'ground')
        //this.platforms.create(750,220,'ground')
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        this.player=this.physics.add.sprite(50,510,'dude')
        this.player.setCollideWorldBounds(true) 
        this.physics.add.collider(this.player,this.platforms)

        // var play=this.add.sprite(50,510,'dude')
        // play.setInteractive();
        // this.input.on('pointerdown',this.startDrag,this)

        this.stars = this.physics.add.group({
            key: 'star',
            repeat:10,
            setXY: {x:50, y:0, stepX:70} 
            });
        this.physics.add.collider(this.stars, this.platforms)

        this.bombs = this.physics.add.group({
            key: 'bomb',
            repeat:5,
            setXY: {x:30, y:0, stepX:120} 
            });
        this.physics.add.collider(this.bombs, this.platforms)

        this.stars.children.iterate(function (child){
            // @ts-ignore
             child.setBounceY(0.5);
             });

        this.cursor=this.input.keyboard.createCursorKeys()

        this.anims.create({
            key:'left', 
            frames :this.anims.generateFrameNumbers
            ('dude',{start:0, end:3}),
            frameRate:10,
            repeat:-1
           });

        //animation idle
        this.anims.create({
            key:'turn',
            frames: [ { key: 'dude', frame: 4 } ], 
            frameRate: 20
        });

        //animation to the right
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', 
            { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.physics.add.overlap(
            this.player,
            this.stars,
            this.collectStar,
            null,
            this
        )

        this.physics.add.overlap(
            this.player,
            this.bombs,
            this.gameOver,
            null,
            this
        )

        this.scoreText= this.add.text(16,16,'Score : 0',{
            fontSize: '32px', color:'yellow'
             });
    }

    update()
    {
        if (this.cursor.left.isDown){
            this.player.setVelocity(-200, 0)
            this.player.anims.play('left',true)
        }
        else if(this.cursor.right.isDown){
            this.player.setVelocity(200, 0)
            this.player.anims.play('right',true)
        }
        else if (this.cursor.up.isDown){
            this.player.setVelocity(0, -200)
            this.player.anims.play('turn')
        }
        else if (this.cursor.down.isDown){
            this.player.setVelocity(0, 200)
            this.player.anims.play('turn')
        }
        else{
            this.player.setVelocity(0,50)
            this.player.anims.play('turn')
        }

        if(this.score >= 100){
            this.physics.pause()
            this.add.text(300,300,'You Win!!!', { 
            fontSize: '48px', 
             color:'yellow'
        })}
    }

    collectStar(player, star){
        star.destroy()
        this.score += 10;
        this.scoreText.setText('Score : '+this.score );
    }

    gameOver(player, bomb){
        this.physics.pause()
        this.add.text(300,300,'Game Over!!!', { 
         fontSize: '48px', color:'yellow' })
    }    
}