let addbtn=document.querySelector('.add-btn');
let modalcont=document.querySelector('.modal-cont');
let maincont=document.querySelector('.main-cont');
let textareacont=document.querySelector('.textarea-cont');
let allprioritycolors=document.querySelectorAll('.priority-color')
let removebtn=document.querySelector('.remove-btn');
let allColors=document.querySelectorAll('.color');


let addTaskFlag=false;
let removeTaskFlag=false;
let modalprioritycolor='lightpink';


 let lockClass="fa-lock";
 let openClass="fa-lock-open";

 let colors=['lightpink','lightgreen','lightblue','black'];
 let ticketsArr=[];
 if(localStorage.getItem('tickets')){
    ticketsArr=JSON.parse(localStorage.getItem('tickets'));

    ticketsArr.forEach(function(eachTicket){
        create_ticket(eachTicket.text,eachTicket.newprioritycolor,eachTicket.id);
    })
 }



addbtn.addEventListener('click',function(){
    addTaskFlag=!addTaskFlag;
    if(addTaskFlag==true){
        modalcont.style.display='flex';
    }else{
        modalcont.style.display='none'; 
    }
});

allprioritycolors.forEach(function(colorElem){
    colorElem.addEventListener('click',function(){
        allprioritycolors.forEach(function(prioritycolor){
            prioritycolor.classList.remove('active');
        })
        colorElem.classList.add('active');
        modalprioritycolor=colorElem.classList[0];
    })
})



modalcont.addEventListener('keydown',function(e){
    let key=e.key;
    if(key ==='Shift'){
        console.log(key);
        create_ticket(textareacont.value,modalprioritycolor);

    }
});








//function to create ticket
function create_ticket(text,newprioritycolor,ticket_id){
    let id=ticket_id || shortid();// precedence is imp here

    let newticket=document.createElement('div');
    newticket.setAttribute('class','ticket-cont');
    newticket.innerHTML=` <div class="ticket-color-cont ${newprioritycolor}"></div>
    <div class="ticket-id">
    ${id}</div>
    <div class="ticket-task">
    ${text}
    </div>
    <div class="lock">
    <i class="fa-solid fa-lock"></i>
    </div>`;
    maincont.appendChild(newticket);
    modalcont.style.display='none'; 
     openTicketLock(newticket,id);
     handleremoval(newticket,id);
     handleColor(newticket);
     if(!ticket_id){
     ticketsArr.push({newprioritycolor,id,text});
     localStorage.setItem('tickets',JSON.stringify(ticketsArr));
     }

    
}
//opening the ticket lock
function openTicketLock(ticket,id){
    let ticketLockElem=ticket.querySelector('.lock');

    let ticketLockIcon=ticketLockElem.children[0];
    let ticket_taskArea=ticket.querySelector('.ticket-task');


    ticketLockIcon.addEventListener('click',function(){
        let idx=getIdx(id);
        if(ticketLockIcon.classList.contains(lockClass)){
            ticketLockIcon.classList.remove(lockClass);
            ticketLockIcon.classList.add(openClass);
            ticket_taskArea.setAttribute('contenteditable','true');
        }else{
            ticketLockIcon.classList.remove(openClass);
            ticketLockIcon.classList.add(lockClass);
            ticket_taskArea.setAttribute('contenteditable','false');
        }
        ticketsArr[idx].text=ticket_taskArea.innerText;
        localStorage.setItem('tickets',JSON.stringify(ticketsArr));
    })
}
//remove button activation and deactivation
removebtn.addEventListener('click',function(){
    removeTaskFlag=!removeTaskFlag;
    if(removeTaskFlag===true){
        alert('remove button is Activited');
        removebtn.style.color='red';

    }else{
        alert('remove button is Deactivated');
        removebtn.style.color='white';
    }

})

//removal of ticket
function handleremoval(ticket,id){
    ticket.addEventListener('click',function(){
        let idx=getIdx(id);
        if(!removeTaskFlag){
            return;
        }else{
            ticket.remove();
            ticketsArr.splice(idx,1);//(index from where,no.of jumps)
            localStorage.setItem('tickets',JSON.stringify(ticketsArr));
        }

    })
}
//handling the color band to set the priority
function handleColor(ticket){
    let ticketColorBand= ticket.querySelector(".ticket-color-cont");
    ticketColorBand.addEventListener('click',function(){
        let currentColor=ticketColorBand.classList[1];
        let currentColorIdx=colors.indexOf(currentColor);
        currentColorIdx++;
        let newColorIdx=currentColorIdx%colors.length;

        let newColor=colors[newColorIdx];

        ticketColorBand.classList.remove(currentColor);

        ticketColorBand.classList.add(newColor);
    });
}




for(let i=0;i<allColors.length;i++){
    //get task based color filter.
    allColors[i].addEventListener('click',function(){
        let selectedColor=allColors[i].classList[0];
        let filteredtickets=ticketsArr.filter(function(ticket){
            return selectedColor===ticket.newprioritycolor;
        });

        let allTickets=document.querySelectorAll('.ticket-cont');
        for(let i=0;i<allTickets.length;i++){
            allTickets[i].remove();
        }
        filteredtickets.forEach(function(filteredticket){
            create_ticket(filteredticket.text,filteredticket.newprioritycolor,filteredticket.id);
        })


    })
      //to get all tickets if color is doubleclicked.
    allColors[i].addEventListener('dblclick',function(){
        let currentTickets=document.querySelectorAll('.ticket-cont');
        for(let j=0;j<currentTickets.length;j++){
            currentTickets[j].remove()
         

        }
       ticketsArr.forEach(function(eachTicket){
        create_ticket(eachTicket.text,eachTicket.newprioritycolor,eachTicket.id);
       })
        
    });
}
  




function getIdx(id){
    let ticketidx=ticketsArr.findIndex(function(ticketObj){
        return ticketObj.id===id
    })
    return ticketidx;
}