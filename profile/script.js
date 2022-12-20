


/////////////initializing;

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.2/firebase-app.js";

import {getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signOut, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider} from "https://www.gstatic.com/firebasejs/9.9.2/firebase-auth.js"

import { getFirestore, onSnapshot,
	collection, doc, getDocs, getDoc,
	addDoc, deleteDoc, setDoc,
	query, where, orderBy, serverTimestamp,
	updateDoc, arrayUnion, arrayRemove} from "https://www.gstatic.com/firebasejs/9.9.2/firebase-firestore.js";

// firebase storage; 
import {getStorage, ref, uploadBytes, getDownloadURL, listAll, list, deleteObject} from 'https://www.gstatic.com/firebasejs/9.9.2/firebase-storage.js'


const bygreenConfig = {
    apiKey: "AIzaSyDqK1z4fd7lO9g2ISbf-NNROMd7xpxcahc",
    authDomain: "bygreen-453c9.firebaseapp.com",
    projectId: "bygreen-453c9",
    storageBucket: "bygreen-453c9.appspot.com",
    messagingSenderId: "19954598250",
    appId: "1:19954598250:web:ba57c792bdf65dbc18a513",
    measurementId: "G-265TN8HGKX"
};

const bygreen = initializeApp(bygreenConfig, 'bygreen');
const bygreenDb = getFirestore(bygreen)
const bygreenAuth = getAuth(bygreen)
const bygreenStorage = getStorage(bygreen)

/////////auth state 
let dbUser ////firestore account 
let authUser ///auth account
let type
let accountsList = []

///////register 
document.querySelector('#registerBtn').addEventListener('click', (ev)=>{
    // check if valid data

    // send 
    if(ev.target.parentElement.querySelector(".em").value.length > 0 &&ev.target.parentElement.querySelector(".em").value.length < 20 && ev.target.parentElement.querySelector(".pw").value.length > 0){

        console.log('make account')
        createUserWithEmailAndPassword(bygreenAuth, ev.target.parentElement.querySelector(".em").value, ev.target.parentElement.querySelector(".pw").value).then(cred=>{
            console.log(cred)
        }).catch(err=>{
            console.log(err.message)
            document.querySelector('#errors').textContent = err.message
            document.querySelector('#errors').style.display = 'block'
            setTimeout(() => {
                document.querySelector('#errors').style.display = 'none'
            }, 10000);
        })
    }else{

    }
    // empty 
    document.querySelector('#registerUsername').value = ''
    document.querySelector('#registerPassword').value = ''
})

//////signin
document.querySelector('#signinBtn').addEventListener('click', (ev)=>{
    console.log('to sign in')
    console.log(ev.target.parentElement)
    // console.log('click signin', document.querySelector('#signinUsername').value.length)
    // console.log(document.querySelector('#signinUsername').value.length >0)

    // send 
    // if(document.querySelector('#signinUsername').value.length > 0 && document.querySelector('#signinPassword').value.length > 0){
        console.log('make account')
        signInWithEmailAndPassword(bygreenAuth, ev.target.parentElement.querySelector(".em").value ,ev.target.parentElement.querySelector(".pw").value)
    // }else{

    // }
    // empty 
    ev.target.parentElement.querySelector(".em").value = ''
    ev.target.parentElement.querySelector(".pw").value = ''
})

//////signout 
document.querySelector('#signoutBtn').addEventListener('click', ()=>{
    signOut(bygreenAuth, (result)=>{console.log(result)})
})
document.querySelector('#halfLoggedSignoutBtn').addEventListener('click', ()=>{
    signOut(bygreenAuth, (result)=>{console.log(result)})
})

// sign with google  
const provider = new GoogleAuthProvider()
document.querySelector('#byGoogle').addEventListener('click', ()=>{
    signInWithPopup(bygreenAuth, provider).then((cred)=>console.log(cred))

})

