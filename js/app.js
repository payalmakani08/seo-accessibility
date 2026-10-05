// Scroll Reveal

const revealElements=document.querySelectorAll(".reveal");

const revealObserver=new IntersectionObserver(entries=>{
entries.forEach(entry=>{
if(entry.isIntersecting){
entry.target.classList.add("active");
}
});
},{threshold:.15});

revealElements.forEach(el=>revealObserver.observe(el));


// Mouse Glow

const mouseGlow=document.querySelector(".mouse-glow");

document.addEventListener("mousemove",e=>{
mouseGlow.style.left=e.clientX+"px";
mouseGlow.style.top=e.clientY+"px";
});


// Theme

const themeBtn=document.getElementById("themeBtn");
const themeIcon=document.getElementById("themeIcon");

const savedTheme=localStorage.getItem("theme");

if(savedTheme==="light"){
document.body.classList.add("light");
themeIcon.className="bi bi-moon-fill";
}

themeBtn.addEventListener("click",()=>{

document.body.classList.toggle("light");

const light=document.body.classList.contains("light");

themeIcon.className=light
?"bi bi-moon-fill"
:"bi bi-sun-fill";

localStorage.setItem("theme",light?"light":"dark");

});


// Animated Counters

const counters=document.querySelectorAll(".counter");

const counterObserver=new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting &&
!entry.target.classList.contains("counted")){

entry.target.classList.add("counted");

const target=Number(entry.target.dataset.target);

let current=0;

const update=()=>{

current+=Math.ceil(target/40);

if(current>=target){
current=target;
entry.target.textContent=current+(target<=100?"%":"+");
return;
}

entry.target.textContent=current+(target<=100?"%":"+");

requestAnimationFrame(update);

};

update();

}

});

},{threshold:.5});

counters.forEach(counter=>counterObserver.observe(counter));


// Progress Bars

const progressBars=document.querySelectorAll(".progress-bar");

const progressObserver=new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.style.width=
entry.target.dataset.width+"%";

}

});

},{threshold:.5});

progressBars.forEach(bar=>progressObserver.observe(bar));


// Website Checker

const runCheck=document.getElementById("runCheck");

runCheck.addEventListener("click",()=>{

const seoScore=95;
const accessScore=95;

document.getElementById("seoScore").textContent=seoScore;
document.getElementById("accessScore").textContent=accessScore;

document.getElementById("seoProgress").style.width=seoScore+"%";
document.getElementById("accessProgress").style.width=accessScore+"%";

document.getElementById("checkResult").innerHTML=
'<i class="bi bi-check-circle-fill text-success"></i> '+
'Excellent! Your webpage follows strong SEO and accessibility practices.';

showToast();

});


// Copy Semantic Code

const copyCode=document.getElementById("copyCode");

copyCode.addEventListener("click",async()=>{

const code=document.getElementById("semanticCode").innerText;

try{

await navigator.clipboard.writeText(code);

copyCode.innerHTML=
'<i class="bi bi-check"></i> Copied';

setTimeout(()=>{
copyCode.innerHTML=
'<i class="bi bi-copy"></i> Copy';
},2000);

}catch(error){

copyCode.innerHTML="Copy failed";

}

});


// Toast

function showToast(){

const toastElement=document.getElementById("liveToast");

const toast=new bootstrap.Toast(toastElement);

toast.show();

}


// Test Interaction

document.getElementById("testBtn").addEventListener("click",()=>{

showToast();

document.getElementById("testBtn").innerHTML=
'<i class="bi bi-check-circle"></i> Working Successfully';

setTimeout(()=>{

document.getElementById("testBtn").innerHTML=
'<i class="bi bi-magic"></i> Test Interaction';

},2500);

});


// Back To Top

const topBtn=document.getElementById("topBtn");

window.addEventListener("scroll",()=>{

if(window.scrollY>500){
topBtn.style.display="block";
}else{
topBtn.style.display="none";
}

});

topBtn.addEventListener("click",()=>{

window.scrollTo({
top:0,
behavior:"smooth"
});

});


// Active Navigation

const sections=document.querySelectorAll("section[id]");
const navLinks=document.querySelectorAll(".nav-link");

window.addEventListener("scroll",()=>{

let current="";

sections.forEach(section=>{

const sectionTop=section.offsetTop-150;

if(window.scrollY>=sectionTop){
current=section.getAttribute("id");
}

});

navLinks.forEach(link=>{

link.classList.remove("active");

if(link.getAttribute("href")==="#"+current){
link.classList.add("active");
}

});

});


// Mobile Navigation

document.querySelectorAll(".nav-link").forEach(link=>{

link.addEventListener("click",()=>{

const menu=document.getElementById("navMenu");

if(menu.classList.contains("show")){

bootstrap.Collapse
.getOrCreateInstance(menu)
.hide();

}

});

});


// Keyboard Shortcut

document.addEventListener("keydown",e=>{

if(e.key.toLowerCase()==="t" && !e.ctrlKey && !e.altKey){

themeBtn.click();

}

});

console.log("SEO & Accessibility website loaded successfully.");
