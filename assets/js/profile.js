firebase.initialize({
    projectName: 'GameHub'
});
//alert(codec.decode(codec.encode('hi')))
const usernameDisplay = document.querySelector('#username');
const userId = localStorage.getItem('userId');
const accountsDB = firebase.database().ref('accounts');
accountsDB.on('value', function(data) {
    if (data[userId - 1]) {
        /*if (data[userId - 1].username === 'Mr. Sprout') {
            localStorage.clear();
            window.location.href = '/signup';
        }*/
        var pfpstyles = document.createElement("style");
        pfpstyles.innerHTML = `.profile-icon{background-image:url("${data[userId - 1].pfp}");}`
        document.head.appendChild(pfpstyles);

        if (window.location.pathname !== '/assets/pages/profile.html') {
            usernameDisplay.innerText = data[userId - 1].username;
            loaded++
        }

        if (window.location.pathname === '/assets/pages/profile.html') {
            const parentstyles = document.createElement("style");
            parentstyles.innerHTML = 'html,body {overflow: hidden;}';
            window.parent.document.head.appendChild(parentstyles);
            const pfp = document.querySelector('.pfp');
            const closeBtn = window.parent.document.querySelector('.modal-close');
            const usernameInput = document.querySelector('[data-attr="username"]');
            const idDisplay = document.querySelector('.userid');
            const loader = document.querySelector('.lds-spinner');
            const overlay = document.querySelector('.uploadIcon');
            const inputBtn = document.querySelector('.button.is-rounded.is-danger.has-right-sharp');
            pfp.style.backgroundImage = `url("${data[userId - 1].pfp}")`;
            usernameInput.value = data[userId - 1].username;
            idDisplay.innerText = '#'+userId;
            loader.classList.add('hidden');
            closeBtn.addEventListener('click', (event) => {
                window.parent.history.pushState({}, '', window.parent.location.pathname);
                window.parent.document.querySelector('.modal.is-active').remove();
                parentstyles.remove();
            });
             
            usernameInput.addEventListener('click', (event) => {
                usernameInput.value = data[userId-1].username;
                
                document.querySelector('.usernameForm').classList.remove('hidden');
                edit.classList.add('hidden');
                username.classList.add('hidden');
                idDisplay.classList.add('hidden');
                
                usernameInput.focus();
            });
            
            document.querySelector('.usernameForm').addEventListener('submit', (event) => {
                event.preventDefault();
                if (inputBtn.dataset.val === '1') {
                    let tempDB = data;
                    if (usernameInput) {
                        let usernames = [];
                        
                        for (let i = 0; i < data.length; i++) {
                            usernames.push(data[i].username)
                        }
                        
                        if (usernameInput.value == data[userId-1].username) {
                            alert('This is already your username')
                        } else {
                            if (usernames.includes(usernameInput.value) === false) {
                                tempDB[userId-1].username = usernameInput.value;
                                //accountsDB.set(tempDB)
                            } else {
                                alert('This username is already taken.');
                                usernameInput.value = data[userId-1].username;
                            }
                        }
                    } else {
                        alert('Please enter a username');
                    }
                } else if (inputBtn.dataset.val === '0') {
                    inputBtn.innerText = 'Done';
                    inputBtn.dataset.val = '1';
                    usernameInput.readOnly = false;
                    usernameInput.focus();
                }
            });
            
            pfp.addEventListener('mouseover', (event) => {
                overlay.classList.remove('hidden');
            });
            
            pfp.addEventListener('mouseout', (event) => {
                overlay.classList.add('hidden');
            });
            
            pfp.addEventListener('click', (event) => {
                let tempDB = data;
                document.querySelector('.main.profile').classList.add('hidden');
                var frame = document.createElement('iframe');
                frame.src = '/assets/pages/cropper.html';
                frame.classList = 'frame_500x500';
                frame.scrolling = 'no';
                document.body.appendChild(frame);
                
                window.onmessage = (e) => {
                    if (e.data) {
                        tempDB[userId-1].pfp = e.data;
                        accountsDB.set(tempDB)
                        setTimeout(() => {
                            window.parent.location.reload();
                        }, 2000);
                    } else {
                        alert('???')
                    }
                }
            });
        }
    } else {
        localStorage.setItem('isLogin', false);
        if (!window.location.href === '/signup') {
            window.location.href = '/signup';
        }
    }
});