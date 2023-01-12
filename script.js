
/////////////initializing;

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.2/firebase-app.js";

import {getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signOut, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider} from "https://www.gstatic.com/firebasejs/9.9.2/firebase-auth.js"

import { getFirestore, onSnapshot,
	collection, doc, getDocs, getDoc,
	addDoc, deleteDoc, setDoc,
	query, where, orderBy, serverTimestamp,
	updateDoc, arrayUnion, arrayRemove} from "https://www.gstatic.com/firebasejs/9.9.2/firebase-firestore.js";

// firebase storage; 
import {getStorage, ref, uploadBytes, getDownloadURL, listAll, list} from 'https://www.gstatic.com/firebasejs/9.9.2/firebase-storage.js'
    

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
document.querySelector("#miniProfileDi").addEventListener("click", (ev)=>{
    ev.target.classList.toggle('on')
    if(ev.target.classList.contains('on')){
        document.querySelector("#miniProfile").style.display = 'block'
    }else{
        document.querySelector("#miniProfile").style.display = 'none'
    }
})

document.querySelector('#asideDi').addEventListener('click', (ev)=>{
    ev.target.classList.toggle('red')
    ev.target.classList.contains('red')?document.querySelector('aside').style.display = 'flex':document.querySelector('aside').style.display = 'none'
})

document.querySelector('#translateToEn').addEventListener('click', (ev)=>{
    ev.target.classList.toggle('red')
    if(ev.target.classList.contains('red')){
        document.querySelectorAll('.en').forEach((enElement)=>enElement.style.display='block')
        document.querySelectorAll('.ar').forEach((arELement)=>arELement.style.display='none')
        ev.target.textContent = 'ar'
    }else{
        document.querySelectorAll('.en').forEach((enElement)=>enElement.style.display='none')
        document.querySelectorAll('.ar').forEach((arELement)=>arELement.style.display='block')
        ev.target.textContent = 'en'
    }
})


/////////////ui-js-data; 

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
                    
                    let completedRoutes = 0
                    let uncompletedRoutes = 0
                    docs.forEach(route=>route.start&&route.end?completedRoutes++:uncompletedRoutes++)

                    document.querySelector('#completedRoutesCounter').textContent = completedRoutes
                    document.querySelector('#uncompletedRoutesCounter').textContent = uncompletedRoutes


                    let votes = 0
                    docs.forEach(route=> votes += (route.upvotes.length + route.downvotes.length))
                    // document.querySelector('#votesCounter').textContent = docs.filter
                    document.querySelector('#votesCounter').innerHTML = votes
        })
    
    getDocs(collection(bygreenDb, 'unroutes')).then((data)=>{
            let docs = []
                data.docs.forEach(doc=>{
                    docs.push({...doc.data(), id: doc.id})
                })
                console.log(docs[0].upvotes.length + docs[0].downvotes)


                document.querySelector('#unconfirmedRoutesCounter').textContent = docs.length
    })

    })


/////////////////sending 



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
        <a href=' https://kadum2.github.io/ivc/profile/${account.userName}' class="account">
            <img class="accountImg" style="background-image: url('${account.img}');">
            <h3 class="accountUsername ranked">${account.userName}</h3>
        </a>
            

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
        <a href=' https://kadum2.github.io/ivc/profile/${account.userName}' class="account">
            <img class="accountImg" style="background-image: url('${account.img}');">
            <h3 class="accountUsername ranked">${account.userName}</h3>
        </a>

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



