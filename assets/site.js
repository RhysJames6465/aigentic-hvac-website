const menuButton=document.querySelector('.menu-toggle');
const nav=document.querySelector('.site-header nav');
const header=document.querySelector('.site-header');
const hero=document.querySelector('.hero');
function closeMenu(returnFocus=false){nav.classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Open navigation');if(returnFocus)menuButton.focus();}
menuButton.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Close navigation':'Open navigation');});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>closeMenu()));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&nav.classList.contains('open'))closeMenu(true);});
document.addEventListener('click',event=>{if(!event.target.closest('.site-header'))closeMenu();});
window.matchMedia('(max-width:1200px)').addEventListener('change',()=>closeMenu());
let scrollFrame;
const updateScrollState=()=>{scrollFrame=0;const scrollTop=window.scrollY||document.documentElement.scrollTop||0;header.classList.toggle('is-scrolled',scrollTop>24);if(hero){const progress=Math.min(1,Math.max(0,(-hero.getBoundingClientRect().top)/Math.max(hero.offsetHeight,1)));const fade=Math.min(1,Math.max(0,(progress-.1)/.25));hero.querySelector('.hero-content').style.setProperty('--hero-fade',String(fade));}};
window.addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(updateScrollState);},{passive:true});
updateScrollState();

const journeyComparison=document.querySelector('.journey-comparison');
if(journeyComparison){
  const reducedJourneyMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
  if(!reducedJourneyMotion.matches){
    const journeyObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){
        journeyComparison.classList.add('is-running');
        journeyObserver.disconnect();
      }
    }),{threshold:.2});
    journeyObserver.observe(journeyComparison);
  }
}

const demoButton=document.getElementById('run-demo');
const demo=document.getElementById('demo');
const demoItems=[...demo.querySelectorAll('[data-stage]')];
const demoStages=[...demo.querySelectorAll('.demo-stages li')];
const demoStatus=document.getElementById('demo-status');
const demoMotion=matchMedia('(prefers-reduced-motion: reduce)');
let demoTimers=[];
function completeDemo(){demoTimers.forEach(clearTimeout);demoTimers=[];demo.classList.remove('running');demoItems.forEach(item=>item.classList.add('show'));demoStages.forEach(item=>item.classList.remove('active'));demoButton.disabled=false;demoButton.textContent='Replay HVAC response demo';demoStatus.textContent='Completed: qualified booking request handed to the team for confirmation. This is an example.';}
function runDemo(){demoTimers.forEach(clearTimeout);if(demoMotion.matches){completeDemo();return;}demo.classList.add('running');demoItems.forEach(item=>item.classList.remove('show'));demoButton.disabled=true;demoButton.textContent='Demo running…';demoStatus.textContent='Running: enquiry received.';demoItems.forEach((item,index)=>demoTimers.push(setTimeout(()=>{item.classList.add('show');demoStages.forEach((stage,i)=>stage.classList.toggle('active',i===index));demoStatus.textContent='Running: '+demoStages[index].textContent.toLowerCase()+'.';},index*1300)));demoTimers.push(setTimeout(completeDemo,6800));}
demoButton.addEventListener('click',runDemo);
demoMotion.addEventListener('change',()=>{if(demoMotion.matches)completeDemo();});
if(demoMotion.matches)completeDemo();

const roiForm=document.getElementById('roi-form');
const calculatorFields=[...document.querySelectorAll('#roi-form input, #roi-form select')];
calculatorFields.filter(f=>f.type==='number').forEach(f=>{if(f.id!=='investment')f.required=true;if(!f.max)f.max='100000000';if(['job-value','investment'].includes(f.id))f.step='0.01';});
const number=new Intl.NumberFormat('en-US',{maximumFractionDigits:1});
const wholeNumber=new Intl.NumberFormat('en-US',{maximumFractionDigits:0});
const value=id=>Math.max(0,Number(document.getElementById(id).value)||0);
const rate=id=>Math.min(100,value(id))/100;
const money=amount=>new Intl.NumberFormat('en-US',{style:'currency',currency:document.getElementById('currency').value,maximumFractionDigits:0}).format(amount);
let currentModel={};
let calculatorPersonalised=false;
let resultAnimationTimer;

function markCalculatorPersonalised(){
  if(calculatorPersonalised)return;
  calculatorPersonalised=true;
  document.getElementById('model-mode').textContent='Using your business numbers';
  document.getElementById('results-mode').textContent='Based on your numbers';
}

