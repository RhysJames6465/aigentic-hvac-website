(() => {
  const form=document.getElementById('contact-form');
  const config=window.AIGENTIC_CONFIG||{};
  const endpoint=typeof config.contactFormEndpoint==='string'&&config.contactFormEndpoint.trim()?config.contactFormEndpoint.trim():null;
  const submit=form.querySelector('#contact-submit');
  const errorSummary=form.querySelector('#contact-error');
  const status=form.querySelector('#contact-form-status');
  const growthCta=document.getElementById('contact-growth-cta');
  const growthStatus=document.getElementById('contact-growth-status');
  const fields=[...form.querySelectorAll('input,select,textarea')].filter(field=>field.type!=='checkbox');
  const fieldLabel=field=>form.querySelector(`label[for="${field.id}"]`)?.childNodes[0]?.textContent.trim()||'This field';
  const validEndpoint=value=>{if(!value)return null;try{const url=new URL(value,location.origin);if(url.origin===location.origin&&url.pathname.startsWith('/api/'))return url.href;if(url.protocol==='https:')return url.href;}catch{}return null;};
  const approvedEndpoint=validEndpoint(endpoint);
  const setState=state=>form.dataset.state=state;
  const clearErrors=()=>{fields.forEach(field=>{field.setAttribute('aria-invalid','false');field.removeAttribute('aria-describedby');});form.elements.privacy_acknowledgement.setAttribute('aria-invalid','false');errorSummary.hidden=true;errorSummary.textContent='';};
  const showErrors=invalid=>{invalid.forEach(field=>{field.setAttribute('aria-invalid','true');field.setAttribute('aria-describedby','contact-error');});const first=invalid[0];errorSummary.textContent=`Please correct ${invalid.length===1?fieldLabel(first).toLowerCase():'the highlighted fields'} before sending your enquiry.`;errorSummary.hidden=false;status.textContent='Your enquiry has not been sent.';setState('validation-error');errorSummary.focus();};
  form.addEventListener('input',event=>{if(event.target.matches('input,select,textarea')){event.target.setAttribute('aria-invalid','false');if(errorSummary.hidden===false&&!form.querySelector('[aria-invalid="true"]')){errorSummary.hidden=true;errorSummary.textContent='';}if(form.dataset.state==='validation-error')setState('default');}});
  form.addEventListener('change',event=>{if(event.target.matches('input,select,textarea'))event.target.setAttribute('aria-invalid','false');});
  form.addEventListener('submit',async event=>{
    event.preventDefault();
    clearErrors();
    const invalid=fields.filter(field=>!field.checkValidity());
    if(!form.elements.privacy_acknowledgement.checked){form.elements.privacy_acknowledgement.setAttribute('aria-invalid','true');invalid.push(form.elements.privacy_acknowledgement);}
    if(invalid.length){showErrors(invalid);return;}
    if(!approvedEndpoint){setState('endpoint-unavailable');status.textContent='Private preview: form delivery is awaiting the approved CONTACT_FORM_ENDPOINT. Nothing was sent.';return;}
    setState('submitting');submit.disabled=true;submit.textContent='Sending enquiry…';status.textContent='Sending your enquiry securely…';
    const values=Object.fromEntries(new FormData(form).entries());
    values.enquiry_sms_consent=form.elements.enquiry_sms_consent.checked;
    values.marketing_sms_consent=form.elements.marketing_sms_consent.checked;
    try{
      const response=await fetch(approvedEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(values)});
      if(!response.ok)throw new Error('delivery');
      setState('submitted');status.textContent='Thanks—your enquiry has been received. We’ll respond within two business days.';submit.disabled=true;submit.textContent='Enquiry received';
    }catch{
      setState('endpoint-unavailable');status.textContent='We could not send your enquiry because the approved delivery endpoint is unavailable. Your details are still here.';submit.disabled=false;submit.textContent='Send enquiry';
    }
  });
  if(growthCta&&growthStatus){
    const booking=validEndpoint(config.bookingUrl);
    if(booking){growthCta.href=booking;growthCta.target='_blank';growthCta.rel='noopener';growthStatus.textContent='The configured booking calendar will open in a new tab.';}
  }
})();
