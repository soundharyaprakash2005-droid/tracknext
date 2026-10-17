const STORAGE_KEY = 'tracknext-saved-opportunities';

const sampleOpportunities = [
  {
    id: 1,
    title: 'Frontend Developer Internship',
    category: 'Internship',
    organizer: 'DVEIN Innovations',
    date: '2026-10-10',
    location: 'Chennai',
    price: '₹5,000/month',
    format: 'Offline',
    description: 'Work with a product engineering team building modern customer-facing interfaces, prototypes, and front-end components for real business use cases.',
    eligibility: 'Students in B.E./B.Tech, design & coding skills, portfolio or mini-project required.',
    applicationLabel: 'Sample application',
    applicationUrl: '#sample-application',
    illustration: '⌂',
    highlight: 'Featured'
  },
  {
    id: 2,
    title: 'AI Product Hackathon',
    category: 'Hackathon',
    organizer: 'Build for Bharat',
    date: '2026-10-14',
    location: 'Remote',
    price: '₹25,000 prize pool',
    format: 'Online',
    description: 'Develop an AI or no-code solution for a civic or student-focused challenge and present your idea to mentors and industry judges.',
    eligibility: 'Any college student; team of 2-4 members preferred.',
    applicationLabel: 'Sample registration',
    applicationUrl: '#sample-registration',
    illustration: '✦',
    highlight: 'Trending'
  },
  {
    id: 3,
    title: 'GenAI to Agentic AI Workshop',
    category: 'Workshop',
    organizer: 'Microsoft Office Chennai AI Community',
    date: '2026-10-12',
    location: 'Online',
    price: 'Free',
    format: 'Online',
    description: 'Explore prompt engineering, AI agent design, and workflow automation through real demos and practical hands-on learning.',
    eligibility: 'Open to all students interested in AI and automation.',
    applicationLabel: 'Sample registration',
    applicationUrl: '#sample-registration',
    illustration: '✎',
    highlight: 'Popular'
  },
  {
    id: 4,
    title: 'Build for Bharat Tech Event',
    category: 'Technical Event',
    organizer: 'TechConnect Hub',
    date: '2026-10-20',
    location: 'Hyderabad',
    price: '₹3,000 entry pass',
    format: 'Offline',
    description: 'A one-day technology showcase featuring expert talks, product demos, and networking with founders, engineers, and student innovators.',
    eligibility: 'Students and early-stage builders encouraged to participate.',
    applicationLabel: 'Sample application',
    applicationUrl: '#sample-application',
    illustration: '◈',
    highlight: 'Featured'
  },
  {
    id: 5,
    title: 'Cyber Security Quiz & Debug',
    category: 'Competition',
    organizer: 'CipherSpark Labs',
    date: '2026-10-18',
    location: 'Bengaluru',
    price: 'Free',
    format: 'Offline',
    description: 'Test your cybersecurity fundamentals, debugging ability, and problem-solving mindset in a competitive lab-based format.',
    eligibility: 'Open to computer science and cyber-focused students.',
    applicationLabel: 'Sample registration',
    applicationUrl: '#sample-registration',
    illustration: '◍',
    highlight: 'Challenge'
  },
  {
    id: 6,
    title: 'Machine Learning Foundation Course',
    category: 'Course',
    organizer: 'SkillForge Academy',
    date: '2026-10-28',
    location: 'Online',
    price: '₹4,499',
    format: 'Online',
    description: 'A structured learning path covering Python, model training, evaluation, and practical ML use cases for career readiness.',
    eligibility: 'Students with basic programming experience preferred.',
    applicationLabel: 'Sample enrollment',
    applicationUrl: '#sample-enrollment',
    illustration: '◐',
    highlight: 'New'
  },
  {
    id: 7,
    title: 'Software Engineer Campus Job',
    category: 'Job',
    organizer: 'NexaStack',
    date: '2026-10-25',
    location: 'Bengaluru',
    price: '₹18,000/month',
    format: 'Offline',
    description: 'Join an engineering team focused on web products, cloud services, and digital experience improvements for campus hires.',
    eligibility: 'Final-year students with strong DSA, JavaScript, and communication skills.',
    applicationLabel: 'Sample application',
    applicationUrl: '#sample-application',
    illustration: '◫',
    highlight: 'Role'
  },
  {
    id: 8,
    title: 'Merit Scholarship for STEM Students',
    category: 'Scholarship',
    organizer: 'STEM Future Foundation',
    date: '2026-10-30',
    location: 'Remote',
    price: '₹50,000 grant',
    format: 'Online',
    description: 'A merit-based funding opportunity for students pursuing STEM fields with strong academic achievement and leadership potential.',
    eligibility: 'Students from recognized colleges with a strong academic profile.',
    applicationLabel: 'Sample form',
    applicationUrl: '#sample-form',
    illustration: '★',
    highlight: 'Award'
  }
];

