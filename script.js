// Espera a que todo el HTML esté cargado
document.addEventListener('DOMContentLoaded', () => {

    // --- 0. INICIALIZACIÓN DE SONIDO ---
    let popSound, dingSound, sendSound, clickSound;
    let audioInitialized = false;

    function initAudio() {
        if (audioInitialized) return;
        
        // Inicializa Tone.js en un contexto de usuario
        Tone.start();

        // Sonido para añadir al carrito (un "pop" corto y agudo)
        popSound = new Tone.Synth({
            oscillator: { type: "triangle" },
            envelope: {
                attack: 0.01,
                decay: 0.1,
                sustain: 0.2,
                release: 0.1
            }
        }).toDestination();

        // Sonido para confirmación (un "ding" placentero)
        dingSound = new Tone.Synth({
            oscillator: { type: "sine" },
            envelope: {
                attack: 0.01,
                decay: 0.2,
                sustain: 0,
                release: 0.1
            }
        }).toDestination();

        // Sonido para enviar formulario (un "swoosh" rápido)
        sendSound = new Tone.NoiseSynth({
            noise: { type: 'white' },
            envelope: {
                attack: 0.005,
                decay: 0.05,
                sustain: 0
            }
        }).toDestination();
        
        // Sonido de clic genérico
        clickSound = new Tone.MembraneSynth({
            pitchDecay: 0.01,
            octaves: 10,
            envelope: {
                attack: 0.001,
                decay: 0.1,
                release: 0.01
            }
        }).toDestination();

        audioInitialized = true;
    }
    
    function playSound(sound) {
        if (!audioInitialized) return;
        
        if (sound === popSound) {
            sound.triggerAttackRelease("C5", "8n", Tone.now());
        } else if (sound === dingSound) {
            sound.triggerAttackRelease("E5", "8n", Tone.now());
        } else if (sound === sendSound) {
            sendSound.triggerAttackRelease("4n");
        } else if (sound === clickSound) {
            clickSound.triggerAttackRelease("C2", "8n", Tone.now());
        }
    }


    // --- 1. DATOS ---
    const joyasData = [
        {
            id: 1,
            title: 'Anillos de Compromiso',
            name: 'Elixir Colección Trilogía Gema',
            price: 2500,
            images: [
                'https://i.imgur.com/YFxgTTD.png',
                'https://i.imgur.com/LVCymFO.png',
                'https://i.imgur.com/IoQzWNr.png'
            ],
            alts: [
                'Anillo de compromiso de diamantes en primer plano',
                'Anillo de compromiso de oro blanco con un gran diamante',
                'Pareja tomados de la mano mostrando un anillo de compromiso'
            ]
        },
        {
            id: 2,
            title: 'Collares Exclusivos',
            name: 'Collar Estelar de Zafiros',
            price: 1800,
            images: [
                'https://i.imgur.com/PQKQeVr.png',
                'https://i.imgur.com/j6tezDw.png',
                'https://i.imgur.com/Akck3ql.png'
            ],
            alts: [
                'Collar de diamantes y zafiros en un maniquí de terciopelo negro',
                'Mujer usando un elegante collar de perlas',
                'Primer plano de un colgante de rubí'
            ]
        },
        {
            id: 3,
            title: 'Relojes de Lujo',
            name: 'Cronógrafo "Le Temps" Dorado',
            price: 3200,
            images: [
                'https://i.imgur.com/8gGe67N.png',
                'https://i.imgur.com/DQ9IvM2.png',
                'https://i.imgur.com/U4BMo8L.png'
            ],
            alts: [
                'Reloj de oro rosa con esfera blanca',
                'Reloj de buceo de acero inoxidable con esfera negra',
                'Detalle de la maquinaria de un reloj suizo'
            ]
        }
    ];
    
    // Objeto mainWatch
    const mainWatch = {
        id: 99, name: "Elixir Édition Limitée Verde Esmeralda Dorado", price: 25480000, title: 'Reloj de Lujo', description: "Versión (Artesanal) / Aro de fabricación (oro). Con estuche de lujo original.",
        mainImages: [ 
            'https://i.imgur.com/kzAk4B4.png', 
            'https://i.imgur.com/fXmuUVW.png', 
            'https://i.imgur.com/Aqd0Crx.png'  
        ],
        galleryImages: [ 
            'https://i.imgur.com/h3nur9t.png', 
            'https://i.imgur.com/a5txGf5.png', 
            'https://i.imgur.com/DJk8a8O.png', 
            'https://i.imgur.com/kzAk4B4.png', 
            'https://i.imgur.com/WFAnPSm.png', 
            'https://i.imgur.com/KHPrYnK.png', 
            'https://i.imgur.com/Aqd0Crx.png', 
            'https://i.imgur.com/kzAk4B4.png', 
            'https://i.imgur.com/fXmuUVW.png'  
        ],
        images: ['https://i.imgur.com/8gGe67N.png'],
        alts: ['Reloj de lujo edición limitada']
    };

    const relojesData = [
        { id: 4, name: 'Aethelred II', price: 4500, images:['https://i.imgur.com/kzAk4B4.png'], alts: ['Reloj Centro'], title: 'Reloj' }, 
        { id: 5, name: 'Valerius Gold', price: 5500, images:['https://i.imgur.com/fXmuUVW.png'], alts: ['Reloj Derecha'], title: 'Reloj' }, 
        { id: 6, name: 'Cronos Meister', price: 6200, images:['https://i.imgur.com/Aqd0Crx.png'], alts: ['Reloj Izquierda'], title: 'Reloj' }, 
    ];
    
    const allProducts = [...joyasData, ...relojesData, mainWatch];

    // --- 2. ESTADO GLOBAL ---
    let cart = [];
    let activePage = 'inicio';
    let pageData = {};
    let carruselJoyasStates = {}; 
    let detalleRelojesGalleryIndex = 0;
    let detalleRelojesCargado = false; 


    // --- 3. SELECTORES DEL DOM ---
    const allPages = document.querySelectorAll('.page-content');
    const menuModal = document.getElementById('menu-lateral-modal');
    const searchModal = document.getElementById('busqueda-modal');
    const searchInput = document.getElementById('search-input');
    const cartModal = document.getElementById('modal-anadido-al-carrito');
    const cartModalDetails = document.getElementById('modal-cart-product-details');
    const cartCountBubble = document.getElementById('cart-count-bubble');
    const toasterContainer = document.getElementById('toaster-container');
    const searchResultsContainer = document.getElementById('search-results-container');
    const searchResultsList = document.getElementById('search-results-list');
    const cestaContentContainer = document.getElementById('cesta-content-container');
    const joyasGridContainer = document.getElementById('joyas-grid-container');
    const joyasGridContainerPage = document.getElementById('joyas-grid-container-page');
    const relojesCarouselContainer = document.getElementById('relojes-carousel'); 
    const detalleRelojesCarousel = document.getElementById('relojes-detalle-carousel');
    const detalleRelojesGallery = document.getElementById('relojes-detalle-gallery');
    const contactForm = document.getElementById('contact-form');
    const newsletterForm = document.getElementById('newsletter-form');
    
    // Selectores del modal de Login
    const loginModal = document.getElementById('login-modal');
    const audioToggle = document.getElementById('audioToggle');
    const videoBackground = document.getElementById('videoBackground');
    const iconMuted = document.getElementById('icon-muted');
    const iconUnmuted = document.getElementById('icon-unmuted');
    const loginForm = document.getElementById('loginForm');
    const googleLoginBtn = document.getElementById('googleLoginBtn');

    // --- 4. FUNCIONES DE RENDERIZACIÓN ---
    
    function showToast({ title, description }) {
        const toastId = `toast-${Date.now()}`;
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.id = toastId;
        toast.innerHTML = `
            <button class="toast-close" data-toast-id="${toastId}">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            ${title ? `<div class="toast-title">${title}</div>` : ''}
            ${description ? `<div class="toast-description">${description}</div>` : ''}
        `;
        toasterContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 5000);
    }

    function renderJoyaCard(joya) {
        if (carruselJoyasStates[joya.id] === undefined) {
            carruselJoyasStates[joya.id] = 0;
        }
        const activeImage = carruselJoyasStates[joya.id];

        const imagesHtml = joya.images.map((img, i) => `
            <img
                key="${i}"
                src="${img}"
                alt="${joya.alts[i]}"
                class="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${activeImage === i ? 'opacity-100' : 'opacity-0'}"
            />
        `).join('');
        
        const dotsHtml = joya.images.map((_, i) => `
            <button data-joya-id="${joya.id}" data-slide-to="${i}" class="joya-dot-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-2 h-2 transition-colors duration-300 ${activeImage === i ? 'text-white fill-current' : 'text-white/50'}"><circle cx="12" cy="12" r="10"></circle></svg>
            </button>
        `).join('');

        return `
            <div class="flex flex-col items-center">
                <div class="relative group overflow-hidden rounded-lg w-full">
                    <div class="relative aspect-square w-full">
                        ${imagesHtml}
                    </div>
                    <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                    <div class="absolute inset-0 flex flex-col justify-end p-6 text-white">
                        <h3 class="font-serif-display text-3xl mb-2">${joya.title}</h3>
                    </div>
                    <div class="absolute top-1/2 left-4 right-4 transform -translate-y-1/2 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                        
                        <button data-joya-id="${joya.id}" data-direction="prev" class="joya-nav-button btn-nav w-[50px] h-[50px]"> 
                            <div class="glass-container">
                                <div class="glass-filter"></div>
                                <div class="glass-overlay"></div>
                                <div class="glass-specular"></div>
                                <div class="glass-content">
                                    <svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
                                </div>
                            </div>
                        </button>
                        
                        <button data-joya-id="${joya.id}" data-direction="next" class="joya-nav-button btn-nav w-[50px] h-[50px]"> 
                            <div class="glass-container">
                                <div class="glass-filter"></div>
                                <div class="glass-overlay"></div>
                                <div class="glass-specular"></div>
                                <div class="glass-content">
                                    <svg viewBox="0 0 24 24"><path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/></svg>
                                </div>
                            </div>
                        </button>

                    </div>
                    <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                        ${dotsHtml}
                    </div>
                </div>
                <div class="text-center mt-6 w-full cursor-pointer nav-link" data-page="detalleProducto" data-product-id="${joya.id}">
                    <p class="text-white text-lg">${joya.name}</p>
                    <p class="text-[#DBE826] text-xl font-bold my-2">$${joya.price.toLocaleString('es-CO')}</p>
                    <p class="text-gray-400 text-sm">GASTOS DE ENVÍO Y ADUANAS INCLUIDOS</p>
                </div>
                <div class="mt-6 w-full max-w-xs text-center">
                    <p class="text-white text-sm mb-4">Tu Joya Ideal</p>
                    <div class="flex flex-col space-y-3">
                        <button class="add-to-cart-button w-full py-3 px-4 bg-brand-gold text-brand-dark font-bold text-sm uppercase tracking-wider rounded" data-product-id="${joya.id}">AÑADIR AL CARRITO</button>
                    </div>
                </div>
            </div>
        `;
    }

    function renderJoyasGrid() {
        const html = joyasData.map(renderJoyaCard).join('');
        joyasGridContainer.innerHTML = html;
        joyasGridContainerPage.innerHTML = html; 
    }
    
    // --- LÓGICA COMPARTIDA DEL CANVAS ---

    function lerp(start, end, t) {
        return start * (1 - t) + end * t;
    }

    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    
    function createRoundedRectPath(ctx, x, y, width, height, radius) {
        if (typeof radius === 'number') {
            radius = {tl: radius, tr: radius, br: radius, bl: radius};
        } else {
            radius = {...{tl: 0, tr: 0, br: 0, bl: 0}, ...radius};
        }
        ctx.beginPath();
        ctx.moveTo(x + radius.tl, y);
        ctx.lineTo(x + width - radius.tr, y);
        ctx.arcTo(x + width, y, x + width, y + radius.tr, radius.tr);
        ctx.lineTo(x + width, y + height - radius.br);
        ctx.arcTo(x + width, y + height, x + width - radius.br, y + height, radius.br);
        ctx.lineTo(x + radius.bl, y + height);
        ctx.arcTo(x, y + height, x, y + height - radius.bl, radius.bl);
        ctx.lineTo(x, y + radius.tl);
        ctx.arcTo(x, y, x + radius.tl, y, radius.tl);
        ctx.closePath();
    }

    function getRelojItemProps(itemIndex, centerIndex, totalItems) {
        const relativeIndex = (itemIndex - centerIndex + totalItems) % totalItems;
        
        if (relativeIndex === 0) { 
            return { xTranslatePercent: 0, scale: 1, opacity: 1, zIndex: 2, overlay: 'rgba(0,0,0,0.3)' };
        }
        if (relativeIndex === 1) { 
            return { xTranslatePercent: 20, scale: 0.7, opacity: 0.5, zIndex: 1, overlay: 'rgba(0,0,0,0.7)' };
        }
        if (relativeIndex === (totalItems - 1)) { 
            return { xTranslatePercent: -20, scale: 0.7, opacity: 0.5, zIndex: 1, overlay: 'rgba(0,0,0,0.7)' };
        }

        return { xTranslatePercent: 0, scale: 0, opacity: 0, zIndex: 0, overlay: 'rgba(0,0,0,0.7)' };
    }
    
    const baseImgAspectRatio = 344 / 475; 
    const sharedTransitionDuration = 700; 

    
    // --- LÓGICA DEL CARRUSEL DE CANVAS (PRINCIPAL) ---
    
    const canvas = document.getElementById('relojes-canvas');
    const ctx = canvas.getContext('2d');
    const totalRelojes = relojesData.length;
    let loadedRelojesImages = []; 
    let carruselRelojesIndex = 0;
    let animationState = {
        fromIndex: 0,
        toIndex: 0,
        progress: 1,
        startTime: 0
    };
    let baseImgHeight = 384; 
    let baseImgWidth = 256; 

    function resizeRelojesCanvas() {
        if (relojesCarouselContainer.offsetWidth > 0) {
            canvas.width = relojesCarouselContainer.offsetWidth;
            canvas.height = relojesCarouselContainer.offsetHeight;
            baseImgHeight = canvas.height; 
            baseImgWidth = baseImgHeight * baseImgAspectRatio; 
        }
    }

    function drawRelojesCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (animationState.progress < 1) {
            const elapsed = Date.now() - animationState.startTime;
            animationState.progress = Math.min(1, elapsed / sharedTransitionDuration);
        }
        const easeProgress = easeInOutCubic(animationState.progress);

        let drawQueue = []; 

        for (let i = 0; i < totalRelojes; i++) {
            const fromProps = getRelojItemProps(i, animationState.fromIndex, totalRelojes);
            const toProps = getRelojItemProps(i, animationState.toIndex, totalRelojes);

            const currentScale = lerp(fromProps.scale, toProps.scale, easeProgress);
            const currentXTranslate = lerp(fromProps.xTranslatePercent, toProps.xTranslatePercent, easeProgress);
            const currentOpacity = lerp(fromProps.opacity, toProps.opacity, easeProgress);
            
            const zIndex = toProps.scale > fromProps.scale ? toProps.zIndex : fromProps.zIndex;
            const overlayColor = easeProgress < 0.5 ? fromProps.overlay : toProps.overlay;

            const w = baseImgWidth * currentScale;
            const h = baseImgHeight * currentScale;
            const xPos = (canvas.width / 2) + (canvas.width * (currentXTranslate / 100)) - (w / 2);
            const yPos = (canvas.height - h) / 2; 

            drawQueue.push({
                img: loadedRelojesImages[i],
                x: xPos, y: yPos, w: w, h: h,
                opacity: currentOpacity, zIndex: zIndex, overlay: overlayColor,
                name: relojesData[i].name 
            });
        }

        drawQueue.sort((a, b) => a.zIndex - b.zIndex);

        drawQueue.forEach(item => {
            if (item.img && item.img.complete && item.img.naturalWidth > 0) { 
                ctx.save();
                ctx.globalAlpha = item.opacity;
                
                createRoundedRectPath(ctx, item.x, item.y, item.w, item.h, 13);
                ctx.clip();
                ctx.drawImage(item.img, item.x, item.y, item.w, item.h);
                
                const gradient = ctx.createLinearGradient(item.x, item.y + item.h, item.x, item.y + item.h * 0.5);
                gradient.addColorStop(0, item.overlay); 
                gradient.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = gradient;
                ctx.fillRect(item.x, item.y, item.w, item.h);

                ctx.restore(); 

                ctx.save();
                ctx.globalAlpha = item.opacity;
                ctx.fillStyle = "white";
                ctx.font = "24px 'Playfair Display', serif"; 
                ctx.textAlign = "left";
                ctx.textBaseline = "bottom";
                ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
                ctx.shadowBlur = 8;
                ctx.shadowOffsetY = 2;
                ctx.fillText(item.name, item.x + 24, item.y + item.h - 24); 
                ctx.restore();
            }
        });

        requestAnimationFrame(drawRelojesCanvas);
    }

    function startRelojesCarousel() {
        resizeRelojesCanvas();
        drawRelojesCanvas();
    }

    function loadRelojesImages() {
        let imagesToLoad = totalRelojes;
        function onImageLoad() {
            imagesToLoad--;
            if (imagesToLoad === 0) {
                startRelojesCarousel();
            }
        }
        relojesData.forEach((reloj, index) => {
            const img = new Image();
            img.src = reloj.images[0]; 
            img.onload = onImageLoad;
            img.onerror = onImageLoad; 
            loadedRelojesImages[index] = img;
        });
    }

    function moveRelojesCarouselLeft() {
        if (animationState.progress < 1) return;
        const newIndex = (carruselRelojesIndex + 1) % totalRelojes; 
        animationState = {
            fromIndex: carruselRelojesIndex,
            toIndex: newIndex,
            progress: 0,
            startTime: Date.now()
        };
        carruselRelojesIndex = newIndex;
    }

    function moveRelojesCarouselRight() {
        if (animationState.progress < 1) return;
        const newIndex = (carruselRelojesIndex - 1 + totalRelojes) % totalRelojes;
        animationState = {
            fromIndex: carruselRelojesIndex,
            toIndex: newIndex,
            progress: 0,
            startTime: Date.now()
        };
        carruselRelojesIndex = newIndex;
    }
    

    // --- LÓGICA DEL SEGUNDO CARRUSEL (DETALLE) ---
    
    const detalleCanvas = document.getElementById('detalle-relojes-canvas');
    const detalleCtx = detalleCanvas.getContext('2d');
    const totalDetalleRelojes = mainWatch.mainImages.length; 
    let loadedDetalleRelojesImages = [];
    let detalleCarruselRelojesIndex = 0; 
    let detalleAnimationState = {
        fromIndex: 0,
        toIndex: 0,
        progress: 1,
        startTime: 0
    };
    let detalleBaseImgHeight = 288;
    let detalleBaseImgWidth = 217; 

    function resizeDetalleRelojesCanvas() {
        if (detalleRelojesCarousel.offsetWidth > 0) {
            detalleCanvas.width = detalleRelojesCarousel.offsetWidth;
            detalleCanvas.height = detalleRelojesCarousel.offsetHeight;
            detalleBaseImgHeight = detalleCanvas.height;
            detalleBaseImgWidth = detalleBaseImgHeight * baseImgAspectRatio; 
        }
    }

    function drawDetalleRelojesCanvas() {
        detalleCtx.clearRect(0, 0, detalleCanvas.width, detalleCanvas.height);

        if (detalleAnimationState.progress < 1) {
            const elapsed = Date.now() - detalleAnimationState.startTime;
            detalleAnimationState.progress = Math.min(1, elapsed / sharedTransitionDuration);
        }
        const easeProgress = easeInOutCubic(detalleAnimationState.progress);

        let drawQueue = [];

        for (let i = 0; i < totalDetalleRelojes; i++) {
            const fromProps = getRelojItemProps(i, detalleAnimationState.fromIndex, totalDetalleRelojes);
            const toProps = getRelojItemProps(i, detalleAnimationState.toIndex, totalDetalleRelojes);

            const currentScale = lerp(fromProps.scale, toProps.scale, easeProgress);
            const currentXTranslate = lerp(fromProps.xTranslatePercent, toProps.xTranslatePercent, easeProgress);
            const currentOpacity = lerp(fromProps.opacity, toProps.opacity, easeProgress);
            
            const zIndex = toProps.scale > fromProps.scale ? toProps.zIndex : fromProps.zIndex;
            const overlayColor = easeProgress < 0.5 ? fromProps.overlay : toProps.overlay;

            const w = detalleBaseImgWidth * currentScale;
            const h = detalleBaseImgHeight * currentScale;
            const xPos = (detalleCanvas.width / 2) + (detalleCanvas.width * (currentXTranslate / 100)) - (w / 2);
            const yPos = (detalleCanvas.height - h) / 2;

            drawQueue.push({
                img: loadedDetalleRelojesImages[i],
                x: xPos, y: yPos, w: w, h: h,
                opacity: currentOpacity, zIndex: zIndex, overlay: overlayColor
            });
        }

        drawQueue.sort((a, b) => a.zIndex - b.zIndex);

        drawQueue.forEach(item => {
            if (item.img && item.img.complete && item.img.naturalWidth > 0) { 
                detalleCtx.save();
                detalleCtx.globalAlpha = item.opacity;
                
                createRoundedRectPath(detalleCtx, item.x, item.y, item.w, item.h, 13);
                detalleCtx.clip();
                detalleCtx.drawImage(item.img, item.x, item.y, item.w, item.h);
                
                const gradient = detalleCtx.createLinearGradient(item.x, item.y + item.h, item.x, item.y + item.h * 0.5);
                gradient.addColorStop(0, item.overlay); 
                gradient.addColorStop(1, 'rgba(0,0,0,0)');
                detalleCtx.fillStyle = gradient;
                detalleCtx.fillRect(item.x, item.y, item.w, item.h); 

                detalleCtx.restore();
            }
        });

        requestAnimationFrame(drawDetalleRelojesCanvas);
    }

    function startDetalleRelojesCarousel() {
        resizeDetalleRelojesCanvas();
        drawDetalleRelojesCanvas();
    }

    function loadDetalleRelojesImages() {
        let imagesToLoad = totalDetalleRelojes;
        function onImageLoad() {
            imagesToLoad--;
            if (imagesToLoad === 0) {
                startDetalleRelojesCarousel();
            }
        }
        mainWatch.mainImages.forEach((imgSrc, index) => {
            const img = new Image();
            img.src = imgSrc;
            img.onload = onImageLoad;
            img.onerror = onImageLoad; 
            loadedDetalleRelojesImages[index] = img;
        });
        detalleRelojesCargado = true;
    }

    function moveDetalleRelojesCarouselLeft() {
        if (detalleAnimationState.progress < 1) return;
        const newIndex = (detalleCarruselRelojesIndex + 1) % totalDetalleRelojes;
        detalleAnimationState = {
            fromIndex: detalleCarruselRelojesIndex,
            toIndex: newIndex,
            progress: 0,
            startTime: Date.now()
        };
        detalleCarruselRelojesIndex = newIndex;
    }

    function moveDetalleRelojesCarouselRight() {
        if (detalleAnimationState.progress < 1) return;
        const newIndex = (detalleCarruselRelojesIndex - 1 + totalDetalleRelojes) % totalDetalleRelojes;
        detalleAnimationState = {
            fromIndex: detalleCarruselRelojesIndex,
            toIndex: newIndex,
            progress: 0,
            startTime: Date.now()
        };
        detalleCarruselRelojesIndex = newIndex;
    }
    

    function renderDetalleRelojes() {
        const galleryHtml = mainWatch.galleryImages.map((img, i) => `
            <div key=${i} class="w-1/3 flex-shrink-0">
                <img src="${img}" class="w-full h-32 object-cover rounded-lg" alt="Vista de galería ${i+1}">
            </div>
        `).join('');

        detalleRelojesGallery.innerHTML = `
            <button id="detalle-gallery-prev" class="absolute left-0 z-10 btn-nav w-[40px] h-[40px]">
                 <div class="glass-container">
                    <div class="glass-filter"></div>
                    <div class="glass-overlay"></div>
                    <div class="glass-specular"></div>
                    <div class="glass-content">
                        <svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
                    </div>
                </div>
            </button>
            <div class="flex gap-4 transition-transform duration-500" style="transform: translateX(-${detalleRelojesGalleryIndex * (100/3)}%)">
                ${galleryHtml}
            </div>
            <button id="detalle-gallery-next" class="absolute right-0 z-10 btn-nav w-[40px] h-[40px]">
                 <div class="glass-container">
                    <div class="glass-filter"></div>
                    <div class="glass-overlay"></div>
                    <div class="glass-specular"></div>
                    <div class="glass-content">
                        <svg viewBox="0 0 24 24"><path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/></svg>
                    </div>
                </div>
            </button>
        `;
    }

    function renderCesta() {
        if (cart.length === 0) {
            cestaContentContainer.innerHTML = `
                <div class="text-center text-white/70">
                    <p class="text-xl mb-6">Tu cesta está vacía.</p>
                    <button data-page="inicio" class="nav-link bg-brand-gold text-brand-dark font-bold py-3 px-8 text-sm uppercase tracking-widest rounded-sm hover:opacity-90 transition-colors">
                        Continuar Comprando
                    </button>
                </div>
            `;
        } else {
            const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            const total = subtotal; 

            const itemsHtml = cart.map(item => `
                <div class="flex items-center gap-4 text-white">
                    <img src="${item.images[0]}" alt="${item.alts[0]}" class="w-24 h-24 object-cover rounded-md" />
                    <div class="flex-grow">
                        <p class="font-bold">${item.name}</p>
                        <p class="text-sm text-white/70">${item.title}</p>
                        <p class="text-lg text-brand-gold mt-1">$${(item.price * item.quantity).toLocaleString('es-CO')}</p>

                    </div>
                    <div class="flex items-center gap-3 border border-white/20 rounded-full px-3 py-1">
                        <button class="cart-quantity-update" data-product-id="${item.id}" data-product-name="${item.name}" data-quantity="${item.quantity - 1}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><line x1="5" y1="12" x2="19" y2="12"></line></svg></button>
                        <span class="w-6 text-center">${item.quantity}</span>
                        <button class="cart-quantity-update" data-product-id="${item.id}" data-product-name="${item.name}" data-quantity="${item.quantity + 1}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></button>
                    </div>
                    <button class="cart-remove-item text-white/50 hover:text-red-500 transition-colors" data-product-id="${item.id}" data-product-name="${item.name}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                </div>
            `).join('');

            cestaContentContainer.innerHTML = `
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
                    <div class="lg:col-span-2 bg-[#111]/50 p-6 rounded-lg">
                        <h2 class="text-2xl font-serif-display text-white mb-6">Tus Productos</h2>
                        <div class="space-y-6">${itemsHtml}</div>
                    </div>
                    <div class="lg:col-span-1">
                        <div class="bg-[#111]/50 p-8 rounded-lg text-white sticky top-40">
                            <h2 class="text-2xl font-serif-display text-white mb-6">Resumen de Compra</h2>
                            <div class="space-y-3">
                                <div class="flex justify-between"><span class="text-white/70">Subtotal</span><span>$${subtotal.toLocaleString('es-CO')}</span></div>
                                <div class="flex justify-between"><span class="text-white/70">Envío</span><span class="text-brand-gold">Gratis</span></div>
                                <div class="border-t border-white/20 my-4"></div>
                                <div class="flex justify-between text-xl font-bold"><span>Total</span><span>$${total.toLocaleString('es-CO')}</span></div>
                            </div>
                            <button id="checkout-button" class="w-full mt-8 bg-brand-gold text-brand-dark font-bold py-3 text-sm uppercase tracking-widest rounded-sm hover:opacity-90 transition-colors">
                                Finalizar Compra
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    function renderCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (totalItems > 0) {
            cartCountBubble.textContent = totalItems;
            cartCountBubble.classList.remove('hidden');
        } else {
            cartCountBubble.classList.add('hidden');
        }
    }

    function renderSearchResults(query) {
        if (query.length > 1) {
            const filteredResults = allProducts.filter(item =>
                item.name.toLowerCase().includes(query.toLowerCase()) ||
                item.title.toLowerCase().includes(query.toLowerCase()) 
            );
            
            if (filteredResults.length > 0) {
                searchResultsList.innerHTML = filteredResults.map(item => `
                    <li class="search-result-item text-white p-4 bg-[#222]/50 hover:bg-brand-gold hover:text-brand-dark cursor-pointer rounded-lg transition-colors" data-product-id="${item.id}">
                        <p class="font-serif-display text-lg">${item.name}</p>
                        <p class="font-serif-display text-sm opacity-70">${item.title}</p>
                    </li>
                `).join('');
                searchResultsContainer.classList.remove('hidden');
            } else {
                searchResultsContainer.classList.add('hidden');
            }
        } else {
            searchResultsContainer.classList.add('hidden');
        }
    }
    
    // --- 5. LÓGICA DE ESTADO ---
    
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('modal-hidden');
            setTimeout(() => {
                modal.classList.add('modal-visible');
            }, 10); 
        }
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('modal-visible');
            setTimeout(() => {
                modal.classList.add('modal-hidden');
            }, 300); 
        }
    }
    
    function navigateTo(page, data = {}) {
        activePage = page;
        pageData = data;
        
        allPages.forEach(p => p.classList.remove('active'));
        
        const newPage = document.getElementById(`page-${page}`);
        if (newPage) {
            newPage.classList.add('active');
        }
        
        if (page === 'cesta') {
            renderCesta();
        } else if (page === 'detalleProducto') {
            document.getElementById('detalle-product-title').textContent = data.name;
            document.getElementById('detalle-product-message').textContent = `Detalles completos para ${data.name} estarán aquí.`;
            document.getElementById('detalle-product-details').innerHTML = `
                <img class="w-48 h-48 object-cover rounded-lg mb-6" alt="${data.alts[0]}" src="${data.images[0]}" />
                <p class="text-3xl text-[#DBE826] font-bold">$${data.price.toLocaleString('es-CO')}</p>
                <p class="text-white/70 mt-2">Esta es una página de marcador de posición para los detalles del producto.</p>
            `;
        } else if (page === 'relojesDetalle') {
            if (!detalleRelojesCargado) {
                loadDetalleRelojesImages(); 
            }
            renderDetalleRelojes(); 
        }
        
        window.scrollTo(0, 0);
    }

    function addToCart(productId) {
        let product;
        if (productId == 4 || productId == 5 || productId == 6 || productId == 99) {
            product = mainWatch;
        } else {
            product = allProducts.find(p => p.id == productId);
        }
        
        if (!product) return; 

        const existingProduct = cart.find(item => item.id === product.id);
        
        if (existingProduct) {
            cart = cart.map(item =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            );
        } else {
            cart = [...cart, { ...product, quantity: 1 }];
        }
        
        renderCartCount();
        showToast({ title: "¡Añadido con éxito!", description: `${product.name} está en tu cesta.` });
        
        const modalProduct = allProducts.find(p => p.id == productId);

        cartModalDetails.innerHTML = `
            <img class="w-24 h-24 object-cover rounded-md" alt="${modalProduct.alts[0]}" src="${modalProduct.images[0]}" />
            <div>
                <p class="font-bold text-lg">${modalProduct.name}</p>
                <p class="text-xl text-[#DBE826]">$${modalProduct.price.toLocaleString('es-CO')}</p>
            </div>
        `;
        
        openModal('modal-anadido-al-carrito');
    }

    function removeFromCart(productId, productName) {
        cart = cart.filter(item => !(item.id == productId && item.name === productName));
        renderCartCount();
        if (activePage === 'cesta') {
            renderCesta();
        }
    }

    function updateQuantity(productId, productName, newQuantity) {
        if (newQuantity <= 0) {
            removeFromCart(productId, productName);
        } else {
            cart = cart.map(item =>
                item.id == productId && item.name === productName ? { ...item, quantity: newQuantity } : item
            );
            renderCartCount();
            if (activePage === 'cesta') {
                renderCesta();
            }
        }
    }
    
    // --- 6. MANEJADORES DE EVENTOS ---

    function animateGlassButton(button) {
        if (!button) return;
        button.classList.add('clicked');
        setTimeout(() => {
            button.classList.remove('clicked');
        }, 300);
    }
    
    document.body.addEventListener('click', (e) => {
        if (!audioInitialized) {
            initAudio();
        }
        
        const target = e.target;
        
        // --- Navegación ---
        const navLink = target.closest('.nav-link');
        if (navLink) {
            e.preventDefault();
            const page = navLink.dataset.page;
            let data = {};
            if (navLink.dataset.productId) {
                data = allProducts.find(p => p.id == navLink.dataset.productId);
            }
            navigateTo(page, data);
            
            if (navLink.closest('.modal-nav-link')) {
                closeModal('menu-lateral-modal');
                closeModal('modal-anadido-al-carrito');
            }
        }
        
        // --- Apertura de Modales ---
        if (target.id === 'open-menu-button' || target.closest('#open-menu-button')) {
            openModal('menu-lateral-modal');
        }
        if (target.id === 'open-search-button' || target.closest('#open-search-button')) {
            openModal('busqueda-modal');
        }
        if (target.id === 'open-login-button' || target.closest('#open-login-button')) {
            openModal('login-modal');
        }
        
        // --- Cierre de Modales ---
        const closeModalBtn = target.closest('[data-close-modal]');
        if (closeModalBtn) {
            const modalId = closeModalBtn.dataset.closeModal;
            closeModal(modalId);
        }
        
        // --- Toasts (Notificaciones) ---
        const toastButton = target.closest('.show-toast-button');
        if (toastButton) {
            if (target.id === 'open-login-button' || target.closest('#open-login-button')) {
               // No hacer nada
            } else {
                e.preventDefault();
                playSound(clickSound); 
                showToast({
                    title: toastButton.dataset.title || "   ",
                    description: toastButton.dataset.description || "     👍"
                });
            }
        }
        const closeToast = target.closest('.toast-close');
        if (closeToast) {
            document.getElementById(closeToast.dataset.toastId)?.remove();
        }
        
        // --- Carrito ---
        const addToCartButton = target.closest('.add-to-cart-button');
        if (addToCartButton) {
            playSound(popSound); 
            addToCart(addToCartButton.dataset.productId);
        }
        const cartRemoveButton = target.closest('.cart-remove-item');
        if (cartRemoveButton) {
            removeFromCart(cartRemoveButton.dataset.productId, cartRemoveButton.dataset.productName);
        }
        const cartQuantityButton = target.closest('.cart-quantity-update');
        if (cartQuantityButton) {
            playSound(clickSound); 
            updateQuantity(cartQuantityButton.dataset.productId, cartQuantityButton.dataset.productName, parseInt(cartQuantityButton.dataset.quantity));
        }
        
        const checkoutButton = target.closest('#checkout-button');
        if (checkoutButton) {
            playSound(dingSound); 
            showToast({ title: "¡Compra Realizada!", description: "Gracias por tu pedido.  " });
            cart = [];
            renderCartCount();
            renderCesta();
        }
        
        // --- Carrusel Joyas (Cuadrícula) ---
        const joyaNavButton = target.closest('.joya-nav-button');
        if (joyaNavButton) {
            const id = joyaNavButton.dataset.joyaId;
            const direction = joyaNavButton.dataset.direction;
            const numImages = joyasData.find(j => j.id == id).images.length;
            if (direction === 'next') {
                carruselJoyasStates[id] = (carruselJoyasStates[id] + 1) % numImages;
            } else {
                carruselJoyasStates[id] = (carruselJoyasStates[id] - 1 + numImages) % numImages;
            }
            animateGlassButton(joyaNavButton); 
            renderJoyasGrid();
        }
        const joyaDotButton = target.closest('.joya-dot-button');
        if (joyaDotButton) {
            const id = joyaDotButton.dataset.joyaId;
            carruselJoyasStates[id] = parseInt(joyaDotButton.dataset.slideTo);
            renderJoyasGrid();
        }
        
        // --- Carrusel Relojes (Página Inicio - CANVAS) ---
        const relojesPrev = target.closest('#relojes-prev');
        if (relojesPrev) {
            moveRelojesCarouselLeft();
            animateGlassButton(relojesPrev); 
        }
        const relojesNext = target.closest('#relojes-next');
        if (relojesNext) {
            moveRelojesCarouselRight();
            animateGlassButton(relojesNext); 
        }

        // --- Carruseles Detalle Relojes (CANVAS) ---
        const detalleRelojPrev = target.closest('#detalle-reloj-prev');
        if (detalleRelojPrev) {
            moveDetalleRelojesCarouselLeft();
            animateGlassButton(detalleRelojPrev);
        }
        const detalleRelojNext = target.closest('#detalle-reloj-next');
        if (detalleRelojNext) {
            moveDetalleRelojesCarouselRight();
            animateGlassButton(detalleRelojNext);
        }
        
        // --- Lógica del carrusel de galería ---
        const detalleGalleryPrev = target.closest('#detalle-gallery-prev');
        if (detalleGalleryPrev) {
            const numImages = mainWatch.galleryImages.length;
            const visibleImages = 3;
            const numPages = (numImages > visibleImages) ? (numImages - visibleImages + 1) : 1;
            
            detalleRelojesGalleryIndex = (detalleRelojesGalleryIndex - 1 + numPages) % numPages;
            
            animateGlassButton(detalleGalleryPrev); 
            renderDetalleRelojes(); 
        }
        const detalleGalleryNext = target.closest('#detalle-gallery-next');
        if (detalleGalleryNext) {
            const numImages = mainWatch.galleryImages.length;
            const visibleImages = 3;
            const numPages = (numImages > visibleImages) ? (numImages - visibleImages + 1) : 1;

            detalleRelojesGalleryIndex = (detalleRelojesGalleryIndex + 1) % numPages;

            animateGlassButton(detalleGalleryNext); 
            renderDetalleRelojes(); 
        }
        
        // --- Búsqueda ---
        const searchResultItem = target.closest('.search-result-item');
        if (searchResultItem) {
            const productId = searchResultItem.dataset.productId;

            if (productId == 4 || productId == 5 || productId == 6 || productId == 99) {
                navigateTo('relojesDetalle', mainWatch);
            } else {
                const product = allProducts.find(p => p.id == productId);
                if (product) {
                    navigateTo('detalleProducto', product);
                }
            }
            
            closeModal('busqueda-modal');
            searchInput.value = '';
            searchResultsContainer.classList.add('hidden');
        }
    });
    
    // --- Manejador de formularios ---
    document.body.addEventListener('submit', (e) => {
        if (e.target.id === 'contact-form') {
            e.preventDefault();
            playSound(sendSound); 
            showToast({ title: "Mensaje Enviado", description: "Gracias por contactarnos. Te responderemos pronto." });
            contactForm.reset();
        }
        if (e.target.id === 'newsletter-form') {
            e.preventDefault();
            playSound(sendSound); 
            showToast({ title: "¡Gracias por suscribirte!", description: "Pronto recibirás noticias nuestras. (Función simulada)" });
            newsletterForm.reset();
        }
        if (e.target.id === 'loginForm') {
            e.preventDefault();
            const cedula = document.getElementById('cedula').value;
            const password = document.getElementById('password').value;
            
            console.log('Login attempt:', { cedula, password });
            
            showToast({ title: 'Inicio de sesión exitoso', description: `¡Bienvenido!  `});
            
            closeModal('login-modal');
            
            loginForm.reset();
        }
    });

    // --- Manejador de input de búsqueda ---
    searchInput.addEventListener('input', (e) => {
        renderSearchResults(e.target.value);
    });
    
    // --- Manejador de re-dibujado en Canvas al cambiar tamaño de ventana ---
    window.addEventListener('resize', () => {
        resizeRelojesCanvas();
        if (detalleRelojesCargado) {
            resizeDetalleRelojesCanvas(); 
        }
    });

    // --- LÓGICA DE ANIMACIÓN ON-SCROLL ---
    function initAnimationObserver() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        if ("IntersectionObserver" in window) {
            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target); 
                    }
                });
            }, { threshold: 0.1 }); 

            animatedElements.forEach(el => observer.observe(el));
        } else {
            animatedElements.forEach(el => el.classList.add('is-visible'));
        }
    }

  
    
    if (audioToggle && videoBackground) {
        audioToggle.addEventListener('click', () => {
            if (videoBackground.muted) {
                videoBackground.muted = false;
                iconMuted.classList.add('hidden');
                iconUnmuted.classList.remove('hidden');
            } else {
                videoBackground.muted = true;
                iconMuted.classList.remove('hidden');
                iconUnmuted.classList.add('hidden');
            }
        });
    }


    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Google login attempt');
            showToast({ title: 'Inicio con Google', description: 'Iniciando sesión con Google...  '});
            
            setTimeout(() => {
                closeModal('login-modal');
            }, 1500);
        });
    }

  
    function init() {
        renderJoyasGrid();
        loadRelojesImages(); 
        navigateTo('inicio');
        initAnimationObserver(); 
    }
    
    init();

});