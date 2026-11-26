/*
 * PEPSICO | Capa adicional de imágenes oficiales
 * ------------------------------------------------
 * Archivo independiente: no reemplaza ni modifica index.html, styles.css,
 * script.js ni datos.js.
 *
 * Instalación: añade esta línea justo antes de </body> en index.html:
 * <script src="pepsico-imagenes-oficiales.js" defer></script>
 *
 * Las imágenes se sirven desde el dominio oficial digitalassets.pepsico.com.
 * La disponibilidad y los permisos de reutilización dependen de PepsiCo.
 */
(() => {
  "use strict";

  const OFFICIAL_ASSETS = {
    brands: {
      "PEPSI": {
        src: "https://digitalassets.pepsico.com/transform/47a5ae69-928c-44bd-b3cf-eab35bdc943e/pepsi-logo-fullcolor-RGB?q=85&w=1200",
        alt: "Logotipo oficial de Pepsi"
      },
      "LAY’S": {
        src: "https://digitalassets.pepsico.com/transform/ea49e510-4e74-44f5-bcdd-519084e32e6a/Lays-Logo-Full-Color?q=85&w=1200",
        alt: "Logotipo oficial de Lay's"
      },
      "GATORADE": {
        src: "https://digitalassets.pepsico.com/transform/7addf46d-fb2a-498f-bb72-d70354925610/gatorade-logo-gbolt-mark-rgb-outline?q=85&w=1200",
        alt: "Logotipo oficial de Gatorade"
      }
    },
    sustainability: [
      {
        src: "https://digitalassets.pepsico.com/transform/8b4c2564-fe59-48d0-b44c-1ad35ed84b2e/header-photo_1697x1130?q=85&w=1800",
        alt: "Tractor trabajando en un campo agrícola",
        caption: "Agricultura y resiliencia"
      },
      {
        src: "https://digitalassets.pepsico.com/transform/bbee566b-07ff-42c3-8dfb-907a427a2098/pepsico_icrop-19_2735x1824?q=85&w=1800",
        alt: "Cultivo de patatas en España",
        caption: "Abastecimiento agrícola"
      },
      {
        src: "https://digitalassets.pepsico.com/transform/b1bd2b8c-4e09-4d66-b6c6-a090cd70dbb9/page-9-i-crop_2258x1505?q=85&w=1800",
        alt: "Agricultores trabajando en un campo",
        caption: "Trabajo con comunidades agrícolas"
      }
    ]
  };

  const normalize = value => String(value || "")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "").replace(/\s+/g, " ").trim().toUpperCase();

  function addStyles() {
    if (document.getElementById("pepsico-official-media-styles")) return;
    const style = document.createElement("style");
    style.id = "pepsico-official-media-styles";
    style.textContent = `
      .brand-card.pepsico-official-brand { position:relative; overflow:hidden; }
      .brand-card.pepsico-official-brand .pepsico-official-brand-image {
        display:block; width:100%; height:112px; object-fit:contain;
        padding:14px 10px 8px; margin:0 auto 10px;
        filter:drop-shadow(0 5px 12px rgba(0,0,0,.12));
      }
      .brand-card.pepsico-official-brand .brand-name { letter-spacing:.015em; }
      .pepsico-official-gallery {
        position:relative; z-index:2; display:grid;
        grid-template-columns:repeat(3,minmax(0,1fr)); gap:14px;
        width:min(1100px,84vw); margin:55px auto 0;
      }
      .pepsico-official-gallery figure { margin:0; min-width:0; }
      .pepsico-official-gallery img {
        display:block; width:100%; aspect-ratio:4/3; object-fit:cover;
        background:#102b45; border-radius:2px;
      }
      .pepsico-official-gallery figcaption {
        margin-top:10px; color:#c3d2df; font-size:10px;
        letter-spacing:.12em; text-transform:uppercase;
      }
      .pepsico-official-credit {
        width:min(1100px,84vw); margin:12px auto 0; color:#91a8bb;
        font-size:10px; line-height:1.6; position:relative; z-index:2;
      }
      @media(max-width:650px) {
        .brand-card.pepsico-official-brand .pepsico-official-brand-image { height:78px; }
        .pepsico-official-gallery { grid-template-columns:1fr; width:88vw; gap:18px; }
        .pepsico-official-gallery img { aspect-ratio:16/9; }
        .pepsico-official-credit { width:88vw; }
      }
    `;
    document.head.appendChild(style);
  }

  function setImageFallback(img) {
    img.addEventListener("error", () => {
      const wrapper = img.closest("figure") || img;
      if (wrapper && wrapper.remove) wrapper.remove();
    }, { once: true });
  }

  function applyBrandImages() {
    const cards = document.querySelectorAll("#brand-grid .brand-card");
    cards.forEach(card => {
      if (card.dataset.pepsicoOfficialImage === "done") return;
      const nameNode = card.querySelector(".brand-name");
      const asset = OFFICIAL_ASSETS.brands[normalize(nameNode?.textContent)];
      if (!asset) return;

      // Evita duplicar imágenes si el filtro vuelve a renderizar las tarjetas.
      const img = document.createElement("img");
      img.className = "pepsico-official-brand-image";
      img.src = asset.src;
      img.alt = asset.alt;
      img.loading = "lazy";
      img.decoding = "async";
      setImageFallback(img);
      card.insertBefore(img, card.firstChild);
      card.classList.add("pepsico-official-brand");
      card.dataset.pepsicoOfficialImage = "done";
    });
  }

  function addSustainabilityGallery() {
    const impact = document.querySelector("#impact .impact-content");
    if (!impact || document.querySelector(".pepsico-official-gallery")) return;

    const gallery = document.createElement("div");
    gallery.className = "pepsico-official-gallery";
    gallery.setAttribute("aria-label", "Fotografías oficiales de sostenibilidad de PepsiCo");

    OFFICIAL_ASSETS.sustainability.forEach(item => {
      const figure = document.createElement("figure");
      const img = document.createElement("img");
      const caption = document.createElement("figcaption");
      img.src = item.src;
      img.alt = item.alt;
      img.loading = "lazy";
      img.decoding = "async";
      caption.textContent = item.caption;
      setImageFallback(img);
      figure.append(img, caption);
      gallery.appendChild(figure);
    });

    const credit = document.createElement("p");
    credit.className = "pepsico-official-credit";
    credit.textContent = "Imágenes: biblioteca oficial de medios de PepsiCo. La publicación y reutilización de estos materiales debe respetar sus términos y autorizaciones.";
    impact.append(gallery, credit);
  }

  function init() {
    addStyles();
    applyBrandImages();
    addSustainabilityGallery();

    // El portafolio se vuelve a dibujar cuando se utilizan los filtros.
    const grid = document.getElementById("brand-grid");
    if (grid && "MutationObserver" in window) {
      new MutationObserver(applyBrandImages).observe(grid, { childList: true, subtree: true });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
