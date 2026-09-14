(() => {
  const config=window.AIGENTIC_CONFIG;
  const byId=id=>document.getElementById(id);
  const safeUrl=value=>{if(typeof value!=='string'||!value.trim()||value.startsWith('#'))return null;try{const url=new URL(value,location.origin);return url.protocol==='https:'&&url.href!==location.href?url.href:null;}catch{return null;}};
  const bookingUrl=safeUrl(config.bookingUrl);
  const privacyUrl=safeUrl(config.privacyUrl);
  const timezone=Intl.DateTimeFormat().resolvedOptions().timeZone||'Choose your time zone in the calendar';
  byId('booking-timezone').textContent=`Your device time zone: ${timezone}. Confirm the time zone and appointment time in the calendar.`;
  const business=config.business;
  const email=typeof business.email==='string'&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(business.email)?business.email:null;
  const addLink=(parent,text,href)=>{const a=document.createElement('a');a.textContent=text;a.href=href;parent.append(a);return a;};
  if(email)addLink(byId('contact-fallback'),`Need help? Email ${email}`,`mailto:${email}`);
  else byId('contact-fallback').textContent='Private preview: a verified fallback contact is still required.';
  let hasLegal=false;
  for(const [key,label] of [['privacyUrl','Privacy Policy'],['termsUrl','Terms and Conditions'],['cookiePolicyUrl','Cookie Policy'],['accessibilityUrl','Accessibility'],['smsTermsUrl','SMS Terms']]){
    const url=safeUrl(config[key]);if(url){addLink(byId('legal-links'),label,url);hasLegal=true;}
  }
  byId('legal-pending').hidden=!!(privacyUrl&&safeUrl(config.termsUrl)&&safeUrl(config.accessibilityUrl));
  const verifiedContact=byId('verified-contact');
  if(!verifiedContact.children.length){for(const key of ['legalName','region','registration'])if(business[key]){const p=document.createElement('p');p.textContent=business[key];verifiedContact.append(p);}
    if(email)addLink(verifiedContact,email,`mailto:${email}`);
    if(business.phone&&/^[+\d ()-]{7,25}$/.test(business.phone))addLink(verifiedContact,business.phone,`tel:${business.phone.replace(/[^+\d]/g,'')}`);
  }
  byId('contact-pending').hidden=verifiedContact.children.length>0;
  byId('copyright-year').textContent=new Date().getFullYear();

  const openButton=byId('open-calendar'),status=byId('booking-status'),retry=byId('retry-booking'),host=byId('calendar-host');
  let timer,frame;
  const bookingReady=!!(bookingUrl&&privacyUrl&&config.consent.reviewed&&config.consent.serviceDisclosure&&config.consent.version);
  function bookingError(){clearTimeout(timer);status.textContent='The calendar could not be loaded. Retry, open it directly, or use the contact below.';retry.hidden=false;openButton.disabled=false;host.setAttribute('aria-busy','false');}
  function loadCalendar(){
    if(!bookingReady)return;
    clearTimeout(timer);status.textContent='Loading the booking calendar…';retry.hidden=true;openButton.disabled=true;host.hidden=false;host.setAttribute('aria-busy','true');host.replaceChildren();
    frame=document.createElement('iframe');frame.title='Schedule your HVAC growth call now';frame.referrerPolicy='strict-origin-when-cross-origin';frame.src=bookingUrl;
    frame.addEventListener('load',()=>{clearTimeout(timer);status.textContent='Calendar loaded. Select your time zone and a suitable time. Your appointment is confirmed only when the calendar confirms it.';host.setAttribute('aria-busy','false');openButton.disabled=false;});
    frame.addEventListener('error',bookingError);timer=setTimeout(bookingError,15000);host.append(frame);
  }
  if(bookingReady){openButton.disabled=false;status.textContent='Choose a time for your HVAC growth call.';byId('calendar-fallback').hidden=false;byId('calendar-fallback').href=bookingUrl;}
  else if(bookingUrl)status.textContent='Private development preview: booking is awaiting the reviewed privacy notice and service disclosure.';
  openButton.addEventListener('click',loadCalendar);retry.addEventListener('click',loadCalendar);
  window.addEventListener('message',event=>{
    if(!frame||!bookingUrl||event.source!==frame.contentWindow||event.origin!==new URL(bookingUrl).origin)return;
    const expected=config.integration.bookingSuccessEvent;
    if(expected&&event.data?.type===expected){clearTimeout(timer);status.textContent='Your HVAC growth call is booked. Check the calendar confirmation for the time zone and appointment details.';host.setAttribute('aria-busy','false');retry.hidden=true;}
  });

  byId('contact-component').innerHTML=`<div class="booking-form-panel"><h3>Give your growth call a useful starting point.</h3><p>Tell us about your business and the opportunity you want to address.</p><p class="development-notice" id="form-development">Private development preview: this form validates locally but does not send information. Connection and reviewed disclosures are pending.</p><form id="contact-form" novalidate><div class="contact-grid">
  <label for="contact-name">Name<input id="contact-name" name="name" autocomplete="name" required maxlength="120"></label>
  <label for="contact-company">Company<input id="contact-company" name="company" autocomplete="organization" required maxlength="160"></label>
  <label for="contact-email">Business email<input id="contact-email" name="email" type="email" autocomplete="email" required maxlength="254"></label>
  <label for="contact-phone">Phone<input id="contact-phone" name="phone" type="tel" autocomplete="tel" required maxlength="30"><small>Include your country code.</small></label>
  <label for="contact-website">Website (optional)<input id="contact-website" name="website" type="url" autocomplete="url" placeholder="https://" maxlength="500"></label>
  <label for="contact-country">Country<input id="contact-country" name="country" autocomplete="country-name" required maxlength="100"></label>
  <label for="contact-timezone">Time zone<input id="contact-timezone" name="timezone" required maxlength="100" list="timezones"><datalist id="timezones"></datalist><small>For example, Australia/Sydney or America/New_York.</small></label>
  <label for="contact-volume">Approximate monthly enquiry volume<select id="contact-volume" name="volume" required><option value="">Choose an estimate</option><option>Under 50</option><option>50–149</option><option>150–499</option><option>500+</option><option>Not sure yet</option></select></label>
  <label for="contact-interest">Main opportunity<select id="contact-interest" name="interest" required><option value="">Choose your starting point</option><option>Database Reactivation</option><option>Missed-Call Recovery &amp; AI Booking</option><option>AI Lead Nurturing</option><option>Reviews &amp; Referrals</option><option>Paid Advertising</option><option>Help identify the biggest leak</option></select></label>
  </div><label class="honeypot" aria-hidden="true">Leave this empty<input name="fax" tabindex="-1" autocomplete="off"></label><p id="service-disclosure" class="review-notice"></p><p id="privacy-notice" class="review-notice"></p><label class="consent-row"><input type="checkbox" name="marketing" id="marketing-consent" disabled><span id="marketing-wording">Optional marketing consent: reviewed wording pending. Disabled in this private preview.</span></label><p id="contact-status" role="status" tabindex="-1"></p><button class="button button-primary" type="submit" id="contact-submit">Check details locally</button></form></div>`;
  byId('contact-timezone').value=timezone;
  if(Intl.supportedValuesOf)for(const zone of Intl.supportedValuesOf('timeZone')){const o=document.createElement('option');o.value=zone;byId('timezones').append(o);}
  byId('service-disclosure').textContent=config.consent.reviewed&&config.consent.serviceDisclosure?config.consent.serviceDisclosure:'Appointment/service-message disclosure requires jurisdiction-specific review before connection.';
  if(privacyUrl)addLink(byId('privacy-notice'),'Read the Privacy Policy',privacyUrl);else byId('privacy-notice').textContent='Privacy notice pending. No information is transmitted from this development form.';
  const marketingReady=!!(config.consent.reviewed&&config.consent.marketingText&&config.consent.version);
  if(marketingReady){byId('marketing-wording').textContent=config.consent.marketingText;byId('marketing-consent').disabled=false;}
  let endpoint=null;try{const u=new URL(config.contactEndpoint,location.origin);if(config.contactEndpoint&&u.origin===location.origin&&u.pathname.startsWith('/api/'))endpoint=u.href;}catch{}
  const contactReady=!!(endpoint&&privacyUrl&&config.consent.reviewed&&config.consent.version&&config.consent.serviceDisclosure&&config.integration.spamProtectionVerified);
  const form=byId('contact-form'),submit=byId('contact-submit'),formStatus=byId('contact-status');
  const startedAt=Date.now();let submitting=false,idempotencyKey=crypto.randomUUID();
  if(contactReady){byId('form-development').hidden=true;submit.textContent='Send growth call enquiry';}
  form.addEventListener('submit',async event=>{
    event.preventDefault();if(submitting)return;
    const fields=[...form.querySelectorAll('.contact-grid input,.contact-grid select')];
    fields.forEach(field=>{field.setCustomValidity('');field.value=field.value.trim();});
    const phone=byId('contact-phone');if(!/^\+?[\d\s().-]{7,30}$/.test(phone.value))phone.setCustomValidity('Enter a phone number with country code, using digits, spaces or +.');
    const zone=byId('contact-timezone');try{new Intl.DateTimeFormat('en',{timeZone:zone.value}).format();}catch{zone.setCustomValidity('Enter a recognized time zone, such as Australia/Sydney.');}
    const invalid=fields.filter(f=>!f.checkValidity());fields.forEach(f=>{f.setAttribute('aria-invalid',String(!f.checkValidity()));f.setAttribute('aria-describedby','contact-status');});
    formStatus.className=invalid.length?'contact-error':'';
    if(invalid.length){const f=invalid[0];formStatus.textContent=`${form.querySelector('label[for="'+f.id+'"]').firstChild.textContent}: ${f.validationMessage}`;f.focus();return;}
    if(!contactReady){formStatus.textContent='Details checked locally. Nothing was sent or booked; the private preview is awaiting connection and reviewed disclosures.';return;}
    const fd=new FormData(form);if(fd.get('fax')){formStatus.textContent='Unable to submit. Please reload and try again.';return;}
    submitting=true;submit.disabled=true;submit.textContent='Sending…';formStatus.textContent='Sending your enquiry securely…';form.setAttribute('aria-busy','true');
    const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),15000);
    const payload={...Object.fromEntries(fd),marketing:marketingReady&&fd.get('marketing')==='on',consent:{wordingVersion:config.consent.version,serviceDisclosure:config.consent.serviceDisclosure,marketingWording:marketingReady?config.consent.marketingText:null,marketingOptIn:marketingReady&&fd.get('marketing')==='on',clientTimestamp:new Date().toISOString(),source:config.consent.source},elapsedMs:Date.now()-startedAt,idempotencyKey};
    try{const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:controller.signal});if(!response.ok)throw Error('submission');const result=await response.json();if(result.accepted!==true)throw Error('unconfirmed');formStatus.textContent='Your enquiry has been received. This does not confirm an appointment; use the calendar to choose a time.';submit.textContent='Enquiry received';form.reset();byId('contact-timezone').value=timezone;idempotencyKey=crypto.randomUUID();}
    catch{formStatus.className='contact-error';formStatus.textContent='We could not confirm receipt. Your details are still here. Retry, or use the fallback contact above.';submit.textContent='Retry enquiry';}
    finally{clearTimeout(timeout);submitting=false;submit.disabled=false;form.setAttribute('aria-busy','false');}
  });
})();