const categoryCounts = {
  all: sampleOpportunities.length,
  Internship: 1,
  Hackathon: 1,
  Workshop: 1,
  'Technical Event': 1,
  Competition: 1,
  Course: 1,
  Job: 1,
  Scholarship: 1
};

const state = {
  keyword: '',
  category: 'all',
  location: 'all',
  date: '',
  maxPrice: '',
  format: 'all'
};

let opportunities = [...sampleOpportunities];

const els = {
  featuredGrid: document.getElementById('featuredGrid'),
  latestList: document.getElementById('latestList'),
  savedList: document.getElementById('savedList'),
  savedCount: document.getElementById('savedCount'),
  filterForm: document.getElementById('filterForm'),
  searchKeyword: document.getElementById('searchKeyword'),
  categoryFilter: document.getElementById('categoryFilter'),
  locationFilter: document.getElementById('locationFilter'),
  dateFilter: document.getElementById('dateFilter'),
  maxPriceFilter: document.getElementById('maxPriceFilter'),
  clearFilters: document.getElementById('clearFilters'),
  topSearchInput: document.getElementById('topSearchInput'),
  modal: document.getElementById('detailsModal'),
  modalContent: document.getElementById('modalContent'),
  toast: document.getElementById('toast')
};

function getSavedIds() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function setSavedIds(ids) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

function toggleSave(id) {
  const saved = getSavedIds();
  const exists = saved.includes(id);
  const next = exists ? saved.filter((item) => item !== id) : [...saved, id];
  setSavedIds(next);
  renderSavedList();
  renderFeaturedCards();
  updateSavedCount();
  showToast(exists ? 'Opportunity removed from saved list.' : 'Opportunity saved successfully.');
}

function updateSavedCount() {
  const count = getSavedIds().length;
  els.savedCount.textContent = count;
}

function parsePrice(value) {
  if (!value) return 0;
  const match = value.match(/\d+/g);
  const numbers = match ? match.join('') : '0';
  return Number(numbers);
}

async function loadOpportunities() {
  try {
    const response = await fetch('/api/opportunities');
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    if (Array.isArray(data.opportunities) && data.opportunities.length) {
      opportunities = data.opportunities;
    }
  } catch (error) {
    opportunities = [...sampleOpportunities];
  }
}

function getFilteredOpportunities() {
  return opportunities.filter((opportunity) => {
    const keywordMatch = !state.keyword || [
      opportunity.title,
      opportunity.category,
      opportunity.organizer,
      opportunity.location,
      opportunity.description
    ].join(' ').toLowerCase().includes(state.keyword.toLowerCase());

    const categoryMatch = state.category === 'all' || opportunity.category === state.category;
    const locationMatch = state.location === 'all' || opportunity.location === state.location;
    const dateMatch = !state.date || opportunity.date === state.date;
    const formatMatch = state.format === 'all' || opportunity.format === state.format;
    const maxPriceMatch = !state.maxPrice || parsePrice(opportunity.price) <= Number(state.maxPrice);

    return keywordMatch && categoryMatch && locationMatch && dateMatch && formatMatch && maxPriceMatch;
  });
}

