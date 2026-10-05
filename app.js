const themeBtn=document.getElementById("themeBtn");
const topBtn=document.getElementById("topBtn");
const testBtn=document.getElementById("testBtn");
const testResult=document.getElementById("testResult");

function setTheme(){

const saved=localStorage.getItem("seoTheme");

if(saved==="light"){
document.body.classList.add("light");
themeBtn.innerHTML=
'<i class="bi bi-sun-fill"></i>';
}

}

themeBtn.addEventListener("click",()=>{

document.body.classList.toggle("light");

const light=
document.body.classList.contains("light");

localStorage.setItem(
"seoTheme",
light?"light":"dark"
);

themeBtn.innerHTML=light?
'<i class="bi bi-sun-fill"></i>':
'<i class="bi bi-moon-stars-fill"></i>';

});


const observer=new IntersectionObserver(
entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){
entry.target.classList.add("visible");
}

});

},
{
threshold:.15
}
);

document.querySelectorAll(".reveal")
.forEach(element=>{
observer.observe(element);
});


function animateCounters(){

document.querySelectorAll(".stat-number")
.forEach(counter=>{

const target=
Number(counter.dataset.target);

let current=0;

const step=Math.max(
1,
Math.ceil(target/50)
);

const timer=setInterval(()=>{

current+=step;

if(current>=target){
current=target;
clearInterval(timer);
}

counter.textContent=current+"%";

},25);

});

}

const statsObserver=
new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

animateCounters();

statsObserver.disconnect();

}

});

});

const stats=
document.querySelector(".stats-section");

if(stats){
statsObserver.observe(stats);
}


testBtn.addEventListener("click",()=>{

testResult.innerHTML=
'<i class="bi bi-hourglass-split"></i> Running test...';

setTimeout(()=>{

const images=
document.querySelectorAll("img");

const links=
document.querySelectorAll("a");

const buttons=
document.querySelectorAll("button");

let checks=0;

let passed=0;

checks++;

if(document.title.length>0){
passed++;
}

checks++;

if(
document.querySelector(
'meta[name="description"]'
)
){
passed++;
}

checks++;

if(
document.querySelector("h1")
){
passed++;
}

checks++;

let accessible=true;

buttons.forEach(button=>{

if(
!button.getAttribute("aria-label") &&
!button.textContent.trim()
){
accessible=false;
}

});

if(accessible)passed++;

checks++;

if(
document.querySelector("main")
){
passed++;
}

const percentage=
Math.round((passed/checks)*100);

testResult.innerHTML=`
<strong>
<i class="bi bi-check-circle-fill"></i>
Accessibility Test Complete
</strong>
<br>
Score: ${percentage}%
<br>
<small>
${passed} of ${checks} basic checks passed.
</small>
`;

},800);

});


window.addEventListener("scroll",()=>{

if(window.scrollY>400){
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


document.querySelectorAll(".nav-link")
.forEach(link=>{

link.addEventListener("click",()=>{

const nav=
document.querySelector(".navbar-collapse");

if(nav.classList.contains("show")){

const collapse=
bootstrap.Collapse.getInstance(nav);

if(collapse){
collapse.hide();
}

}

});

});


setTheme();
