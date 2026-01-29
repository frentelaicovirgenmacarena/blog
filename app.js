/**
 * CÓDIGO SAGRADO DE LA APLICACIÓN
 * Por favor, no tocar sin lavarse las manos con agua bendita (o gel hidroalcohólico).
 */

// 1. CONFIGURACIÓN DEL ALTAR (Firebase Config)
// IMPORTANTE: El usuario debe rellenar esto con sus propias credenciales o el espíritu santo no conectará.
const firebaseConfig = {
    apiKey: "AIzaSyCYNAHkIS0KrSOD_3PrDNVSgCJSdXunjAk",
    authDomain: "flvm-8e829.firebaseapp.com",
    projectId: "flvm-8e829",
    storageBucket: "flvm-8e829.firebasestorage.app",
    messagingSenderId: "205652705080",
    appId: "1:205652705080:web:d6ef37b92f573d43a08bcd",
    measurementId: "G-X75BSFM368"
};

// Inicializar la Gracia Divina
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// ... (Resto del código sin cambios hasta guardarNoticia)

// --------------------------------------------------------------------------
// PREDICACIÓN (Escribir noticias)
// --------------------------------------------------------------------------

// ... (Listeners del formulario)

function guardarNoticia(estado) {
    if (!auth.currentUser || auth.currentUser.email !== ADMIN_EMAIL) {
        alert("¡Alto ahí, Judas!");
        return;
    }

    const id = document.getElementById('id-noticia').value;
    const titulo = document.getElementById('titulo-post').value;
    const cuerpo = document.getElementById('cuerpo-post').value;
    const fechaInput = document.getElementById('fecha-post').value;
    const imagenUrlInput = document.getElementById('img-post').value;
    const fileInput = document.getElementById('file-post');
    const archivo = fileInput.files[0];

    // Feedback visual
    const btnSubmit = formNoticia.querySelector('button[type="submit"]');
    const textoOriginal = btnSubmit.innerText;
    btnSubmit.disabled = true;
    btnBorrador.disabled = true;
    btnSubmit.innerText = "Subiendo ofrendas...";

    // Promesa para obtener la URL de la imagen
    let promesaImagen;

    if (archivo) {
        // Opción A: Subir archivo al Almacén Celestial
        const storageRef = storage.ref();
        const archivoRef = storageRef.child(`reliquias/${Date.now()}_${archivo.name}`);
        promesaImagen = archivoRef.put(archivo).then((snapshot) => {
            return snapshot.ref.getDownloadURL();
        });
    } else {
        // Opción B: Usar URL existente o vacía
        promesaImagen = Promise.resolve(imagenUrlInput);
    }

    promesaImagen.then((urlFinal) => {
        btnSubmit.innerText = "Intercediendo...";

        // Preparar datos sagrados
        let fechaPublicacion;
        if (fechaInput) {
            fechaPublicacion = firebase.firestore.Timestamp.fromDate(new Date(fechaInput));
        } else {
            fechaPublicacion = firebase.firestore.FieldValue.serverTimestamp();
        }

        const datosSagrados = {
            titulo: titulo,
            imagenUrl: urlFinal, // La URL que hemos obtenido (subida o texto)
            cuerpo: cuerpo,
            estado: estado,
            fechaPublicacion: fechaPublicacion,
            ultimaModificacion: firebase.firestore.FieldValue.serverTimestamp()
        };

        if (id) {
            // Si estamos editando y no se subió/cambió imagen, quizás queramos mantener la anterior
            // Pero como rellenamos el input URL con la anterior al editar, 'urlFinal' debería ser correcta
            return db.collection(COLECCION_NOTICIAS).doc(id).update(datosSagrados);
        } else {
            datosSagrados.creadoEn = firebase.firestore.FieldValue.serverTimestamp();
            return db.collection(COLECCION_NOTICIAS).add(datosSagrados);
        }
    })
        .then(() => {
            const msg = id ? "Rectificación aceptada." : (estado === 'borrador' ? "Guardado en el Limbo." : "Tu profecía ha sido lanzada.");
            alert(msg);
            cerrarModal();
            fileInput.value = ''; // Limpiar input file
        })
        .catch((error) => {
            console.error("Error teológico:", error);
            alert("Hubo un cisma al intentar subir o guardar. Mira la consola.");
        })
        .finally(() => {
            btnSubmit.disabled = false;
            btnBorrador.disabled = false;
            btnSubmit.innerText = textoOriginal;
        });
}
const ADMIN_EMAIL = "frentelaicovirgenmacarena@gmail.com";
const COLECCION_NOTICIAS = "noticias"; // El libro de la verdad

