class Chat {
  constructor(name, old, good) {
    this.name = name
    this.old = old
    this.good = good
  }
}

class UI {
  static displayChats() {
    const chats = Store.getChats()
    chats.forEach((chat) => UI.addChatToList(chat))
  }

  static addChatToList(chat) {
    const list = document.getElementById('chat-list')
    const row = document.createElement('tr')
    row.innerHTML = `
      <td>${chat.name}</td>
      <td>${chat.old}</td>
      <td>${chat.good}</td>
      <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
    `
    list.appendChild(row)
  }

  static deleteChat(target) {
    target.parentElement.parentElement.remove()
  }

  static showAlert(message, className) {
    const div = document.createElement('div')
    div.className = `alert alert-${className}`
    div.appendChild(document.createTextNode(message))
    const container = document.querySelector('.container')
    const form = document.querySelector('#chat-form')
    container.insertBefore(div, form)
    setTimeout(() => document.querySelector('.alert').remove(), 2000)
  }

  static clearFields() {
    document.querySelector('#name').value = ''
    document.querySelector('#old').value = ''
    document.querySelector('#good').value = ''
  }
}

document.addEventListener('DOMContentLoaded', UI.displayChats)

document.querySelector('#chat-form').addEventListener('submit', (e) => {
  e.preventDefault()

  const name = document.querySelector('#name').value
  const old = document.querySelector('#old').value
  const good = document.querySelector('#good').value

  if (name === '' || old === '' || good === '') {
    UI.showAlert('모든 필드를 입력해 주세요', 'danger')
  } else {
    const chat = new Chat(name, old, good)

    UI.addChatToList(chat)

    Store.addChat(chat)

    UI.showAlert('응원 한마디가 저장되었습니다', 'success')

    setTimeout(() => {
      UI.clearFields()
    }, 0)
  }
})

document.querySelector('#chat-list').addEventListener('click', (e) => {
  if (e.target.classList.contains('delete')) {
    UI.deleteChat(e.target)

    const good = e.target.parentElement.previousElementSibling.textContent
    Store.removeChat(good)

    UI.showAlert('응원 한마디를 삭제했습니다', 'info')
  }
})

class Store {
  static getChats() {
    let chats
    if (localStorage.getItem('chats') === null) {
      chats = []
    } else {
      chats = JSON.parse(localStorage.getItem('chats'))
    }
    return chats
  }

  static addChat(chat) {
    const chats = Store.getChats()
    chats.push(chat)
    localStorage.setItem('chats', JSON.stringify(chats))
  }

  static removeChat(good) {
    const chats = Store.getChats()

    chats.forEach((chat, index) => {
      if (chat.good === good) {
        chats.splice(index, 1)
      }
    })

    localStorage.setItem('chats', JSON.stringify(chats))
  }
}
