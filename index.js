import express from 'express'
const app = express()
const port = 3000

app.get('/', (req, res) => {
    let number_of_players = req.query.number_of_players
    let number_of_dice = req.query.number_of_dice
    console.log(`========================== START GAME ==========================`)
    if(number_of_players != undefined && number_of_dice != undefined){
        console.log(`number_of_players : ` + number_of_players)
        console.log(`number_of_dice : ` + number_of_players)
        let debugObject = new DiceGame(number_of_players, number_of_dice)
        console.log(`========================== END GAME ==========================`)
        res.send(debugObject.start())
    }else{
        let debugObject = new DiceGame(3, 4)
        console.log(`========================== END GAME ==========================`)
        res.send(debugObject.start())
    }
})

class DiceGame  {
    constructor (number_of_players, number_of_dice){
        this.number_of_players = number_of_players
        this.number_of_dice = number_of_dice
        this.scoring_system = []
        this.recorded_session = [];
        this.collection = []
    }

    debugger(){
        return {
            number_of_players : this.number_of_players,
            number_of_dice : this.number_of_dice
        }
    }

    initial_round(number_of_players, number_of_dice){
        let scoring_system = []
        for(let i = 0 ; i < number_of_players; i ++){
            // scoring system will record the player number, dice number, score
            scoring_system.push([i, number_of_dice, 0]) 
        }
        return scoring_system
    }

    start (){
        this.scoring_system = this.initial_round(this.number_of_players, this.number_of_dice)
        this.play()
        this.collection.push({
            final_score: this.scoring_system
        })
        console.log(`===============================`)
        console.log(`Results : `)
        let temp_highest = 0
        let temp_winner = 0
        for(let i = 0; i < this.scoring_system.length; i ++){
            if(temp_highest < this.scoring_system[i][2]){
                temp_highest = this.scoring_system[i][2]
                temp_winner = i
            }
        }
        console.log(`Winner is Player ${(temp_winner+1)} with score of ${temp_highest}`)
        this.collection.push({
            final_result: `Winner is Player ${(temp_winner+1)} with score of ${temp_highest}`
        })
        return this.collection
    }

    play(){
        console.log(`===============================`)
        this.collection.push({
            divider: `===============================`
        })
        this.recorded_session = []
        // players
        for(let i = 0; i < this.scoring_system.length; i ++){
            // dices
            let turn_result = this.player_play(this.scoring_system[i][1])
            this.recorded_session.push(turn_result)
        }
        console.log(`This round, dice shake results :`)
        for(let i = 0; i < this.recorded_session.length; i ++){
            console.log({
                player: i,
                roll_result: this.recorded_session[i].roll_result
            })
        }
        this.collection.push({
            round: this.recorded_session
        })
        for(let i = 0; i < this.recorded_session.length; i ++){
            this.dice_elimination(i, this.recorded_session[i])
        }
        console.log(`This round, score results : `)
        for(let i = 0; i < this.scoring_system.length; i ++){
            console.log({
                dice_owned_remaining: this.scoring_system[i][1],
                point_owned: this.scoring_system[i][2]
            })
        }
        
        let dice_checker = 0
        for(let i = 0; i < this.scoring_system.length; i ++){
            if(this.scoring_system[i][1] === 0){
                dice_checker++;
            }
        }
        if(dice_checker + 1 === this.scoring_system.length){

        }else{
            this.play()
        }
    }

    dice_elimination(player_number, roll_result){
        if(roll_result.roll_result != undefined){
            let player_number_copy = player_number
            for(let i = 0; i < roll_result.roll_result.length; i ++){
                if(roll_result.roll_result[i] === 6){
                    this.scoring_system[player_number_copy][1] -- // number of dice deducted
                    this.scoring_system[player_number_copy][2] ++ // number of score added by 1
                }
                if(roll_result.roll_result[i] === 1){
                    this.scoring_system[player_number_copy][1] -- // number of dice deducted
                    let player_to_the_side = player_number_copy + 1
                    this.score_reduction_and_dice_addition(player_to_the_side)
                }
                player_number_copy = player_number
            }
        }
    }

    score_reduction_and_dice_addition(player_number_copy){
        let player_to_the_side = player_number_copy
        if(player_to_the_side >= this.scoring_system.length){
            player_to_the_side = 0
        }
        if(this.scoring_system[player_to_the_side][1] > 0){
            this.scoring_system[player_to_the_side][1] ++ // player to the side takes the dice
        }else{
            player_to_the_side = player_to_the_side + 1
            if(player_to_the_side >= this.scoring_system.length){
                player_to_the_side = 0
            }
            this.score_reduction_and_dice_addition(player_to_the_side)
        }
    }

    player_play(number_of_dice){
        let roll_result = {}
        if(number_of_dice > 0){
            for(let i = 0; i < number_of_dice; i ++){
                roll_result = {
                    roll_result : this.rollDice(number_of_dice)
                }
            }
            return roll_result
        }else{
            return roll_result
        }
    }

    rollDice(given_number_of_dice){
        let result_of_rolls = []
        for(let i = 0; i < given_number_of_dice; i ++){
            let random_dice_number = Math.floor((Math.random() * 6) + 1)
            result_of_rolls.push(random_dice_number)
        }
        return result_of_rolls
    }
}

app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})