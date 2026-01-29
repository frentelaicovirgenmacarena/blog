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

// Helper para números romanos (porque el latín mola)
function toRoman(num) {
    const roman = {
        M: 1000,
        CM: 900,
        D: 500,
        CD: 400,
        C: 100,
        XC: 90,
        L: 50,
        XL: 40,
        X: 10,
        IX: 9,
        V: 5,
        IV: 4,
        I: 1
    };
    let str = '';
    for (let i of Object.keys(roman)) {
        let q = Math.floor(num / roman[i]);
        num -= q * roman[i];
        str += i.repeat(q);
    }
    return str;
}

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
                    const data = doc.data();
                    // Renderizar con H1 para SEO
                    renderizarCarta(data, doc.id, true);

                    // Actualizar Meta Tags Dinámicamente
                    actualizarSEO(data.titulo, data.cuerpo, data.imagenUrl);

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

                // Actualizar fecha litúrgica en el header
                const fechaHeader = document.getElementById('fecha-liturgica-header');
                if (fechaHeader) {
                    const hoy = new Date();
                    const year = hoy.getFullYear();
                    const romanYear = toRoman(year);
                    // Formato: "Anni Domini MMXXVI"
                    fechaHeader.innerText = `Anni Domini ${romanYear}`;
                }

                const ahora = new Date();

                snapshot.forEach((doc) => {
                    const data = doc.data();
                    const fechaPub = data.fechaPublicacion ? data.fechaPublicacion.toDate() : new Date();

                    // FILTRADO PÚBLICO ESTRICTO
                    const esPublico = data.estado === 'publicado';
                    const yaHaSalido = fechaPub <= ahora;

                    if (esPublico && yaHaSalido) {
                        renderizarCarta(data, doc.id, false);
                    }
                });
            }, (error) => {
                console.error("Fe débil:", error);
            });
    }
}

function actualizarSEO(titulo, cuerpo, imagenUrl) {
    // Título de la página
    document.title = `${titulo} | FLVM`;

    // Metas Open Graph
    // Nota: Como es una SPA, esto afecta al navegador, pero los crawlers de RRSS 
    // a veces no lo leen si no ejecutan JS. Sin SSR es lo mejor que podemos hacer.
    const metaTitle = document.querySelector('meta[property="og:title"]');
    if (metaTitle) metaTitle.setAttribute("content", titulo);

    const metaDesc = document.querySelector('meta[property="og:description"]');
    if (metaDesc) metaDesc.setAttribute("content", cuerpo.substring(0, 150) + "...");

    if (imagenUrl) {
        const metaImg = document.querySelector('meta[property="og:image"]');
        if (metaImg) metaImg.setAttribute("content", imagenUrl);
    }
    const metaUrl = document.querySelector('meta[property="og:url"]');
    if (metaUrl) metaUrl.setAttribute("content", window.location.href);
}

function renderizarCarta(dato, id, esIndividual = false) {
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
        <div class="compartir-container-standard">
            <!-- WhatsApp -->
            <a href="https://api.whatsapp.com/send?text=${textoCompartir}%20${urlEncoded}" target="_blank" class="btn-share-std btn-wa" title="WhatsApp">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            </a>
            
            <!-- Telegram -->
            <a href="https://t.me/share/url?url=${urlEncoded}&text=${textoCompartir}" target="_blank" class="btn-share-std btn-tg" title="Telegram">
                 <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.361 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            </a>
            
            <!-- X -->
            <a href="https://twitter.com/intent/tweet?text=${textoCompartir}&url=${urlEncoded}" target="_blank" class="btn-share-std btn-x" title="X">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            
             <!-- Facebook -->
            <a href="https://www.facebook.com/sharer/sharer.php?u=${urlEncoded}" target="_blank" class="btn-share-std btn-fb" title="Facebook">
                 <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>

            <!-- Copy -->
            <a href="#" onclick="navigator.clipboard.writeText('${permalink}'); alert('Enlace copiado al breviario (portapapeles).'); return false;" class="btn-share-std btn-copy" title="Copiar Enlace">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
            </a>
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

    // Usar H1 si es vista individual, H3 si es lista
    const etiquetaTitulo = esIndividual ? 'h1' : 'h3';

    card.innerHTML = `
        <div class="fecha-liturgica">${fecha}</div>
        ${imagenHTML}
        <${etiquetaTitulo} class="titulo-noticia"><a href="${permalink}" style="text-decoration:none; color:inherit;">${dato.titulo}</a></${etiquetaTitulo}>
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