//////make profile; 
document.querySelector('#makeProfileBtn').addEventListener('click', async (ev)=>{
    //////////set user in the users collection user current user uid 
    let q = query(collection(bygreenDb, 'users'), where('username', '==', ev.target.parentElement.querySelector('#username').value))
    let foundDoc = await getDocs(q)
    let found

    foundDoc.forEach(e=>{
        found = doc.data()
        console.log(doc.id, doc.data())
    })
    console.log(foundDoc, found)
    if(!found){
        console.log('no taken')

        let fileRef = ref(bygreenStorage, '/user-imgs/' + new Date().toISOString().replace(/:/g, '-') +document.querySelector("#userImg").files[0].name.replaceAll(" ","") )

            uploadBytes(fileRef, document.querySelector("#userImg").files[0]).then(res=>{
                getDownloadURL(res.ref).then(url=>{
                    console.log(url)
                    let imgUrl = url

        ///addDoc; add document to a collection; 
        setDoc(doc(bygreenDb, 'users', authUser.uid), {
            userName: ev.target.parentElement.querySelector('#username').value,
            name: ev.target.parentElement.querySelector('#name').value,
            bio: ev.target.parentElement.querySelector('#bio').value,
            img: imgUrl,
            red: [],
            green: [],
            yellow:[],
            addedRoutes: [], 
            votes: [],
            type: 'user'
        }).then(()=>{window.location.reload();}) 
        
        })
    })



        // setDoc(doc(bygreenDb, 'users', currentUser.uid), {name: ev.target.querySelector('username').value})
    }else{
        //////////make messaga section to display errors 
        console.log('username already taken')
    }

})




//////////////////ui-js; 

// di
document.querySelector("#miniProfileDi").addEventListener("click", (ev)=>{
    ev.target.classList.toggle('on')
    if(ev.target.classList.contains('on')){
        document.querySelector("#miniProfile").style.display = 'block'
    }else{
        document.querySelector("#miniProfile").style.display = 'none'
    }
})
document.querySelector('#asideDi').addEventListener('click', (ev)=>{
    ev.target.classList.toggle('on')
    ev.target.classList.contains('on')?document.querySelector('aside').style.display = 'flex':document.querySelector('aside').style.display = 'none'
})
document.querySelector("#editSectionDi").addEventListener("click", (ev)=>{
    ev.target.classList.toggle("on")
    ev.target.classList.contains('on')?document.querySelector("#editSection").style.display = 'flex':document.querySelector("#editSection").style.display = 'none'
})



/////////////ui-js-data; 
// ranking sorting; 
totalSorting.addEventListener('click', (ev)=>{
    ev.target.classList.toggle('on')
    ev.target.classList.contains('on')?ranking('total', 'ac'):ranking('total', 'de')
})
publiclineSorting.addEventListener('click', (ev)=>{
    ev.target.classList.toggle('on')
    ev.target.classList.contains('on')?ranking('publicline', 'ac'):ranking('publicline', 'de')
})
bygreenSorting.addEventListener('click', (ev)=>{
    ev.target.classList.toggle('on')
    ev.target.classList.contains('on')?ranking('bygreen', 'ac'):ranking('bygreen', 'de')
})



/////////////////////getting; 