function animateDiagnostic(){
  const results=document.querySelector('.roi-results');
  results.classList.remove('is-updating');
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  results.classList.add('is-updating');
  clearTimeout(resultAnimationTimer);
  resultAnimationTimer=setTimeout(()=>results.classList.remove('is-updating'),520);
}

function calculateOpportunity(){
  const invalid=calculatorFields.filter(field=>{const bad=!field.checkValidity();field.setAttribute('aria-invalid',String(bad));field.setAttribute('aria-describedby','calculator-error');return bad;});
  const error=document.getElementById('calculator-error');
  if(invalid.length){const f=invalid[0];error.textContent=`Check ${(f.closest('label').querySelector('.field-label')?.firstChild.textContent||f.closest('label').firstChild.textContent).trim()}: enter ${f.max?'a value from '+f.min+' to '+f.max:'a non-negative number'}${f.step==='1'?', using whole numbers':''}. Results remain at the last valid inputs.`;document.getElementById('copy-audit').disabled=true;return;}
  error.textContent='';document.getElementById('copy-audit').disabled=false;

  const monthlyLeads=value('monthly-leads');
  const dormant=value('dormant-contacts');
  const jobValue=value('job-value');
  const leakRate=value('leak-rate');
  const booking=rate('booking-rate');
  const show=rate('show-rate');
  const close=rate('close-rate');
  const newConversations=monthlyLeads*3*rate('leak-rate')*rate('recoverable-rate');
  const dormantConversations=dormant*rate('response-rate')*rate('qualified-rate');
  const conversations=newConversations+dormantConversations;
  const attended=conversations*booking*show;
  const jobs=attended*close;
  const revenue=jobs*jobValue;
  const profit=revenue*rate('margin-rate');
  const investment=value('investment');
  const roi=investment>0?((profit-investment)/investment)*100:null;
  const newJobs=newConversations*booking*show*close;
  const dormantJobs=dormantConversations*booking*show*close;
  const recommendation=monthlyLeads===0&&dormant===0?{
    title:'Add your lead numbers to reveal the opportunity',
    copy:'Start with a recent month of enquiries or the older contacts already in your database.'
  }:dormantJobs>newJobs?{
    title:'Start with database reactivation',
    copy:`Your ${wholeNumber.format(dormant)} dormant leads and estimates create the stronger modelled recovery path.`
  }:{
    title:'Start with enquiry follow-up and missed-call recovery',
    copy:'Your monthly enquiry volume creates the stronger modelled opportunity to recover.'
  };
  currentModel={monthlyLeads,dormant,jobValue,leakRate,conversations,attended,jobs,revenue,profit,investment,roi,recommendation};
  document.getElementById('revenue-result').textContent=money(revenue);
  document.getElementById('conversation-result').textContent=wholeNumber.format(conversations);
  document.getElementById('appointment-result').textContent=wholeNumber.format(attended);
  document.getElementById('job-result').textContent=wholeNumber.format(jobs);
  document.getElementById('path-job-result').textContent=wholeNumber.format(jobs);
  document.getElementById('profit-result').textContent=money(profit);
  document.getElementById('roi-result').textContent=roi===null?'Add an investment':`${number.format(roi)}%`;
  document.getElementById('recommendation-title').textContent=recommendation.title;
  document.getElementById('recommendation-copy').textContent=recommendation.copy;
  const currencySymbols={USD:'$',AUD:'$',GBP:'£',CAD:'$',GHS:'₵'};
  document.querySelectorAll('.currency-prefix').forEach(prefix=>{prefix.textContent=currencySymbols[document.getElementById('currency').value]||'';});
}

calculatorFields.forEach(field=>field.addEventListener('input',()=>{markCalculatorPersonalised();calculateOpportunity();animateDiagnostic();}));
roiForm.addEventListener('submit',event=>event.preventDefault());
calculateOpportunity();

const useMyNumbers=document.getElementById('use-my-numbers');
useMyNumbers.addEventListener('click',()=>{
  markCalculatorPersonalised();
  document.getElementById('monthly-leads').focus();
  document.getElementById('monthly-leads').select();
});