function renderFeaturedCards() {
  const filtered = getFilteredOpportunities();

  if (!filtered.length) {
    els.featuredGrid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div>
          <strong>No opportunities match your search.</strong><br />
          Try changing the filters or clearing them to explore more options.
        </div>
      </div>
    `;
    return;
  }

  const saved = new Set(getSavedIds());

  els.featuredGrid.innerHTML = filtered
    .map((item) => {
      const isSaved = saved.has(item.id);
      return `
        <article class="opportunity-card">
          <div class="card-graphic">
            <span class="card-badge">${item.highlight}</span>
            <div class="card-illustration">${item.illustration}</div>
          </div>
          <div class="card-body">
            <div class="card-header">
              <h3>${item.title}</h3>
              <button
                type="button"
                class="save-button ${isSaved ? 'saved' : ''}"
                data-save-btn="${item.id}"
                aria-label="${isSaved ? 'Unsave' : 'Save'} opportunity"
                title="${isSaved ? 'Unsave' : 'Save'} this opportunity"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3.5A2.5 2.5 0 018.5 1h7A2.5 2.5 0 0118 3.5V21l-6-3.7L6 21V3.5zm2.5-.5a.5.5 0 00-.5.5V16.7l4.5-2.78 4.5 2.78V3.5a.5.5 0 00-.5-.5h-7z" /></svg>
              </button>
            </div>

            <div class="card-meta">
              <div>
                <span class="meta-label">Category</span>
                <strong>${item.category}</strong>
              </div>
              <div>
                <span class="meta-label">Organizer</span>
                <strong>${item.organizer}</strong>
              </div>
              <div>
                <span class="meta-label">Date</span>
                <strong>${formatDate(item.date)}</strong>
              </div>
              <div>
                <span class="meta-label">Location</span>
                <strong>${item.location}</strong>
              </div>
            </div>

            <div class="card-tags">
              <span class="tag">${item.price}</span>
              <span class="tag">${item.format}</span>
            </div>
          </div>

          <div class="card-actions">
            <button type="button" class="secondary-button" data-open-modal="${item.id}">View Details</button>
            <button type="button" class="primary-button" data-apply-modal="${item.id}">Apply</button>
          </div>
        </article>
      `;
    })
    .join('');
}

function renderLatestList() {
  const filtered = [...getFilteredOpportunities()].sort((a, b) => new Date(a.date) - new Date(b.date));

  if (!filtered.length) {
    els.latestList.innerHTML = '<div class="empty-state">No recent opportunities available for this filter set.</div>';
    return;
  }

  els.latestList.innerHTML = filtered
    .slice(0, 5)
    .map((item) => `
      <div class="latest-item">
        <div>
          <strong>${item.title}</strong>
          <small>${item.category}</small>
        </div>
        <span>${formatDate(item.date)}</span>
        <span>${item.location}</span>
        <span>${item.price}</span>
        <button type="button" class="text-button" data-open-modal="${item.id}">View Details</button>
      </div>
    `)
    .join('');
}

function renderSavedList() {
  const savedIds = getSavedIds();
  const saved = opportunities.filter((item) => savedIds.includes(item.id));

  if (!saved.length) {
    els.savedList.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div>
          <strong>No saved opportunities yet.</strong><br />
          Save any opportunity card to keep your shortlists here.
        </div>
      </div>
    `;
    return;
  }

  els.savedList.innerHTML = saved
    .map((item) => `
      <article class="saved-item">
        <h3>${item.title}</h3>
        <div class="row"><span>${item.category}</span><span>${item.format}</span></div>
        <div class="row"><span>${formatDate(item.date)}</span><span>${item.location}</span></div>
        <div class="row"><span>${item.price}</span><button type="button" class="text-button" data-open-modal="${item.id}">View Details</button></div>
      </article>
    `)
    .join('');
}

function openModal(id) {
  const item = opportunities.find((opportunity) => opportunity.id === Number(id));
  if (!item) return;

  const saved = getSavedIds().includes(item.id);
  els.modalContent.innerHTML = `
    <div class="modal-header">
      <h3 id="modalTitle">${item.title}</h3>
      <span class="modal-badge">${item.category}</span>
    </div>
    <div class="modal-body">
      <div>
        <p>${item.description}</p>
        <div class="modal-info">
          <div class="info-row"><span>Organizer</span><strong>${item.organizer}</strong></div>
          <div class="info-row"><span>Date</span><strong>${formatDate(item.date)}</strong></div>
          <div class="info-row"><span>Location</span><strong>${item.location}</strong></div>
          <div class="info-row"><span>Price</span><strong>${item.price}</strong></div>
          <div class="info-row"><span>Eligibility</span><strong>${item.eligibility}</strong></div>
          <div class="info-row"><span>Format</span><strong>${item.format}</strong></div>
        </div>
      </div>
      <div>
        <div class="modal-info">
          <div class="info-row"><span>Application</span><strong>${item.applicationLabel}</strong></div>
          <div class="info-row"><span>Website</span><strong>Sample link</strong></div>
        </div>
        <div class="modal-actions">
          <button type="button" class="secondary-button" id="saveModalBtn">${saved ? 'Unsave' : 'Save'}</button>
          <button type="button" class="primary-button" id="applyModalBtn">${item.applicationLabel}</button>
        </div>
      </div>
    </div>
  `;

  const saveModalBtn = document.getElementById('saveModalBtn');
  const applyModalBtn = document.getElementById('applyModalBtn');

  saveModalBtn.addEventListener('click', () => {
    toggleSave(item.id);
    const nextSaved = getSavedIds().includes(item.id);
    saveModalBtn.textContent = nextSaved ? 'Unsave' : 'Save';
    if (nextSaved) {
      showToast('Saved opportunity updated.');
    }
  });

  applyModalBtn.addEventListener('click', () => {
    showToast('This is a sample action placeholder. Add the official registration URL before deployment.');
  });

  els.modal.classList.remove('hidden');
  els.modal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
  els.modal.classList.add('hidden');
  els.modal.setAttribute('aria-hidden', 'true');
}

