var socket = io();

const btn = document.getElementById('btn');
btn.onclick = function execute(){
    socket.emit('from_client');
}


socket.on('from_server', ()=>{
    console.log("Collected a new event from server");
    const div = document.createElement('div');
    div.innerText= 'New event from server';
    document.body.appendChild(div);
})