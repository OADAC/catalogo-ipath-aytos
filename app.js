const $=(q,r=document)=>r.querySelector(q);
const $$=(q,r=document)=>[...r.querySelectorAll(q)];
const fmt=n=>new Intl.NumberFormat('es-ES',{maximumFractionDigits:0}).format(n);
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

/* ---------- Theme ---------- */
function setTheme(theme,persist=true){
  const value=theme==='dark'?'dark':'light';
  document.documentElement.dataset.theme=value;
  $$('[data-theme-value]').forEach(b=>b.classList.toggle('active',b.dataset.themeValue===value));
  if(persist){try{localStorage.setItem('ipath-theme',value)}catch(e){}}
}
let savedTheme='light';try{savedTheme=localStorage.getItem('ipath-theme')||'light'}catch(e){}setTheme(savedTheme,false);
$$('[data-theme-value]').forEach(b=>b.addEventListener('click',()=>setTheme(b.dataset.themeValue)));
$$('[data-theme-toggle]').forEach(b=>b.addEventListener('click',()=>setTheme(document.documentElement.dataset.theme==='light'?'dark':'light')));

/* ---------- Image fallbacks ---------- */
function imgTag(src,alt,cls='',fallbacks=[]){
  return `<img${cls?` class="${cls}"`:''} src="${esc(src)}" alt="${esc(alt)}"${fallbacks.length?` data-fallbacks="${esc(fallbacks.join('|'))}"`:''} decoding="async">`;
}
function isVideo(src=''){return /\.mp4(?:$|\?)/i.test(src)}
function mediaTag(src,alt,cls='',fallbacks=[]){
  if(isVideo(src)) return `<video${cls?` class="${cls}"`:''} src="${esc(src)}" aria-label="${esc(alt)}" muted loop autoplay playsinline preload="metadata"${fallbacks.length?` data-fallbacks="${esc(fallbacks.join('|'))}"`:''}></video>`;
  return imgTag(src,alt,cls,fallbacks);
}
document.addEventListener('error',e=>{
  const el=e.target;
  if(!(el instanceof HTMLImageElement) && !(el instanceof HTMLVideoElement)) return;
  const list=(el.dataset.fallbacks||el.dataset.fallback||'').split('|').filter(Boolean);
  const idx=Number(el.dataset.fallbackIndex||0);
  if(idx<list.length){
    const next=list[idx];el.dataset.fallbackIndex=String(idx+1);
    if(el instanceof HTMLVideoElement){
      const img=document.createElement('img');img.className=el.className;img.alt=el.getAttribute('aria-label')||'';img.src=next;img.dataset.fallbacks=list.slice(idx+1).join('|');el.replaceWith(img);
    }else el.src=next;
    return;
  }
  el.classList.add('image-missing');
  const visual=el.closest?.('.tech-visual');if(visual)visual.hidden=true;
},true);

