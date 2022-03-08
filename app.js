let roles = document.querySelector('#role')
let addUserForm = document.querySelector('.addUserForm')
let editDevsform = document.querySelector('.editDevsform')
let showDvsAll = document.querySelector('.showDvsAll')
//bootstrap hide
var modalAdduser = new bootstrap.Modal(document.getElementById('mainDataModal'));
var editModelHid = new bootstrap.Modal(document.getElementById('editModal'));



// get role on select option
function addSkill(){
    // stop working fetch start working with axios**
    /*fetch('http://localhost:5050/role').then(data => data.json()).then(data=>{
        roleList = "";
        data.map(singleRole=>{
            roleList += `
            <option value="${singleRole.id}">${singleRole.name}</option>
            `
        })
        roles.insertAdjacentHTML("beforeend", roleList)
    })*/

    axios.get('http://localhost:5050/role').then(rols=>{
        roleList = "";
        rols.data.map(singleData=>{
            roleList += `
            <option value="${singleData.id}">${singleData.name}</option>
            `
        })
        roles.insertAdjacentHTML("beforeend", roleList)
    })
}
addSkill()


/**
 * Add New User
 */
addUserForm.addEventListener("submit", function(e){
    e.preventDefault()
    let name = this.querySelector('#name')
    let skill = this.querySelector('#skill')
    let age = this.querySelector('#age')
    let photo = this.querySelector('#photo')
    let role = this.querySelector('#role')
    let showAlertadduser = this.querySelector('.showAlertadduser')
    
    if (name.value == '' || skill.value == '' || age.value == '' || photo.value == '' || role.value == '') {
        showAlertadduser.innerHTML = `<div class="alert alert-warning alert-dismissible fade show" role="alert">
        All Fields Are required!
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`;
    } else {

        axios.post('http://localhost:5050/devs',{
            id  : "",
            name  : name.value,
            skill  : skill.value,
            age  : age.value,
            photo  : photo.value,
            roleId  : role.value
        }).then(responce=>{
            name.value = '';
        skill.value = '';
        age.value = '';
        photo.value = '';
        role.value = '';
        showDatadev()
        modalAdduser.hide();
        counDevelopers()
        })
        
        
    }
    
})


// show Data

function showDatadev(pag = 1){
    //let pagS = pag ? "1" : pag;
    axios.get(`http://localhost:5050/devs?_page=${pag}&_limit=8`).then(allDvs=>{
        allDvsHtCode = "";
        allDvs.data.map(dvsVIew=>{
            allDvsHtCode += `
            <tr>
                                                      <td class="txtColorWhite">${dvsVIew.id}</td>
                                                      <th><img src="${dvsVIew.photo}" alt=""></td>
                                                      <td class="txtColorWhite">${dvsVIew.name}</td>
                                                      <td class="txtColorWhite">${dvsVIew.skill}</td>
                                                      <td class="txtColorWhite" onclick="showSingleData(${dvsVIew.id})"><i class="fa-solid fa-eye btn btn-primary"></i></td>
                                                      <td class="txtColorWhite"  data-bs-toggle="modal" data-bs-target="#editModal" onclick="editdevData(${dvsVIew.id})"><i class="fa-solid fa-pen-to-square btn btn-info"></i></td>
                                                      <td class="txtColorWhite" onclick="deleteDeveloper(${dvsVIew.id})"><i class="fa-solid fa-trash-can btn btn-danger"></i></td>
                                                  </tr>
            `
        })
        showDvsAll.innerHTML = allDvsHtCode;
    })
}
showDatadev()


