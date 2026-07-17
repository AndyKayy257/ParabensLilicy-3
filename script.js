/* ==========================================================================
   LILICY — Presente de aniversário
   JavaScript puro, organizado por responsabilidade.
   ========================================================================== */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ========================================================================
     PARTÍCULAS DE FUNDO (estrelas discretas flutuando)
     ======================================================================== */
  const Particles = (function () {
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let width, height, raf;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    function createParticles() {
      const count = window.innerWidth < 540 ? 34 : 54;
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.6 + 0.4,
        speed: Math.random() * 0.15 + 0.03,
        drift: (Math.random() - 0.5) * 0.15,
        alpha: Math.random() * 0.5 + 0.15,
        twinkleSpeed: Math.random() * 0.015 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
      }));
    }

    function tick() {
      ctx.clearRect(0, 0, width, height);
      const time = performance.now();

      particles.forEach((p) => {
        p.y -= p.speed;
        p.x += p.drift;
        if (p.y < -10) { p.y = height + 10; p.x = Math.random() * width; }

        const twinkle = Math.sin(time * p.twinkleSpeed + p.twinklePhase) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.fillStyle = `rgba(243, 227, 191, ${p.alpha * twinkle})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      raf = requestAnimationFrame(tick);
    }

    function init() {
      resize();
      createParticles();
      if (!prefersReducedMotion) {
        tick();
      } else {
        // desenha um único quadro estático
        ctx.clearRect(0, 0, width, height);
        particles.forEach((p) => {
          ctx.beginPath();
          ctx.fillStyle = `rgba(243, 227, 191, ${p.alpha})`;
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        });
      }
      window.addEventListener('resize', () => {
        resize();
        createParticles();
      });
    }

    return { init };
  })();

  /* ========================================================================
     MÚSICA — player fixo, autoplay controlado após interação do usuário
     ======================================================================== */
  const MusicPlayer = (function () {
    const audio = document.getElementById('audio');
    const player = document.getElementById('player');
    const toggleBtn = document.getElementById('player-toggle');
    const panel = document.getElementById('player-panel');
    const playBtn = document.getElementById('btn-play');
    const restartBtn = document.getElementById('btn-restart');
    const volumeInput = document.getElementById('volume');
    const iconPlay = document.getElementById('icon-play');
    const iconPause = document.getElementById('icon-pause');

    function setPlayingIcon(isPlaying) {
      iconPlay.style.display = isPlaying ? 'none' : 'block';
      iconPause.style.display = isPlaying ? 'block' : 'none';
    }

    function play() {
      audio.play().then(() => setPlayingIcon(true)).catch(() => {
        // Autoplay bloqueado pelo navegador — o botão de play manual resolve.
        setPlayingIcon(false);
      });
    }

    function pause() {
      audio.pause();
      setPlayingIcon(false);
    }

    function bindEvents() {
      toggleBtn.addEventListener('click', () => {
        panel.classList.toggle('is-open');
      });

      playBtn.addEventListener('click', () => {
        if (audio.paused) play(); else pause();
      });

      restartBtn.addEventListener('click', () => {
        audio.currentTime = 0;
        play();
      });

      volumeInput.addEventListener('input', (e) => {
        audio.volume = parseFloat(e.target.value);
      });

      audio.volume = parseFloat(volumeInput.value);
    }

    function reveal() {
      player.setAttribute('data-visible', 'true');
    }

    function start() {
      reveal();
      play();
    }

    function init() {
      bindEvents();
    }

    return { init, start };
  })();

  /* ========================================================================
     BOTÕES / TRANSIÇÃO INICIAL — revela o restante do site
     ======================================================================== */
  const IntroFlow = (function () {
    const introSection = document.getElementById('intro');
    const veil = document.getElementById('intro-veil');
    const startBtn = document.getElementById('btn-start');
    const site = document.getElementById('site');

    function revealSite() {
      site.hidden = false;
      requestAnimationFrame(() => {
        ScrollReveal.observeAll();
        ScrollReveal.revealVisible();
      });
    }

    function start() {
      introSection.classList.add('is-leaving');
      veil.classList.add('is-active');

      MusicPlayer.start();

      setTimeout(() => {
        revealSite();
        introSection.style.display = 'none';
        veil.classList.remove('is-active');
        veil.style.pointerEvents = 'none';
        window.scrollTo({ top: 0, behavior: 'auto' });
      }, prefersReducedMotion ? 50 : 1300);
    }

    function init() {
      startBtn.addEventListener('click', start, { once: true });
    }

    return { init };
  })();

  /* ========================================================================
     SCROLL REVEAL — animações leves ao rolar a página
     ======================================================================== */
  const ScrollReveal = (function () {
    let observer;

    function observeAll() {
      const targets = document.querySelectorAll('.reveal:not(.is-observed)');
      if (!observer) {
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
        );
      }
      targets.forEach((el) => {
        el.classList.add('is-observed');
        observer.observe(el);
      });
    }

    function revealVisible() {
      // Revela imediatamente o que já está na viewport ao abrir o site
      document.querySelectorAll('.reveal').forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.9) {
          el.classList.add('is-visible');
        }
      });
    }

    return { observeAll, revealVisible };
  })();

  /* ========================================================================
     CARTA + MÁQUINA DE ESCREVER
     ======================================================================== */
  const Letter = (function () {
    const TEXT = `Oii, Lilicy.

Eu sei que esse presente  chegou alguns dias depois do seu aniversário.

Mas eu descobri que algumas coisas não precisam acontecer exatamente na data para terem significado.

Enquanto eu fazia esse site, percebi que o mais importante não era terminar rápido.

Era fazer cada detalhe pensando em você.

Cada animação.

Cada botão.

Cada efeito.

Cada pedacinho foi colocado aqui com carinho.

Ainda estamos nos conhecendo.

Ainda existem muitas coisas sobre você que eu nem sei.

Mas as pequenas conversas que tivemos já foram suficientes para me inspirar a criar tudo isso.

Eu queria fazer um presente que não fosse comprado.

Queria fazer algo único.

Algo que existisse somente para você.

Espero que, quando olhar para este site, consiga perceber que ele foi feito com tempo, dedicação e carinho.

Obrigado por compartilhar um pouco do seu tempo comigo.

Obrigado pelas conversas.

Que Deus continue cuidando de você.

Que Ele ilumine seus caminhos.

Fortaleça sua fé.

Proteja seus sonhos.

E faça este novo ciclo ser repleto de alegria, paz e momentos inesquecíveis.

Feliz aniversário, Lilicy.

Espero que este presente consiga arrancar pelo menos um sorriso seu.

Com carinho,

Kay.`;

    const overlay = document.getElementById('letter-overlay');
    const openBtn = document.getElementById('btn-open-letter');
    const closeBtn = document.getElementById('letter-close');
    const textEl = document.getElementById('letter-text');
    const caret = document.getElementById('letter-caret');

    let typing = false;
    let typed = false;
    let typeTimer = null;

    function typeWriter() {
      if (typed || typing) return;
      typing = true;
      textEl.textContent = '';
      let i = 0;
      const speed = prefersReducedMotion ? 0 : 18;

      function step() {
        if (i <= TEXT.length) {
          textEl.textContent = TEXT.slice(0, i);
          i += 1;
          typeTimer = setTimeout(step, speed);
        } else {
          typing = false;
          typed = true;
          caret.style.display = 'none';
        }
      }

      if (prefersReducedMotion) {
        textEl.textContent = TEXT;
        typing = false;
        typed = true;
        caret.style.display = 'none';
      } else {
        step();
      }
    }

    function open() {
      overlay.classList.add('is-open');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      setTimeout(typeWriter, prefersReducedMotion ? 0 : 650);
    }

    function close() {
      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (typeTimer) clearTimeout(typeTimer);
    }

    function init() {
      openBtn.addEventListener('click', open);
      closeBtn.addEventListener('click', close);
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) close();
      });
    }

    return { init };
  })();

  /* ========================================================================
     CONFETES — usados nos joguinhos ao concluir
     ======================================================================== */
  const Confetti = (function () {
    const colors = ['#b3243a', '#d4af6a', '#f3e3bf', '#8c1c2e', '#ffffff'];

    function burst(count = 60) {
      if (prefersReducedMotion) return;
      const frag = document.createDocumentFragment();

      for (let i = 0; i < count; i += 1) {
        const piece = document.createElement('span');
        piece.className = 'confetti-piece';
        const left = Math.random() * 100;
        const duration = 2.6 + Math.random() * 1.8;
        const delay = Math.random() * 0.4;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const rotate = Math.random() > 0.5 ? '50%' : '3px';

        piece.style.left = `${left}vw`;
        piece.style.background = color;
        piece.style.borderRadius = rotate;
        piece.style.animationDuration = `${duration}s`;
        piece.style.animationDelay = `${delay}s`;

        frag.appendChild(piece);
      }

      document.body.appendChild(frag);

      setTimeout(() => {
        document.querySelectorAll('.confetti-piece').forEach((el) => el.remove());
      }, 5000);
    }

    return { burst };
  })();

  /* ========================================================================
     CÉU ESTRELADO
     ======================================================================== */
  const Sky = (function () {
    const container = document.getElementById('sky-stars');
    const messageEl = document.getElementById('sky-message');
    let messagesShown = false;

    function createStars(count = 26) {
      const frag = document.createDocumentFragment();
      for (let i = 0; i < count; i += 1) {
        const star = document.createElement('button');
        star.className = 'sky__star';
        star.setAttribute('aria-label', 'Estrela');
        star.style.top = `${8 + Math.random() * 78}%`;
        star.style.left = `${4 + Math.random() * 90}%`;
        star.style.animationDelay = `${Math.random() * 3}s`;
        star.addEventListener('click', () => shootStar(star));
        frag.appendChild(star);
      }
      container.appendChild(frag);
    }

    function shootStar(star) {
      if (star.classList.contains('is-shooting')) return;
      star.classList.add('is-shooting');

      const trail = document.createElement('span');
      trail.className = 'shooting-trail';
      trail.style.width = '70px';
      trail.style.top = star.style.top;
      trail.style.left = star.style.left;
      container.appendChild(trail);

      setTimeout(() => trail.remove(), 1000);

      messageEl.textContent = 'Que Deus continue iluminando cada passo da sua caminhada.';
      messageEl.classList.add('is-visible');

      setTimeout(() => {
        star.classList.remove('is-shooting');
      }, 1200);
    }

    function init() {
      createStars();
    }

    return { init };
  })();

  /* ========================================================================
     JOGUINHOS
     ======================================================================== */
  const Games = (function () {
    const overlay = document.getElementById('game-overlay');
    const closeBtn = document.getElementById('game-close');
    const titleEl = document.getElementById('game-title');
    const bodyEl = document.getElementById('game-body');
    const tiles = document.querySelectorAll('.game-tile');

    function open(title) {
      titleEl.textContent = title;
      overlay.classList.add('is-open');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function close() {
      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      bodyEl.innerHTML = '';
    }

    function showComplete() {
      Confetti.burst(70);
      const msg = document.createElement('p');
      msg.className = 'game-complete';
      msg.textContent = 'Parabéns, Lilicy';
      bodyEl.appendChild(msg);
    }

    /* --- Jogo 1: Estourar balões --- */
    function renderBalloons() {
      bodyEl.innerHTML = `
        <div class="balloon-field" id="balloon-field"></div>
        <p class="balloon-progress" id="balloon-progress">Estoure 8 balões</p>
      `;
      const field = document.getElementById('balloon-field');
      const progress = document.getElementById('balloon-progress');
      const colors = ['#b3243a', '#8c1c2e', '#cf3b4d', '#d4af6a'];
      let popped = 0;
      const goal = 8;
      let spawnTimer;

      function spawnBalloon() {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        const left = Math.random() * 82;
        const duration = 4.5 + Math.random() * 3;
        const drift = (Math.random() - 0.5) * 60;
        const color = colors[Math.floor(Math.random() * colors.length)];

        balloon.style.left = `${left}%`;
        balloon.style.background = `radial-gradient(circle at 35% 30%, ${color}, #3d0510)`;
        balloon.style.animationDuration = `${duration}s`;
        balloon.style.setProperty('--drift', `${drift}px`);

        balloon.addEventListener('click', () => {
          if (balloon.classList.contains('is-popped')) return;
          balloon.classList.add('is-popped');
          popped += 1;
          progress.textContent = popped >= goal ? '' : `Estoure ${goal - popped} balões`;
          setTimeout(() => balloon.remove(), 350);
          if (popped >= goal) {
            clearInterval(spawnTimer);
            setTimeout(() => {
              field.innerHTML = '';
              showComplete();
            }, 400);
          }
        });

        balloon.addEventListener('animationend', (e) => {
          if (e.animationName === 'floatUp') balloon.remove();
        });

        field.appendChild(balloon);
      }

      for (let i = 0; i < 3; i += 1) setTimeout(spawnBalloon, i * 400);
      spawnTimer = setInterval(spawnBalloon, 900);
    }

    /* --- Jogo 2: Quebra-cabeça (15-puzzle 3x3) --- */
    function renderPuzzle() {
      bodyEl.innerHTML = `
        <div class="puzzle-board" id="puzzle-board"></div>
        <p class="balloon-progress">Ordene os números de 1 a 8</p>
      `;
      const board = document.getElementById('puzzle-board');
      let tilesArr = [1, 2, 3, 4, 5, 6, 7, 8, null];

      // embaralhar com movimentos válidos garante solubilidade
      function shuffle() {
        let emptyIndex = 8;
        for (let i = 0; i < 120; i += 1) {
          const neighbors = getNeighbors(emptyIndex);
          const swapWith = neighbors[Math.floor(Math.random() * neighbors.length)];
          [tilesArr[emptyIndex], tilesArr[swapWith]] = [tilesArr[swapWith], tilesArr[emptyIndex]];
          emptyIndex = swapWith;
        }
      }

      function getNeighbors(index) {
        const row = Math.floor(index / 3);
        const col = index % 3;
        const result = [];
        if (row > 0) result.push(index - 3);
        if (row < 2) result.push(index + 3);
        if (col > 0) result.push(index - 1);
        if (col < 2) result.push(index + 1);
        return result;
      }

      function isSolved() {
        return tilesArr.slice(0, 8).every((v, i) => v === i + 1);
      }

      function render() {
        board.innerHTML = '';
        tilesArr.forEach((val, i) => {
          const btn = document.createElement('button');
          btn.className = 'puzzle-piece' + (val === null ? ' is-empty' : '');
          if (val !== null) {
            btn.textContent = val;
            if (val === i + 1) btn.classList.add('is-correct');
          }
          btn.addEventListener('click', () => handleClick(i));
          board.appendChild(btn);
        });
      }

      function handleClick(index) {
        const emptyIndex = tilesArr.indexOf(null);
        if (getNeighbors(emptyIndex).includes(index)) {
          [tilesArr[emptyIndex], tilesArr[index]] = [tilesArr[index], tilesArr[emptyIndex]];
          render();
          if (isSolved()) {
            setTimeout(() => {
              board.remove();
              showComplete();
            }, 350);
          }
        }
      }

      shuffle();
      render();
    }

    /* --- Jogo 3: Encontrar a estrela --- */
    function renderStarFind() {
      bodyEl.innerHTML = `
        <div class="star-grid" id="star-grid"></div>
        <p class="balloon-progress" id="star-progress">Toque na estrela escondida</p>
      `;
      const grid = document.getElementById('star-grid');
      const progress = document.getElementById('star-progress');
      const total = 12;
      let round = 0;
      const roundsToWin = 3;

      function buildRound() {
        grid.innerHTML = '';
        const targetIndex = Math.floor(Math.random() * total);
        for (let i = 0; i < total; i += 1) {
          const cell = document.createElement('button');
          cell.className = 'star-cell' + (i === targetIndex ? ' is-target' : '');
          cell.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 2l2.9 6.6L22 9.3l-5 4.8L18.2 22 12 18.3 5.8 22 7 14.1l-5-4.8 7.1-0.7z"/></svg>';
          cell.addEventListener('click', () => {
            if (i === targetIndex) {
              round += 1;
              progress.textContent = round >= roundsToWin ? '' : 'Isso mesmo! Mais uma vez';
              if (round >= roundsToWin) {
                setTimeout(() => {
                  grid.remove();
                  showComplete();
                }, 300);
              } else {
                setTimeout(buildRound, 400);
              }
            } else {
              cell.style.transform = 'scale(0.9)';
              setTimeout(() => { cell.style.transform = ''; }, 150);
            }
          });
          grid.appendChild(cell);
        }
      }

      buildRound();
    }

    /* --- Jogo 4: Jogo da memória --- */
    function renderMemory() {
      bodyEl.innerHTML = `
        <div class="memory-board" id="memory-board"></div>
        <p class="balloon-progress" id="memory-progress"></p>
      `;
      const board = document.getElementById('memory-board');
      const progress = document.getElementById('memory-progress');
      const symbols = ['♥', '✦', '☾', '❋', '✿', '♥', '✦', '☾', '❋', '✿'].slice(0, 10);
      // 5 pares
      const pairSymbols = ['♥', '✦', '☾', '❋', '✿'];
      let deck = [...pairSymbols, ...pairSymbols]
        .sort(() => Math.random() - 0.5)
        .map((symbol, i) => ({ id: i, symbol }));

      let firstPick = null;
      let lock = false;
      let matches = 0;

      function render() {
        board.innerHTML = '';
        deck.forEach((card) => {
          const el = document.createElement('div');
          el.className = 'memory-card';
          el.dataset.id = card.id;
          el.innerHTML = `
            <div class="memory-card__inner">
              <div class="memory-card__face memory-card__face--back"></div>
              <div class="memory-card__face memory-card__face--front">${card.symbol}</div>
            </div>
          `;
          el.addEventListener('click', () => handlePick(el, card));
          board.appendChild(el);
        });
      }

      function handlePick(el, card) {
        if (lock || el.classList.contains('is-matched') || el.classList.contains('is-flipped')) return;
        el.classList.add('is-flipped');

        if (!firstPick) {
          firstPick = { el, card };
          return;
        }

        lock = true;
        if (firstPick.card.symbol === card.symbol && firstPick.card.id !== card.id) {
          firstPick.el.classList.add('is-matched');
          el.classList.add('is-matched');
          matches += 1;
          firstPick = null;
          lock = false;
          if (matches === pairSymbols.length) {
            setTimeout(() => {
              board.remove();
              progress.remove();
              showComplete();
            }, 400);
          }
        } else {
          setTimeout(() => {
            firstPick.el.classList.remove('is-flipped');
            el.classList.remove('is-flipped');
            firstPick = null;
            lock = false;
          }, 750);
        }
      }

      render();
    }

    const renderers = {
      balloons: { title: 'Estourar balões', render: renderBalloons },
      puzzle: { title: 'Quebra-cabeça', render: renderPuzzle },
      star: { title: 'Encontrar a estrela', render: renderStarFind },
      memory: { title: 'Jogo da memória', render: renderMemory },
    };

    function init() {
      tiles.forEach((tile) => {
        tile.addEventListener('click', () => {
          const key = tile.dataset.game;
          const config = renderers[key];
          if (!config) return;
          open(config.title);
          config.render();
        });
      });

      closeBtn.addEventListener('click', close);
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) close();
      });
    }

    return { init };
  })();

  /* ========================================================================
     FINAL — confetes contínuos e leves na última seção
     ======================================================================== */
  const FinalScene = (function () {
    function init() {
      const finalSection = document.getElementById('section-final');
      if (!finalSection || prefersReducedMotion) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            Confetti.burst(50);
            observer.disconnect();
          }
        });
      }, { threshold: 0.4 });

      observer.observe(finalSection);
    }

    return { init };
  })();

  /* ========================================================================
     INICIALIZAÇÃO GERAL
     ======================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    Particles.init();
    MusicPlayer.init();
    IntroFlow.init();
    Letter.init();
    Sky.init();
    Games.init();
    FinalScene.init();
  });
})();