const APPS=[
{id:'walk',name:'Aceras y recorridos',cat:'Espacio público',img:'assets/Aceras y recorridos/ChatGPT Image 22 jul 2026, 17_54_17.png',gallery:['assets/Aceras y recorridos/ChatGPT Image 22 jul 2026, 17_54_17.png','assets/Aceras y recorridos/ChatGPT Image 22 jul 2026, 17_56_04.png','assets/Aceras y recorridos/freepik_crea-una-imagen-alternativa-de-una-plaza-en-un-entorno-de-ciudad-paso-de-cebra-carril-bici-img1_0045.png'],pos:[18,24],short:'Continuidad, accesibilidad y reparación localizada.',problem:'Recorridos que deben mantenerse operativos sin convertir cada intervención en una obra extensa.',physical:'Superficies modulares, encuentros accesibles, sustitución por tramos y compatibilidad con mobiliario.',data:'Verificación de instalación, ubicación, estado, revisiones e histórico del activo.',operation:'Inventariar recorridos, localizar incidencias, programar revisiones y comparar soluciones.',actions:['Planificar por tramos','Ver estado y revisiones','Justificar reposiciones','Mantener rutas accesibles'],formats:'J1 · J2 · J4'},
{id:'plaza',name:'Plazas y espacios cívicos',cat:'Espacio público',img:'assets/Plazas y espacios cívicos/magnific_img1-img2-img3-act-as-a-p_2915886664.png',gallery:['assets/Plazas y espacios cívicos/magnific_img1-img2-img3-act-as-a-p_2915886664.png','assets/Plazas y espacios cívicos/freepik_crea-una-imagen-de-varias-piezas-img1-formando-una-plaza-en-un-parque-fotografia-tipo-national-geographic-no-pongas-las-medidas_0051.png','assets/Plazas y espacios cívicos/freepik_crea-una-imagen-real-de-una-calle-con-img1_0034.png','assets/Plazas y espacios cívicos/freepik_generate-9-different-angles-of-this-image-tile-8_0060.png','assets/Plazas y espacios cívicos/freepik_crea-una-escena-de-dron-con-cmara-ojo-de-pez-recor_kling_1080p_16-9_24fps_8522.mp4'],pos:[45,19],short:'Espacios flexibles para vida urbana y eventos.',problem:'Plazas que cambian de uso, integran servicios y necesitan mantenimiento sin perder actividad.',physical:'Geometrías combinables, acabados diferenciados, canalizaciones y montaje por fases.',data:'Inventario del espacio, configuración, calendario de uso e historial de cambios.',operation:'Reconfigurar áreas, preparar eventos, coordinar servicios y conservar la identidad estética.',actions:['Cambiar configuraciones','Integrar servicios','Gestionar eventos','Reponer acabados exactos'],formats:'J4 · J6 · J8'},
{id:'bike',name:'Carriles bici',cat:'Movilidad',img:'assets/Carriles bici/ChatGPT Image 22 jul 2026, 17_57_53.png',gallery:['assets/Carriles bici/ChatGPT Image 22 jul 2026, 17_57_53.png','assets/Carriles bici/freepik_crea-una-imagen-real-de-img1-formando-un-carril-bici-modular-integrado-en-el-entorno_0009.png'],pos:[68,27],short:'Continuidad, drenaje y seguridad de la red.',problem:'Trazados que deben permanecer continuos y reparables con la menor afección posible.',physical:'Bandas modulares, textura específica, drenaje coordinado y señalización compatible.',data:'Tramos identificados, incidencias localizadas, revisiones y cambios de trazado.',operation:'Priorizar mantenimientos, gestionar cortes cortos y conservar la continuidad de la red.',actions:['Mapear la red','Detectar puntos críticos','Programar revisiones','Modificar trazados'],formats:'J2 · J6 · J8'},
{id:'cross',name:'Pasos y cruces seguros',cat:'Movilidad',img:'assets/Pasos y cruces seguros/ChatGPT Image 22 jul 2026, 17_59_27.png',gallery:['assets/Pasos y cruces seguros/ChatGPT Image 22 jul 2026, 17_59_27.png','assets/Pasos y cruces seguros/ChatGPT Image 22 jul 2026, 18_01_29.png','assets/Pasos y cruces seguros/ChatGPT Image 22 jul 2026, 18_04_14.png','assets/Pasos y cruces seguros/ChatGPT Image 22 jul 2026, 18_06_35.png'],pos:[83,19],short:'Prioridad peatonal y accesibilidad verificable.',problem:'Cruces expuestos a desgaste, cambios de normativa y necesidades de accesibilidad.',physical:'Texturas diferenciadas, bandas táctiles, iluminación y encuentros de borde reemplazables.',data:'Instalación verificada, estado de accesibilidad, mantenimiento e incidencias.',operation:'Revisar cumplimiento, localizar defectos y sustituir solo el componente afectado.',actions:['Auditar accesibilidad','Actualizar señalización','Localizar defectos','Reducir tiempos de corte'],formats:'J1 · J2 · J4'},
{id:'parking',name:'Parkings urbanos y modulares',cat:'Actividad',img:'assets/Parkings urbanos y parkings modulares/ChatGPT Image 22 jul 2026, 18_07_27.png',gallery:['assets/Parkings urbanos y parkings modulares/ChatGPT Image 22 jul 2026, 18_07_27.png','assets/Parkings urbanos y parkings modulares/ChatGPT Image 22 jul 2026, 18_10_58.png'],pos:[25,56],short:'Superficie adaptable con servicios futuros.',problem:'Áreas que cambian de uso y deben admitir recarga, drenaje, seguimiento operativo o nuevas distribuciones.',physical:'Formatos de mayor escala, altas cargas, canalizaciones y señalización reemplazable.',data:'Plazas, instalaciones, ocupación, revisiones y servicios asociados.',operation:'Cambiar distribución, incorporar recarga, reservar áreas y programar mantenimiento.',actions:['Reconfigurar plazas','Añadir recarga','Gestionar servicios','Escalar por fases'],formats:'J6 · J8 · J10'},
{id:'transport',name:'Paradas e intercambiadores',cat:'Movilidad',img:'assets/Paradas e intercambiadores/ChatGPT Image 22 jul 2026, 18_13_30.png',gallery:['assets/Paradas e intercambiadores/ChatGPT Image 22 jul 2026, 18_13_30.png'],pos:[51,51],short:'Accesibilidad, espera y conexión de servicios.',problem:'Puntos de movilidad con alta intensidad, mobiliario, información y necesidades cambiantes.',physical:'Plataformas accesibles, zonas de espera, mobiliario, drenaje y canalizaciones integradas.',data:'Elementos instalados, revisiones, incidencias, servicios y configuración del punto.',operation:'Actualizar mobiliario, reorganizar flujos y coordinar mantenimiento con el operador.',actions:['Actualizar equipamiento','Gestionar accesibilidad','Coordinar operadores','Medir disponibilidad'],formats:'J4 · J6 · J8'},
{id:'parks',name:'Parques y zonas verdes',cat:'Espacio público',img:'assets/Parques y zonas verdes/ChatGPT Image 22 jul 2026, 18_23_52.png',gallery:['assets/Parques y zonas verdes/ChatGPT Image 22 jul 2026, 18_23_52.png','assets/Parques y zonas verdes/ChatGPT Image 22 jul 2026, 18_26_45.png','assets/Parques y zonas verdes/freepik_generate-9-different-angles-of-this-image-tile-9_0061.png'],pos:[76,61],short:'Recorridos, sombra, agua y mobiliario.',problem:'Entornos con vegetación, riego y drenaje que requieren acceso frecuente y cambios estacionales.',physical:'Superficies drenantes, encuentros vegetales, piezas auxiliares y mobiliario compatible.',data:'Zonas, riego, arbolado, revisiones, incidencias y actuaciones realizadas.',operation:'Coordinar riego, accesos, mantenimiento y ampliaciones sin rehacer el conjunto.',actions:['Coordinar riego','Proteger raíces','Añadir mobiliario','Ampliar recorridos'],formats:'J1 · J2 · J4'},
{id:'utilities',name:'Redes, servicios y registros',cat:'Servicios',img:'assets/Redes , servicios , drenajes , accesibilidad/ChatGPT Image 22 jul 2026, 18_40_29.png',gallery:['assets/Redes , servicios , drenajes , accesibilidad/ChatGPT Image 22 jul 2026, 18_40_29.png','assets/Redes , servicios , drenajes , accesibilidad/ChatGPT Image 22 jul 2026, 18_56_00.png','assets/Redes , servicios , drenajes , accesibilidad/ChatGPT Image 22 jul 2026, 18_57_08.png'],pos:[89,50],short:'Acceso rápido y trazabilidad de lo instalado.',problem:'Intervenir bajo el pavimento sin demoliciones extensas ni pérdida de información.',physical:'Registros integrados, bandejas, canalizaciones y reposición exacta de la superficie.',data:'Ubicación de redes, responsables, intervenciones, fotografías y documentación asociada.',operation:'Consultar qué existe bajo cada zona, autorizar trabajos y recuperar el acabado original.',actions:['Localizar redes','Autorizar intervenciones','Evitar demoliciones','Cerrar con evidencia'],formats:'J2 · J4 · J6'},
{id:'temporary',name:'Urbanismo temporal',cat:'Actividad',img:'assets/Urbanismo temporal/ChatGPT Image 22 jul 2026, 18_28_19.png',gallery:['assets/Urbanismo temporal/ChatGPT Image 22 jul 2026, 18_28_19.png','assets/Urbanismo temporal/ChatGPT Image 22 jul 2026, 18_34_29.png'],pos:[58,82],short:'Desplegar, retirar y volver a usar.',problem:'Eventos, pruebas urbanas o necesidades estacionales que no justifican una obra irreversible.',physical:'Montaje seco, configuraciones reversibles, acabados intercambiables y almacenamiento.',data:'Ubicación temporal, calendario, responsables, estado y siguiente destino.',operation:'Pilotar soluciones, moverlas entre barrios y reutilizar el mismo inventario.',actions:['Probar antes de consolidar','Mover entre zonas','Gestionar calendario','Reutilizar inventario'],formats:'J1 · J2 · J4'},
{id:'industrial',name:'Zonas industriales y logísticas',cat:'Actividad',img:'assets/Zonas Industriales y logísticas/22 jul 2026, 18_30_18.png',gallery:['assets/Zonas Industriales y logísticas/22 jul 2026, 18_30_18.png','assets/Zonas Industriales y logísticas/ChatGPT Image 22 jul 2026, 18_32_58.png'],pos:[80,80],short:'Altas cargas, tráfico y operación continua.',problem:'Superficies exigentes con redes, cargas y reparaciones que no pueden detener la actividad.',physical:'Formatos grandes, estructura reforzada, registros y soluciones por sectores.',data:'Inventario de superficie, cargas, revisiones, intervenciones y disponibilidad.',operation:'Sectorizar mantenimiento, reducir paradas y preparar ampliaciones logísticas.',actions:['Sectorizar zonas','Planificar paradas','Registrar cargas','Ampliar capacidad'],formats:'J6 · J8 · J10'},
{id:'housing',name:'Vivienda pública modular',cat:'Edificación',img:'assets/Vivienda Pública/magnific_img1-img2-img3-act-as-a-p_2915794534.png',gallery:['assets/Vivienda Pública/magnific_img1-img2-img3-act-as-a-p_2915794534.png','assets/Vivienda Pública/freepik_assistant_1762782311970.png','assets/Vivienda Pública/freepik__a-partir-de-esta-img1-de-esta-modern-house-design-__72035.png','assets/Vivienda Pública/freepik__vista-1-ngulo-desde-la-zona-del-comedor-mirando-ha__72044.png'],pos:[40,39],short:'Edificios que pueden reformarse y ampliarse.',problem:'Parque público que debe adaptarse a nuevas unidades, usos y prestaciones sin demoliciones completas.',physical:'Estructura, fachada, instalaciones y acabados compatibles y reemplazables.',data:'Ficha viva del edificio, componentes, intervenciones, garantías y consumos.',operation:'Reconfigurar viviendas, ampliar capacidad y planificar rehabilitaciones por componentes.',actions:['Cambiar distribuciones','Ampliar módulos','Actualizar instalaciones','Recuperar componentes'],formats:'Sistema CUEVA'},
{id:'school',name:'Colegios y centros educativos',cat:'Edificación',img:'assets/Colegios/ChatGPT Image 23 jul 2026, 11_07_56.png',gallery:['assets/Colegios/ChatGPT Image 23 jul 2026, 11_07_56.png'],pos:[63,41],short:'Aulas y espacios que cambian con la demanda.',problem:'Centros que necesitan ampliar, dividir, conectar o transformar espacios durante su vida útil.',physical:'Módulos estructurales, patios, fachadas e instalaciones reconfigurables.',data:'Inventario de espacios, mantenimiento, calidad ambiental y reformas.',operation:'Adaptar aulas, crecer por fases y reducir cierres durante las obras.',actions:['Crear nuevas aulas','Reconfigurar espacios','Actualizar instalaciones','Reducir cierres'],formats:'Sistema CUEVA'},
{id:'civic',name:'Edificios municipales y cívicos',cat:'Edificación',img:'assets/Equipamiento sanitario y Ciudadano/freepik__img1photorealistic-architectural-exterior-render-o__8512.png',gallery:['assets/Equipamiento sanitario y Ciudadano/freepik__img1photorealistic-architectural-exterior-render-o__8512.png','assets/Equipamiento sanitario y Ciudadano/freepik__a-partir-de-esta-img1-de-esta-tiny-hose-moderna-de__72037.png'],pos:[72,69],short:'Equipamientos preparados para nuevos servicios.',problem:'Edificios administrativos, culturales o sociales que cambian de programa con el tiempo.',physical:'Estructura modular, envolvente actualizable, instalaciones accesibles y acabados reemplazables.',data:'Componentes, uso de espacios, mantenimiento, intervenciones y certificaciones.',operation:'Cambiar programa, dividir áreas, modernizar instalaciones y ampliar sin empezar de cero.',actions:['Cambiar programa','Crear nuevos servicios','Reformar por fases','Proteger inversión'],formats:'Sistema CUEVA'},
{id:'health',name:'Equipamientos sanitarios y cuidados',cat:'Edificación',img:'assets/Equipamiento sanitario y Ciudadano/ChatGPT Image 23 jul 2026, 11_19_05.png',gallery:['assets/Equipamiento sanitario y Ciudadano/ChatGPT Image 23 jul 2026, 11_19_05.png','assets/Equipamiento sanitario y Ciudadano/freepik__a-partir-de-esta-img1-de-esta-tiny-hose-moderna-de__72037.png','assets/Equipamiento sanitario y Ciudadano/freepik__img1photorealistic-architectural-exterior-render-o__8512.png'],pos:[51,70],short:'Capacidad rápida y adaptable para servicios esenciales.',problem:'Necesidades asistenciales variables que requieren ampliar o reorganizar con rapidez.',physical:'Módulos compatibles, instalaciones registrables y ampliaciones planificadas.',data:'Inventario técnico, mantenimiento, reformas, equipos y cumplimiento.',operation:'Habilitar nuevas áreas, cambiar flujos y mantener el servicio durante la transformación.',actions:['Ampliar capacidad','Reorganizar flujos','Actualizar tecnología','Mantener servicio'],formats:'Sistema CUEVA'},
];


