const GAME_STATE = {
  FirstCardAwaits: "FirstCardAwaits",
  SecondCardAwaits: "SecondCardAwaits",
  CardsMatchFailed: "CardsMatchFailed",
  CardsMatched: "CardsMatched",
  GameFinished: "GameFinished",
}
const Symbols = [
  'https://image.flaticon.com/icons/svg/105/105223.svg', // 黑桃
  'https://image.flaticon.com/icons/svg/105/105220.svg', // 愛心
  'https://image.flaticon.com/icons/svg/105/105212.svg', // 方塊
  'https://image.flaticon.com/icons/svg/105/105219.svg' // 梅花
]
const view = {
  //getCardElement - 負責生成卡片內容，包括花色和數字
  getCardElement(index) {
    return `<div data-index="${index}" class="card back"></div>`
  },
   getCardContent(index) {
    const number = this.transformNumber((index % 13) + 1)
    const symbol = Symbols[Math.floor(index / 13)]
    return `
      <p>${number}</p>
        <img src="${symbol}" alt="" />
      <p>${number}</p>
    `
  },
  flipCards(...cards) {
    cards.map(card => {
      if(card.classList.contains('back')) {
        card.classList.remove('back')
        card.innerHTML = this.getCardContent(Number(card.dataset.index))
        return 
      } 
      card.classList.add('back')
      card.innerHTML = null
    })
  },
  transformNumber (number) {
    switch (number) {
      case 1:
        return 'A'
      case 11:
        return 'J'
      case 12:
        return 'Q'
      case 13:
        return 'K'
      default:
        return number
    }
  },
  //displayCards - 負責選出 #cards 並抽換內容
  displayCards(indexes) { //原本的寫法: displayCards: function displayCards() {...} => displayCards() {...}
    const rootElement = document.querySelector('#cards')
    rootElement.innerHTML = indexes.map(index => this.getCardElement(index)).join('')
  },
  pairCards(...cards) {
    cards.map(card => {
      card.classList.add('paired')
    })
    
  },
  renderScore(score) {
     document.querySelector(".score").innerHTML = `Score: ${score}`;
  },
  renderTriedTimes(times) {
     document.querySelector(".tried").innerHTML = `You've tried: ${times} times`;
  },
  appendWrongAnimation(...cards) {
    cards.map(card => {
      card.classList.add('wrong')
      card.addEventListener('animationend', event => {
        event.target.classList.remove('wrong'),
        {once: true} //是要求在事件執行一次之後，就要卸載這個監聽器。因為同一張卡片可能會被點錯好幾次，每一次都需要動態地掛上一個新的監聽器，並且用完就要卸載。
      })
    })
  },
  showGameFinished () {
    const div = document.createElement('div')
    div.classList.add('completed')
    div.innerHTML = `
      <p>Complete!</p>
      <p>Score: ${model.score}</p>
      <p>You've tried: ${model.triedTimes} times</p>
    `
    const header = document.querySelector('#header')
    header.before(div)
  }
}
//utility 概念像是外掛函式庫
const utility = {
  getRandomNumberArray(count) {
    const number = Array.from(Array(count).keys())
    for(let index = number.length-1; index > 0; index --) {
      let randomIndex = Math.floor(Math.random()*(index-1))
      ; //Math.floor() 這個函式庫，如果沒有加上分號，會和後面的 [] 連起來，被解讀成 Math.floor()[]，雖然沒有實際的意義，但因為瀏覽器對 JavaScript 的語法解析很寬鬆，這裡會發生錯誤，所以需要加上分號變成 Math.floor();[] 來把執行語句隔開。
      [number[index], number[randomIndex]] = [number[randomIndex], number[index]]
    }
    return number
  }
}
const model = {
  revealedCards: [], //被翻開的卡片
  isRevealedCardsMatched() {
    return this.revealedCards[0].dataset.index % 13 === this.revealedCards[1].dataset.index % 13 
  },
  score: 0,
  triedTimes: 0
}
const controller = {
  currentState: GAME_STATE.FirstCardAwaits,
  generateCards() {
    view.displayCards(utility.getRandomNumberArray(52))
  },
  dispatechCardAction(card) {
    if(!card.classList.contains('back'))  {return}
    switch(this.currentState) {
      case GAME_STATE.FirstCardAwaits: 
        view.flipCards(card)
        model.revealedCards.push(card)
        this.currentState = GAME_STATE.SecondCardAwaits
        break
      case GAME_STATE.SecondCardAwaits: 
        view.renderTriedTimes(++model.triedTimes)
        view.flipCards(card)
        model.revealedCards.push(card)
        if(model.isRevealedCardsMatched()) {
          view.renderScore(model.score+=10)
          this.currentState = GAME_STATE.CardsMatched
          view.pairCards(...model.revealedCards)
          model.revealedCards = []
           if (model.score === 260) {
            console.log('showGameFinished')
            this.currentState = GAME_STATE.GameFinished
            view.showGameFinished()  // 加在這裡
            return
          }
          this.currentState = GAME_STATE.FirstCardAwaits
        } else {
          //配對失敗
          view.appendWrongAnimation(...model.revealedCards)
          this.currentState = GAME_STATE.CardsMatchFailed
          setTimeout(this.resetCards, 1000)
        }
        break
    }
    console.log('this.currentState: ', this.currentState)
    console.log('revealedCards: ', model.revealedCards.map(card => card.dataset.index))
  },
  resetCards() {
    view.flipCards(...model.revealedCards)
    model.revealedCards = []
    controller.currentState = GAME_STATE.FirstCardAwaits
  }
}
controller.generateCards()
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', event => {
    controller.dispatechCardAction(card)
  })
})