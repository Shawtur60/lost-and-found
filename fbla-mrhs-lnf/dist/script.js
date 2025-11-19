<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyAdhKzgPM7OcBr7R37Qft8rEOqmxnNANUc",
    authDomain: "fbla-lost-and-found-def70.firebaseapp.com",
    projectId: "fbla-lost-and-found-def70",
    storageBucket: "fbla-lost-and-found-def70.firebasestorage.app",
    messagingSenderId: "154791511213",
    appId: "1:154791511213:web:5ae44e159925868ac5b224"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
</script>

import { getFirestore, collection, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

const db = getFirestore(app);
const itemsCollection = collection(db, "foundItems");

// Fetch items from Firestore
async function loadItems() {
  const querySnapshot = await getDocs(itemsCollection);
  foundItems = [];
  querySnapshot.forEach((doc) => {
    foundItems.push({ id: doc.id, ...doc.data() });
  });
  displayItems(foundItems);
}

// Update claimed status in Firestore
async function updateItemClaim(id, claimed) {
  const itemDoc = doc(db, "foundItems", id);
  await updateDoc(itemDoc, { claimed });
}

// Override claimItem and toggleClaim functions
window.claimItem = async function(idx) {
  foundItems[idx].claimed = true;
  await updateItemClaim(foundItems[idx].id, true);
  displayItems(foundItems);
}

window.toggleClaim = async function(idx) {
  foundItems[idx].claimed = !foundItems[idx].claimed;
  await updateItemClaim(foundItems[idx].id, foundItems[idx].claimed);
  renderAdminItems();
}

// Call loadItems when page loads
loadItems();

window.claimItem = function(idx) {
  const item = foundItems[idx];
  if(item.claimed) return; // Already claimed, do nothing

  // Confirmation pop-up
  const confirmClaim = confirm(`Are you sure you want to claim "${item.title}"?`);
  if(confirmClaim) {
    item.claimed = true;
    displayItems(foundItems);
  }
}

function openClaimModal() {
  claimModal.classList.remove('hidden');
  const modalContent = document.getElementById('claim-modal-content');
  modalContent.classList.remove('modal-exit', 'modal-exit-active');
  modalContent.classList.add('modal-enter');
  requestAnimationFrame(() => {
    modalContent.classList.add('modal-enter-active');
  });
}

function closeClaimModal() {
  const modalContent = document.getElementById('claim-modal-content');
  modalContent.classList.remove('modal-enter', 'modal-enter-active');
  modalContent.classList.add('modal-exit');
  requestAnimationFrame(() => {
    modalContent.classList.add('modal-exit-active');
  });
  setTimeout(() => {
    claimModal.classList.add('hidden');
  }, 300); // match animation duration
}

// Update claimItem to open modal with animation
window.claimItem = function(idx) {
  const item = foundItems[idx];
  if(item.claimed) return;
  currentClaimIndex = idx;
  claimModalTitle.textContent = `Claim "${item.title}"?`;
  claimModalMessage.textContent = `Are you sure you want to claim "${item.title}"?`;
  openClaimModal();
}

claimConfirmBtn.addEventListener('click', () => {
  if(currentClaimIndex !== null) {
    foundItems[currentClaimIndex].claimed = true;
    displayItems(foundItems);
    currentClaimIndex = null;
  }
  closeClaimModal();
});

claimCancelBtn.addEventListener('click', () => {
  currentClaimIndex = null;
  closeClaimModal();
});