/* Capacidades digitales y operativas específicas por aplicación.
   Se describen por el valor que habilitan, sin exponer la arquitectura o los medios técnicos internos. */
const APP_TECH={
  walk:[
    'Registro individual de cada pieza o tramo, con su estado y relación con el recorrido completo.',
    'Verificación de instalación con fecha, ubicación, responsable y aceptación.',
    'Ficha viva con acabado, lote, revisiones, incidencias e intervenciones.',
    'Consulta cartográfica de continuidad, accesibilidad y estado del recorrido.',
    'Avisos y órdenes de trabajo vinculados al punto exacto, con cierre documentado.',
    'Histórico de sustituciones para actuar solo sobre el tramo afectado y conservar la estética.'
  ],
  plaza:[
    'Plano operativo de zonas, configuraciones, acabados, mobiliario y servicios integrados.',
    'Ficha de cada módulo con procedencia, montaje, mantenimiento y segundo uso.',
    'Calendario de eventos y cambios de configuración asociado al inventario disponible.',
    'Localización de canalizaciones y puntos de conexión antes de abrir o transformar la plaza.',
    'Seguimiento opcional de uso, condiciones ambientales, iluminación o riego.',
    'Registro de desmontajes y nuevas disposiciones para repetir configuraciones ya validadas.'
  ],
  bike:[
    'Registro por tramos para conocer continuidad, acabado, señalización y estado.',
    'Mapa de la red ciclista con incidencias, desvíos temporales y prioridades de mantenimiento.',
    'Verificación de instalación y revisión de juntas, drenaje, textura y encuentros seguros.',
    'Seguimiento opcional de iluminación, humedad, ocupación o deterioro localizado.',
    'Histórico de cambios de trazado y reposiciones sin perder la identidad del activo.',
    'Conexión con servicios municipales de movilidad y rutas accesibles.'
  ],
  cross:[
    'Ficha del cruce con geometría, bandas táctiles, acabado y señalización instalada.',
    'Verificación documentada de accesibilidad y seguridad en la recepción y las revisiones.',
    'Localización exacta de defectos para sustituir únicamente la pieza o banda afectada.',
    'Registro de cambios normativos, intervenciones y responsables de cada actualización.',
    'Posibilidad de activar iluminación, balizas, avisos o prioridad peatonal.',
    'Histórico fotográfico y documental para acreditar el estado antes y después de actuar.'
  ],
  parking:[
    'Inventario de plazas, sectores, acabados, canalizaciones y servicios disponibles.',
    'Posibilidad de activar recarga, iluminación, control de acceso y gestión de ocupación.',
    'Estado por módulo para reconfigurar plazas sin perder el historial del activo.',
    'Registro de cargas, revisiones, incidencias, drenaje y mantenimiento por zonas.',
    'Planificación cartográfica de reservas, ampliaciones y trabajos sin cerrar todo el aparcamiento.',
    'Ficha de componentes reutilizables cuando cambie la distribución o el uso del espacio.'
  ],
  transport:[
    'Inventario de andenes, paradas, zonas de espera, itinerarios y equipamiento asociado.',
    'Información de accesibilidad, pavimento, marquesinas, iluminación y servicios por punto.',
    'Posibilidad de activar información al usuario, energía, comunicaciones y seguimiento operativo.',
    'Registro de incidencias y mantenimiento vinculado al elemento y al operador responsable.',
    'Coordinación cartográfica de recorridos, transbordos, obras temporales y continuidad del servicio.',
    'Verificación de instalación y actualización documental al sustituir o ampliar componentes.'
  ],
  parks:[
    'Inventario de recorridos, áreas estanciales, juegos, mobiliario, riego y drenaje.',
    'Ficha de superficies y componentes con acabado, origen, revisiones y recuperación prevista.',
    'Seguimiento opcional de riego, humedad, iluminación, calidad ambiental o intensidad de uso.',
    'Mapa de accesibilidad y mantenimiento para localizar incidencias sin inspecciones generales.',
    'Histórico de cambios estacionales, eventos y reconfiguraciones del parque.',
    'Órdenes de trabajo asociadas a zonas concretas, responsables y evidencias de cierre.'
  ],
  utilities:[
    'Mapa preciso de registros, canalizaciones, acometidas, propietarios y servicios vinculados.',
    'Identidad de tapas, bandejas y módulos para abrir, intervenir y reponer sin pérdida de información.',
    'Permisos y órdenes de trabajo asociados al punto exacto antes de iniciar una actuación.',
    'Verificación de apertura, intervención y cierre con fecha, operario, fotografías y documentación.',
    'Avisos configurables por apertura, humedad, temperatura o estado del registro.',
    'Histórico técnico que reduce excavaciones exploratorias y facilita la coordinación entre compañías.'
  ],
  temporary:[
    'Inventario reservado por evento, zona, fecha, responsable y siguiente destino.',
    'Identidad de cada módulo para controlar montaje, desmontaje, transporte y almacenamiento.',
    'Ficha con número de usos, estado, reparaciones y disponibilidad para nuevos despliegues.',
    'Mapa temporal con calendario, servicios conectados, accesos y restricciones de cada montaje.',
    'Verificación de instalación y retirada para justificar ocupación, entrega y recuperación.',
    'Configuraciones guardadas que pueden repetirse o adaptarse en otros barrios y eventos.'
  ],
  industrial:[
    'Inventario por sectores con formato, carga prevista, servicios, accesos y estado operativo.',
    'Mapa de tráfico interno, redes, puntos críticos y ventanas de mantenimiento.',
    'Registro de cargas, impactos, incidencias y reposiciones por módulo o zona.',
    'Conexión opcional con control de accesos, logística, iluminación y seguimiento ambiental.',
    'Ficha de cada componente para ampliar, trasladar o recuperar sin perder su historial.',
    'Planificación de intervenciones coordinada con la producción para reducir paradas.'
  ],
  housing:[
    'Ficha viva del edificio y de sus componentes: estructura, fachada, instalaciones y acabados.',
    'Versión documentada de distribuciones, ampliaciones y reformas durante toda la vida del inmueble.',
    'Inventario de garantías, mantenimiento, incidencias y componentes recuperables.',
    'Posibilidad de activar seguimiento de energía, calidad ambiental, agua, accesos y otros servicios.',
    'Histórico de desmontajes y reutilización para reformar por componentes, no por demolición completa.',
    'Modelo de información compatible con planificación patrimonial, rehabilitación y vivienda pública.'
  ],
  school:[
    'Inventario de aulas, patios, circulaciones, instalaciones y equipamiento por zonas.',
    'Registro de configuración y capacidad para ampliar, dividir o reconectar espacios educativos.',
    'Posibilidad de activar seguimiento de calidad ambiental, energía, iluminación, accesos y seguridad.',
    'Ficha de componentes, garantías, revisiones y reformas realizadas durante el curso o por fases.',
    'Mapa interior y exterior para mantenimiento, accesibilidad, emergencias y continuidad del servicio.',
    'Histórico de cambios que permite repetir soluciones y justificar futuras ampliaciones.'
  ],
  civic:[
    'Inventario de espacios, usos, equipamiento, instalaciones y responsables municipales.',
    'Ficha del edificio con configuraciones, reformas, garantías e intervenciones.',
    'Posibilidad de activar reservas, accesos, energía, calidad ambiental y atención ciudadana.',
    'Registro de cambios de programa para transformar áreas sin perder información técnica.',
    'Órdenes de mantenimiento y obras vinculadas a cada zona, con evidencias de recepción.',
    'Modelo de información para coordinar ampliaciones, nuevos servicios y gestión patrimonial.'
  ],
  health:[
    'Inventario técnico de áreas asistenciales, instalaciones, equipos y componentes críticos.',
    'Ficha viva con revisiones, garantías, mantenimiento y reformas por zonas.',
    'Posibilidad de activar seguimiento ambiental, energía, accesos, comunicaciones y alarmas técnicas.',
    'Histórico de ampliaciones y reconfiguraciones para mantener el servicio durante las obras.',
    'Mapa interior para localizar redes, equipos, incidencias y responsables de intervención.',
    'Documentación de recepción y cumplimiento asociada a cada fase, módulo o componente.'
  ]
};



