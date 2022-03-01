(function () {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.validated-forms')
  
    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
      .forEach(function (form) {
        form.addEventListener('submit', function (event) {
          if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
          }
  
          form.classList.add('was-validated')
        }, false)
      })
  })()


function sfees(date){
    dates = new Date(date)
    Days=Math.floor((Date.now()-dates.getTime())/(1000*24*3600))
    perDayFees=120;
    fees=perDayFees*Days
    return fees
} 

function onError(){
    document.querySelector("#sName").innerHTML=`Wrong Details Entered`
    document.querySelector("#sFname").innerHTML=``
    document.querySelector("#sRoll").innerHTML=``
    document.querySelector("#sMobile").innerHTML=``
    document.querySelector("#semail").innerHTML=``
    document.querySelector("#sjoinDate").innerHTML=``
    document.querySelector("#sFees").innerHTML=``
}

function addDetails(data,fees) {
    const SName=document.querySelector('#sName')
    const FName=document.querySelector('#sFname')
    SName.innerHTML=`${data.name}`
    FName.innerHTML=`${data.father_name}`
    document.querySelector("#sRoll").innerHTML=`${data.rollNo}`
    document.querySelector("#sMobile").innerHTML=`${data.mobileNo}`
    document.querySelector("#semail").innerHTML=`${data.email}`
    document.querySelector("#sjoinDate").innerHTML=`${data.date_start}`
    document.querySelector("#sFees").innerHTML=`${sfees(data.date_start)}`
}

var id=0;

const submission = document.querySelector('#submitsss')  
submission.addEventListener('submit',async function(e){
    e.preventDefault()
    e.stopPropagation()
    let data= new FormData(this)
    const response= await axios.post('/student_search',data)
    if(response.data.detail.length!==0)
    {
    addDetails(response.data.detail[0],response.data.Fees);
    id=response.data.detail[0]._id;
    }
    else{
      onError()
      id=0;
    }  
})

const Fsubmission = document.querySelector('#sSearch')  
Fsubmission.addEventListener('submit',async function(e){
    e.preventDefault()
    e.stopPropagation()
    if(id===0)
    {
      onError()
      return 
    }
    else{
    const response = await axios.put(`/dashboard/fees/${id}`)
    id=0;
    if(response.data="Done")
    {
      alert("Fees Submission Succesful")
    }
    else{
      alert("Unsuccesfull")
    }  
    }
})