// edit dev data
function editdevData(id){
   let name = document.querySelector('#ename')
    let skill = document.querySelector('#eskill')
    let age = document.querySelector('#eage')
    let photo = document.querySelector('#ephoto')
    let role = document.querySelector('#erole')
    let uderIDEdit = document.querySelector('#uderIDEdit')
    let imgEditShow = document.querySelector('#imgEditShow')


    axios.get(`http://localhost:5050/devs/${id}`).then(singleData =>{
        name.value = singleData.data.name
        skill.value = singleData.data.skill
        age.value = singleData.data.age
        photo.value = singleData.data.photo
        role.value = singleData.data.roleId
        imgEditShow.setAttribute('src', singleData.data.photo)
        uderIDEdit.value = singleData.data.id
    })

}
editDevsform.addEventListener('submit', function(e){
    e.preventDefault()
    let name = this.querySelector('#ename')
    let skill = this.querySelector('#eskill')
    let age = this.querySelector('#eage')
    let photo = this.querySelector('#ephoto')
    let role = this.querySelector('#erole')
    let uderIDEdit = this.querySelector('#uderIDEdit')

    axios.patch(`http://localhost:5050/devs/${uderIDEdit.value}`,{
            id  : uderIDEdit.id,
            name  : name.value,
            skill  : skill.value,
            age  : age.value,
            photo  : photo.value,
            roleId  : role.value
    }).then(res=>{
        showDatadev()
        editModelHid.hide()
    })
})


// delete develpers

function deleteDeveloper(id){
   let DelWorn = confirm("are you sure to delete Developer?")
   if (DelWorn) {
       axios.delete(`http://localhost:5050/devs/${id}`).then(res=>{
        showDatadev()
        counDevelopers()
       })
   }
}

// show single Data
/**
 * 
 * @param {*} id 
 */
// get data
let VieName = document.querySelector('.seleName');
let VieAge = document.querySelector('.seleAge');
let VieSkill = document.querySelector('.seleSkill');
let VieImg = document.querySelector('.selectImg');
let VieRole = document.querySelector('.seleRol');

function showSingleData(id){
    axios.get(`http://localhost:5050/devs/${id}`).then(singData=>{
        VieName.innerHTML = singData.data.name;
        VieAge.innerHTML = singData.data.age;
        VieSkill.innerHTML = singData.data.skill;
        VieImg.setAttribute('src', singData.data.photo)

        axios.get(`http://localhost:5050/role/${singData.data.roleId}`).then(rolName=>{
            VieRole.innerHTML = rolName.data.name
        })
        
    })
    

}


// 
// 
// Pagenation work
// 

// dev_count !important

let devsCountShow = document.querySelector('.devsCountShow');
let addpageItem = document.querySelector('.allPagenAt');


function counDevelopers(){
    axios.get('http://localhost:5050/devs').then(devCount =>{
        let devCNT = devCount.data.length;
    devsCountShow.innerHTML = devCNT;

    let pagenatItem = Math.ceil(devCNT / 8)
    addpageItem.innerHTML = ""
    let pageNat = "";
    for (let i = 1; i <= pagenatItem; i++) {
       pageNat += `<li class="page-item" onclick="showDatadev(${i})"><a class="page-link" href="#">${i}</a></li>`
    }
    //addpageItem.insertAdjacentHTML('afterend', pageNat)
    addpageItem.innerHTML = pageNat;
})
}
counDevelopers()


// search Data

let SearchForm = document.querySelector('.SearchForm');
let showDvs = document.querySelector('.showDvs');
SearchForm.addEventListener('keyup', function(e){
    showDvs.innerHTML = ""
    e.preventDefault()
    let searchField = this.querySelector('input[placeholder="search devlopers"]').value;
    if (searchField == '') {
        alldvsAdd = ""
    }else{
        axios.get(`http://localhost:5050/devs?q=${searchField}`).then(res=>{
        alldvsAdd = ""
        res.data.map(dataId=>{
            alldvsAdd += `
           <tr> 
                                                      <td><img src="${dataId.photo}" alt=""></td>
                                                      <td class="txtColorWhite">${dataId.name}</td>
                                                      <td class="txtColorWhite" onclick="showSingleData(${dataId.id})"><i class="fa-solid fa-eye btn btn-primary"></i></td>
                                </tr>
           `
        })
        showDvs.innerHTML = alldvsAdd;
    })
    }
})