/* Una posibilidad ampliada por aplicación.
   Se explica el servicio que puede habilitar el Ayuntamiento sin revelar la solución técnica interna. */
const APP_ENABLE={
  walk:{title:'Rutas ciudadanas, accesibles y culturales',text:'Crear recorridos guiados con avisos de obras, accesibilidad, patrimonio, comercios, actividades y puntos de interés para residentes y visitantes.'},
  plaza:{title:'Agenda y experiencias en el espacio público',text:'Ofrecer información sobre actividades, eventos, historia local, servicios próximos y experiencias participativas vinculadas a cada plaza.'},
  bike:{title:'Servicios para ciclistas y visitantes',text:'Publicar rutas recomendadas, incidencias, desvíos, puntos de descanso, conexiones con transporte y lugares de interés del municipio.'},
  cross:{title:'Información y acompañamiento en puntos sensibles',text:'Activar avisos de seguridad, rutas escolares, orientación accesible e información contextual para peatones, familias y visitantes.'},
  parking:{title:'Censo y servicios para vehículos',text:'Gestionar plazas, vehículos autorizados, reservas, rotación, recarga y servicios para vehículos conectados desde una visión municipal unificada.'},
  transport:{title:'Información al viajero y conexión con la ciudad',text:'Integrar horarios, transbordos, incidencias, accesibilidad, agenda local y contenidos turísticos para facilitar cada desplazamiento.'},
  parks:{title:'Experiencias naturales, educativas y turísticas',text:'Crear rutas botánicas, históricas, deportivas o familiares con actividades, contenidos interpretativos y avisos útiles para cada zona.'},
  utilities:{title:'Relación ciudadana y gobernanza de servicios',text:'Canalizar avisos, consultas y autorizaciones, coordinando áreas municipales, compañías y ciudadanía alrededor de cada intervención.'},
  temporary:{title:'Aplicaciones para eventos y usos temporales',text:'Informar sobre programa, recorridos, accesos, servicios, actividades, cambios y recomendaciones antes, durante y después de cada evento.'},
  industrial:{title:'Vehículos, flotas y gobernanza del área',text:'Mantener un censo de vehículos y flotas, organizar accesos y rutas internas, habilitar servicios para vehículos conectados y coordinar la actividad del recinto.'},
  housing:{title:'Servicios al residente y gobernanza comunitaria',text:'Ofrecer avisos, incidencias, reservas, consumos, documentación, servicios comunes y participación en la gestión cotidiana del edificio.'},
  school:{title:'Conexión con familias y comunidad educativa',text:'Centralizar avisos, actividades, accesos, uso de instalaciones, incidencias y comunicación con familias, alumnado y personal del centro.'},
  civic:{title:'Atención ciudadana, agenda y participación',text:'Habilitar citas, reservas, trámites, actividades, información histórica, participación y acceso sencillo a los servicios del edificio municipal.'},
  health:{title:'Orientación y comunicación con usuarios y familias',text:'Facilitar accesos, citas, recorridos, avisos, servicios disponibles y comunicación clara durante la atención y el uso del equipamiento.'}
};

