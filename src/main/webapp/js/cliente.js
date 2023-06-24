/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */


class Cliente {
    dom;
    modal; // login modal

    state;  // state variables: if any

    constructor() {
        this.state = {
            preguntas: []
        };
        this.dom = this.render();
        this.modal = new bootstrap.Modal(this.dom.querySelector('#app>#modal'));
        var button = this.dom.querySelector("#search");
        button.addEventListener('click', e => this.filterPreguntas());
    }

    render = () => {
        const html = `
            ${this.renderBody()} 
            ${this.renderModal()} 
        `;
        var rootContent = document.createElement('div');
        rootContent.id = 'app';
        rootContent.innerHTML = html;
        return rootContent;
    }

    renderBody = () => {
        const html = `
      <div id="list" class="container">     
        <div class="card bg-light">
          <h4 class="card-title mt-3 text-center">Preguntas</h4>    
          <div class="card-body mx-auto w-75" >
            <form id="form">
              <div class="input-group mb-3">
                <span class="input-group-text">Topic</span>
                <input id="name" type="text" class="form-control">
                <div class="btn-toolbar">
                  <div class="btn-group me-2"><button type="button" class="btn btn-primary" id="search">Buscar</button> </div>                      
                </div>  
              </div>
            </form>

            <div class="table-responsive " style="max-height: 300px; overflow: auto">
              <table class="table table-striped table-hover">
                <thead>
                  <tr>
                  </tr>
                </thead>
                <tbody id="listbody"></tbody>
              </table>
            </div>                 
          </div>
        </div>
      </div>
        `;


        return html;
    }

    filterPreguntas = async() => {
        var text = this.dom.querySelector("#name").value;
        const requestDireccion = `${backend}/clientes/${text}`; // Reemplaza "backend" con la URL de tu backend y "/preguntas/all" con el endpoint correcto
        var preguntas;
        if (text === "") {
            preguntas = this.state.preguntas;
        } else {
            // Realizar la solicitud GET al endpoint de obtención de preguntas en el backend
            const response = await fetch(requestDireccion, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                // Manejar el error de la solicitud
                alert('Error al obtener las preguntas');
                return;
            }

            preguntas = await response.json();
        }
        var listing = this.dom.querySelector("#listbody");
        listing.innerHTML = "";
        preguntas.forEach(e => this.row(listing, e));
    }

    renderModal = () => {
        const html = `
                    <div id="modal" class="modal fade" tabindex="-1">
           <div class="modal-dialog">
               <div class="modal-content">
                   <div class="modal-header" >
                       <span style='margin-left:4em;font-weight: bold;'id="modalHeaderDescription">Empty</span> 
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                   </div>
                        <div class="modal-body" id="modal-body">
                            <h4 class="card-title mt-3 text-center" id="card-modal">Respuestas</h4>  
                        </div>   
               </div>         
           </div>          
       </div>  
        `;
        return html;
    }

    list = async() => {
        await this.listPreguntas();
        var listing = this.dom.querySelector("#listbody");
        listing.innerHTML = "";
        this.state.preguntas.forEach(e => this.row(listing, e));
    }

    row = (list, p) => {

        var tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${p.enunciado}</td>
        `;
        tr.addEventListener('dblclick', e => this.preguntaShow(p));
        list.append(tr);
    }

    preguntaShow = (p) => {
        var modalHeaderDescription = this.dom.querySelector("#modalHeaderDescription");
        modalHeaderDescription.textContent = p.enunciado;
        var modalBody = this.dom.querySelector("#modal-body");
        // Crear el contenedor principal
        const container = document.createElement("div");
        container.className = "container";
        // Crear el contenedor de elementos flexibles
        const flexContainer = document.createElement("div");
        flexContainer.className = "d-flex justify-content-between";
        p.opciones.forEach(e => this.renderOpcion(flexContainer, e));
        // Crear el elemento <button>
        const button = document.createElement("button");

        // Asignar los atributos al botón
        button.id = "Enviar";
        button.type = "button";
        button.className = "btn btn-primary btn-comprar";
        button.textContent = "Enviar";
        button.addEventListener('click', e => this.enviaRespuesta());
        container.appendChild(flexContainer);
        container.appendChild(button);
        modalBody.appendChild(container);
        this.modal.show();
    }

    enviaRespuesta = async () => {
        var modalHeaderDescription = this.dom.querySelector("#modalHeaderDescription");
        var text = modalHeaderDescription.textContent;
        var respuestaSeleccionada = this.dom.querySelector('input[name="Respuestas"]:checked');
        var respuestaText = respuestaSeleccionada.textContent;
        const opciones = document.getElementsByName("Respuestas");
        let opcionSeleccionada = null;

        // Recorrer todas las opciones para encontrar la seleccionada
        opciones.forEach(opcion => {
            if (opcion.checked) {
                opcionSeleccionada = opcion.value;
            }
        });

        /* const enunciado = encodeURIComponent(text);
         const respuesta = encodeURIComponent(opcionSeleccionada);*/

        const url = `${backend}/clientes/verificaRespuesta?enunciado=${text}&respuesta=${opcionSeleccionada}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const resultado = await response.json();
                console.log('Respuesta verificada:', resultado);
                // Aquí puedes realizar acciones adicionales dependiendo del resultado de la verificación
                if (resultado) {
                    alert("Respuesta correcta");
                } else {
                    alert("Respuesta incorrecta");
                }

                await this.list();
                this.modal.hide();

            } else {
                console.log('Error al verificar la respuesta');
            }
        } catch (error) {
            console.log('Error:', error);
        }

        var modalBody = this.dom.querySelector("#modal-body");
        modalBody.innerHTML = ``;
    }

    renderOpcion = (flexContainer, o) => {
        const formCheck = document.createElement("div");
        formCheck.className = "form-check";

        const input = document.createElement("input");
        input.className = "form-check-input";
        input.type = "radio";
        input.name = "Respuestas";
        input.id = o;
        input.value = o;

        const label = document.createElement("label");
        label.className = "form-check-label";
        label.htmlFor = o;
        label.textContent = o;

        formCheck.appendChild(input);
        formCheck.appendChild(label);

        flexContainer.appendChild(formCheck);
    }

    /*renderOpcion = (body, o) => {
     const div = document.createElement("div");
     div.textContent=o;
     body.appendChild(div);
     }*/

    listPreguntas = async() => {
        try {
            const requestDireccion = `${backend}/clientes/preguntas`; // Reemplaza "backend" con la URL de tu backend y "/preguntas/all" con el endpoint correcto

            // Realizar la solicitud GET al endpoint de obtención de preguntas en el backend
            const response = await fetch(requestDireccion, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                // Manejar el error de la solicitud
                alert('Error al obtener las preguntas');
                return;
            }

            const preguntas = await response.json();

            // Utiliza las preguntas obtenidas para realizar las operaciones necesarias
            console.log(preguntas);
            this.state.preguntas = preguntas;
        } catch (error) {
            console.log('Error:', error);
        }
    }
}