// Referencias al DOM (Los fieles)
const btnSacristia = document.getElementById('btn-sacristia');
const modalLogin = document.getElementById('modal-login');
const modalDashboard = document.getElementById('modal-dashboard');
const modalEditor = document.getElementById('modal-editor');
const btnGoogleLogin = document.getElementById('btn-google-login');
// Actualizamos selectores de cierre
const closeBtns = document.querySelectorAll('.close, .close-editor, .close-dashboard');
const formNoticia = document.getElementById('form-noticia');
const noticiasContainer = document.getElementById('noticias-container');
const btnNuevaEpistola = document.getElementById('btn-nueva-epistola');
const tablaNoticiasCuerpo = document.getElementById('cuerpo-tabla-noticias');

// --------------------------------------------------------------------------
// LITURGIA DE AUTENTICACIÓN & NAVEGACIÓN
// --------------------------------------------------------------------------

btnSacristia.addEventListener('click', () => {
    const usuario = auth.currentUser;
    if (usuario && usuario.email === ADMIN_EMAIL) {
        abrirDashboard();
    } else {
        modalLogin.style.display = 'flex';
    }
});

btnNuevaEpistola.addEventListener('click', () => {
    modalEditor.style.display = 'flex';
    // Limpiamos form
    formNoticia.reset();
    document.getElementById('id-noticia').value = '';
    formNoticia.querySelector('#btn-publicar').innerText = "Predicar Urbi et Orbi";
});

btnGoogleLogin.addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then((result) => {
            verificarHerejia(result.user);
        })
        .catch((error) => {
            console.error("Error en la comunión digital:", error);
            alert("El diablo está en los cables.");
        });
});

function verificarHerejia(user) {
    modalLogin.style.display = 'none';
    if (user.email === ADMIN_EMAIL) {
        alert("¡Gloria! La Cúpula te reconoce.");
        abrirDashboard();
    } else {
        auth.signOut();
        alert("¡ANATEMA! No tienes permisos.");
    }
}

// Cerrar modales
closeBtns.forEach(btn => {
    btn.onclick = () => {
        modalLogin.style.display = 'none';
        modalDashboard.style.display = 'none';
        modalEditor.style.display = 'none';
    };
});

// --------------------------------------------------------------------------
// EL DASHBOARD (La Sacristía)
// --------------------------------------------------------------------------

let unsubscribeDashboard = null;