let profile
let profileAccount

    await onAuthStateChanged(bygreenAuth, async (user)=>{
    console.log('onauthstate; ', user)

    if(user){
        console.log('from auth ', user)
        authUser = user
        user.getIdTokenResult().then(idTokenResult => {
            console.log('claims', idTokenResult.claims)
            type = idTokenResult.claims
            // if team 
            if (idTokenResult.claims.team){
                document.querySelectorAll('.teamEle').forEach(teamEle=>{
                    teamEle.style.display = 'inline-block'
                })
                // document.querySelector('.addYellow').style.display = 'block'
            }

        })

        let dbUserDoc = await getDoc(doc(bygreenDb, 'users', user.uid))
        dbUser = dbUserDoc.data()



        if(dbUser){
        dbUser.id = dbUserDoc.id


        // mini profile
            ////registered
            document.querySelectorAll('.logged').forEach(e=>{e.style.display = 'block'})
            document.querySelectorAll('.halfLogged').forEach(e=>e.style.display = 'none')
            document.querySelectorAll('.notLogged').forEach(e=>e.style.display = 'none')

            // di
            document.querySelector('#currentAccountImgDi').style.backgroundImage = `url('${dbUser.img}')`
            document.querySelector("#currentAccountUsernameDi").textContent = '@'+ dbUser.userName

            // mini
            document.querySelector('#currentAccountImgMini').style.backgroundImage = `url('${dbUser.img}')`
            document.querySelector("#currentAccountUsernameMini").textContent = '@'+ dbUser.userName
            document.querySelector("#currentAccountName").textContent = dbUser.name
            document.querySelector("#currentAccountBio").textContent = dbUser.bio
            document.querySelector("#currentAccountLink").href = `https://kadum2.github.io/ivc/profile/${dbUser.userName}`

        }else{
            /////half registered; make profile
            document.querySelectorAll('.logged').forEach(e=>e.style.display = 'none')
            document.querySelectorAll('.halfLogged').forEach(e=>e.style.display = 'block')
            document.querySelectorAll('.notLogged').forEach(e=>e.style.display = 'none')
        }
        
    }else{
        /////not registered
        document.querySelectorAll('.logged').forEach(e=>e.style.display = 'none')
        document.querySelectorAll('.halfLogged').forEach(e=>e.style.display = 'none')
        document.querySelectorAll('.notlogged').forEach(e=>e.style.display = 'block')
        dbUser = 'none'
    }

    getDocs(collection(bygreenDb, 'users')).then((data)=>{
        let docs = []
            data.docs.forEach(doc=>{
                docs.push({...doc.data(), id: doc.id})
            })
            accountsList = docs
            console.log(docs)
            document.querySelector('#accountsCounter').textContent = accountsList.length
            ranking('total', 'de')

        //check the url and get the username to make profile 
        profile = window.location.href.split('/')[window.location.href.split('/').length-2]

        // profile = 'kdm'
        profileAccount = accountsList.filter(account=>account.userName == profile)[0]


        console.log('profile name ...', profile, profileAccount, accountsList)

            // if owner; 
        if(dbUser.userName== profile){
            document.querySelectorAll('.owner').forEach(ownerEle=>{ownerEle.style.display = 'block'})
        }


        console.log(profileAccount)
    
        // profile main info
        document.querySelector('#profileImg').style.backgroundImage = `url('${profileAccount.img}')` 
        // document.querySelector('#profileImg').setAttribute('src', profileAccount.img) 

        document.querySelector('#profileUsername').textContent = profileAccount.userName
        document.querySelector('#profileName').textContent = profileAccount.name
        document.querySelector('#profileBio').textContent = profileAccount.bio
        
        // profile sm 

        profileAccount.sm.instagram?document.querySelector('#profileInstagram').setAttribute('href', profileAccount.sm.instagram):null
        profileAccount.sm.instagram?document.querySelector('#profileInstagram').querySelector('img').style.filter = 'grayscale(0%)' :null

        profileAccount.sm.telegram?document.querySelector('#profileTelegram').setAttribute('href', profileAccount.sm.telegram):null
        profileAccount.sm.telegram?document.querySelector('#profileTelegram').querySelector('img').style.filter = 'grayscale(0%)' :null


        //////projects statics 
        // publicline
        document.querySelector('#profileAddedRoutesCounter').textContent = profileAccount.addedRoutes.length
        document.querySelector('#profileVotedCounter').textContent = profileAccount.votes.length

        // bygreen
        document.querySelector('#profileAddedGreenCounter').textContent = profileAccount.green.length
        document.querySelector('#profileAddedRedCounter').textContent = profileAccount.red.length
        document.querySelector('#profileYellowCounter').textContent = profileAccount.yellow.length


        })

    getDocs(collection(bygreenDb, 'pins')).then((data)=>{
                let docs = []
                    data.docs.forEach(doc=>{
                        docs.push({...doc.data(), id: doc.id})
                    })

                    let red = 0
                    let green = 0
                    let yellow = 0
                    let redToGreen = 0

                    docs.forEach(generalPin=>{
                        generalPin.afterImgs?red++:green++
                        generalPin.next?yellow++:null
                        generalPin.redToGreen?redToGreen++:null
                    })

                    document.querySelector('#redCounter').textContent = red
                    document.querySelector('#greenCounter').textContent = green
                    document.querySelector('#yellowCounter').textContent = yellow
                    // document.querySelector('#redToGreenCounter').textContent = green
        })
    
    getDocs(collection(bygreenDb, 'shop')).then((data)=>{
            let docs = []
                data.docs.forEach(doc=>{
                    docs.push({...doc.data(), id: doc.id})
                })
                // console.log(docs[0].upvotes.length + docs[0].downvotes)
                document.querySelector('#shopsCounter').textContent = docs.length
        })

    getDocs(collection(bygreenDb, 'routes')).then((data)=>{
                let docs = []
                    data.docs.forEach(doc=>{
                        docs.push({...doc.data(), id: doc.id})
                    })
                    console.log(docs[0].upvotes.length + docs[0].downvotes)
                    document.querySelector('#routesCounter').textContent = docs.length
                    let votes = 0
                    docs.forEach(route=> votes += (route.upvotes.length + route.downvotes.length))
                    // document.querySelector('#votesCounter').textContent = docs.filter
                    document.querySelector('#votesCounter').innerHTML = votes
            })

    })