const TECH_ICONS=[
'assets/Iconos tech 3d urbanos/freepik_crea-una-imagen-con-materiales-reales-y-realistas-de-img1-fotorrealista-iluminacion-etc-etc-etc_0001 (1).png',
'assets/Iconos tech 3d urbanos/freepik_crea-una-imagen-con-materiales-reales-y-realistas-de-img1-fotorrealista-iluminacion-etc-etc-etc_0001 (10).png',
'assets/Iconos tech 3d urbanos/freepik_crea-una-imagen-con-materiales-reales-y-realistas-de-img1-fotorrealista-iluminacion-etc-etc-etc_0001 (2).png',
'assets/Iconos tech 3d urbanos/freepik_crea-una-imagen-con-materiales-reales-y-realistas-de-img1-fotorrealista-iluminacion-etc-etc-etc_0001 (4).png',
'assets/Iconos tech 3d urbanos/freepik_crea-una-imagen-con-materiales-reales-y-realistas-de-img1-fotorrealista-iluminacion-etc-etc-etc_0001 (5).png',
'assets/Iconos tech 3d urbanos/freepik_crea-una-imagen-con-materiales-reales-y-realistas-de-img1-fotorrealista-iluminacion-etc-etc-etc_0001 (6).png'
];
const CAPABILITY_VISUALS=[
'assets/Actuaciones y montajes/ChatGPT Image 22 jul 2026, 18_40_29.png',
'assets/Actuaciones y montajes/ChatGPT Image 22 jul 2026, 18_56_00.png',
'assets/Actuaciones y montajes/ChatGPT Image 22 jul 2026, 18_57_08.png'
];

const CATS=['Todas','Espacio público','Movilidad','Servicios','Actividad','Edificación'];
const APP_FALLBACKS={walk:'assets/generated/catalog/01_walk.webp',plaza:'assets/generated/catalog/02_plaza.webp',bike:'assets/generated/catalog/03_bike.webp',cross:'assets/generated/catalog/04_cross.webp',parking:'assets/generated/catalog/05_parking.webp',transport:'assets/generated/catalog/06_transport.webp',parks:'assets/generated/catalog/07_parks.webp',utilities:'assets/generated/catalog/08_utilities.webp',temporary:'assets/generated/catalog/10_temporary.webp',industrial:'assets/generated/catalog/11_industrial.webp',housing:'assets/generated/catalog/13_housing.webp',school:'assets/generated/catalog/14_school.webp',civic:'assets/generated/catalog/15_civic.webp',health:'assets/generated/catalog/16_health.webp'};
function appFallbacks(a){return [...new Set([...(a.fallbacks||[]),APP_FALLBACKS[a.id]].filter(Boolean))]}
let appFilter='Todas',activeApp=0,activeMedia=0,auto=true,autoTimer;
function appClass(cat){return {'Espacio público':'cat-space','Movilidad':'cat-move','Servicios':'cat-service','Actividad':'cat-activity','Edificación':'cat-build'}[cat]||'cat-space'}
function visibleApps(){return APPS.map((a,i)=>({...a,orig:i})).filter(a=>appFilter==='Todas'||a.cat===appFilter)}
function renderFilters(){
  $('#appFilters').innerHTML=CATS.map(c=>`<button class="${c===appFilter?'active':''}" data-cat="${c}">${c}</button>`).join('');
  $$('#appFilters button').forEach(b=>b.onclick=()=>{appFilter=b.dataset.cat;auto=false;$('#autoTour').classList.remove('active');renderFilters();renderApps();});
}
function renderApps(){
  const items=visibleApps();
  if(!items.some(x=>x.orig===activeApp)){activeApp=items[0]?.orig||0;activeMedia=0;}
  $('#appGrid').innerHTML=items.map(a=>`<article class="app-card ${a.orig===activeApp?'active':''}" data-i="${a.orig}"><div class="pic">${imgTag(a.img,a.name,'',appFallbacks(a))}<span class="id">${String(a.orig+1).padStart(2,'0')}</span><h3>${a.name}</h3></div><div class="meta"><b>${a.cat}</b><span>${a.formats}</span></div></article>`).join('');
  $$('.app-card').forEach(c=>c.onclick=()=>selectApp(+c.dataset.i,false));
  renderAppDetail();renderMapNodes();
}
function renderAppDetail(){
  const a=APPS[activeApp];
  const fallback=APP_FALLBACKS[a.id];
  const gallery=[...(a.gallery?.length?a.gallery:[a.img]),fallback].filter(Boolean).filter((v,i,arr)=>arr.indexOf(v)===i).slice(0,5);
  if(activeMedia>=gallery.length)activeMedia=0;
  const current=gallery[activeMedia];
  const currentFallbacks=[...appFallbacks(a).filter(x=>x!==current),a.img].filter(Boolean);
  $('#appDetail').innerHTML=`
    <div class="app-media">
      <div class="app-main-img">${mediaTag(current,a.name,'',currentFallbacks)}<span class="app-image-label">${a.cat} · ${String(activeApp+1).padStart(2,'0')}</span></div>
      <div class="app-thumbs">${gallery.map((g,i)=>`<button class="app-thumb ${i===activeMedia?'active':''} ${isVideo(g)?'is-video':''}" data-media="${i}" title="Vista ${i+1}">${isVideo(g)?imgTag(a.img,`${a.name} · vídeo`,'',appFallbacks(a)) : imgTag(g,`${a.name} · vista ${i+1}`,'',appFallbacks(a).filter(x=>x!==g))}${isVideo(g)?'<span class="video-play">▶</span>':''}</button>`).join('')}</div>
    </div>
    <div class="app-info"><div class="app-title-row"><div><small>${a.cat} · Aplicación ${String(activeApp+1).padStart(2,'0')}</small><h3>${a.name}</h3></div><span class="format-badge">${a.formats}</span></div><p class="app-intro">${a.problem}</p><div class="app-action">${a.actions.map(x=>`<span>${x}</span>`).join('')}</div><div class="app-cap-grid"><div class="app-cap"><b>Solución física</b><span>${a.physical}</span></div><div class="app-cap"><b>Información del activo</b><span>${a.data}</span></div><div class="app-cap"><b>Operación municipal</b><span>${a.operation}</span></div><div class="app-cap"><b>Decisiones habilitadas</b><span>${a.actions.join(' · ')}</span></div></div><section class="app-tech"><div class="app-tech-head"><div><small>CAPACIDADES DIGITALES Y OPERATIVAS</small><h4>Qué puede habilitar el Ayuntamiento en esta aplicación</h4></div><span>Configuración adaptable al proyecto</span></div><div class="app-tech-grid">${(APP_TECH[a.id]||[]).map((x,i)=>`<article><span class="tech-visual">${imgTag(TECH_ICONS[i%TECH_ICONS.length],`Capacidad ${i+1}`,'')}</span><div><i>${String(i+1).padStart(2,'0')}</i><p>${x}</p></div></article>`).join('')}</div>${APP_ENABLE[a.id]?`<article class="app-enable"><i>+</i><div><small>CONEXIÓN CON PERSONAS Y SERVICIOS</small><h5>${APP_ENABLE[a.id].title}</h5><p>${APP_ENABLE[a.id].text}</p></div></article>`:''}</section></div>`;
  $$('.app-thumb').forEach(b=>b.onclick=()=>{activeMedia=+b.dataset.media;renderAppDetail();});
}
function selectApp(i,user=true){activeApp=i;activeMedia=0;if(user){auto=false;$('#autoTour').classList.remove('active')}renderApps();renderMapCard();}
function renderMapNodes(){
  const filtered=visibleApps();
  $('#mapNodes').innerHTML=filtered.map(a=>`<button class="map-node ${appClass(a.cat)} ${a.orig===activeApp?'active':''}" style="left:${a.pos[0]}%;top:${a.pos[1]}%" data-i="${a.orig}" aria-label="${a.name}">${a.orig+1}</button>`).join('');
  $$('.map-node').forEach(n=>n.onclick=()=>selectApp(+n.dataset.i));renderMapCard();
}
function renderMapCard(){const a=APPS[activeApp];$('#mapCard').innerHTML=`<span class="n">Aplicación ${String(activeApp+1).padStart(2,'0')} · ${a.cat}</span><h3>${a.name}</h3><p>${a.short}</p><div class="tags">${a.actions.slice(0,3).map(x=>`<span>${x}</span>`).join('')}</div>`;}
$('#autoTour').onclick=()=>{auto=!auto;$('#autoTour').classList.toggle('active',auto);if(auto)startAuto();};
function startAuto(){clearInterval(autoTimer);autoTimer=setInterval(()=>{if(!auto||document.hidden)return;activeApp=(activeApp+1)%APPS.length;activeMedia=0;appFilter='Todas';renderFilters();renderApps();},6200)}