function abrirDashboard() {
    modalDashboard.style.display = 'flex';

    // Escuchar cambios en tiempo real pero solo para la tabla
    if (unsubscribeDashboard) unsubscribeDashboard();

    unsubscribeDashboard = db.collection(COLECCION_NOTICIAS)
        .orderBy("ultimaModificacion", "desc") // Ordenamos por última vez tocado
        .onSnapshot((snapshot) => {
            tablaNoticiasCuerpo.innerHTML = '';

            if (snapshot.empty) {
                tablaNoticiasCuerpo.innerHTML = '<tr><td colspan="4" style="text-align:center;">No hay pecados confesados aún.</td></tr>';
                return;
            }

            snapshot.forEach((doc) => {
                const data = doc.data();
                const id = doc.id;
                // Si fechaPublicacion es null, intenta usar fecha normal, sino '---'
                let fecha = '---';
                if (data.fechaPublicacion) {
                    fecha = data.fechaPublicacion.toDate().toLocaleDateString();
                } else if (data.creadoEn) {
                    fecha = data.creadoEn.toDate().toLocaleDateString();
                }

                const estado = data.estado === 'borrador' ? 'LIMBO' : 'PUBLICADO';

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${data.titulo}</td>
                    <td style="text-align:center;"><strong>${estado}</strong></td>
                    <td style="text-align:center;">${fecha}</td>
                    <td style="text-align:right;">
                        <button onclick="editarDesdeDashboard('${id}')" class="btn-accion-dashboard">✎</button>
                        <button onclick="eliminarNoticia('${id}')" class="btn-accion-dashboard btn-borrar">✖</button>
                    </td>
                `;
                tablaNoticiasCuerpo.appendChild(tr);
            });
        });
}

// Funciones globales para los botones onlick del dashboard
window.editarDesdeDashboard = function (id) {
    db.collection(COLECCION_NOTICIAS).doc(id).get().then((doc) => {
        if (doc.exists) {
            const data = doc.data();
            // Rellenar formulario (reutilizamos lógica)
            document.getElementById('id-noticia').value = id;
            document.getElementById('titulo-post').value = data.titulo;
            document.getElementById('img-post').value = data.imagenUrl || '';
            document.getElementById('cuerpo-post').value = data.cuerpo;

            if (data.fechaPublicacion) {
                // Ajustar al formato datetime-local (YYYY-MM-DDThh:mm)
                // Truco sucio para ajustar zona horaria local
                const d = data.fechaPublicacion.toDate();
                d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
                document.getElementById('fecha-post').value = d.toISOString().slice(0, 16);
            }

            const btnSubmit = formNoticia.querySelector('#btn-publicar');
            btnSubmit.innerText = "Confirmar Rectificación";

            modalEditor.style.display = 'flex';
        }
    });
};

window.eliminarNoticia = function (id) {
    if (confirm("¿Estás seguro de querer EXCOMULGAR esta noticia para siempre?")) {
        db.collection(COLECCION_NOTICIAS).doc(id).delete()
            .then(() => alert("Noticia eliminada. Paz a sus restos."))
            .catch((e) => alert("Error al borrar: " + e.message));
    }
};


// --------------------------------------------------------------------------
// EVANGELIZACIÓN (Vista Pública)
// --------------------------------------------------------------------------

// --------------------------------------------------------------------------
// EVANGELIZACIÓN (Vista Pública)
// --------------------------------------------------------------------------

function escucharLaPalabra() {
    // 1. Revisar si hay un ID específico en la URL (Permalink)
    const urlParams = new URLSearchParams(window.location.search);
    const idNoticia = urlParams.get('id');

    if (idNoticia) {
        // MODO PROFECÍA ÚNICA
        noticiasContainer.innerHTML = '<div class="loading-spinner">Buscando la revelación específica...</div>';

        db.collection(COLECCION_NOTICIAS).doc(idNoticia).get()
            .then((doc) => {
                noticiasContainer.innerHTML = '';
                if (doc.exists) {
                    renderizarCarta(doc.data(), doc.id);
                    // Añadir botón para ver todas
                    const divVolver = document.createElement('div');
                    divVolver.style.textAlign = 'center';
                    divVolver.style.marginTop = '2rem';
                    divVolver.innerHTML = `<button class="btn-solemne" onclick="window.location.href=window.location.pathname">Volver a las Escrituras</button>`;
                    noticiasContainer.appendChild(divVolver);
                } else {
                    noticiasContainer.innerHTML = '<p style="text-align:center;">Esa profecía no existe (o ha sido excomulgada).</p><p style="text-align:center;"><a href="index.html">Volver al rebaño</a></p>';
                }
            })
            .catch((error) => {
                console.error("Error buscando el versículo:", error);
                noticiasContainer.innerHTML = '<p>Error al buscar la verdad.</p>';
            });

    } else {
        // MODO MISA GENERAL (Todas las noticias)
        // Escuchar en tiempo real para la home
        db.collection(COLECCION_NOTICIAS)
            .orderBy("fechaPublicacion", "desc")
            .onSnapshot((snapshot) => {
                noticiasContainer.innerHTML = '';

                if (snapshot.empty) {
                    noticiasContainer.innerHTML = '<p style="text-align:center; font-style:italic;">El silencio de Dios es ensordecedor...</p>';
                    return;
                }

                const ahora = new Date();

                snapshot.forEach((doc) => {
                    const data = doc.data();
                    const fechaPub = data.fechaPublicacion ? data.fechaPublicacion.toDate() : new Date();

                    // FILTRADO PÚBLICO ESTRICTO
                    const esPublico = data.estado === 'publicado';
                    const yaHaSalido = fechaPub <= ahora;

                    if (esPublico && yaHaSalido) {
                        renderizarCarta(data, doc.id);
                    }
                });
            }, (error) => {
                console.error("Fe débil:", error);
            });
    }
}

function renderizarCarta(dato, id) {
    const fecha = dato.fechaPublicacion ? dato.fechaPublicacion.toDate().toLocaleDateString('es-SE', {
        year: 'numeric', month: 'long', day: 'numeric'
    }) : "Fecha desconocida";

    const imagenHTML = dato.imagenUrl
        ? `<img src="${dato.imagenUrl}" alt="Imagen Revelada" class="imagen-noticia">`
        : '';

    // Generar enlaces de compartir
    // URL actual base + ?id=ID
    const baseUrl = window.location.origin + window.location.pathname;
    const permalink = `${baseUrl}?id=${id}`;
    const textoCompartir = encodeURIComponent(`¡Milagro en el FLVM! ${dato.titulo}`);
    const urlEncoded = encodeURIComponent(permalink);

    const shareLinks = `
        <div class="compartir-container">
            <div class="titulo-compartir">Difundir la palabra:</div>
            <a href="https://api.whatsapp.com/send?text=${textoCompartir}%20${urlEncoded}" target="_blank" class="btn-social bg-wa" title="WhatsApp">W</a>
            <a href="https://t.me/share/url?url=${urlEncoded}&text=${textoCompartir}" target="_blank" class="btn-social bg-tg" title="Telegram">T</a>
            <a href="https://twitter.com/intent/tweet?text=${textoCompartir}&url=${urlEncoded}" target="_blank" class="btn-social bg-x" title="X (Twitter)">X</a>
            <a href="https://www.facebook.com/sharer/sharer.php?u=${urlEncoded}" target="_blank" class="btn-social bg-fb" title="Facebook">F</a>
            <a href="#" onclick="navigator.clipboard.writeText('${permalink}'); alert('Enlace copiado al breviario (portapapeles).'); return false;" class="btn-social bg-copy" title="Copiar Enlace">🔗</a>
        </div>
    `;

    const card = document.createElement('article');
    card.className = 'card-noticia';
    // ID para anclas y búsqueda
    card.id = `noticia-${id}`;

    // Guardar datos en el elemento para edición fácil (ADMIN)
    card.dataset.titulo = dato.titulo;
    card.dataset.imagenUrl = dato.imagenUrl || '';
    card.dataset.cuerpo = dato.cuerpo;
    if (dato.fechaPublicacion) {
        // Ajustar fecha para input datetime-local
        const d = dato.fechaPublicacion.toDate();
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        card.dataset.fechaISO = d.toISOString().slice(0, 16);
    }

    card.innerHTML = `
        <div class="fecha-liturgica">${fecha}</div>
        ${imagenHTML}
        <h3 class="titulo-noticia"><a href="${permalink}" style="text-decoration:none; color:inherit;">${dato.titulo}</a></h3>
        <div class="cuerpo-noticia">
            ${dato.cuerpo.replace(/\n/g, '<br>')}
        </div>
        ${shareLinks}
    `;

    noticiasContainer.appendChild(card);
}

// Global para que el HTML la vea (chapuza sagrada)
window.editarNoticia = function (id) {
    const card = document.getElementById(`noticia-${id}`);
    if (!card) return;

    // Rellenar formulario
    document.getElementById('id-noticia').value = id;
    document.getElementById('titulo-post').value = card.dataset.titulo;
    document.getElementById('img-post').value = card.dataset.imagenUrl;
    document.getElementById('cuerpo-post').value = card.dataset.cuerpo;

    if (card.dataset.fechaISO) {
        document.getElementById('fecha-post').value = card.dataset.fechaISO;
    }

    // Cambiar UI del modal
    const btnSubmit = formNoticia.querySelector('#btn-publicar');
    btnSubmit.innerText = "Confirmar Rectificación";

    modalAdmin.style.display = 'flex';
};

// Iniciar la escucha
// Recuerda volver a escuchar si el auth cambia para actualizar la vista admin/public
auth.onAuthStateChanged((user) => {
    escucharLaPalabra();
});

// --------------------------------------------------------------------------
// PREDICACIÓN (Escribir noticias)
// --------------------------------------------------------------------------

const btnBorrador = document.getElementById('btn-borrador');

// Limpiar formulario al cerrar (para que no se quede con datos de edición)
// Limpiar formulario al cerrar (para que no se quede con datos de edición)
const cerrarModal = () => {
    resetearFormulario();

    // Cerrar el editor
    if (modalEditor) modalEditor.style.display = 'none';
};

// Sobrescribir el cierre de botones para que limpien y cierren lo que toca
closeBtns.forEach(btn => {
    btn.onclick = (e) => {
        // Encontrar el modal padre y cerrarlo
        const modal = btn.closest('.modal');
        if (modal) {
            modal.style.display = 'none';
        }

        // Si cerramos el editor, limpiamos formulario
        if (modal && modal.id === 'modal-editor') {
            resetearFormulario();
        }
    };
});

function resetearFormulario() {
    formNoticia.reset();
    document.getElementById('id-noticia').value = '';
    const submitBtn = formNoticia.querySelector('#btn-publicar');
    if (submitBtn) submitBtn.innerText = "Predicar Urbi et Orbi";
}

// Manejar envío normal (Publicar)
formNoticia.addEventListener('submit', (e) => {
    e.preventDefault();
    guardarNoticia('publicado');
});

// Manejar botón borrador
btnBorrador.addEventListener('click', (e) => {
    e.preventDefault();
    guardarNoticia('borrador');
});

function guardarNoticia(estado) {
    // Verificar identidad una última vez
    if (!auth.currentUser || auth.currentUser.email !== ADMIN_EMAIL) {
        alert("¡Alto ahí, Judas!");
        return;
    }

    const id = document.getElementById('id-noticia').value;
    const titulo = document.getElementById('titulo-post').value;
    const imagenUrl = document.getElementById('img-post').value;
    const cuerpo = document.getElementById('cuerpo-post').value;
    const fechaInput = document.getElementById('fecha-post').value;

    // Si hay fecha input, usala. Si no, ahora mismo.
    let fechaPublicacion;
    if (fechaInput) {
        fechaPublicacion = firebase.firestore.Timestamp.fromDate(new Date(fechaInput));
    } else {
        fechaPublicacion = firebase.firestore.FieldValue.serverTimestamp();
    }

    // Feedback visual
    const btnSubmit = formNoticia.querySelector('button[type="submit"]');
    const textoOriginal = btnSubmit.innerText;
    btnSubmit.disabled = true;
    btnBorrador.disabled = true;
    btnSubmit.innerText = "Intercediendo...";

    const datosSagrados = {
        titulo: titulo,
        imagenUrl: imagenUrl,
        cuerpo: cuerpo,
        estado: estado, // 'borrador' o 'publicado'
        fechaPublicacion: fechaPublicacion,
        ultimaModificacion: firebase.firestore.FieldValue.serverTimestamp()
    };

    let promesa;

    if (id) {
        // ACTUALIZAR (Rectificar es de sabios)
        promesa = db.collection(COLECCION_NOTICIAS).doc(id).update(datosSagrados);
    } else {
        // CREAR (Génesis)
        datosSagrados.creadoEn = firebase.firestore.FieldValue.serverTimestamp();
        promesa = db.collection(COLECCION_NOTICIAS).add(datosSagrados);
    }

    promesa
        .then(() => {
            const msg = id ? "Rectificación aceptada." : (estado === 'borrador' ? "Guardado en el Limbo con éxito." : "Tu profecía ha sido lanzada.");
            alert(msg);
            cerrarModal(); // Esto resetea el form y el ID
        })
        .catch((error) => {
            console.error("Error teológico:", error);
            alert("Hubo un cisma al intentar guardar. Mira la consola.");
        })
        .finally(() => {
            btnSubmit.disabled = false;
            btnBorrador.disabled = false;
            btnSubmit.innerText = textoOriginal;
        });
}
