let QRCode = require('qrcode')
let { ipcRenderer, shell, BrowserWindow, screen } = require('electron');

let canvas = document.getElementById('canvas')
let input = document.getElementById("input")
let generate_btn = document.getElementById("generate")

// For Button Disable
setInterval(() => {
    if (input.value.length == 0) {
        generate_btn.disabled = true
    } else {
        generate_btn.disabled = false
    }
}, 250);


// Values
let color;
let bg;
let scale;
let margin;
let mp;
let r = document.querySelector(':root');
let main_url;

setInterval(() => {
    color = document.getElementById("color").value
    bg = document.getElementById("bg").value
    scale = document.getElementById("scale").value
    margin = document.getElementById("margin").value
    mp = document.getElementById("mp").value


    // For Dark Mode
    let DarkMode = document.getElementById("DarkMode").checked;

    if (DarkMode == true) {
        r.style.setProperty('--theme-background', '#191919');
        r.style.setProperty('--theme-background-2', '#121212');
        r.style.setProperty('--editor-background', '#202020');
        r.style.setProperty('--theme-color', 'white');
        r.style.setProperty('--min-color', 'lightblue');
        r.style.setProperty('--max-color', 'lightgreen');
        r.style.setProperty('--shadow-color', '#191919');
    } else {
        r.style.setProperty('--theme-background', 'lightgray');
        r.style.setProperty('--theme-background-2', 'white');
        r.style.setProperty('--editor-background', '#F0F0F0');
        r.style.setProperty('--theme-color', 'black');
        r.style.setProperty('--min-color', 'blue');
        r.style.setProperty('--max-color', 'green');
        r.style.setProperty('--shadow-color', 'darkgray');
    }

    QRCode.toCanvas(canvas, input.value, {
        color: {
            dark: color,
            light: bg,
        },
        scale: scale,
        margin: margin,
        maskPattern: mp,
    },
        function (error) {
            if (error) console.error(error)
        })
    
    QRCode.toDataURL(input.value)
        .then(url => {
            console.log(url)
            main_url = url
        })
        .catch(err => {
            console.error(err)
        })

}, 250);


// Title Bar JS
document.getElementById("quit-button").addEventListener("click", () => {
    ipcRenderer.send('quit-app')
})

document.getElementById("refresh_btn").addEventListener("click", () => {
    ipcRenderer.send('reload-app')
})

document.getElementById("minimize-button").addEventListener("click", () => {
    ipcRenderer.send('minimize-app')
})

// document.getElementById("maximize-button").addEventListener("click", () => {
//     ipcRenderer.send('maximize-app')
//     ipcRenderer.on("maximizing-icon", (event, icon) => {
//         // if (icon == "Max") {
//         //     document.getElementById("maximize-button").innerHTML = `<i class="bi bi-app"></i>`
//         // } else if (icon == "UnMax") {
//         //     document.getElementById("maximize-button").innerHTML = `<i class="bi bi-app-indicator"></i>`
//         // }
//     })
// })

// ipcRenderer.on('asynchronous-message', function (evt, message) {
//     let icon = message.icon;
//     // console.log(icon)
//     // if (icon == "Max") {
//     //     document.getElementById("maximize-button").innerHTML = `<i class="bi bi-app-indicator"></i>`
//     // } else if (icon == "UnMax") {
//     //     document.getElementById("maximize-button").innerHTML = `<i class="bi bi-app"></i>`
//     // }
// });


// Function to Downlaod an Image 

let downloadImage = () => {
    // let url = "https://www.timeoutdubai.com/cloud/timeoutdubai/2021/09/11/hfpqyV7B-IMG-Dubai-UAE.jpg"
    ipcRenderer.send('download-img', {
        payload: {
            url: main_url
        }
    })
}