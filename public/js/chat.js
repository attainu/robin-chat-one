const socket = io()

// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $shareFileButton = document.querySelector('#share-file')
const $messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const oldMessageTemplate = document.querySelector('#old-message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const fileShareTemplate = document.querySelector('#file-share-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('old-message', (info) => {
    const n = info.length
    const chatList = []
    if(n >= 10) {
        for (let i = n - 1; i > n - 10; i--) {
            chatList.push({
                username: info[i].username,
                text: info[i].text,
                url: info[i].url,
                createdAt: moment(info[i].createdAt).format('h:mm a')
            })
        }
        chatList.reverse()
        const html = Mustache.render(oldMessageTemplate, { chatList: chatList, n: 10 })
        $messages.insertAdjacentHTML('afterbegin', html)
    } else {
        for (let chat of info) {
            chatList.push({
                username: chat.username,
                text: chat.text,
                url: chat.url,
                createdAt: moment(chat.createdAt).format('h:mm a')
            })
        }
        const html = Mustache.render(oldMessageTemplate, { chatList: chatList, n: n })
        $messages.insertAdjacentHTML('afterbegin', html)
    }
})

socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('locationMessage', (message) => {
    console.log(message)
    const html = Mustache.render(locationMessageTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('fileShareMessage', (message) => {
    console.log(message)
    const html = Mustache.render(fileShareTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if (error) {
            alert(error.error);
            location.href = '/users/login'
            return console.log(error)
        }

        console.log('Message delivered!')
    })
})

$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }

    $sendLocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, (error) => {
            if(error) {
                alert(error.error);
                location.href = '/users/login'
                console.log(error);
            }
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location shared!')  
        })
    })
})

const siofu = new SocketIOFileUpload(socket)
document.getElementById("share-file").addEventListener('click', siofu.prompt, false)

siofu.addEventListener("complete", (event) => {
    socket.emit('shareFile', event.success, (error) => {
        if(error) {
            alert(error.error);
            location.href = '/users/login'
            console.log(error);
        }
    })
})


socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/users/rooms'
    }
})