/* ---------- GIS modal ---------- */
const mapModal=$('#mapModal');
$('#openMap').onclick=()=>{mapModal.classList.add('open');mapModal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden'};
function closeMap(){mapModal.classList.remove('open');mapModal.setAttribute('aria-hidden','true');document.body.style.overflow=''}
$('#closeMap').onclick=closeMap;mapModal.addEventListener('click',e=>{if(e.target===mapModal)closeMap()});addEventListener('keydown',e=>{if(e.key==='Escape')closeMap()});

/* ---------- Process ---------- */
const PROCESS=[
{name:'Diagnóstico',icon:'◎',img:'assets/process/01_preparacion.webp',fallback:'assets/generated/process/01_preparacion.webp',desc:'Necesidades, estado del suelo, servicios existentes y objetivos municipales.',deliver:'Alcance y línea base'},
{name:'Diseño',icon:'✎',img:'assets/process/01_preparacion.webp',fallback:'assets/generated/process/01_preparacion.webp',desc:'Solución física, funcional y digital adaptada al emplazamiento.',deliver:'Proyecto y configuración'},
{name:'Fabricación',icon:'▥',img:'assets/process/01_preparacion.webp',fallback:'assets/generated/process/01_preparacion.webp',desc:'Prefabricación controlada, componente circular, identidad y calidad.',deliver:'Lote documentado'},
{name:'Logística',icon:'▰',img:'assets/process/02_instalacion.webp',fallback:'assets/generated/process/02_instalacion.webp',desc:'Transporte, acopio y secuencia de instalación planificados.',deliver:'Entrega trazada'},
{name:'Instalación',icon:'◇',img:'assets/process/02_instalacion.webp',fallback:'assets/generated/process/02_instalacion.webp',desc:'Montaje seco, verificación y aceptación de cada zona o elemento.',deliver:'Prueba de instalación'},
{name:'Operación',icon:'▣',img:'assets/process/03_verificacion.webp',fallback:'assets/generated/process/03_verificacion.webp',desc:'Inventario, incidencias, revisiones, mantenimiento e histórico.',deliver:'Activo visible'},
{name:'Reconfiguración',icon:'↻',img:'assets/process/03_verificacion.webp',fallback:'assets/generated/process/03_verificacion.webp',desc:'Cambio de uso, ampliación o reforma sustituyendo componentes.',deliver:'Nueva configuración'},
{name:'Segundo uso',icon:'♻',img:'assets/process/03_verificacion.webp',fallback:'assets/generated/process/03_verificacion.webp',desc:'Desmontaje, reutilización, retorno o reciclaje con destino documentado.',deliver:'Cierre circular'}
];
let processActive=0,processTimer;
function renderProcess(){
  const ring=$('#processRing');ring.style.setProperty('--process-index',processActive);
  ring.innerHTML=`<svg class="process-orbit" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="47"></circle><path d="M50 3 A47 47 0 0 1 97 50"></path></svg>`+PROCESS.map((p,i)=>`<button class="process-node pos-${i} ${i===processActive?'active':''}" data-i="${i}"><b>${p.icon}</b><span>${i+1}. ${p.name}</span></button>`).join('');
  $$('.process-node').forEach(n=>n.onclick=()=>{processActive=+n.dataset.i;renderProcess();restartProcessTimer();});
  const p=PROCESS[processActive];$('#processDetail').innerHTML=`<span class="process-image">${imgTag(p.img,p.name,'',[p.fallback])}</span><small>${String(processActive+1).padStart(2,'0')} · ${p.name}</small><h3>${p.deliver}</h3><p>${p.desc}</p><span class="deliverable">Fase ${processActive+1} de ${PROCESS.length}</span>`;
}
function restartProcessTimer(){clearInterval(processTimer);processTimer=setInterval(()=>{if(document.hidden)return;processActive=(processActive+1)%PROCESS.length;renderProcess();},7200)}

/* ---------- Layers ---------- */
const LAYERS=[
{name:'Terreno, base y drenaje',sub:'Preparación, apoyo y gestión del agua',desc:'La plataforma inferior se adapta al emplazamiento y coordina soporte, pendientes, drenaje y accesibilidad a redes.',chips:['Base preparada','Drenaje','Registro']},
{name:'Conectividad y servicios',sub:'Redes, registros, canalizaciones y servicios',desc:'Integra servicios urbanos actuales y futuros: redes, iluminación, comunicaciones, mobiliario y puntos de acceso.',chips:['Servicios urbanos','Interoperable','Actualizable']},
{name:'Componente plástico circular',sub:'Bandeja, molde perdido y componente técnico',desc:'La pieza reciclada simplifica la fabricación como bandeja y molde perdido integrado; después aporta protección, drenaje y recuperación circular durante el uso.',chips:['22 kg/m²','Molde perdido','Proceso simple','Recuperable']},
{name:'Identidad y datos',sub:'Registro, histórico e instalación demostrable',desc:'Cada unidad conserva su identidad, ubicación, fabricación, instalación, mantenimiento y destino final.',chips:['Identidad del activo','Ficha viva','Histórico']},
{name:'Módulo estructural Serie J',sub:'Hormigón de altas prestaciones',desc:'Elemento prefabricado dimensionado para cada uso, producido con control de calidad y compatible con cortes y formatos de la familia.',chips:['Prefabricado','Altas cargas','Cortes especiales']},
{name:'Superficie funcional',sub:'Acabados, textura, señalización y prestación',desc:'La cara visible se adapta al uso, la estética, la accesibilidad, el drenaje, la señalización y las condiciones del entorno.',chips:['Texturas','Antideslizante','Accesibilidad','Reposición exacta']}
];
let layerActive=2,layerMode='open',layerModeTimer;
const LAYER_STATES={open:['Sistema desglosado','Cada capa puede inspeccionarse de forma independiente.'],factory:['Fabricación simplificada','La bandeja plástica funciona como molde perdido integrado.'],service:['Sistema en servicio','Las capas trabajan juntas y mantienen su identidad e histórico.']};
function renderLayers(){
  $('#layerList').innerHTML=LAYERS.map((l,i)=>`<article class="layer-item ${i===layerActive?'active':''}" data-i="${i}"><i>${String(i+1).padStart(2,'0')}</i><div><b>${l.name}</b><span>${l.sub}</span></div></article>`).join('');
  $$('.layer-item').forEach(el=>el.onclick=()=>{layerActive=+el.dataset.i;renderLayers();});
  $$('[data-layer-svg]').forEach(el=>{const active=+el.dataset.layerSvg===layerActive;el.classList.toggle('active',active);el.onclick=()=>{layerActive=+el.dataset.layerSvg;renderLayers();};});
  const l=LAYERS[layerActive];$('#layerDetail').innerHTML=`<div class="layer-detail-index">${String(layerActive+1).padStart(2,'0')}</div><div><b>${l.name}</b><p>${l.desc}</p><div class="chips">${l.chips.map(x=>`<span>${x}</span>`).join('')}</div></div>`;
  const [t,s]=LAYER_STATES[layerMode];$('#layerState').innerHTML=`<b>${t}</b><span>${s}</span>`;
}
$$('[data-layer-mode]').forEach(b=>b.onclick=()=>{
  $$('[data-layer-mode]').forEach(x=>x.classList.remove('active'));b.classList.add('active');layerMode=b.dataset.layerMode;$('#layerStage').className='layer-stage mode-'+layerMode;
  if(layerMode==='factory')layerActive=2;if(layerMode==='service')layerActive=1;renderLayers();restartLayerTimer();
});
function restartLayerTimer(){clearInterval(layerModeTimer);layerModeTimer=setInterval(()=>{if(document.hidden)return;const modes=['open','factory','service'];layerMode=modes[(modes.indexOf(layerMode)+1)%modes.length];$$('[data-layer-mode]').forEach(x=>x.classList.toggle('active',x.dataset.layerMode===layerMode));$('#layerStage').className='layer-stage mode-'+layerMode;if(layerMode==='factory')layerActive=2;if(layerMode==='service')layerActive=1;renderLayers();},9000)}

/* ---------- Formats ---------- */
const FORMATS=[
{id:'J1',l:1.5,w:1.5,use:'Aceras, cruces, accesibilidad y encuentros.'},
{id:'J2',l:3,w:1.5,use:'Recorridos, carriles bici y redes urbanas.'},
{id:'J4',l:3,w:3,use:'Plazas, espacios cívicos y servicios.'},
{id:'J6',l:4.5,w:3,use:'Parkings, intercambiadores y actividad.'},
{id:'J8',l:6,w:3,use:'Grandes superficies y usos intensivos.'},
{id:'J10',l:7.5,w:3,use:'Zonas industriales, logísticas y grandes plataformas.'}
];
const CUTS=[['J1(0,75)',1.5,.75],['J4(0,75)',3,.75],['J4(2,25)',3,2.25],['J6(0,75)',4.5,.75],['J6(1,50)',4.5,1.5],['J6(2,25)',4.5,2.25],['J8(0,75)',6,.75],['J8(1,50)',6,1.5],['J8(2,25)',6,2.25],['J10(0,75)',7.5,.75],['J10(1,50)',7.5,1.5],['J10(2,25)',7.5,2.25]];
let formatActive=2,cutActive=-1;
function renderFormats(){
  const max=7.5;
  $('#formatTabs').innerHTML=FORMATS.map((f,i)=>{const mw=36+46*f.l/max,mh=16+18*f.w/3;return `<button class="format-tab ${i===formatActive&&cutActive<0?'active':''}" data-i="${i}" style="--mini-w:${mw}px;--mini-h:${mh}px"><span class="mini-slab"><i></i></span><b>${f.id}</b><span>${f.l.toFixed(2).replace('.',',')} × ${f.w.toFixed(2).replace('.',',')} m</span><small>${(f.l*f.w).toFixed(2).replace('.',',')} m²</small></button>`}).join('');
  $('#cutTabs').innerHTML=CUTS.map((c,i)=>`<button class="cut-tab ${i===cutActive?'active':''}" data-cut="${i}"><b>${c[0]}</b><span>${c[1].toFixed(2).replace('.',',')} × ${c[2].toFixed(2).replace('.',',')} m</span><small>${(c[1]*c[2]).toFixed(3).replace('.',',')} m²</small></button>`).join('');
  $$('#formatTabs button').forEach(b=>b.onclick=()=>{formatActive=+b.dataset.i;cutActive=-1;renderFormats();});
  $$('#cutTabs button').forEach(b=>b.onclick=()=>{cutActive=+b.dataset.cut;renderFormats();});
  let id,l,w,use,family='FORMATO ESTÁNDAR';if(cutActive>=0){[id,l,w]=CUTS[cutActive];use='Corte especial compatible con la familia, la conexión y el proceso de montaje.';family='CORTE ESPECIAL'}else{({id,l,w,use}=FORMATS[formatActive])}
  const fw=135+230*l/max,fh=80+125*w/3;
  const scene=$('#dimensionScene');scene.classList.add('is-changing');setTimeout(()=>scene.classList.remove('is-changing'),360);
  $('#formatPiece').style.setProperty('--fw',fw+'px');$('#formatPiece').style.setProperty('--fh',fh+'px');
  $('#dimX').textContent=l.toFixed(2).replace('.',',')+' m';$('#dimY').textContent=w.toFixed(2).replace('.',',')+' m';$('#formatFamily').textContent=family;$('#formatName').textContent=id;$('#formatDims').textContent=l.toFixed(2).replace('.',',')+' × '+w.toFixed(2).replace('.',',')+' m';$('#formatArea').textContent=(l*w).toFixed(2).replace('.',',')+' m²';$('#formatUse').textContent=use;
}

/* ---------- Benefits ---------- */
const BENEFIT_ICONS=[
'assets/Iconos tech 3d urbanos/freepik_crea-una-imagen-con-materiales-reales-y-realistas-de-img1-fotorrealista-iluminacion-etc-etc-etc_0001 (1).png',
'assets/Iconos tech 3d urbanos/freepik_crea-una-imagen-con-materiales-reales-y-realistas-de-img1-fotorrealista-iluminacion-etc-etc-etc_0001 (2).png',
'assets/Iconos tech 3d urbanos/freepik_crea-una-imagen-con-materiales-reales-y-realistas-de-img1-fotorrealista-iluminacion-etc-etc-etc_0001 (4).png',
'assets/Iconos tech 3d urbanos/freepik_crea-una-imagen-con-materiales-reales-y-realistas-de-img1-fotorrealista-iluminacion-etc-etc-etc_0001 (5).png',
'assets/Iconos tech 3d urbanos/freepik_crea-una-imagen-con-materiales-reales-y-realistas-de-img1-fotorrealista-iluminacion-etc-etc-etc_0001 (6).png',
'assets/Iconos tech 3d urbanos/freepik_crea-una-imagen-con-materiales-reales-y-realistas-de-img1-fotorrealista-iluminacion-etc-etc-etc_0001 (10).png'];
const BENEFITS=[
{cat:'Ciudadanía',title:'Menos obra y menos molestias',txt:'Prefabricación, montaje seco y actuaciones localizadas reducen ruido, polvo y duración de cortes.',action:'Puede programar por tramos, mantener itinerarios y comunicar plazos precisos.'},
{cat:'Operación',title:'Información útil del activo',txt:'Ubicación, estado, instalación, responsables y mantenimiento vinculados al elemento o zona.',action:'Puede consultar, priorizar, autorizar y cerrar intervenciones con evidencia.'},
{cat:'Economía',title:'Mayor vida útil y valor patrimonial',txt:'Reparar componentes y reconfigurar usos protege la inversión y evita reemplazos completos.',action:'Puede comparar coste de ciclo de vida y justificar decisiones de inversión.'},
{cat:'Circularidad',title:'Recuperar, reutilizar y reconfigurar',txt:'Los componentes se diseñan para desmontaje, retorno, nuevo uso o reciclaje documentado.',action:'Puede definir el destino y el segundo ciclo desde la contratación.'},
{cat:'Operación',title:'Mantenimiento localizado',txt:'La intervención se concentra en la pieza, tramo o servicio afectado, conservando el resto.',action:'Puede coordinar operarios, repuestos, ventanas de trabajo y disponibilidad.'},
{cat:'Ciudadanía',title:'Accesibilidad y seguridad actualizables',txt:'Texturas, bandas, señalización, pendientes y encuentros pueden renovarse sin rehacer todo el entorno.',action:'Puede mantener itinerarios adaptados a normativa y necesidades reales.'},
{cat:'Economía',title:'Escalabilidad por fases',txt:'La solución puede comenzar en una zona, ampliarse por lotes o cambiar de modalidad de servicio.',action:'Puede adaptar alcance e inversión al presupuesto y la prioridad municipal.'},
{cat:'Circularidad',title:'Cadena local y abierta',txt:'Fabricantes, montadores, mantenedores y recicladores locales pueden incorporarse con método y control CUEVA.',action:'Puede generar actividad local, conocimiento y menor dependencia logística.'},
{cat:'Operación',title:'Instalación demostrable',txt:'La recepción del elemento conserva fecha, ubicación, agente, documentación y aceptación.',action:'Puede comprobar qué se instaló, dónde, cuándo y bajo qué control.'},
{cat:'Economía',title:'Diseño adaptable y compatible',txt:'Los formatos, acabados y servicios pueden crecer o modificarse sin romper la lógica del sistema.',action:'Puede reconfigurar espacios, ampliar fases y actualizar prestaciones futuras.'},
{cat:'Ciudadanía',title:'Respuesta más rápida',txt:'La localización del elemento y su histórico reducen diagnóstico, apertura y cierre de incidencias.',action:'Puede dar respuesta más trazable a vecinos, comercios y servicios públicos.'},
{cat:'Circularidad',title:'Material convertido en activo',txt:'El componente plástico reciclado funciona en fabricación, en servicio y en la recuperación final.',action:'Puede medir material incorporado y planificar recuperación y nuevo uso.'}
];
const BCATS=['Todas','Ciudadanía','Operación','Economía','Circularidad'];let benefitCat='Todas';
function renderBenefits(){
  $('#benefitTabs').innerHTML=BCATS.map(c=>`<button class="${c===benefitCat?'active':''}" data-cat="${c}">${c}</button>`).join('');
  $$('#benefitTabs button').forEach(b=>b.onclick=()=>{benefitCat=b.dataset.cat;renderBenefits()});
  const arr=BENEFITS.filter(b=>benefitCat==='Todas'||b.cat===benefitCat);
  const icons=['⌁','◎','◫','↻','◇','♿','＋','∞','✓','⌂','⚡','♻'];$('#benefitGrid').innerHTML=arr.map((b,i)=>`<article class="benefit-card"><span class="benefit-icon">${icons[i%icons.length]}</span><small>${b.cat}</small><h4>${b.title}</h4><p>${b.txt}</p><span class="action">${b.action}</span></article>`).join('');
}

/* ---------- Textures ---------- */
const TEXTURES=[
{name:'Colección de superficies iPath',img:'assets/texturas/texturas-cueva-board.webp',use:'Texturas, colores y relieves reales reunidos en una misma familia visual.',chips:['Colección completa','Personalizable','Reposición documentada']},
{name:'Catálogo de acabados',img:'assets/texturas/freepik_crea-una-imagen-con-materiales-reales-y-realistas-de-img1-de-alta-calidad-de-catalogo-de-esta-pieza-modular-de-hormigon-genera-varias-opciones-como-un-catalogo_0001.png',use:'Familias de textura, color y relieve seleccionables por proyecto.',chips:['Urbano','Personalizable','Reposición exacta']},
{name:'Acabados y colores',img:'assets/texturas/freepik_crea-una-imagen-con-materiales-reales-y-realistas-de-img1-de-alta-calidad-de-catalogo-de-esta-pieza-modular-de-hormigon-genera-varias-opciones-y-colores-como-un-catalogo_0001.png',use:'Combinaciones cromáticas para identidad de barrio, señalización o integración paisajística.',chips:['Color','Señalización','Identidad']},
{name:'Pieza texturizada',img:'assets/texturas/freepik_crea-una-imagen-con-materiales-reales-y-realistas-de-img1-de-alta-calidad-de-catalogo-de-esta-pieza-texturizada-modular-de-hormigon_0001 (1).png',fallbacks:['assets/texturas/freepik_crea-una-imagen-con-materiales-reales-y-realistas-de-img1-de-alta-calidad-de-catalogo-de-esta-pieza-texturizada-modular-de-hormigon_0001.png'],use:'Relieves antideslizantes y legibles para recorridos, cruces y espacios cívicos.',chips:['Antideslizante','Táctil','Alta durabilidad']},
{name:'Textura de piedra',img:'assets/texturas/freepik_crea-una-imagen-con-materiales-reales-y-realistas-de-img1-de-alta-calidad-de-catalogo-de-esta-pieza-modular-de-hormigon-genera-varias-opciones-como-un-catalogo_0001 (1).png',use:'Acabado mineral para cascos urbanos, plazas y entornos patrimoniales.',chips:['Mineral','Patrimonial','Reposición']},
{name:'Acabado ranurado',img:'assets/texturas/texture-grooved.webp',use:'Direccionalidad, drenaje y lectura funcional de la superficie.',chips:['Drenante','Direccional','Movilidad']}
];
let textureActive=0;
function renderTextures(){
  $('#textureSwatches').innerHTML=TEXTURES.map((t,i)=>`<button class="texture-btn ${i===textureActive?'active':''}" data-i="${i}">${imgTag(t.img,t.name,'',t.fallbacks||[])}<span>${t.name}</span></button>`).join('');
  $$('.texture-btn').forEach(b=>b.onclick=()=>{textureActive=+b.dataset.i;renderTextures()});
  const t=TEXTURES[textureActive];const preview=$('#texturePreview');preview.src=t.img;preview.dataset.fallbacks=(t.fallbacks||[]).join('|');preview.dataset.fallbackIndex='0';$('#textureName').textContent=t.name;$('#textureUse').textContent=t.use;$('#textureSpec').innerHTML=`<b>${t.name}</b><p>${t.use} El acabado seleccionado queda asociado a la documentación del elemento para facilitar futuras reposiciones.</p><div class="chips">${t.chips.map(x=>`<span>${x}</span>`).join('')}</div>`;
}

/* ---------- Impact ---------- */
function updateImpact(){const m2=+$('#surfaceRange').value;$('#surfaceOut').textContent=fmt(m2)+' m²';$('#plasticKg').textContent=fmt(m2*22)+' kg';$('#recoverKg').textContent=fmt(m2*22*2)+' kg';$('#serviceM2').textContent=fmt(m2*2)+' m²'}
$('#surfaceRange').oninput=updateImpact;

/* ---------- Navigation and motion ---------- */
function initNav(){
  const links=$$('.side-nav a');const targetIds=new Set(links.map(a=>a.getAttribute('href').slice(1)));const sections=$$('section[id]').filter(s=>targetIds.has(s.id));
  const obs=new IntersectionObserver(entries=>{const hit=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(!hit)return;links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+hit.target.id));},{threshold:[.16,.3,.5]});
  sections.forEach(s=>obs.observe(s));$('#mobileMenu').onclick=()=>$('#sidebar').classList.toggle('open');links.forEach(a=>a.onclick=()=>$('#sidebar').classList.remove('open'));
}
function heroParallax(){const h=$('#inicio'),img=$('.hero-bg');if(!h||!img)return;h.addEventListener('pointermove',e=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;const r=h.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;img.style.transform=`scale(1.03) translate(${x*-7}px,${y*-5}px)`});h.addEventListener('pointerleave',()=>img.style.transform='');}

renderFilters();renderApps();renderProcess();restartProcessTimer();renderLayers();restartLayerTimer();renderFormats();renderBenefits();updateImpact();initNav();heroParallax();startAuto();
