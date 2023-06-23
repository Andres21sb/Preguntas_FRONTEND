/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */


class App {
    dom;
    modal; // login modal

    state;  // state variables: if any

    //countries; // Countries view

    constructor() {
        this.state = {};
        this.dom = this.render();
        this.modal = new bootstrap.Modal(this.dom.querySelector('#app>#modal'));
        this.dom.querySelector('#app>#modal #apply').addEventListener('click', e => this.login());
        this.renderBodyFiller();
        this.renderMenuItems();
        //this.countries = new Countries();
    }

    render = () => {
        const html = `
            ${this.renderMenu()}
            ${this.renderBody()} 
            ${this.renderFooter()}
            ${this.renderModal()}
        `;
        var rootContent = document.createElement('div');
        rootContent.id = 'app';
        rootContent.innerHTML = html;
        return rootContent;
    }

    renderMenu = () => {
        return `
        <nav id="menu" class="navbar navbar-expand-lg p-0 navbar-dark bg-dark">
          <div class="container-fluid">
            <a class="navbar-brand  font-italic font-weight-light  text-info" href="#">
                <h1>Preguntas</h3>
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menuCollapse">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div id="menuCollapse" class="collapse navbar-collapse" >
              <ul class="navbar-nav me-auto mb-2 mb-lg-0" id='menuItems'>
              </ul>
            </div>
          </div>
        </nav>
        `;
    }

    renderBody = () => {
        return `
        <div id="body">   
        </div>          
    `;
    }

    renderFooter = () => {
        return `
        <footer id="footer" class="bg-dark text-white mt-4 w-100 fixed-bottom">
            <div class="container-fluid py-2">

                <div class="row">
                    <div class="col-md-2"><h5>Total Soft Inc.</h5></div>
                    <div class="col-md-7"><h4>
                        <i class="fab fa-twitter"></i>
                        <i class="fab fa-facebook"></i>
                        <i class="fab fa-instagram"></i></h4>
                    </div>
                    <div class="col-md-3 text-right small align-self-end">©2023 Tsf, Inc.</div>
                </div>
            </div>
        </footer> 
    `;
    }

    renderModal = () => {
        return `
        <div id="modal" class="modal fade" tabindex="-1">
           <div class="modal-dialog">
               <div class="modal-content">
                   <div class="modal-header" >
                       <img class="img-circle" id="img_logo" src="images/user.png" style="max-width: 50px; max-height: 50px" alt="logo">
                       <span style='margin-left:4em;font-weight: bold;'>Login</span> 
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                   </div>
                   <form id="form" >
                   <div class="modal-body">
                       <div class="input-group mb-3">
                           <span class="input-group-text">Id</span>
                           <input type="text" class="form-control" id="id" name="id">
                       </div>  
                       <div class="input-group mb-3">
                           <span class="input-group-text">clave</span>
                           <input type="password" class="form-control" id="clave" name="clave">
                       </div>      
                   </div>
                   <div class="modal-footer">
                       <button id="apply" type="button" class="btn btn-primary" id="apply">Login</button>
                   </div>
                   <div class="input-group">
                       <span style="font-style: italic; margin-left: 2em;">No tiene cuenta? ... </span>
                       <a id="register" class="btn btn-info btn-block" style="margin-bottom: 15px; background-color: white; color:red; border:1px solid red" href="#">Registrese aquí</a>
                   </div>                
                   </form>                 
               </div>         
           </div>          
       </div>   
    `;
    }

    renderBodyFiller = () => {
        var html = `
        <div id='bodyFiller' style='margin-left: 10%; margin-top:100px; width: 80%; text-align: center; font-size: 1.5em'>
            <p>Preguntas sobre programacion</p>
        </div>
    `;
        this.dom.querySelector('#app>#body').replaceChildren();
        this.dom.querySelector('#app>#body').innerHTML = html;
    }

    renderMenuItems = () => {
        var html = '';
        if (globalstate.user === null) {
            html += `
              <li class="nav-item">
                  <a class="nav-link" id="login" href="#" data-bs-toggle="modal"> <span><i class="fa fa-address-card"></i></span> Login </a>
              </li>
            `;
        } else {
            if (globalstate.user.rol === 'CLI') {
                html += `
                `;
            }
            if (globalstate.user.rol === 'ADM') {
                html += `
                `;
            }
            html += `
              <li class="nav-item">
                  <a class="nav-link" id="logout" href="#" data-bs-toggle="modal"> <span><i class="fas fa-power-off"></i></span> Logout (${globalstate.user.id}) </a>
              </li>
            `;
        }
        ;
        this.dom.querySelector('#app>#menu #menuItems').replaceChildren();
        this.dom.querySelector('#app>#menu #menuItems').innerHTML = html;
        this.dom.querySelector("#app>#menu #menuItems #login")?.addEventListener('click', e => this.modal.show());
        this.dom.querySelector("#app>#menu #menuItems #logout")?.addEventListener('click', e => this.logout());
        if (globalstate.user !== null) {
            switch (globalstate.user.rol) {
                case 'CLI':
                    //  this.countriesShow();
                    break;
            }
        }
    }

    countriesShow = () => {
        this.dom.querySelector('#app>#body').replaceChildren(this.countries.dom);
        this.countries.list();
    }

    login = async () => {
        const candidate = Object.fromEntries((new FormData(this.dom.querySelector("#form"))).entries());
        candidate.rol = 'CLI';
        var requestDireccion = `${backend}/clientes/login`;
        // invoque backend for login
        //Envia el cliente o administrador al backEnd para revisar si existe para hacer login
        let request = new Request(requestDireccion, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(candidate)
        });

        let response = await fetch(request);
        if (!response.ok) {
            //errorMessage(response.status);
            alert("Usuario o Contraseña invalida");
            return;
        }

        globalstate.user = await response.json();
        globalstate.user.rol = 'CLI';
        //console.log(JSON.stringify(candidate));

        console.log(JSON.stringify(globalstate.user));

        this.modal.hide();
        this.renderMenuItems();
    }

    logout = async () => {
        // invoque backend for login
        globalstate.user = null;
        this.dom.querySelector('#app>#body').replaceChildren();
        this.renderBodyFiller();
        this.renderMenuItems();
        // Realizar la solicitud DELETE al endpoint de cierre de sesión en el backend
        let request = new Request(`${backend}/clientes/logout`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
        });

        let response = await fetch(request);
        if (!response.ok) {
            // Manejar el error de cierre de sesión
            // Puedes mostrar una alerta u otra acción apropiada
            alert('Error al cerrar sesión');
        } else {
            alert('Sesión cerrada exitosamente');
        }

    }

}
