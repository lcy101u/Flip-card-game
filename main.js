const Symbols = [
  'https://image.flaticon.com/icons/svg/105/105223.svg', // 黑桃
  'https://image.flaticon.com/icons/svg/105/105220.svg', // 愛心
  'https://image.flaticon.com/icons/svg/105/105212.svg', // 方塊
  'https://image.flaticon.com/icons/svg/105/105219.svg' // 梅花
]
const view = {
  //getCardElement - 負責生成卡片內容，包括花色和數字
  getCardElement(index) {
    const number = this.transformNumber((index % 13) + 1)
    const symbol = Symbols[Math.floor(index / 13)]
    return `
      <div class="card">
        <p>${number}</p>
        <img src="${symbol}" alt="" />
        <p>${number}</p>
      </div>
    `
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
  displayCards() { //原本的寫法: displayCards: function displayCards() {...} => displayCards() {...}
    const rootElement = document.querySelector('#cards')
    rootElement.innerHTML = this.getCardElement(12)
  }
}
view.displayCards()