/////////////////sending 

// make edits; update profile
document.querySelector('#submitProfileEdit').addEventListener('click', (ev)=>{
    // check if valid 

    if(document.querySelector('#newUsername').value){
        console.log('to send new username ', dbUser.id, document.querySelector('#newUsername').value)
        // sending alarm
        document.querySelector('#greenMessage').style.display = 'block'
        document.querySelector('#greenMessage').style.textContent = 'sending ...'
        updateDoc(doc(bygreenDb, 'users', dbUser.id), {userName: document.querySelector('#newUsername').value}).then(data=>{
            document.querySelector('#greenMessage').style.textContent = 'sent'
            
            setTimeout(() => {
            document.querySelector('#greenMessage').style.display = 'none'
            }, 1000);
        })
    }
    if(document.querySelector('#newName').value){
        console.log('to send new username ', dbUser.id, document.querySelector('#newName').value)
        // sending alarm
        document.querySelector('#greenMessage').style.display = 'block'
        document.querySelector('#greenMessage').textContent = 'sending ...'
        updateDoc(doc(bygreenDb, 'users', dbUser.id), {name: document.querySelector('#newName').value}).then(data=>{

            document.querySelector('#greenMessage').style.textContent = 'sent'
            setTimeout(() => {
            document.querySelector('#greenMessage').style.display = 'none'
            }, 1000);
        })
    }
    if(document.querySelector('#newBio').value){
        console.log('to send new username ', dbUser.id, document.querySelector('#newBio').value)
        // sending alarm
        document.querySelector('#greenMessage').style.display = 'block'
        document.querySelector('#greenMessage').textContent = 'sending ...'
        updateDoc(doc(bygreenDb, 'users', dbUser.id), {bio: document.querySelector('#newBio').value}).then(data=>{
            document.querySelector('#greenMessage').style.textContent = 'sent'
            
            setTimeout(() => {
                document.querySelector('#greenMessage').style.display = 'none'
            }, 1000);
        })
    }
    if(document.querySelector('#newProfileImg').files[0]){
        console.log('to send new username ', dbUser.id, document.querySelector('#newProfileImg').files)
        // sending alarm
        document.querySelector('#greenMessage').style.display = 'block'
        document.querySelector('#greenMessage').style.textContent = 'sending ...'
        //send img then get url; 

        let fileRef = ref(bygreenStorage, '/userimgs/' + new Date().toISOString().replace(/:/g, '-') +document.querySelector("#newProfileImg").files[0].name.replaceAll(" ","") )

        uploadBytes(fileRef, document.querySelector("#newProfileImg").files[0]).then(res=>{
            getDownloadURL(res.ref).then(url=>{
                console.log(url)
                console.log('old url', dbUser.img)
                let imgUrl = url

                // delete old img
                deleteObject(ref(bygreenStorage, 'user-imgs/'+ dbUser.img)).then(data=>console.log('img deleted'))

            updateDoc(doc(bygreenDb, 'users', dbUser.id), {img: url}).then(data=>{
                document.querySelector('#greenMessage').style.textContent = 'sent'
                
                setTimeout(() => {
                document.querySelector('#greenMessage').style.display = 'none'
                }, 1000);
            })
        })



                })

    }
    if(document.querySelector('#newInstagram').value){
        console.log('to send new username ', dbUser.id, document.querySelector('#newInstagram').value)
        // sending alarm
        document.querySelector('#greenMessage').style.display = 'block'
        document.querySelector('#greenMessage').style.textContent = 'sending ...'
        updateDoc(doc(bygreenDb, 'users', dbUser.id), {'sm.instagram': document.querySelector('#newInstagram').value}).then(data=>{
            document.querySelector('#greenMessage').style.textContent = 'sent'
            
            setTimeout(() => {
            document.querySelector('#greenMessage').style.display = 'none'
            }, 1000);
        })
    }
    if(document.querySelector('#newTelegram').value){
        console.log('to send new username ', dbUser.id, document.querySelector('#newTelegram').value)
        // sending alarm
        document.querySelector('#greenMessage').style.display = 'block'
        document.querySelector('#greenMessage').style.textContent = 'sending ...'
        updateDoc(doc(bygreenDb, 'users', dbUser.id), {'sm.telegram': document.querySelector('#newTelegram').value}).then(data=>{
            document.querySelector('#greenMessage').style.textContent = 'sent'
            
            setTimeout(() => {
            document.querySelector('#greenMessage').style.display = 'none'
            }, 1000);
        })
    }
    // send
})

