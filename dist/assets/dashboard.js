import"./modulepreload-polyfill.js";import{m as r}from"./module.esm.js";const a="/";r.store("pd",{phone:"",error:"",needToCreatePatient:!1,patientName:"",patientAge:null,patientGender:"male",async proceed(){if(this.validate()){console.log(this.phone);const e=await i(this.phone);if(e!=null&&e.error){this.error=e.error;return}if(this.needToCreatePatient=!(e!=null&&e.userExists),this.needToCreatePatient){const t={phone:this.phone,name:this.patientName,age:this.patientAge,gender:this.patientGender};t.phone&&t.name&&t.age&&t.gender&&(console.log(t),s(t,()=>{console.log("User created..."),window.location.href="/chillpill/prescribe/?phone="+this.phone}))}else window.location.href="/chillpill/prescribe/?phone="+this.phone}},validate(){this.error="";const t=/(^(01){1}[3456789]{1}(\d){8})$/.test(this.phone)&&this.phone.length===11,o=this.patientName.length>0,n=this.patientAge>0;return t||(this.error="Please put a valid phone number"),!o&&this.needToCreatePatient&&(this.error="Please put a valid patient name"),!n&&this.needToCreatePatient&&(this.error="Please put a valid patient age"),this.needToCreatePatient?t&&o&&n:t}});window.Alpine=r;r.start();const i=async e=>{const t=await fetch(`${a}chillpill/functions/checkUser.php?phone=${e}`,{method:"GET",headers:{"Content-Type":"application/json"}});if(t!=null&&t.ok){const o=await t.json();return console.log(o),o}else return{error:`${t.status} Error`}},s=async(e,t)=>{const o=await fetch(`${a}chillpill/functions/createPatient.php?phone=${e==null?void 0:e.phone}&name=${e==null?void 0:e.name}&age=${e==null?void 0:e.age}&gender=${e==null?void 0:e.gender}`,{method:"GET",headers:{"Content-Type":"application/json"}});if(o!=null&&o.ok){const n=await o.json();return console.log(n),t(),n}else return{error:`${o.status} Error`}};