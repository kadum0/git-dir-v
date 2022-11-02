


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
    measurementId: "G-265TN8HGKX"};

const bygreen = initializeApp(bygreenConfig, 'bygreen');
const bygreenDb = getFirestore(bygreen)
const bygreenAuth = getAuth(bygreen)
const bygreenStorage = getStorage(bygreen)

/////////auth state 
let errDiv = document.querySelector('#errors')

let dbUser ////firestore 
let authUser ///auth 
let type
let accountsList = []

// getting ???
await onAuthStateChanged(bygreenAuth, async (user)=>{
    console.log('authstatefun', dbUser)
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
            document.querySelectorAll('.makeprofile').forEach(e=>e.style.display = 'none')
            document.querySelectorAll('.notlogged').forEach(e=>e.style.display = 'none')

            ///insert the basic info; 
            document.querySelector('.minicuserimg').style.backgroundImage = `url('${dbUser.img}')`
            // document.querySelector(".minicuserusername").textContent = '@'+ dbUser.userName
            document.querySelector('.cuserimg').style.backgroundImage = `url('${dbUser.img}')`
            document.querySelector(".cuserusername").textContent = '@'+ dbUser.userName
            document.querySelector(".cusername").textContent = dbUser.name
            document.querySelector(".cuserbio").textContent = dbUser.bio
            document.querySelector("#profileLink").href = window.location.host+'/'+ dbUser.userName

            document.querySelector(".addedRoutes").querySelector('span').textContent = dbUser.addedRoutes.length
            document.querySelector(".votes").querySelector('span').textContent += dbUser.votes.length


        }else{
            /////half registered; make profile
            document.querySelectorAll('.makeprofile').forEach(e=>e.style.display = 'block')
            document.querySelectorAll('.logged').forEach(e=>e.style.display = 'none')
            document.querySelectorAll('.notlogged').forEach(e=>e.style.display = 'none')
        }
        
    }else{
        /////not registered
        document.querySelectorAll('.notlogged').forEach(e=>e.style.display = 'block')
        document.querySelectorAll('.logged').forEach(e=>e.style.display = 'none')
        document.querySelectorAll('.makeprofile').forEach(e=>e.style.display = 'none')

        dbUser = 'none'
    }

    // getDocs(collection(bygreenDb, 'users')).then((data)=>{
    //     let docs = []
    //         data.docs.forEach(doc=>{
    //             docs.push({...doc.data(), id: doc.id})
    //         })
    //         accountsList = docs
    //         console.log(docs)
    //         document.querySelector('#accountsCounter').textContent = accountsList.length
    //         if(accountsList){
    //             // console.log(accountsList, dbUser)
    //             ranking('total', 'de')
    //         }

    //     })
})
///////register 
document.querySelector('#registerbtn').addEventListener('click', (ev)=>{
    // check if valid data

    // send 
    if(ev.target.parentElement.querySelector(".em").value.length > 0 &&ev.target.parentElement.querySelector(".em").value.length < 20 && ev.target.parentElement.querySelector(".pw").value.length > 0){

        console.log('make account')
        createUserWithEmailAndPassword(bygreenAuth, ev.target.parentElement.querySelector(".em").value, ev.target.parentElement.querySelector(".pw").value).then(cred=>{
            console.log(cred)
        }).catch(err=>{
            console.log(err.message)
            errDiv.textContent = err.message
            errDiv.style.display = 'block'
            setTimeout(() => {
                errDiv.style.display = 'none'
            }, 10000);
        })
    }else{

    }
    // empty 
    document.querySelector('#registerUsername').value = ''
    document.querySelector('#registerPassword').value = ''
})

//////signin
document.querySelector('#signinbtn').addEventListener('click', (ev)=>{
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
document.querySelector('#signoutbtn').addEventListener('click', ()=>{
    signOut(bygreenAuth, (result)=>{console.log(result)})
})

// sign with google  
const provider = new GoogleAuthProvider()
document.querySelector('#bygoogle').addEventListener('click', ()=>{
    signInWithPopup(bygreenAuth, provider).then((cred)=>console.log(cred))

})


//////make profile; 
document.querySelector('#makeprofilebtn').addEventListener('click', async (ev)=>{
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

        let fileRef = ref(bygreenStorage, '/userimgs/' + new Date().toISOString().replace(/:/g, '-') +document.querySelector("#userimg").files[0].name.replaceAll(" ","") )

            uploadBytes(fileRef, document.querySelector("#userimg").files[0]).then(res=>{
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

////authstate
document.querySelector(".auth").addEventListener("click", (e)=>{
    e.target.classList.toggle('on')
    if(e.target.classList.contains('on')){
        document.querySelector(".authstate").style.display = 'block'
    }else{
        document.querySelector(".authstate").style.display = 'none'
    }
})