const copyButton=document.getElementById('copy-audit');
const copyStatus=document.getElementById('copy-status');
copyButton.addEventListener('click',async()=>{
  const m=currentModel;
  const brief=`AIGENTIC 90-DAY HVAC RECOVERY BRIEF\n\nOpportunity pool\n- Monthly inbound enquiries: ${wholeNumber.format(m.monthlyLeads)}\n- Enquiries not yet converted: ${wholeNumber.format(m.leakRate)}%\n- Dormant leads and estimates: ${wholeNumber.format(m.dormant)}\n- Average completed job value: ${money(m.jobValue)}\n\nWorking assumptions\n- New-enquiry recoverable share: ${wholeNumber.format(value('recoverable-rate'))}%\n- Dormant-contact response: ${wholeNumber.format(value('response-rate'))}%\n- Responses that qualify: ${wholeNumber.format(value('qualified-rate'))}%\n- Qualified leads that book: ${wholeNumber.format(value('booking-rate'))}%\n- Appointments that attend: ${wholeNumber.format(value('show-rate'))}%\n- Attended appointments that close: ${wholeNumber.format(value('close-rate'))}%\n- Estimated gross margin: ${wholeNumber.format(value('margin-rate'))}%\n\nIllustrative first 90 days\n- Recovered conversations: ${wholeNumber.format(m.conversations)}\n- Attended appointments: ${wholeNumber.format(m.attended)}\n- Potential jobs: ${wholeNumber.format(m.jobs)}\n- Revenue opportunity: ${money(m.revenue)}\n- Gross profit opportunity: ${money(m.profit)}\n- Planned investment: ${m.investment?money(m.investment):'Not entered'}\n- Illustrative ROI: ${m.roi===null?'Not calculated':`${number.format(m.roi)}%`}\n\nSuggested starting point\n- ${m.recommendation.title}\n- ${m.recommendation.copy}\n\nThis is an illustrative planning model, not a forecast or guarantee.`;
  try{
    await navigator.clipboard.writeText(brief);
    copyStatus.textContent='Your 90-day recovery brief is copied and ready for the growth call.';
    copyButton.innerHTML='Recovery brief copied <span>✓</span>';
  }catch(error){
    document.getElementById('brief-fallback').hidden=false;const fallback=document.getElementById('brief-text');fallback.value=brief;fallback.focus();fallback.select();copyStatus.textContent='Clipboard unavailable. Your complete brief is selected below; copy it using your device’s copy command.';
  }
});

const pipelineCard=document.getElementById('recovery-pipeline');
if(pipelineCard){
  const leads=['Maintenance enquiry · 63 days ago','No-show follow-up · 41 days ago','Install quote · 88 days ago','After-hours voicemail · 9 days ago'];
  const steps=[...pipelineCard.querySelectorAll('.pipeline-step')];
  const lines=[...pipelineCard.querySelectorAll('.pipeline-line')];
  const leadText=document.getElementById('pipeline-lead');
  const progress=document.getElementById('pipeline-progress-bar');
  const counter=document.querySelector('#pipeline-counter strong');
  const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
  let leadIndex=0;
  let recovered=0;
  let visible=false;
  let timers=[];
  const schedule=(callback,delay)=>timers.push(setTimeout(callback,delay));
  const stop=()=>{timers.forEach(clearTimeout);timers=[];};
  const reset=()=>{
    steps.forEach(step=>step.classList.remove('active'));
    lines.forEach(line=>line.classList.remove('active'));
    progress.style.transform='scaleX(0)';
  };
  const activate=(index,width)=>{
    steps[index].classList.add('active');
    if(index>0)lines[index-1].classList.add('active');
    progress.style.transform=`scaleX(${width/100})`;
  };
  const showFinalState=()=>{
    stop();
    steps.forEach(step=>step.classList.add('active'));
    lines.forEach(line=>line.classList.add('active'));
    progress.style.transform='scaleX(1)';
    counter.textContent=String(Math.max(recovered,1));
  };
  const runPipeline=()=>{
    if(!visible||reducedMotion.matches)return;
    stop();
    reset();
    leadText.classList.add('is-changing');
    schedule(()=>{leadText.textContent=leads[leadIndex];leadIndex=(leadIndex+1)%leads.length;},160);
    schedule(()=>leadText.classList.remove('is-changing'),340);
    schedule(()=>activate(0,33),420);
    schedule(()=>activate(1,66),1580);
    schedule(()=>activate(2,100),2740);
    schedule(()=>{recovered+=1;counter.textContent=String(recovered);},3700);
    schedule(runPipeline,5000);
  };
  const pipelineObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
    visible=entry.isIntersecting;
    if(visible)runPipeline();else stop();
  }),{threshold:.15});
  const handleMotionChange=()=>{if(reducedMotion.matches)showFinalState();else if(visible)runPipeline();};
  if(reducedMotion.matches)showFinalState();else pipelineObserver.observe(pipelineCard);
  if(reducedMotion.addEventListener)reducedMotion.addEventListener('change',handleMotionChange);
  else reducedMotion.addListener(handleMotionChange);
}

const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(item=>observer.observe(item));