//////////// functions
function ranking(based, order){

        // restructure the accounts array
    //label the current account to be green 

    let intendedOrder = []
    let orderedUserElements
    let orderedteamElements

    if(based == 'total'){
        if(order == 'de'){
            // decending order 
            intendedOrder = accountsList.sort((a, b) => { return (b.green.length+b.red.length +b.addedRoutes.length + b.votes.length)-(a.green.length +a.red.length+a.addedRoutes.length + a.votes.length)}) 
        }else{
            //acending order 
            intendedOrder = accountsList.sort((a, b) => { return (a.green.length +a.red.length+a.addedRoutes.length + a.votes.length) - (b.green.length+b.red.length +b.addedRoutes.length + b.votes.length)})
        }
    }else if(based == 'publicline'){
        if(order == 'de'){
            intendedOrder = accountsList.sort((a,b)=>{return (b.addedRoutes.length + b.votes.length) - (a.addedRoutes.length + a.votes.length)})
        }else{
            intendedOrder = accountsList.sort((a,b)=>{return (a.addedRoutes.length + a.votes.length)- (b.addedRoutes.length + b.votes.length)})
        }

    }else if(based == 'bygreen'){
        if(order == 'de'){
            intendedOrder = accountsList.sort((a,b)=>{return (b.red.length + b.green.length) - (a.red.length + a.green.length)})
        }else{
            intendedOrder = accountsList.sort((a,b)=>{return (a.red.length + a.green.length)- (b.red.length + b.green.length)})
        }
    }

    // make the dom
    let currentUserName 
    dbUser?currentUserName=dbUser.userName:null

    let userCounter= 1
    orderedUserElements = `${intendedOrder.map((account, index)=>{
        if(account.type == 'user'){return`
<div class="rankedAccount" ${account.userName == currentUserName?'id="#me" style="background-color: #29D659"':''}>

        <div class="ranking point">${userCounter++}</div>
        <div href=' https://kadum2.github.io/ivc/profile/kdm//${account.userName}' class="account">
            <img class="accountImg" style="background-image: url('${account.img}');">
            <h3 class="accountUsername ranked">${account.userName}</h3>
        </div>
            

        <div class='points'>
    <div class="publiclineCounter point">${(account.addedRoutes[0]?account.addedRoutes.length:0)+(account.votes[0]?account.votes.length:0)}</div>
    <div class="bygreenCounter point">${(account.red[0]?account.red.length:0)+(account.green[0]?account.green.length:0)}</div>
    <div class="total point">${((account.addedRoutes[0]?account.addedRoutes.length:0)+(account.votes[0]?account.votes.length:0)) + ((account.red[0]?account.red.length:0)+(account.green[0]?account.green.length:0))}</div>
    </div>
        </div>
    `}
})}`


        let teamCounter = 1
    orderedteamElements = `${intendedOrder.map((account, index)=>{
        if(account.type == 'team'){return`
<div class="rankedAccount" ${account.userName == currentUserName?'style="background-color: #29D659"':''}>
        <div class="ranking point">${teamCounter++}</div>
        <div href=' https://kadum2.github.io/ivc/profile/kdm//${account.userName}' class="account">
            <img class="accountImg" style="background-image: url('${account.img}');">
            <h3 class="accountUsername ranked">${account.userName}</h3>
        </div>

        <div class='points'>
    <div class="publiclineCounter point">${(account.addedRoutes[0]?account.addedRoutes.length:0)+(account.votes[0]?account.votes.length:0)}</div>
    <div class="bygreenCounter point">${(account.red[0]?account.red.length:0)+(account.green[0]?account.green.length:0)}</div>
    <div class="total point">${((account.addedRoutes[0]?account.addedRoutes.length:0)+(account.votes[0]?account.votes.length:0)) + ((account.red[0]?account.red.length:0)+(account.green[0]?account.green.length:0))}</div>
    </div>
        </div>
    `}
        })}`

    // console.log('intended order',intendedOrder)
    document.querySelector('#usersRanking').innerHTML = orderedUserElements.replaceAll(',', '')
    document.querySelector('#teamsRanking').innerHTML = orderedteamElements.replaceAll(',', '')
}