function renderAll() {
  renderFeaturedCards();
  renderLatestList();
  renderSavedList();
  updateSavedCount();
  syncCategoryState();
}

function syncCategoryState() {
  const categoryButtons = document.querySelectorAll('.category-card');
  categoryButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.category === state.category);
  });

  els.categoryFilter.value = state.category;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add('show');
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => {
    els.toast.classList.remove('show');
  }, 2200);
}

function applyFilters(event) {
  event.preventDefault();
  state.keyword = els.searchKeyword.value.trim();
  state.category = els.categoryFilter.value;
  state.location = els.locationFilter.value;
  state.date = els.dateFilter.value;
  state.maxPrice = els.maxPriceFilter.value;
  const selectedMode = document.querySelector('input[name="formatFilter"]:checked');
  state.format = selectedMode ? selectedMode.value : 'all';
  renderAll();
}

function clearFilters() {
  els.filterForm.reset();
  state.keyword = '';
  state.category = 'all';
  state.location = 'all';
  state.date = '';
  state.maxPrice = '';
  state.format = 'all';
  els.searchKeyword.value = '';
  els.topSearchInput.value = '';
  renderAll();
}

function bindEventListeners() {
  els.filterForm.addEventListener('submit', applyFilters);
  els.clearFilters.addEventListener('click', clearFilters);

  document.addEventListener('click', (event) => {
    const openButton = event.target.closest('[data-open-modal]');
    const saveButton = event.target.closest('[data-save-btn]');
    const applyButton = event.target.closest('[data-apply-modal]');
    const categoryCard = event.target.closest('.category-card');

    if (openButton) {
      openModal(openButton.dataset.openModal);
      return;
    }

    if (saveButton) {
      toggleSave(Number(saveButton.dataset.saveBtn));
      return;
    }

    if (applyButton) {
      openModal(applyButton.dataset.applyModal);
      showToast('This action is a sample placeholder. Add a real link before production.');
      return;
    }

    if (categoryCard) {
      state.category = categoryCard.dataset.category || 'all';
      els.categoryFilter.value = state.category;
      renderAll();
      document.getElementById('featured-opportunities').scrollIntoView({ behavior: 'smooth' });
    }

    if (event.target.closest('.modal-close')) {
      closeModal();
    }

    if (event.target === els.modal) {
      closeModal();
    }
  });

  els.searchKeyword.addEventListener('input', (event) => {
    state.keyword = event.target.value.trim();
    renderAll();
  });

  els.topSearchInput.addEventListener('input', (event) => {
    els.searchKeyword.value = event.target.value;
    state.keyword = event.target.value.trim();
    renderAll();
  });

  document.querySelectorAll('input[name="formatFilter"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      state.format = radio.value;
      renderAll();
    });
  });

  document.getElementById('savedShortcut').addEventListener('click', () => {
    document.getElementById('saved-opportunities').scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById('createProfileBtn')?.addEventListener('click', () => {
    showToast('Profile setup flow ready for your backend or sign-up integration.');
  });

  document.querySelector('.mobile-menu-toggle').addEventListener('click', () => {
    document.body.classList.toggle('nav-open');
  });

  document.querySelectorAll('.nav-item').forEach((navItem) => {
    navItem.addEventListener('click', () => {
      document.body.classList.remove('nav-open');
      document.querySelectorAll('.nav-item').forEach((item) => item.classList.remove('active'));
      navItem.classList.add('active');
    });
  });

  document.addEventListener('click', (event) => {
    if (event.target.closest('.nav-item')) {
      document.body.classList.remove('nav-open');
    }
  });
}

async function initialize() {
  updateSavedCount();
  bindEventListeners();
  await loadOpportunities();
  renderAll();
}

initialize();
